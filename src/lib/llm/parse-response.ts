import { type z } from 'zod'

function stripCodeFences(raw: string): string {
  return raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim()
}

/**
 * Find balanced JSON structures in a string. Returns candidates from longest
 * to shortest so callers try the most likely real payload first.
 */
function extractBalancedJsonCandidates(raw: string): string[] {
  const candidates: string[] = []
  let searchFrom = 0

  while (searchFrom < raw.length) {
    const offset = raw.slice(searchFrom).search(/[\[{]/)
    if (offset === -1) break

    const start = searchFrom + offset
    const stack: string[] = []
    let inString = false
    let isEscaped = false
    let found = false

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
        if (stack.length === 0 || stack[stack.length - 1] !== expected) {
          break
        }
        stack.pop()

        if (stack.length === 0) {
          candidates.push(raw.slice(start, index + 1))
          found = true
          break
        }
      }
    }

    // Move past this opening bracket whether we matched or not
    searchFrom = found ? start + 1 : start + 1
  }

  // Sort longest first — the real payload is almost always the largest
  candidates.sort((a, b) => b.length - a.length)
  return candidates
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
  // Log raw LLM output before any cleaning — for debugging parse failures
  console.log('[LLM] Raw response preview:', raw.slice(0, 500))

  const cleaned = stripCodeFences(raw)

  let parsed: unknown
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    // The cleaned string isn't valid JSON on its own — scan for balanced
    // JSON structures and try each one (largest first, since small fragments
    // in preamble text like {"ideas": [...]} are false positives)
    const candidates = extractBalancedJsonCandidates(cleaned)
    if (candidates.length === 0) {
      console.error('[LLM] Failed to locate JSON in response:', cleaned.slice(0, 500))
      throw new Error('LLM response did not contain valid JSON')
    }

    let lastError: unknown
    for (const candidate of candidates) {
      try {
        parsed = JSON.parse(candidate)
        console.log(`[LLM] Parsed JSON from candidate (${candidate.length} chars, ${candidates.length} total candidates)`)
        break
      } catch (error) {
        lastError = error
      }
    }

    if (parsed === undefined) {
      console.error('[LLM] All JSON candidates failed to parse. Largest candidate:', candidates[0].slice(0, 500))
      throw lastError
    }
  }

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
