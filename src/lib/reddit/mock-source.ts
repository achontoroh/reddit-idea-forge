import { mockRedditPosts, type RedditPost } from '@/data/reddit-mock'
import { type RedditDataSource } from './source'

export class MockRedditSource implements RedditDataSource {
  async fetchPosts(): Promise<RedditPost[]> {
    return mockRedditPosts
  }
}
