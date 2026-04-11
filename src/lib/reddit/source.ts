import { type RedditPost } from './types'

export interface RedditDataSource {
  /**
   * Fetch posts from Reddit.
   * @param subreddits — optional list of subreddits to fetch from.
   *   When omitted, fetches from all configured subreddits (legacy behavior).
   */
  fetchPosts(subreddits?: string[]): Promise<RedditPost[]>
}
