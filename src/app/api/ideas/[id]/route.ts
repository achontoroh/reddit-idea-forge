import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { type Idea, type IdeaRouteContext } from '@/lib/types/idea'
import { type RedditPost } from '@/lib/types/reddit-post'

export interface IdeaDetailResponse {
  idea: Idea
  userVote: 1 | -1 | null
  isFavorited: boolean
  redditPosts: RedditPost[]
}

export async function GET(_request: NextRequest, context: IdeaRouteContext) {
  try {
    const supabase = await createClient()
    const { id } = await context.params

    const { data: idea, error: ideaError } = await supabase
      .from('ideas')
      .select('*')
      .eq('id', id)
      .single()

    if (ideaError || !idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 })
    }

    const typedIdea = idea as Idea

    // Unauthenticated users can still view
    const { data: { user } } = await supabase.auth.getUser()

    let userVote: 1 | -1 | null = null
    let isFavorited = false

    if (user) {
      const [voteResult, favoriteResult] = await Promise.all([
        supabase
          .from('idea_votes')
          .select('vote')
          .eq('idea_id', id)
          .eq('user_id', user.id)
          .maybeSingle(),
        supabase
          .from('user_favorites')
          .select('id')
          .eq('idea_id', id)
          .eq('user_id', user.id)
          .maybeSingle(),
      ])

      userVote = (voteResult.data?.vote as 1 | -1) ?? null
      isFavorited = !!favoriteResult.data
    }

    let redditPosts: RedditPost[] = []
    if (typedIdea.source_post_ids && typedIdea.source_post_ids.length > 0) {
      const { data: posts } = await supabase
        .from('reddit_posts')
        .select('*')
        .in('id', typedIdea.source_post_ids)

      redditPosts = (posts as RedditPost[]) ?? []
    }

    const response: IdeaDetailResponse = {
      idea: typedIdea,
      userVote,
      isFavorited,
      redditPosts,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('[API] GET /api/ideas/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
