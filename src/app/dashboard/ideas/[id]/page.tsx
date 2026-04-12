import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { type Idea, type IdeaBadge } from '@/lib/types/idea'
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
  const badges: IdeaBadge[] = []

  if (user) {
    const [voteResult, favoriteResult, prefsResult, viewResult] = await Promise.all([
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
      supabase
        .from('user_preferences')
        .select('last_seen_at')
        .eq('user_id', user.id)
        .maybeSingle(),
      supabase
        .from('idea_views')
        .select('idea_id')
        .eq('user_id', user.id)
        .eq('idea_id', id)
        .maybeSingle(),
    ])

    userVote = (voteResult.data?.vote as 1 | -1) ?? null
    isFavorited = !!favoriteResult.data

    // Compute badges for this single idea
    const lastSeenAt = prefsResult.data?.last_seen_at
    const hasViewed = !!viewResult.data
    const nowMs = new Date().getTime()

    // 'new' badge: created after last_seen_at AND not viewed
    if (lastSeenAt && new Date(typedIdea.created_at) > new Date(lastSeenAt) && !hasViewed) {
      badges.push('new')
    }

    // 'hot' badge: >= 5 upvotes in last 24h
    const twentyFourHoursAgo = new Date(nowMs - 24 * 60 * 60 * 1000).toISOString()
    const { count: hotCount } = await supabase
      .from('idea_votes')
      .select('id', { count: 'exact', head: true })
      .eq('idea_id', id)
      .eq('vote', 1)
      .gte('created_at', twentyFourHoursAgo)
    if ((hotCount ?? 0) >= 5) badges.push('hot')

    // 'top' badge: in top 10 by (ai_score + community_score) among last 7 days ideas
    const sevenDaysAgo = new Date(nowMs - 7 * 24 * 60 * 60 * 1000).toISOString()
    if (new Date(typedIdea.created_at) >= new Date(sevenDaysAgo)) {
      // Fetch top candidates sorted by ai_score desc (best available proxy),
      // then re-rank by combined score server-side
      const { data: topCandidates } = await supabase
        .from('ideas')
        .select('id, ai_score, community_score')
        .gte('created_at', sevenDaysAgo)
        .or('expires_at.is.null,expires_at.gt.now()')
        .order('ai_score', { ascending: false })
        .limit(50)

      if (topCandidates) {
        const topIds = new Set(
          [...topCandidates]
            .sort((a, b) => (b.ai_score + b.community_score) - (a.ai_score + a.community_score))
            .slice(0, 10)
            .map((i) => i.id)
        )
        if (topIds.has(id)) badges.push('top')
      }
    }

    // 'trending' badge: >= 3 votes in last 48h
    const fortyEightHoursAgo = new Date(nowMs - 48 * 60 * 60 * 1000).toISOString()
    const { count: trendingCount } = await supabase
      .from('idea_votes')
      .select('id', { count: 'exact', head: true })
      .eq('idea_id', id)
      .gte('created_at', fortyEightHoursAgo)
    if ((trendingCount ?? 0) >= 3) badges.push('trending')
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
      badges={badges}
      redditPosts={redditPosts}
      isAuthenticated={!!user}
    />
  )
}
