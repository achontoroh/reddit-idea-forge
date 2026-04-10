import { config } from './app'

export const LLM_CONFIG = {
  anthropicModel: config.llm.models.anthropic,
  groqModel: config.llm.models.groq,
  geminiModel: config.llm.models.gemini,
  maxTokens: 4096,
  temperature: 0.7,
  scoringTemperature: 0.3,
} as const
