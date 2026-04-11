import { getAllSubreddits, CATEGORIES } from './categories'

export const config = {
  llm: {
    provider: 'gemini' as 'anthropic' | 'groq' | 'gemini',
    models: {
      anthropic: 'claude-sonnet-4-20250514',
      groq: 'meta-llama/llama-4-scout-17b-16e-instruct',
      gemini: 'gemma-4-31b-it',
    },
    inputPostLimit: 8,
  },
  reddit: {
    dataSource: 'api' as 'mock' | 'api',
    postsPerSubreddit: 5,
    requestDelayMs: 200,
    subreddits: getAllSubreddits(),
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
    ttlDays: 14,
    maxFavoritesPerUser: 20,
  },
} as const
