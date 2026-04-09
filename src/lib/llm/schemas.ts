import { z } from 'zod'

export const SignalSchema = z.object({
  post_id: z.string(),
  source_url: z.string(),
  pain_point: z.string(),
  frequency_indicator: z.string(),
  target_audience: z.string(),
  category: z.enum(['devtools', 'health', 'education', 'finance', 'productivity']),
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
  category: z.enum(['devtools', 'health', 'education', 'finance', 'productivity']),
  source_subreddit: z.string(),
  source_url: z.string().nullable(),
  score: z.number().min(0).max(100),
  score_breakdown: ScoreBreakdownSchema,
})

export const SignalsResponseSchema = z.object({
  signals: z.array(SignalSchema),
})

export const IdeasResponseSchema = z.object({
  ideas: z.array(GeneratedIdeaSchema),
})

export type Signal = z.infer<typeof SignalSchema>
export type GeneratedIdea = z.infer<typeof GeneratedIdeaSchema>
