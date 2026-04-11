import { type RedditPost } from '@/lib/reddit/types'
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

  // Build post_id → url map for URL tracking through the pipeline
  const urlByPostId = new Map(posts.map((p) => [p.id, p.url]))

  // Step 1: Extract signals from posts
  const signalsRaw = await llm.complete(
    PROMPTS.signalExtraction.user(selectedPosts),
    PROMPTS.signalExtraction.system
  )
  const { signals } = parseLLMResponse(signalsRaw, SignalsResponseSchema)

  // Enrich signals with verified source URLs from original posts
  const enrichedSignals = signals.map((signal) => ({
    ...signal,
    source_url: urlByPostId.get(signal.post_id) ?? signal.source_url,
  }))

  if (process.env.NODE_ENV === 'development') {
    console.log(
      `[LLM] Extracted ${enrichedSignals.length} signals from ${selectedPosts.length}/${posts.length} posts`
    )
  }

  // Step 2: Generate ideas with scoring (signals carry verified source URLs)
  const ideasRaw = await llm.complete(
    PROMPTS.ideaGeneration.user(enrichedSignals),
    PROMPTS.ideaGeneration.system
  )
  const { ideas } = parseLLMResponse(ideasRaw, IdeasResponseSchema)

  // Step 3: Validate scores, fix or skip invalid ones
  const knownUrls = new Set(urlByPostId.values())
  const validIdeas = ideas.filter((idea) => {
    if (!validateScore(idea)) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[LLM] Score mismatch for "${idea.title}", recalculating`)
      }
      const { pain_intensity, willingness_to_pay, competition, tam } =
        idea.score_breakdown
      idea.score = pain_intensity + willingness_to_pay + competition + tam
    }
    // Validate source_url is a known post URL
    if (!idea.source_url || !knownUrls.has(idea.source_url)) {
      const matchingSignal = enrichedSignals.find(
        (s) => s.category === idea.category
      )
      idea.source_url = matchingSignal?.source_url ?? null
    }
    return true
  })

  if (process.env.NODE_ENV === 'development') {
    console.log(`[LLM] Generated ${validIdeas.length} valid ideas`)
  }

  return validIdeas
}
