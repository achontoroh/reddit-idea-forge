import { type RedditPost } from './types'
import {
  TARGET_SUBREDDITS,
  REDDIT_CONFIG,
} from '@/config/reddit'
import { type RedditDataSource } from './source'
import { type RedditApiResponse, mapRawToRedditPost } from './types'

const USER_AGENT = 'IdeaForge/1.0'

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchSubredditPosts(subreddit: string): Promise<RedditPost[]> {
  const url = `https://www.reddit.com/r/${subreddit}/hot.json?limit=${REDDIT_CONFIG.postsPerSubreddit}`

  const response = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT },
  })

  if (!response.ok) {
    console.warn(
      `[Reddit] Failed to fetch r/${subreddit}: ${response.status} ${response.statusText}`
    )
    return []
  }

  const json: RedditApiResponse = await response.json()

  const posts: RedditPost[] = []
  for (const child of json.data.children) {
    const mapped = mapRawToRedditPost(child.data)
    if (mapped) {
      posts.push(mapped)
    }
  }

  return posts
}

export class PublicJsonRedditSource implements RedditDataSource {
  async fetchPosts(subreddits?: string[]): Promise<RedditPost[]> {
    const targetSubs = subreddits ?? TARGET_SUBREDDITS
    const allPosts: RedditPost[] = []

    for (let i = 0; i < targetSubs.length; i++) {
      const subreddit = targetSubs[i]

      try {
        const posts = await fetchSubredditPosts(subreddit)
        allPosts.push(...posts)

        if (process.env.NODE_ENV === 'development') {
          console.log(`[Reddit] r/${subreddit}: ${posts.length} posts`)
        }
      } catch (error) {
        console.warn(`[Reddit] Error fetching r/${subreddit}:`, error)
      }

      // Rate limit: delay between requests (skip after last)
      if (i < targetSubs.length - 1) {
        await delay(REDDIT_CONFIG.requestDelayMs)
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Reddit] Total: ${allPosts.length} posts from ${targetSubs.length} subreddits`)
    }

    return allPosts
  }
}
