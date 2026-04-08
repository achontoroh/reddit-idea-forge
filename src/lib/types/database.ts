import type { ScoreBreakdown } from './idea'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          created_at: string
        }
        Insert: {
          id: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
        }
      }
      ideas: {
        Row: {
          id: string
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
        Insert: {
          id?: string
          title: string
          pitch: string
          pain_point: string
          category: string
          source_subreddit: string
          source_url?: string | null
          score: number
          score_breakdown: ScoreBreakdown
          is_new?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          pitch?: string
          pain_point?: string
          category?: string
          source_subreddit?: string
          source_url?: string | null
          score?: number
          score_breakdown?: ScoreBreakdown
          is_new?: boolean
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          categories: string[]
          is_active: boolean
          unsubscribe_token: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          categories?: string[]
          is_active?: boolean
          unsubscribe_token?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          categories?: string[]
          is_active?: boolean
          unsubscribe_token?: string
          created_at?: string
          updated_at?: string
        }
      }
      email_logs: {
        Row: {
          id: string
          subscription_id: string | null
          sent_at: string
          idea_ids: string[]
        }
        Insert: {
          id?: string
          subscription_id?: string | null
          sent_at?: string
          idea_ids?: string[]
        }
        Update: {
          id?: string
          subscription_id?: string | null
          sent_at?: string
          idea_ids?: string[]
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
