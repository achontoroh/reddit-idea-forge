import { type CategorySlug } from '@/config/categories'
import { SUBREDDIT_CATEGORY_MAP } from '@/config/reddit'

export interface RedditPost {
  id: string
  subreddit: string
  title: string
  body: string
  score: number
  num_comments: number
  url: string
  created_utc: number
  category: CategorySlug
}

/** Shape of a single post inside Reddit's public JSON response */
export interface RedditApiPost {
  kind: string
  data: {
    id: string
    subreddit: string
    title: string
    selftext: string
    score: number
    num_comments: number
    permalink: string
    created_utc: number
  }
}

/** Top-level shape of /r/{subreddit}/hot.json */
export interface RedditApiResponse {
  kind: string
  data: {
    children: RedditApiPost[]
    after: string | null
  }
}

/**
 * Maps a raw Reddit API post to the app's RedditPost interface.
 * Returns null if the subreddit has no known category mapping.
 */
export function mapRawToRedditPost(raw: RedditApiPost['data']): RedditPost | null {
  const subredditLower = raw.subreddit.toLowerCase()
  const category: CategorySlug | undefined = SUBREDDIT_CATEGORY_MAP[subredditLower]

  if (!category) {
    return null
  }

  return {
    id: raw.id,
    subreddit: `r/${raw.subreddit}`,
    title: raw.title,
    body: raw.selftext,
    score: raw.score,
    num_comments: raw.num_comments,
    url: `https://reddit.com${raw.permalink}`,
    created_utc: raw.created_utc,
    category,
  }
}
