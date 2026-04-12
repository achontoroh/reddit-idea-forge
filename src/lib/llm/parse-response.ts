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

function normalizeResponse(parsed: unknown): unknown {
  if (Array.isArray(parsed)) {
    console.log('[LLM] Response is a bare array — wrapping as { ideas: [...] }')
    return { ideas: parsed }
  }

  if (typeof parsed === 'object' && parsed !== null && 'ideas' in parsed) {
    return parsed
  }

  throw new Error(
    `LLM response has unexpected shape: expected object with "ideas" key or array, got ${typeof parsed}`
  )
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

  // Log raw response prefix for debugging
  console.log('[LLM] Raw response preview:', cleaned.slice(0, 500))

  // Normalize: if the model returned a bare array, wrap it as { ideas: [...] }
  // so it matches schemas that expect an object with an `ideas` key
  const normalized = normalizeResponse(parsed)

  const result = schema.safeParse(normalized)

  if (!result.success) {
    console.error('[LLM] Validation failed:', result.error.issues)
    throw new Error(`LLM response validation failed: ${result.error.message}`)
  }

  return result.data
}
