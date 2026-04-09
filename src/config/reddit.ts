function parsePositiveInteger(value: string | undefined, fallback: number): number {
  if (!value) return fallback

  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback
  }

  return parsed
}

export const REDDIT_CONFIG = {
  llmInputPostLimit: parsePositiveInteger(process.env.LLM_INPUT_POST_LIMIT, 5),
} as const
