import { type RedditDataSource } from './source'
import { MockRedditSource } from './mock-source'

export type { RedditDataSource } from './source'

export function getRedditSource(): RedditDataSource {
  if (process.env.REDDIT_DATA_SOURCE === 'api') {
    // Real Reddit API source — not yet implemented.
    // Falls back to mock to avoid runtime errors.
    console.warn('[Reddit] REDDIT_DATA_SOURCE=api but no real source implemented — using mock')
    return new MockRedditSource()
  }

  return new MockRedditSource()
}
