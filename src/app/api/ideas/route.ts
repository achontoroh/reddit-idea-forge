import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { type Idea, type IdeaWithVote, type IdeaBadge } from '@/lib/types/idea'

type TabMode = 'hot' | 'top' | 'new' | 'foryou'
type TopPeriod = 'week' | 'month' | 'all'

const VALID_TABS: readonly TabMode[] = ['hot', 'top', 'new', 'foryou']
const VALID_PERIODS: readonly TopPeriod[] = ['week', 'month', 'all']

const DEFAULT_LIMIT = 20
const MAX_LIMIT = 100

/** Recency boost window for "hot" tab — ideas within this window get boosted */
const HOT_RECENCY_HOURS = 24

function getPeriodFilter(period: TopPeriod): string | null {
  switch (period) {
    case 'week':
      return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    case 'month':
      return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    case 'all':
      return null
  }
}

/**
 * Compute a "hot" score: weighted combination of recency, community score, and views.
 * Ideas within the last HOT_RECENCY_HOURS get a boost.
 */
function computeHotScore(idea: Idea): number {
  const ageMs = Date.now() - new Date(idea.created_at).getTime()
  const ageHours = ageMs / (1000 * 60 * 60)
  const recencyBoost = ageHours <= HOT_RECENCY_HOURS ? 50 : 0

  return idea.ai_score * 2 + idea.community_score * 3 + idea.view_count * 0.5 + recencyBoost
}

/**
 * Compute badges for a set of ideas.
 * Badge criteria:
 *   - 'new':      created after user's last_seen_at AND no idea_views record for this user+idea
 *   - 'hot':      >= 5 upvotes in the last 24 hours
 *   - 'top':      in the top 10 by (ai_score + community_score) among ideas from last 7 days
 *   - 'trending': >= 3 votes (any direction) in the last 48 hours
 *
 * OPTIMIZATION NOTE: Badge computation uses additional subqueries. For MVP this is
 * acceptable with proper indexes. Future optimization: cache badge data in a
 * materialized view or compute badges in a background job.
 */
async function computeBadges(
  supabase: Awaited<ReturnType<typeof createClient>>,
  ideas: Idea[],
  userId: string
): Promise<Map<string, IdeaBadge[]>> {
  const badgeMap = new Map<string, IdeaBadge[]>()
  if (ideas.length === 0) return badgeMap

  const ideaIds = ideas.map((i) => i.id)

  // Initialize all ideas with empty badges
  for (const id of ideaIds) {
    badgeMap.set(id, [])
  }

  // --- 'new' badge: created after last_seen_at AND no view record ---
  // OPTIMIZATION NOTE: Could be cached per-user session to avoid repeated pref lookups
  const { data: prefs } = await supabase
    .from('user_preferences')
    .select('last_seen_at')
    .eq('user_id', userId)
    .maybeSingle()

  const lastSeenAt = prefs?.last_seen_at

  // Fetch user's viewed idea IDs (within the current batch)
  const { data: viewedRows } = await supabase
    .from('idea_views')
    .select('idea_id')
    .eq('user_id', userId)
    .in('idea_id', ideaIds)

  const viewedIds = new Set((viewedRows ?? []).map((r) => r.idea_id))

  for (const idea of ideas) {
    const isNew = lastSeenAt
      ? new Date(idea.created_at) > new Date(lastSeenAt) && !viewedIds.has(idea.id)
      : false // First-time users: no last_seen_at means nothing is "new" yet
    if (isNew) {
      badgeMap.get(idea.id)!.push('new')
    }
  }

  // --- 'hot' badge: >= 5 upvotes in the last 24 hours ---
  // OPTIMIZATION NOTE: Could use a pre-computed "recent_upvotes" column updated by trigger
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { data: hotVotes } = await supabase
    .from('idea_votes')
    .select('idea_id')
    .in('idea_id', ideaIds)
    .eq('vote', 1)
    .gte('created_at', twentyFourHoursAgo)

  const hotCounts = new Map<string, number>()
  for (const row of hotVotes ?? []) {
    hotCounts.set(row.idea_id, (hotCounts.get(row.idea_id) ?? 0) + 1)
  }
  for (const [ideaId, count] of hotCounts) {
    if (count >= 5) {
      badgeMap.get(ideaId)!.push('hot')
    }
  }

  // --- 'top' badge: top 10 by (ai_score + community_score) among ideas from last 7 days ---
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const recentIdeas = ideas.filter((i) => new Date(i.created_at) >= new Date(sevenDaysAgo))
  const sortedByScore = [...recentIdeas].sort(
    (a, b) => (b.ai_score + b.community_score) - (a.ai_score + a.community_score)
  )
  const topIds = new Set(sortedByScore.slice(0, 10).map((i) => i.id))

  for (const ideaId of topIds) {
    if (badgeMap.has(ideaId)) {
      badgeMap.get(ideaId)!.push('top')
    }
  }

  // --- 'trending' badge: >= 3 votes (any direction) in the last 48 hours ---
  // OPTIMIZATION NOTE: Could share the vote query with 'hot' and filter by time window
  const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
  const { data: trendingVotes } = await supabase
    .from('idea_votes')
    .select('idea_id')
    .in('idea_id', ideaIds)
    .gte('created_at', fortyEightHoursAgo)

  const trendingCounts = new Map<string, number>()
  for (const row of trendingVotes ?? []) {
    trendingCounts.set(row.idea_id, (trendingCounts.get(row.idea_id) ?? 0) + 1)
  }
  for (const [ideaId, count] of trendingCounts) {
    if (count >= 3) {
      badgeMap.get(ideaId)!.push('trending')
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

    // Parse query params
    const { searchParams } = new URL(request.url)
    const tabParam = searchParams.get('tab') as TabMode | null
    const tab: TabMode = tabParam && VALID_TABS.includes(tabParam) ? tabParam : 'hot'
    const category = searchParams.get('category')
    const periodParam = searchParams.get('period') as TopPeriod | null
    const period: TopPeriod = periodParam && VALID_PERIODS.includes(periodParam) ? periodParam : 'week'
    const limit = Math.min(
      Math.max(parseInt(searchParams.get('limit') ?? '', 10) || DEFAULT_LIMIT, 1),
      MAX_LIMIT
    )
    const offset = Math.max(parseInt(searchParams.get('offset') ?? '', 10) || 0, 0)

    // For "foryou" tab, fetch user's preferred categories
    let userCategories: string[] | null = null
    if (tab === 'foryou') {
      const { data: prefs } = await supabase
        .from('user_preferences')
        .select('categories')
        .eq('user_id', user.id)
        .maybeSingle()
      userCategories = prefs?.categories ?? null
    }

    // Build query — left join idea_votes for current user's vote
    let query = supabase
      .from('ideas')
      .select('*, idea_votes!left(vote)', { count: 'exact' })
      .eq('idea_votes.user_id', user.id)

    // Exclude expired ideas
    query = query.or('expires_at.is.null,expires_at.gt.now()')

    // Category filter (from chips)
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    // "For You" — filter by user's preferred categories
    if (tab === 'foryou' && userCategories && userCategories.length > 0) {
      query = query.in('category', userCategories)
    }

    // Period filter (for "top" tab)
    if (tab === 'top') {
      const timeSince = getPeriodFilter(period)
      if (timeSince) {
        query = query.gte('created_at', timeSince)
      }
    }

    // Sorting — "hot" sorts client-side after fetch, others sort server-side
    if (tab === 'hot') {
      // Fetch a broader set for hot ranking, then slice for pagination
      // We need all candidate ideas to rank by hotness, so fetch more
      query = query.order('created_at', { ascending: false }).limit(500)
    } else if (tab === 'top') {
      query = query
        .order('ai_score', { ascending: false })
        .order('community_score', { ascending: false })
        .range(offset, offset + limit - 1)
    } else if (tab === 'new') {
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

    // Transform joined data: extract userVote from idea_votes array
    let rawIdeas: (Idea & { userVote: 1 | -1 | null })[] = (data ?? []).map((row) => {
      const { idea_votes, ...idea } = row as Idea & { idea_votes: { vote: number }[] }
      const userVote = idea_votes?.[0]?.vote as 1 | -1 | undefined ?? null
      return { ...idea, userVote }
    })

    // For "hot" tab: rank by computed hot score, then paginate
    let total = count ?? 0
    if (tab === 'hot') {
      rawIdeas.sort((a, b) => computeHotScore(b) - computeHotScore(a))
      total = rawIdeas.length
      rawIdeas = rawIdeas.slice(offset, offset + limit)
    }

    // Compute server-side badges for the page of ideas
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
