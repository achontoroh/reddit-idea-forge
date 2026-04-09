import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { type Idea } from '@/lib/types/idea'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Auth check
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse query params
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    // Query ideas scoped to authenticated user
    let query = supabase
      .from('ideas')
      .select('*')
      .eq('user_id', user.id)

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    const { data, error } = await query
      .order('score', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[API] ideas GET query error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch ideas' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: (data ?? []) as Idea[] })
  } catch (error) {
    console.error('[API] ideas GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
