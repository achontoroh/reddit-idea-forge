import { config } from './app'

export const REDDIT_CONFIG = {
  llmInputPostLimit: config.llm.inputPostLimit,
} as const
