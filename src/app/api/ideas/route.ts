import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { type Idea, type IdeaWithVote, type IdeaBadge } from '@/lib/types/idea'

type TabMode = 'latest' | 'rating' | 'foryou'

const VALID_TABS: readonly TabMode[] = ['latest', 'rating', 'foryou']
const DEFAULT_LIMIT = 20
const MAX_LIMIT = 100

async function computeBadges(
  supabase: Awaited<ReturnType<typeof createClient>>,
  ideas: Idea[],
  userId: string
): Promise<Map<string, IdeaBadge[]>> {
  const badgeMap = new Map<string, IdeaBadge[]>()
  if (ideas.length === 0) return badgeMap

  const ideaIds = ideas.map((i) => i.id)

  for (const id of ideaIds) {
    badgeMap.set(id, [])
  }

  const { data: viewedRows } = await supabase
    .from('idea_views')
    .select('idea_id')
    .eq('user_id', userId)
    .in('idea_id', ideaIds)

  const viewedIds = new Set((viewedRows ?? []).map((r) => r.idea_id))

  for (const idea of ideas) {
    if (!viewedIds.has(idea.id)) {
      badgeMap.get(idea.id)!.push('new')
    }
  }

  // --- 'hot' + 'trending' badges from a single vote query ---
  // Fetch all votes from the last 48h (superset of 24h window for 'hot')
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()

  const { data: recentVotes } = await supabase
    .from('idea_votes')
    .select('idea_id, vote, created_at')
    .in('idea_id', ideaIds)
    .gte('created_at', fortyEightHoursAgo)

  const hotCounts = new Map<string, number>()
  const trendingCounts = new Map<string, number>()
  for (const row of recentVotes ?? []) {
    // Trending: any vote in last 48h
    trendingCounts.set(row.idea_id, (trendingCounts.get(row.idea_id) ?? 0) + 1)
    // Hot: upvotes only, last 24h
    if (row.vote === 1 && row.created_at >= twentyFourHoursAgo) {
      hotCounts.set(row.idea_id, (hotCounts.get(row.idea_id) ?? 0) + 1)
    }
  }
  for (const [ideaId, count] of hotCounts) {
    if (count >= 5) {
      badgeMap.get(ideaId)!.push('hot')
    }
  }
  for (const [ideaId, count] of trendingCounts) {
    if (count >= 3) {
      badgeMap.get(ideaId)!.push('trending')
    }
  }

  // --- 'top' badge: top 5 by (ai_score + community_score) among ideas from last 7 days ---
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const recentIdeas = ideas.filter((i) => new Date(i.created_at) >= new Date(sevenDaysAgo))
  const sortedByScore = [...recentIdeas].sort(
    (a, b) => (b.ai_score + b.community_score) - (a.ai_score + a.community_score)
  )
  const topIds = new Set(sortedByScore.slice(0, 5).map((i) => i.id))

  for (const ideaId of topIds) {
    if (badgeMap.has(ideaId)) {
      badgeMap.get(ideaId)!.push('top')
    }
  }

  return badgeMap
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const tabParam = searchParams.get('tab') as TabMode | null
    const tab: TabMode = tabParam && VALID_TABS.includes(tabParam) ? tabParam : 'latest'
    const category = searchParams.get('category')
    const limit = Math.min(
      Math.max(parseInt(searchParams.get('limit') ?? '', 10) || DEFAULT_LIMIT, 1),
      MAX_LIMIT
    )
    const offset = Math.max(parseInt(searchParams.get('offset') ?? '', 10) || 0, 0)

    let userCategories: string[] | null = null
    if (tab === 'foryou') {
      const { data: prefs } = await supabase
        .from('user_preferences')
        .select('categories')
        .eq('user_id', user.id)
        .maybeSingle()
      userCategories = prefs?.categories ?? null
    }

    let query = supabase
      .from('ideas')
      .select('*, idea_votes!left(vote)', { count: 'exact' })
      .eq('idea_votes.user_id', user.id)

    query = query.or('expires_at.is.null,expires_at.gt.now()')

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    if (tab === 'foryou' && userCategories && userCategories.length > 0) {
      query = query.in('category', userCategories)
    }

    if (tab === 'rating') {
      query = query
        .order('ai_score', { ascending: false })
        .order('community_score', { ascending: false })
        .range(offset, offset + limit - 1)
    } else if (tab === 'latest') {
      query = query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)
    } else {
      // foryou — sort by ai_score
      query = query
        .order('ai_score', { ascending: false })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('[API] ideas GET query error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch ideas' },
        { status: 500 }
      )
    }

    const rawIdeas: (Idea & { userVote: 1 | -1 | null })[] = (data ?? []).map((row) => {
      const { idea_votes, ...idea } = row as Idea & { idea_votes: { vote: number }[] }
      const userVote = idea_votes?.[0]?.vote as 1 | -1 | undefined ?? null
      return { ...idea, userVote }
    })

    const total = count ?? 0

    const badgeMap = await computeBadges(supabase, rawIdeas, user.id)

    const ideas: IdeaWithVote[] = rawIdeas.map((idea) => ({
      ...idea,
      badges: badgeMap.get(idea.id) ?? [],
    }))

    return NextResponse.json({
      data: ideas,
      pagination: {
        total,
        limit,
        offset,
      },
    })
  } catch (error) {
    console.error('[API] ideas GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
