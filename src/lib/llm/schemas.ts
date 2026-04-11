import { z } from 'zod'
import { CATEGORIES } from '@/config/categories'

const categorySlugs = CATEGORIES.map((c) => c.slug) as [string, ...string[]]

export const SignalSchema = z.object({
  post_id: z.string(),
  source_url: z.string(),
  pain_point: z.string(),
  frequency_indicator: z.string(),
  target_audience: z.string(),
  category: z.enum(categorySlugs),
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
  category: z.enum(categorySlugs),
  source_subreddit: z.string(),
  source_url: z.string().nullable(),
  score: z.number().min(0).max(100),
  score_breakdown: ScoreBreakdownSchema,
})

export const MvpComplexitySchema = z.enum(['low', 'medium', 'high'])
export const MonetizationModelSchema = z.enum(['subscription', 'one-time', 'freemium', 'marketplace'])

/** V2 schema: merged signal + idea generation with additional fields */
export const GeneratedIdeaV2Schema = z.object({
  title: z.string(),
  pitch: z.string(),
  pain_point: z.string(),
  target_audience: z.string(),
  category: z.enum(categorySlugs),
  source_subreddit: z.string(),
  source_url: z.string(),
  score: z.number().min(0).max(100),
  score_breakdown: ScoreBreakdownSchema,
  mvp_complexity: MvpComplexitySchema,
  monetization_model: MonetizationModelSchema,
})

export const SignalsResponseSchema = z.object({
  signals: z.array(SignalSchema),
})

export const IdeasResponseSchema = z.object({
  ideas: z.array(GeneratedIdeaSchema),
})

export const IdeasV2ResponseSchema = z.object({
  ideas: z.array(GeneratedIdeaV2Schema),
})

export type Signal = z.infer<typeof SignalSchema>
export type GeneratedIdea = z.infer<typeof GeneratedIdeaSchema>
export type GeneratedIdeaV2 = z.infer<typeof GeneratedIdeaV2Schema>
