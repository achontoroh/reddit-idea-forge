import { type z } from 'zod'

export function parseLLMResponse<T>(raw: string, schema: z.ZodType<T>): T {
  const cleaned = raw
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim()

  const parsed: unknown = JSON.parse(cleaned)
  const result = schema.safeParse(parsed)

  if (!result.success) {
    console.error('[LLM] Validation failed:', result.error.issues)
    throw new Error(`LLM response validation failed: ${result.error.message}`)
  }

  return result.data
}
