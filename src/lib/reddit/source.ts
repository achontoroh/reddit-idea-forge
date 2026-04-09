import { type RedditPost } from '@/data/reddit-mock'

export interface RedditDataSource {
  fetchPosts(): Promise<RedditPost[]>
}
