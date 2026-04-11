import { config } from '@/config/app'
import { LLM_CONFIG } from '@/config/llm'
import { supabaseServiceRole } from '@/lib/supabase/service'
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

/**
 * Main generation pipeline: fetches unprocessed Reddit posts, enriches them,
 * sends to LLM for merged signal+idea generation, deduplicates, and stores ideas.
 */
export async function generateSharedIdeas(): Promise<GenerationResult> {
  const errors: string[] = []

  // 1. Query unprocessed posts, ordered by score desc
  console.log('[Pipeline] Querying unprocessed reddit posts...')
  const { data: posts, error: fetchError } = await supabaseServiceRole
    .from('reddit_posts')
    .select('*')
    .eq('processed', false)
    .order('score', { ascending: false })
    .limit(config.cron.postsToAnalyze)

  if (fetchError) {
    const msg = `[Pipeline] Failed to fetch posts: ${fetchError.message}`
    console.error(msg)
    return { postsProcessed: 0, ideasGenerated: 0, ideasSkippedDuplicate: 0, model: '', errors: [msg] }
  }

  if (!posts || posts.length === 0) {
    console.log('[Pipeline] No unprocessed posts found, skipping generation')
    return { postsProcessed: 0, ideasGenerated: 0, ideasSkippedDuplicate: 0, model: '', errors: [] }
  }

  console.log(`[Pipeline] Found ${posts.length} unprocessed posts`)

  // 2. Pre-LLM enrichment
  const crossSubredditOverlaps = detectCrossSubredditOverlap(posts)
  console.log(`[Pipeline] Cross-subreddit keywords detected: ${crossSubredditOverlaps.size}`)

  const enrichedPosts: EnrichedPostInput[] = posts.map((post) => ({
    id: post.reddit_id,
    reddit_post_id: post.id,
    url: post.url,
    subreddit: post.subreddit,
    title: post.title,
    body: post.body,
    score: post.score,
    num_comments: post.num_comments,
    engagement_tier: classifyEngagement(post.score),
    cross_subreddit_keywords: getCrossSubredditKeywordsForPost(post, crossSubredditOverlaps),
  }))

  // 3. Model rotation
  const model = getCurrentRotationModel()
  console.log(`[Pipeline] Using model: ${model}`)

  // 4. Call LLM with merged prompt
  const provider = getLLMProvider()
  const systemPrompt = PROMPTS_V2.mergedGeneration.system
  const userPrompt = PROMPTS_V2.mergedGeneration.user(enrichedPosts)

  let ideas: GeneratedIdeaV2[]
  try {
    console.log('[Pipeline] Calling LLM for idea generation...')
    const rawResponse = await provider.complete(userPrompt, systemPrompt, {
      temperature: LLM_CONFIG.scoringTemperature,
      model,
    })

    const parsed = parseLLMResponse(rawResponse, IdeasV2ResponseSchema)
    ideas = parsed.ideas
    console.log(`[Pipeline] LLM returned ${ideas.length} ideas`)
  } catch (error) {
    const msg = `[Pipeline] LLM call failed: ${error instanceof Error ? error.message : String(error)}`
    console.error(msg)
    errors.push(msg)

    // Mark posts as processed even on LLM failure to avoid retry loops
    await markPostsProcessed(posts)
    return { postsProcessed: posts.length, ideasGenerated: 0, ideasSkippedDuplicate: 0, model, errors }
  }

  // 5. Post-LLM score adjustment
  const postsByUrl = new Map(posts.map((p) => [p.url, p]))
  for (const idea of ideas) {
    const sourcePost = postsByUrl.get(idea.source_url)
    if (!sourcePost) continue

    let bonus = 0
    if (hasCrossSubredditSignal(sourcePost, crossSubredditOverlaps)) {
      bonus += config.scoring.crossSubredditBonus
    }
    if (classifyEngagement(sourcePost.score) === 'viral') {
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

  // 6. Deduplication: check for existing ideas with same source_url in last 7 days
  const sourceUrls = ideas.map((idea) => idea.source_url)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const { data: existingIdeas } = await supabaseServiceRole
    .from('ideas')
    .select('source_url')
    .in('source_url', sourceUrls)
    .gte('created_at', sevenDaysAgo.toISOString())

  const existingUrls = new Set((existingIdeas ?? []).map((i) => i.source_url))
  const newIdeas = ideas.filter((idea) => !existingUrls.has(idea.source_url))
  const skippedCount = ideas.length - newIdeas.length

  if (skippedCount > 0) {
    console.log(`[Pipeline] Skipped ${skippedCount} duplicate ideas (same source_url in last 7 days)`)
  }

  // 7. Build post ID lookup (url → DB uuid) for source_post_ids
  const urlToPostId = new Map(posts.map((p) => [p.url, p.id]))

  // 8. Insert ideas
  const expiresAt = new Date()
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
    source_post_ids: resolveSourcePostIds(idea.source_url, urlToPostId),
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
      console.error(msg)
      errors.push(msg)
    } else {
      console.log(`[Pipeline] Inserted ${ideaInserts.length} ideas`)
    }
  }

  // 9. Mark source posts as processed
  await markPostsProcessed(posts)

  const result: GenerationResult = {
    postsProcessed: posts.length,
    ideasGenerated: ideaInserts.length,
    ideasSkippedDuplicate: skippedCount,
    model,
    errors,
  }

  console.log(
    `[Pipeline] Complete: ${result.postsProcessed} posts processed, ` +
    `${result.ideasGenerated} ideas generated, ${result.ideasSkippedDuplicate} duplicates skipped`
  )

  return result
}

/**
 * Resolve source_url to an array of reddit_post UUIDs.
 */
function resolveSourcePostIds(
  sourceUrl: string,
  urlToPostId: Map<string, string>
): string[] {
  const postId = urlToPostId.get(sourceUrl)
  return postId ? [postId] : []
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
    console.error(`[Pipeline] Failed to mark posts as processed: ${error.message}`)
  } else {
    console.log(`[Pipeline] Marked ${postIds.length} posts as processed`)
  }
}
