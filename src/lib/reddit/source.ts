import { type RedditPost } from '@/data/reddit-mock'

export interface RedditDataSource {
  /**
   * Fetch posts from Reddit.
   * @param subreddits — optional list of subreddits to fetch from.
   *   When omitted, fetches from all configured subreddits (legacy behavior).
   */
  fetchPosts(subreddits?: string[]): Promise<RedditPost[]>
}
