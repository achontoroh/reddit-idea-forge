export interface IdeaVote {
  id: string
  idea_id: string
  user_id: string
  vote: -1 | 1
  created_at: string
}
