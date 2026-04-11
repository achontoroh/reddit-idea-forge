import type { ScoreBreakdown, MvpComplexity, MonetizationModel } from './idea'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Relationships: []
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
        Insert: {
          id?: string
          title: string
          pitch: string
          pain_point: string
          category: string
          source_subreddit: string
          source_url?: string | null
          ai_score: number
          ai_score_breakdown: ScoreBreakdown
          target_audience?: string | null
          source_post_ids?: string[] | null
          community_score?: number
          view_count?: number
          mvp_complexity?: MvpComplexity | null
          monetization_model?: MonetizationModel | null
          expires_at?: string | null
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
          ai_score?: number
          ai_score_breakdown?: ScoreBreakdown
          target_audience?: string | null
          source_post_ids?: string[] | null
          community_score?: number
          view_count?: number
          mvp_complexity?: MvpComplexity | null
          monetization_model?: MonetizationModel | null
          expires_at?: string | null
          created_at?: string
        }
        Relationships: []
      }
      reddit_posts: {
        Row: {
          id: string
          reddit_id: string
          subreddit: string
          title: string
          body: string | null
          url: string
          score: number
          num_comments: number
          category: string
          fetched_at: string
          processed: boolean
          expires_at: string | null
        }
        Insert: {
          id?: string
          reddit_id: string
          subreddit: string
          title: string
          body?: string | null
          url: string
          score?: number
          num_comments?: number
          category: string
          fetched_at?: string
          processed?: boolean
          expires_at?: string | null
        }
        Update: {
          id?: string
          reddit_id?: string
          subreddit?: string
          title?: string
          body?: string | null
          url?: string
          score?: number
          num_comments?: number
          category?: string
          fetched_at?: string
          processed?: boolean
          expires_at?: string | null
        }
        Relationships: []
      }
      idea_votes: {
        Row: {
          id: string
          idea_id: string
          user_id: string
          vote: -1 | 1
          created_at: string
        }
        Insert: {
          id?: string
          idea_id: string
          user_id: string
          vote: -1 | 1
          created_at?: string
        }
        Update: {
          id?: string
          idea_id?: string
          user_id?: string
          vote?: -1 | 1
          created_at?: string
        }
        Relationships: []
      }
      idea_views: {
        Row: {
          id: string
          idea_id: string
          user_id: string
          viewed_at: string
        }
        Insert: {
          id?: string
          idea_id: string
          user_id: string
          viewed_at?: string
        }
        Update: {
          id?: string
          idea_id?: string
          user_id?: string
          viewed_at?: string
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          id: string
          idea_id: string
          user_id: string
          saved_at: string
        }
        Insert: {
          id?: string
          idea_id: string
          user_id: string
          saved_at?: string
        }
        Update: {
          id?: string
          idea_id?: string
          user_id?: string
          saved_at?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
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
        Insert: {
          id?: string
          user_id: string
          categories?: string[]
          onboarding_completed?: boolean
          last_seen_at?: string | null
          explore_tokens_today?: number
          explore_tokens_reset_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          categories?: string[]
          onboarding_completed?: boolean
          last_seen_at?: string | null
          explore_tokens_today?: number
          explore_tokens_reset_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
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
        Relationships: []
      }
      email_logs: {
        Row: {
          id: string
          user_id: string
          email: string
          status: 'sent' | 'failed'
          ideas_count: number
          error_message: string | null
          sent_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email: string
          status: 'sent' | 'failed'
          ideas_count: number
          error_message?: string | null
          sent_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email?: string
          status?: 'sent' | 'failed'
          ideas_count?: number
          error_message?: string | null
          sent_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}
