export interface Subscription {
  id: string
  user_id: string
  categories: string[]
  is_active: boolean
  unsubscribe_token: string
  created_at: string
  updated_at: string
}
