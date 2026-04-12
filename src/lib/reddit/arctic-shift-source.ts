import { type RedditPost } from './types'
import { type RedditDataSource } from './source'
import { REDDIT_CONFIG, SUBREDDIT_CATEGORY_MAP } from '@/config/reddit'
import { type CategorySlug } from '@/config/categories'
import { logger } from '@/lib/logger'

const USER_AGENT = 'IdeaForge/1.0'
const ARCTIC_SHIFT_BASE = 'https://arctic-shift.photon-reddit.com/api/posts/search'

/** Days to look back when fetching posts from Arctic Shift */
const LOOKBACK_DAYS = 7

/**
 * Arctic Shift only sorts by created_utc, not by score.
 * We fetch up to 100 posts (API max) per subreddit for the last LOOKBACK_DAYS.
 * All posts are returned to the caller — dedup against DB happens in fetch-service,
 * so repeat runs naturally yield only new posts even from a wide time window.
 */
const FETCH_LIMIT = 100

interface ArcticShiftPost {
  id: string
  subreddit: string
  title: string
  selftext: string
  score: number
  num_comments: number
  created_utc: number
}

interface ArcticShiftResponse {
  data: ArcticShiftPost[]
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getAfterDate(): string {
  const date = new Date()
  date.setDate(date.getDate() - LOOKBACK_DAYS)
  return date.toISOString()
}

async function fetchSubredditFromArcticShift(
  subreddit: string
): Promise<RedditPost[]> {
  // Fetch up to 100 most recent posts; dedup + scoring happens downstream in fetch-service.
  const params = new URLSearchParams({
    subreddit,
    limit: String(FETCH_LIMIT),
    sort: 'desc',
    after: getAfterDate(),
    fields: 'id,subreddit,title,selftext,score,num_comments,created_utc',
  })

  const url = `${ARCTIC_SHIFT_BASE}?${params}`

  const response = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT },
  })

  if (!response.ok) {
    logger.warn(`[ArcticShift] Failed to fetch r/${subreddit}: ${response.status} ${response.statusText}`)
    return []
  }

  const json: ArcticShiftResponse = await response.json()

  const posts: RedditPost[] = []
  for (const raw of json.data) {
    const subredditLower = raw.subreddit.toLowerCase()
    const category: CategorySlug | undefined = SUBREDDIT_CATEGORY_MAP[subredditLower]

    if (!category) continue

    posts.push({
      id: raw.id,
      subreddit: `r/${raw.subreddit}`,
      title: raw.title,
      body: raw.selftext,
      score: raw.score,
      num_comments: raw.num_comments,
      url: `https://reddit.com/r/${raw.subreddit}/comments/${raw.id}`,
      created_utc: raw.created_utc,
      category,
    })
  }

  return posts
}

export class ArcticShiftSource implements RedditDataSource {
  async fetchPosts(subreddits?: string[]): Promise<RedditPost[]> {
    const targetSubs =
      subreddits ?? (await import('@/config/reddit')).TARGET_SUBREDDITS
    const allPosts: RedditPost[] = []

    for (let i = 0; i < targetSubs.length; i++) {
      const subreddit = targetSubs[i]

      try {
        const posts = await fetchSubredditFromArcticShift(subreddit)
        allPosts.push(...posts)

        logger.debug(`[ArcticShift] r/${subreddit}: ${posts.length} posts`)
      } catch (error) {
        logger.warn(`[ArcticShift] Error fetching r/${subreddit}`, {
          error: error instanceof Error ? error.message : String(error),
        })
      }

      // Rate limit: delay between requests (skip after last)
      if (i < targetSubs.length - 1) {
        await delay(REDDIT_CONFIG.requestDelayMs)
      }
    }

    logger.debug(`[ArcticShift] Total: ${allPosts.length} posts from ${targetSubs.length} subreddits`)

    return allPosts
  }
}
