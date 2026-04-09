import { type z } from 'zod'

function stripCodeFences(raw: string): string {
  return raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
}

function extractBalancedJson(raw: string): string | null {
  const start = raw.search(/[\[{]/)
  if (start === -1) return null

  const stack: string[] = []
  let inString = false
  let isEscaped = false

  for (let index = start; index < raw.length; index += 1) {
    const char = raw[index]

    if (inString) {
      if (isEscaped) {
        isEscaped = false
        continue
      }

      if (char === '\\') {
        isEscaped = true
        continue
      }

      if (char === '"') {
        inString = false
      }

      continue
    }

    if (char === '"') {
      inString = true
      continue
    }

    if (char === '{' || char === '[') {
      stack.push(char)
      continue
    }

    if (char === '}' || char === ']') {
      const expected = char === '}' ? '{' : '['
      const actual = stack.pop()

      if (actual !== expected) {
        return null
      }

      if (stack.length === 0) {
        return raw.slice(start, index + 1)
      }
    }
  }

  return null
}

export function parseLLMResponse<T>(raw: string, schema: z.ZodType<T>): T {
  const cleaned = stripCodeFences(raw)

  let parsed: unknown
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    const extracted = extractBalancedJson(cleaned)
    if (!extracted) {
      console.error('[LLM] Failed to locate JSON in response:', cleaned.slice(0, 500))
      throw new Error('LLM response did not contain valid JSON')
    }

    try {
      parsed = JSON.parse(extracted)
    } catch (error) {
      console.error(
        '[LLM] Failed to parse extracted JSON:',
        extracted.slice(0, 500)
      )
      throw error
    }
  }

  const result = schema.safeParse(parsed)

  if (!result.success) {
    console.error('[LLM] Validation failed:', result.error.issues)
    throw new Error(`LLM response validation failed: ${result.error.message}`)
  }

  return result.data
}
