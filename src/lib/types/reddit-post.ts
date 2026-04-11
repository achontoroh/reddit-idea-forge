export interface RedditPost {
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
