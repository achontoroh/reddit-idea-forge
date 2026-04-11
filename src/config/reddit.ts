import { type CategorySlug, getAllSubreddits, CATEGORIES } from './categories'
import { config } from './app'

/** Subreddits to scan for pain points — derived from category config */
export const TARGET_SUBREDDITS: readonly string[] = getAllSubreddits()

/** Maps subreddit names (lowercase) → app category slug for classification */
export const SUBREDDIT_CATEGORY_MAP: Record<string, CategorySlug> = Object.fromEntries(
  CATEGORIES.flatMap((c) =>
    c.subreddits.map((sub) => [sub.toLowerCase(), c.slug as CategorySlug])
  )
)

export const REDDIT_CONFIG = {
  postsPerSubreddit: config.reddit.postsPerSubreddit,
  requestDelayMs: config.reddit.requestDelayMs,
  llmInputPostLimit: config.llm.inputPostLimit,
} as const
