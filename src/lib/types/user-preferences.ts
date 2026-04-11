export interface UserPreferences {
  id: string
  user_id: string
  categories: string[]
  onboarding_completed: boolean
  last_seen_at: string | null
  explore_tokens_today: number
  explore_tokens_reset_at: string | null
  created_at: string
  updated_at: string
}
