import { config } from '@/config/app'
import { type RedditDataSource } from './source'
import { PublicJsonRedditSource } from './client'
import { ArcticShiftSource } from './arctic-shift-source'

export type { RedditDataSource } from './source'
export type { RedditPost } from './types'

export function getRedditSource(): RedditDataSource {
  switch (config.reddit.dataSource) {
    case 'arctic-shift':
      return new ArcticShiftSource()
    case 'api':
      return new PublicJsonRedditSource()
  }
}
