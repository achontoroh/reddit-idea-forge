import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { type Idea } from '@/lib/types/idea'
import { type RedditPost } from '@/lib/types/reddit-post'
import { IdeaDetailClient } from './idea-detail-client'

interface IdeaDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function IdeaDetailPage({ params }: IdeaDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch idea
  const { data: idea } = await supabase
    .from('ideas')
    .select('*')
    .eq('id', id)
    .single()

  if (!idea) {
    notFound()
  }

  const typedIdea = idea as Idea

  // Get current user
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

  // Fetch linked Reddit posts
  let redditPosts: RedditPost[] = []
  if (typedIdea.source_post_ids && typedIdea.source_post_ids.length > 0) {
    const { data: posts } = await supabase
      .from('reddit_posts')
      .select('*')
      .in('id', typedIdea.source_post_ids)

    redditPosts = (posts as RedditPost[]) ?? []
  }

  return (
    <IdeaDetailClient
      idea={typedIdea}
      userVote={userVote}
      isFavorited={isFavorited}
      redditPosts={redditPosts}
      isAuthenticated={!!user}
    />
  )
}
