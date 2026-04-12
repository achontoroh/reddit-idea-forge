import * as Sentry from '@sentry/nextjs'
import { config } from '@/config/app'
import { LLM_CONFIG } from '@/config/llm'
import { supabaseServiceRole } from '@/lib/supabase/service'
import { logger } from '@/lib/logger'
import { getLLMProvider } from '@/lib/llm'
import { parseLLMResponse } from '@/lib/llm/parse-response'
import { IdeasV2ResponseSchema, type GeneratedIdeaV2 } from '@/lib/llm/schemas'
import { PROMPTS_V2, type EnrichedPostInput } from '@/lib/llm/prompts-v2'
import { getCurrentRotationModel } from '@/lib/llm/model-rotation'
import {
  classifyEngagement,
  detectCrossSubredditOverlap,
  getCrossSubredditKeywordsForPost,
  hasCrossSubredditSignal,
  type EngagementTier,
} from './enrichment'
import type { Database } from '@/lib/types/database'

type RedditPostRow = Database['public']['Tables']['reddit_posts']['Row']
type IdeaInsert = Database['public']['Tables']['ideas']['Insert']

export interface GenerationResult {
  postsProcessed: number
  ideasGenerated: number
  ideasSkippedDuplicate: number
  model: string
  errors: string[]
}

export interface GenerationOptions {
  /** Override the automatic model rotation with a specific model name. */
  modelOverride?: string
}

/**
 * Main generation pipeline: fetches unprocessed Reddit posts, enriches them,
 * sends to LLM for merged signal+idea generation, deduplicates, and stores ideas.
 */
export async function generateSharedIdeas(options?: GenerationOptions): Promise<GenerationResult> {
  const errors: string[] = []

  // 1. Query unprocessed posts, ordered by score desc
  logger.info('[Pipeline] Querying unprocessed reddit posts...')
  const { data: posts, error: fetchError } = await supabaseServiceRole
    .from('reddit_posts')
    .select('*')
    .eq('processed', false)
    .order('score', { ascending: false })
    .limit(config.cron.postsToAnalyze)

  if (fetchError) {
    const msg = `[Pipeline] Failed to fetch posts: ${fetchError.message}`
    logger.error(msg)
    return { postsProcessed: 0, ideasGenerated: 0, ideasSkippedDuplicate: 0, model: '', errors: [msg] }
  }

  if (!posts || posts.length === 0) {
    logger.info('[Pipeline] No unprocessed posts found, skipping generation')
    return { postsProcessed: 0, ideasGenerated: 0, ideasSkippedDuplicate: 0, model: '', errors: [] }
  }

  logger.info(`[Pipeline] Found ${posts.length} unprocessed posts`)

  // 2. Pre-LLM enrichment
  const crossSubredditOverlaps = detectCrossSubredditOverlap(posts)
  logger.info(`[Pipeline] Cross-subreddit keywords detected: ${crossSubredditOverlaps.size}`)

  const now = new Date()

  // Cache enrichment + DB ID per post URL to avoid recomputing during score adjustment
  const postEnrichmentCache = new Map<string, { postId: string; engagementTier: EngagementTier; crossKeywords: string[] }>()

  const enrichedPosts: EnrichedPostInput[] = posts.map((post) => {
    const engagementTier = classifyEngagement(post.score)
    const crossKeywords = getCrossSubredditKeywordsForPost(post, crossSubredditOverlaps)
    postEnrichmentCache.set(post.url, { postId: post.id, engagementTier, crossKeywords })

    return {
      id: post.reddit_id,
      reddit_post_id: post.id,
      url: post.url,
      subreddit: post.subreddit,
      title: post.title,
      body: post.body,
      score: post.score,
      num_comments: post.num_comments,
      engagement_tier: engagementTier,
      cross_subreddit_keywords: crossKeywords,
    }
  })

  // 3. Model selection: explicit override (dev) or automatic rotation (cron)
  const model = options?.modelOverride ?? getCurrentRotationModel()
  logger.info(`[Pipeline] Using model: ${model}${options?.modelOverride ? ' (manual override)' : ' (rotation)'}`)

  // 4. Call LLM with merged prompt
  const provider = getLLMProvider()
  const systemPrompt = PROMPTS_V2.mergedGeneration.system
  const userPrompt = PROMPTS_V2.mergedGeneration.user(enrichedPosts)

  let ideas: GeneratedIdeaV2[]
  try {
    logger.info('[Pipeline] Calling LLM for idea generation...')
    const rawResponse = await provider.complete(userPrompt, systemPrompt, {
      temperature: LLM_CONFIG.scoringTemperature,
      model,
    })

    const parsed = parseLLMResponse(rawResponse, IdeasV2ResponseSchema)
    ideas = parsed.ideas
    logger.info(`[Pipeline] LLM returned ${ideas.length} ideas`)
  } catch (error) {
    const msg = `[Pipeline] LLM call failed: ${error instanceof Error ? error.message : String(error)}`
    logger.error(msg)
    Sentry.captureException(error, { tags: { pipeline: 'cron', model } })
    errors.push(msg)

    // Mark posts as processed even on LLM failure to avoid retry loops
    await markPostsProcessed(posts)
    return { postsProcessed: posts.length, ideasGenerated: 0, ideasSkippedDuplicate: 0, model, errors }
  }

  // 5. Post-LLM score adjustment (using cached enrichment data)
  for (const idea of ideas) {
    const cached = postEnrichmentCache.get(idea.source_url)
    if (!cached) continue

    let bonus = 0
    if (hasCrossSubredditSignal(cached.crossKeywords)) {
      bonus += config.scoring.crossSubredditBonus
    }
    if (cached.engagementTier === 'viral') {
      bonus += config.scoring.highEngagementBonus
    }

    if (bonus > 0) {
      idea.score = Math.min(100, idea.score + bonus)
      // Distribute bonus evenly across breakdown components
      const perComponent = Math.floor(bonus / 4)
      const remainder = bonus - perComponent * 4
      idea.score_breakdown.pain_intensity = Math.min(25, idea.score_breakdown.pain_intensity + perComponent + (remainder > 0 ? 1 : 0))
      idea.score_breakdown.willingness_to_pay = Math.min(25, idea.score_breakdown.willingness_to_pay + perComponent + (remainder > 1 ? 1 : 0))
      idea.score_breakdown.competition = Math.min(25, idea.score_breakdown.competition + perComponent + (remainder > 2 ? 1 : 0))
      idea.score_breakdown.tam = Math.min(25, idea.score_breakdown.tam + perComponent)
    }
  }

  // 6. Deduplication: check for existing ideas with same source_url within dedup window
  const sourceUrls = ideas.map((idea) => idea.source_url)
  const dedupCutoff = new Date(now.getTime())
  dedupCutoff.setDate(dedupCutoff.getDate() - config.ideas.dedupWindowDays)

  const { data: existingIdeas } = await supabaseServiceRole
    .from('ideas')
    .select('source_url')
    .in('source_url', sourceUrls)
    .gte('created_at', dedupCutoff.toISOString())

  const existingUrls = new Set((existingIdeas ?? []).map((i) => i.source_url))
  const newIdeas = ideas.filter((idea) => !existingUrls.has(idea.source_url))
  const skippedCount = ideas.length - newIdeas.length

  if (skippedCount > 0) {
    logger.info(`[Pipeline] Skipped ${skippedCount} duplicate ideas (same source_url within ${config.ideas.dedupWindowDays}-day window)`)
  }

  // 7. Insert ideas into DB
  const expiresAt = new Date(now.getTime())
  expiresAt.setDate(expiresAt.getDate() + config.ideas.ttlDays)
  const expiresAtIso = expiresAt.toISOString()

  const ideaInserts: IdeaInsert[] = newIdeas.map((idea) => ({
    title: idea.title,
    pitch: idea.pitch,
    pain_point: idea.pain_point,
    target_audience: idea.target_audience,
    category: idea.category,
    source_subreddit: idea.source_subreddit,
    source_url: idea.source_url,
    ai_score: idea.score,
    ai_score_breakdown: idea.score_breakdown,
    source_post_ids: postEnrichmentCache.has(idea.source_url) ? [postEnrichmentCache.get(idea.source_url)!.postId] : [],
    mvp_complexity: idea.mvp_complexity,
    monetization_model: idea.monetization_model,
    expires_at: expiresAtIso,
  }))

  if (ideaInserts.length > 0) {
    const { error: insertError } = await supabaseServiceRole
      .from('ideas')
      .insert(ideaInserts)

    if (insertError) {
      const msg = `[Pipeline] Failed to insert ideas: ${insertError.message}`
      logger.error(msg)
      errors.push(msg)
    } else {
      logger.info(`[Pipeline] Inserted ${ideaInserts.length} ideas`)
    }
  }

  // 8. Mark source posts as processed
  await markPostsProcessed(posts)

  const result: GenerationResult = {
    postsProcessed: posts.length,
    ideasGenerated: ideaInserts.length,
    ideasSkippedDuplicate: skippedCount,
    model,
    errors,
  }

  logger.info(
    `[Pipeline] Complete: ${result.postsProcessed} posts processed, ` +
    `${result.ideasGenerated} ideas generated, ${result.ideasSkippedDuplicate} duplicates skipped`
  )

  return result
}

/**
 * Mark a batch of reddit posts as processed.
 */
async function markPostsProcessed(posts: RedditPostRow[]): Promise<void> {
  const postIds = posts.map((p) => p.id)

  const { error } = await supabaseServiceRole
    .from('reddit_posts')
    .update({ processed: true })
    .in('id', postIds)

  if (error) {
    logger.error(`[Pipeline] Failed to mark posts as processed: ${error.message}`)
  } else {
    logger.info(`[Pipeline] Marked ${postIds.length} posts as processed`)
  }
}
