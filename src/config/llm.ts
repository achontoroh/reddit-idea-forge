export const LLM_CONFIG = {
  model: 'claude-sonnet-4-20250514',
  geminiModel: process.env.GEMINI_MODEL ?? 'gemini-2.0-flash',
  maxTokens: 4096,
  temperature: 0.7,
  scoringTemperature: 0.3,
} as const
