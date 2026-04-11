import { mockRedditPosts, type RedditPost } from '@/data/reddit-mock'
import { type RedditDataSource } from './source'

export class MockRedditSource implements RedditDataSource {
  async fetchPosts(subreddits?: string[]): Promise<RedditPost[]> {
    if (!subreddits) {
      return mockRedditPosts
    }

    const subredditSet = new Set(subreddits.map((s) => s.toLowerCase()))
    return mockRedditPosts.filter((post) => {
      const postSub = post.subreddit.replace('r/', '').toLowerCase()
      return subredditSet.has(postSub)
    })
  }
}
