import { LLM_CONFIG } from '@/config/llm'

const ROTATION_INTERVAL_MS = 6 * 60 * 60 * 1000 // 6 hours

const MODELS = [LLM_CONFIG.geminiModel, LLM_CONFIG.geminiSecondaryModel] as const

/**
 * Returns the current model based on time rotation.
 * Alternates between primary and secondary Gemini models every 6 hours.
 */
export function getCurrentRotationModel(): string {
  const modelIndex = Math.floor(Date.now() / ROTATION_INTERVAL_MS) % MODELS.length
  return MODELS[modelIndex]
}
