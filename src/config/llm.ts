export const LLM_CONFIG = {
  anthropicModel:
    process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-20250514',
  groqModel:
    process.env.GROQ_MODEL ?? 'meta-llama/llama-4-scout-17b-16e-instruct',
  geminiModel: process.env.GEMINI_MODEL ?? 'gemini-2.0-flash',
  maxTokens: 4096,
  temperature: 0.7,
  scoringTemperature: 0.3,
} as const
