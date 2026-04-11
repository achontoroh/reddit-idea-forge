export interface ScoreBreakdown {
  pain_intensity: number
  willingness_to_pay: number
  competition: number
  tam: number
}

export type MvpComplexity = 'low' | 'medium' | 'high'
export type MonetizationModel = 'subscription' | 'one-time' | 'freemium' | 'marketplace'

export interface Idea {
  id: string
  title: string
  pitch: string
  pain_point: string
  category: string
  source_subreddit: string
  source_url: string | null
  ai_score: number
  ai_score_breakdown: ScoreBreakdown
  target_audience: string | null
  source_post_ids: string[] | null
  community_score: number
  view_count: number
  mvp_complexity: MvpComplexity | null
  monetization_model: MonetizationModel | null
  expires_at: string | null
  created_at: string
}
