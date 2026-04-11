import { type RedditDataSource } from './source'
import { PublicJsonRedditSource } from './client'

export type { RedditDataSource } from './source'
export type { RedditPost } from './types'

export function getRedditSource(): RedditDataSource {
  return new PublicJsonRedditSource()
}
