import { CATEGORIES } from './categories'

export const config = {
  llm: {
    provider: 'gemini' as 'anthropic' | 'groq' | 'gemini',
    models: {
      anthropic: 'claude-sonnet-4-20250514',
      groq: 'meta-llama/llama-4-scout-17b-16e-instruct',
      gemini: 'gemma-4-31b-it',
      /** Secondary model for rotation — alternates with primary every 6 hours */
      geminiSecondary: 'gemma-4-26b-it',
    },
    inputPostLimit: 8,
  },
  scoring: {
    /** Bonus for ideas sourced from posts with cross-subreddit signal */
    crossSubredditBonus: 5,
    /** Bonus for ideas sourced from high-engagement (viral) posts */
    highEngagementBonus: 3,
  },
  reddit: {
    dataSource: 'api' as const,
    postsPerSubreddit: 5,
    requestDelayMs: 200,
    categories: CATEGORIES,
  },
  email: {
    maxIdeasPerEmail: 3,
    windowDays: 7,
  },
  cron: {
    fetchIntervalHours: 6,
    postsToAnalyze: 8,
    categoriesPerRun: 3,
    postTtlDays: 30,
  },
  ideas: {
    ttlDays: 30,
    dedupWindowDays: 7,
    maxFavoritesPerUser: 20,
  },
} as const
