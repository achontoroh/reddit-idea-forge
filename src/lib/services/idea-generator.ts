import { type RedditPost } from '@/data/reddit-mock'
import { callLLMWithRetry } from '@/lib/anthropic'
import { LLM_CONFIG } from '@/config/llm'
import { PROMPTS } from '@/lib/llm/prompts'
import { parseLLMResponse } from '@/lib/llm/parse-response'
import {
  SignalsResponseSchema,
  IdeasResponseSchema,
  type GeneratedIdea,
} from '@/lib/llm/schemas'

function validateScore(idea: GeneratedIdea): boolean {
  const { pain_intensity, willingness_to_pay, competition, tam } =
    idea.score_breakdown
  const calculatedTotal =
    pain_intensity + willingness_to_pay + competition + tam
  return Math.abs(calculatedTotal - idea.score) <= 2
}

export async function generateIdeasFromPosts(
  posts: RedditPost[]
): Promise<GeneratedIdea[]> {
  // Step 1: Extract signals from posts
  const signalsRaw = await callLLMWithRetry(
    PROMPTS.signalExtraction.system,
    PROMPTS.signalExtraction.user(posts),
    LLM_CONFIG.temperature
  )
  const { signals } = parseLLMResponse(signalsRaw, SignalsResponseSchema)

  if (process.env.NODE_ENV === 'development') {
    console.log(`[LLM] Extracted ${signals.length} signals from ${posts.length} posts`)
  }

  // Step 2: Generate ideas with scoring
  const ideasRaw = await callLLMWithRetry(
    PROMPTS.ideaGeneration.system,
    PROMPTS.ideaGeneration.user(signals),
    LLM_CONFIG.temperature
  )
  const { ideas } = parseLLMResponse(ideasRaw, IdeasResponseSchema)

  // Step 3: Validate scores, fix or skip invalid ones
  const validIdeas = ideas.filter((idea) => {
    if (!validateScore(idea)) {
      console.warn(`[LLM] Score mismatch for "${idea.title}", recalculating`)
      const { pain_intensity, willingness_to_pay, competition, tam } =
        idea.score_breakdown
      idea.score = pain_intensity + willingness_to_pay + competition + tam
    }
    return true
  })

  if (process.env.NODE_ENV === 'development') {
    console.log(`[LLM] Generated ${validIdeas.length} valid ideas`)
  }

  return validIdeas
}
