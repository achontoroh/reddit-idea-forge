---
name: kit-llm
description: "Use when working with LLM integration — prompt design, Anthropic API calls, response validation, idea generation pipeline. Contains prompt templates, Zod schemas, and the two-step pipeline architecture."
---

# LLM Integration — Idea Generation Pipeline

## Architecture Overview

```
Mock Reddit posts → Step 1: Signal extraction (LLM) → Step 2: Idea generation + scoring (LLM) → Zod validation → Supabase insert
```

Two separate LLM calls with different system prompts optimized for each task.

## Anthropic SDK Usage

```typescript
// src/lib/llm/client.ts
import Anthropic from '@anthropic-ai/sdk'
import { LLM_CONFIG } from '@/config/llm'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function callLLM(systemPrompt: string, userPrompt: string): Promise<string> {
  const response = await client.messages.create({
    model: LLM_CONFIG.model,
    max_tokens: LLM_CONFIG.maxTokens,
    temperature: LLM_CONFIG.temperature,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const textBlock = response.content.find(block => block.type === 'text')
  if (!textBlock || textBlock.type !== 'text') throw new Error('No text response from LLM')
  return textBlock.text
}
```

## Config

```typescript
// src/config/llm.ts
export const LLM_CONFIG = {
  model: 'claude-sonnet-4-20250514',
  maxTokens: 4096,
  temperature: 0.7,          // creative variety for ideas
  scoringTemperature: 0.3,   // consistency for scoring
} as const
```

## Prompt Design Rules

1. **System prompt** sets role and output format
2. **User prompt** provides the data
3. **Always instruct**: "Respond ONLY with valid JSON. No markdown, no preamble."
4. **Include 1 few-shot example** in system prompt for format consistency
5. **Prompts live in `src/lib/llm/prompts.ts`** — never inline in routes

## Zod Schemas

```typescript
// src/lib/llm/schemas.ts
import { z } from 'zod'

export const SignalSchema = z.object({
  post_id: z.string(),
  pain_point: z.string(),
  frequency_indicator: z.string(),
  target_audience: z.string(),
  category: z.enum(['devtools', 'health', 'education', 'finance', 'productivity', 'other']),
})

export const ScoreBreakdownSchema = z.object({
  pain_intensity: z.number().min(0).max(25),
  willingness_to_pay: z.number().min(0).max(25),
  competition: z.number().min(0).max(25),
  tam: z.number().min(0).max(25),
})

export const GeneratedIdeaSchema = z.object({
  title: z.string(),
  pitch: z.string(),
  pain_point: z.string(),
  target_audience: z.string(),
  category: z.enum(['devtools', 'health', 'education', 'finance', 'productivity', 'other']),
  source_subreddit: z.string(),
  source_url: z.string().nullable(),
  score: z.number().min(0).max(100),
  score_breakdown: ScoreBreakdownSchema,
})

export const SignalsResponseSchema = z.object({ signals: z.array(SignalSchema) })
export const IdeasResponseSchema = z.object({ ideas: z.array(GeneratedIdeaSchema) })
```

## Response Parsing Pattern

```typescript
function parseLLMResponse<T>(raw: string, schema: z.ZodType<T>): T {
  // Strip potential markdown code fences
  const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

  const parsed = JSON.parse(cleaned)
  const result = schema.safeParse(parsed)

  if (!result.success) {
    console.error('[LLM] Validation failed:', result.error.issues)
    throw new Error(`LLM response validation failed: ${result.error.message}`)
  }

  return result.data
}
```

## Retry Logic

```typescript
async function callLLMWithRetry(system: string, user: string, maxRetries = 1): Promise<string> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await callLLM(system, user)
    } catch (error) {
      if (attempt === maxRetries) throw error
      console.warn(`[LLM] Attempt ${attempt + 1} failed, retrying...`)
    }
  }
  throw new Error('LLM call failed after retries')
}
```

## Score Validation

After parsing, verify score consistency:

```typescript
function validateScore(idea: GeneratedIdea): boolean {
  const { pain_intensity, willingness_to_pay, competition, tam } = idea.score_breakdown
  const calculatedTotal = pain_intensity + willingness_to_pay + competition + tam
  return Math.abs(calculatedTotal - idea.score) <= 2 // allow small rounding
}
```

## Pipeline Composition

```typescript
// src/lib/llm/generate-ideas.ts
export async function generateIdeas(posts: RedditPost[]): Promise<GeneratedIdea[]> {
  // Step 1: Extract signals
  const signalsRaw = await callLLMWithRetry(
    PROMPTS.signalExtraction.system,
    PROMPTS.signalExtraction.user(posts)
  )
  const { signals } = parseLLMResponse(signalsRaw, SignalsResponseSchema)

  // Step 2: Generate ideas with scoring
  const ideasRaw = await callLLMWithRetry(
    PROMPTS.ideaGeneration.system,
    PROMPTS.ideaGeneration.user(signals)
  )
  const { ideas } = parseLLMResponse(ideasRaw, IdeasResponseSchema)

  // Step 3: Validate scores
  return ideas.filter(idea => {
    if (!validateScore(idea)) {
      console.warn(`[LLM] Score mismatch for "${idea.title}", skipping`)
      return false
    }
    return true
  })
}
```
