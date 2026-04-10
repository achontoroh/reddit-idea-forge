export const config = {
  llm: {
    provider: 'anthropic' as 'anthropic' | 'groq' | 'gemini',
    models: {
      anthropic: 'claude-sonnet-4-20250514',
      groq: 'meta-llama/llama-4-scout-17b-16e-instruct',
      gemini: 'gemini-2.0-flash',
    },
    inputPostLimit: 8,
  },
  reddit: {
    dataSource: 'mock' as 'mock' | 'api',
  },
  email: {
    maxIdeasPerEmail: 3,
    windowDays: 7,
  },
} as const
