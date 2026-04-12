import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { type Idea, type IdeaWithVote } from '@/lib/types/idea'

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
    let ideas: IdeaWithVote[] = (data ?? []).map((row) => {
      const { idea_votes, ...idea } = row as Idea & { idea_votes: { vote: number }[] }
      const userVote = idea_votes?.[0]?.vote as 1 | -1 | undefined ?? null
      return { ...idea, userVote }
    })

    // For "hot" tab: rank by computed hot score, then paginate
    let total = count ?? 0
    if (tab === 'hot') {
      ideas.sort((a, b) => computeHotScore(b) - computeHotScore(a))
      total = ideas.length
      ideas = ideas.slice(offset, offset + limit)
    }

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
