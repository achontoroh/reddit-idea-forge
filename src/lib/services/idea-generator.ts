import { type RedditPost } from '@/data/reddit-mock'
import { getLLMProvider } from '@/lib/llm'
import { PROMPTS } from '@/lib/llm/prompts'
import { parseLLMResponse } from '@/lib/llm/parse-response'
import { selectPostsForLLM } from '@/lib/reddit/select-posts'
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
  const llm = getLLMProvider()
  const selectedPosts = selectPostsForLLM(posts)

  // Step 1: Extract signals from posts
  const signalsRaw = await llm.complete(
    PROMPTS.signalExtraction.user(selectedPosts),
    PROMPTS.signalExtraction.system
  )
  const { signals } = parseLLMResponse(signalsRaw, SignalsResponseSchema)

  if (process.env.NODE_ENV === 'development') {
    console.log(
      `[LLM] Extracted ${signals.length} signals from ${selectedPosts.length}/${posts.length} posts`
    )
  }

  // Step 2: Generate ideas with scoring
  const ideasRaw = await llm.complete(
    PROMPTS.ideaGeneration.user(signals),
    PROMPTS.ideaGeneration.system
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
