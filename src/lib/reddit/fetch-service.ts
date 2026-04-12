import * as Sentry from '@sentry/nextjs'
import { type Category } from '@/config/categories'
import { config } from '@/config/app'
import { supabaseServiceRole } from '@/lib/supabase/service'
import { logger } from '@/lib/logger'
import type { Database } from '@/lib/types/database'
import { getRedditSource } from './index'
import { getCategoriesToFetch, getSubredditsForCategories } from './rotation'

type RedditPostInsert = Database['public']['Tables']['reddit_posts']['Insert']

export interface FetchResult {
  fetchedCount: number
  newCount: number
  skippedCount: number
  categories: string[]
  errors: string[]
}

/**
 * Fetches Reddit posts for the given categories, deduplicates against the DB,
 * and inserts new posts into the reddit_posts table.
 */
export async function fetchAndStoreByCategories(
  categories: Category[]
): Promise<FetchResult> {
  const errors: string[] = []
  const subreddits = getSubredditsForCategories(categories)
  const categorySlugs = categories.map((c) => c.slug)

  logger.info(`[FetchService] Starting fetch for categories: ${categorySlugs.join(', ')}`, {
    subreddits: subreddits.length,
  })

  // Fetch posts from Reddit via the existing source abstraction
  const source = getRedditSource()
  const rawPosts = await source.fetchPosts(subreddits)

  logger.info(`[FetchService] Fetched ${rawPosts.length} posts from Reddit`)

  if (rawPosts.length === 0) {
    return {
      fetchedCount: 0,
      newCount: 0,
      skippedCount: 0,
      categories: categorySlugs,
      errors,
    }
  }

  // Compute expires_at: now + postTtlDays
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + config.cron.postTtlDays)
  const expiresAtIso = expiresAt.toISOString()

  // Map raw posts to DB insert format
  const postsToInsert: RedditPostInsert[] = rawPosts.map((post) => ({
    reddit_id: post.id,
    subreddit: post.subreddit,
    title: post.title,
    body: post.body || null,
    url: post.url,
    score: post.score,
    num_comments: post.num_comments,
    category: post.category,
    processed: false,
    expires_at: expiresAtIso,
  }))

  // Upsert with ON CONFLICT (reddit_id) DO NOTHING for deduplication.
  // Supabase JS client supports onConflict + ignoreDuplicates.
  const { data, error } = await supabaseServiceRole
    .from('reddit_posts')
    .upsert(postsToInsert, {
      onConflict: 'reddit_id',
      ignoreDuplicates: true,
    })
    .select('id')

  if (error) {
    const msg = `[FetchService] DB insert error: ${error.message}`
    logger.error(msg)
    Sentry.captureException(new Error(msg), { tags: { pipeline: 'cron' } })
    errors.push(msg)
    return {
      fetchedCount: rawPosts.length,
      newCount: 0,
      skippedCount: rawPosts.length,
      categories: categorySlugs,
      errors,
    }
  }

  const newCount = data?.length ?? 0
  const skippedCount = rawPosts.length - newCount

  logger.info(`[FetchService] Done: ${newCount} new, ${skippedCount} duplicates skipped`)

  return {
    fetchedCount: rawPosts.length,
    newCount,
    skippedCount,
    categories: categorySlugs,
    errors,
  }
}

/**
 * Main entry point for the cron pipeline.
 * @param rotationIndex — explicit rotation slot (used by dev panel).
 *   When omitted, determines the slot from current UTC time (prod behavior).
 */
export async function fetchAndStorePosts(rotationIndex?: number): Promise<FetchResult> {
  const categories = getCategoriesToFetch(rotationIndex)

  logger.info(`[FetchService] Rotation selected: ${categories.map((c) => c.slug).join(', ')}`, {
    slot: rotationIndex ?? 'auto',
    utcHour: new Date().getUTCHours(),
  })

  return fetchAndStoreByCategories(categories)
}
