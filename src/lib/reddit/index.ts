import { config } from '@/config/app'
import { type RedditDataSource } from './source'
import { MockRedditSource } from './mock-source'
import { PublicJsonRedditSource } from './client'

export type { RedditDataSource } from './source'

export function getRedditSource(): RedditDataSource {
  if (config.reddit.dataSource === 'api') {
    return new PublicJsonRedditSource()
  }

  return new MockRedditSource()
}
