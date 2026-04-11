import { type RedditPost } from '@/lib/reddit/types'
import { getLLMProvider } from '@/lib/llm'
import { parseLLMResponse } from '@/lib/llm/parse-response'
import { ScoreBreakdownSchema, type GeneratedIdea } from '@/lib/llm/schemas'
import { type ScoreBreakdown } from '@/lib/types/idea'
import { LLM_CONFIG } from '@/config/llm'
import { z } from 'zod'

const IdeaScoreResponseSchema = z.object({
  pain_intensity: ScoreBreakdownSchema.shape.pain_intensity,
  willingness_to_pay: ScoreBreakdownSchema.shape.willingness_to_pay,
  competition: ScoreBreakdownSchema.shape.competition,
  tam: ScoreBreakdownSchema.shape.tam,
  reasoning: z.string(),
})

export interface IdeaScore extends ScoreBreakdown {
  total: number
  reasoning: string
}

const SCORING_SYSTEM_PROMPT = `You are a startup viability analyst. Score a product idea on four dimensions, each 0-25:

- pain_intensity: How severe is the pain? (0 = mild annoyance, 25 = hair-on-fire problem)
- willingness_to_pay: Would users pay? (0 = never, 25 = desperate to pay for a solution)
- competition: How open is the market? (0 = dominated by incumbents, 25 = no good solutions exist)
- tam: Total addressable market size (0 = tiny niche, 25 = massive market)

Also provide a brief "reasoning" field (2-3 sentences) explaining your scoring rationale.

Respond ONLY with valid JSON. No markdown, no preamble.

Example:
{
  "pain_intensity": 20,
  "willingness_to_pay": 18,
  "competition": 22,
  "tam": 12,
  "reasoning": "Developers frequently report this pain point with high engagement. Existing tools don't address it well, but the TAM is limited to Next.js users."
}`

export async function scoreIdea(
  idea: GeneratedIdea,
  sourcePosts: RedditPost[]
): Promise<IdeaScore> {
  const userPrompt = `Score this product idea:

Title: ${idea.title}
Pitch: ${idea.pitch}
Pain Point: ${idea.pain_point}
Target Audience: ${idea.target_audience}
Category: ${idea.category}

Source Reddit posts for context:
${sourcePosts
  .map(
    (p) =>
      `- [${p.subreddit}] "${p.title}" (score: ${p.score}, comments: ${p.num_comments})`
  )
  .join('\n')}`

  const llm = getLLMProvider()
  const raw = await llm.complete(userPrompt, SCORING_SYSTEM_PROMPT, {
    temperature: LLM_CONFIG.scoringTemperature,
  })

  const parsed = parseLLMResponse(raw, IdeaScoreResponseSchema)
  const total =
    parsed.pain_intensity +
    parsed.willingness_to_pay +
    parsed.competition +
    parsed.tam

  return {
    pain_intensity: parsed.pain_intensity,
    willingness_to_pay: parsed.willingness_to_pay,
    competition: parsed.competition,
    tam: parsed.tam,
    total,
    reasoning: parsed.reasoning,
  }
}
