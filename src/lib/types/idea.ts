export interface ScoreBreakdown {
  pain_intensity: number
  willingness_to_pay: number
  competition: number
  tam: number
}

export interface Idea {
  id: string
  user_id: string
  title: string
  pitch: string
  pain_point: string
  category: string
  source_subreddit: string
  source_url: string | null
  score: number
  score_breakdown: ScoreBreakdown
  is_new: boolean
  created_at: string
}
