import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { type Idea } from '@/lib/types/idea'

const VALID_SORT = ['ai_score', 'community_score', 'created_at'] as const
type SortField = (typeof VALID_SORT)[number]

const DEFAULT_LIMIT = 20
const MAX_LIMIT = 100

function getTimePeriodFilter(period: string): string | null {
  switch (period) {
    case 'today':
      return new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    case 'week':
      return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    case 'month':
      return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    default:
      return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Auth check — dashboard access still requires authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse query params
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const period = searchParams.get('period')
    const sortParam = searchParams.get('sort') as SortField | null
    const sort: SortField = sortParam && VALID_SORT.includes(sortParam) ? sortParam : 'ai_score'
    const limit = Math.min(
      Math.max(parseInt(searchParams.get('limit') ?? '', 10) || DEFAULT_LIMIT, 1),
      MAX_LIMIT
    )
    const offset = Math.max(parseInt(searchParams.get('offset') ?? '', 10) || 0, 0)

    // Build query — shared pool, no user_id filter
    let query = supabase
      .from('ideas')
      .select('*', { count: 'exact' })

    // Exclude expired ideas
    query = query.or('expires_at.is.null,expires_at.gt.now()')

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    const timeSince = period ? getTimePeriodFilter(period) : null
    if (timeSince) {
      query = query.gte('created_at', timeSince)
    }

    const { data, error, count } = await query
      .order(sort, { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('[API] ideas GET query error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch ideas' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: (data ?? []) as Idea[],
      pagination: {
        total: count ?? 0,
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
