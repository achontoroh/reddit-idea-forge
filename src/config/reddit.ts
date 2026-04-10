import { type Category } from './categories'
import { config } from './app'

/** Subreddits to scan for pain points, grouped by app category */
export const TARGET_SUBREDDITS: readonly string[] = [
  'SaaS',
  'startups',
  'smallbusiness',
  'webdev',
  'Entrepreneur',
  'productivity',
  'personalfinance',
  'programming',
] as const

/** Maps subreddit names (lowercase) → app category for classification */
export const SUBREDDIT_CATEGORY_MAP: Record<string, Category> = {
  saas: 'devtools',
  startups: 'finance',
  smallbusiness: 'finance',
  webdev: 'devtools',
  entrepreneur: 'productivity',
  productivity: 'productivity',
  personalfinance: 'finance',
  programming: 'devtools',
}

export const REDDIT_CONFIG = {
  postsPerSubreddit: config.reddit.postsPerSubreddit,
  requestDelayMs: config.reddit.requestDelayMs,
  llmInputPostLimit: config.llm.inputPostLimit,
} as const
