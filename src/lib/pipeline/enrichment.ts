import type { Database } from '@/lib/types/database'

type RedditPostRow = Database['public']['Tables']['reddit_posts']['Row']

export type EngagementTier = 'viral' | 'popular' | 'moderate' | 'niche'

/**
 * Classify a post's engagement level based on upvote score.
 */
export function classifyEngagement(score: number): EngagementTier {
  if (score > 500) return 'viral'
  if (score >= 100) return 'popular'
  if (score >= 20) return 'moderate'
  return 'niche'
}

const STOP_WORDS = new Set([
  'i', 'me', 'my', 'we', 'our', 'you', 'your', 'he', 'she', 'it', 'they',
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'can', 'may', 'might', 'just', 'not', 'no', 'so', 'if',
  'how', 'what', 'when', 'where', 'why', 'who', 'which', 'that', 'this',
  'these', 'those', 'am', 'about', 'any', 'all', 'also', 'than', 'too',
  'very', 'some', 'more', 'most', 'other', 'into', 'out', 'up', 'down',
  'then', 'there', 'here', 'each', 'every', 'both', 'few', 'many',
  'much', 'own', 'same', 'like', 'get', 'got', 'need', 'want', 'use',
  'using', 'used', 'make', 'made', 'way', 'thing', 'things', 'really',
  'even', 'still', 'already', 'yet', 'after', 'before', 'while',
])

/**
 * Extract significant words from a title for overlap detection.
 * Strips common stop words and short tokens.
 */
function extractKeywords(title: string): string[] {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length >= 4 && !STOP_WORDS.has(word))
}

/**
 * Detect keywords that appear in posts from 2+ different subreddits.
 * Returns a Map of keyword → array of subreddits where it appears.
 */
export function detectCrossSubredditOverlap(
  posts: RedditPostRow[]
): Map<string, string[]> {
  // keyword → Set of subreddits
  const keywordSubreddits = new Map<string, Set<string>>()

  for (const post of posts) {
    const keywords = extractKeywords(post.title)
    for (const keyword of keywords) {
      const subs = keywordSubreddits.get(keyword) ?? new Set<string>()
      subs.add(post.subreddit)
      keywordSubreddits.set(keyword, subs)
    }
  }

  // Filter to keywords appearing in 2+ subreddits
  const overlaps = new Map<string, string[]>()
  for (const [keyword, subs] of keywordSubreddits) {
    if (subs.size >= 2) {
      overlaps.set(keyword, [...subs])
    }
  }

  return overlaps
}

/**
 * Get cross-subreddit keywords relevant to a specific post.
 */
export function getCrossSubredditKeywordsForPost(
  post: RedditPostRow,
  overlaps: Map<string, string[]>
): string[] {
  const postKeywords = extractKeywords(post.title)
  return postKeywords.filter((kw) => overlaps.has(kw))
}

/**
 * Check if a post has any cross-subreddit signal.
 * Accepts pre-computed keywords to avoid re-extracting.
 */
export function hasCrossSubredditSignal(
  crossSubredditKeywords: string[]
): boolean {
  return crossSubredditKeywords.length > 0
}
