import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function POST(_request: NextRequest, context: RouteContext) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: ideaId } = await context.params

    // Verify idea exists
    const { data: idea } = await supabase
      .from('ideas')
      .select('id')
      .eq('id', ideaId)
      .single()

    if (!idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 })
    }

    // Insert view — ON CONFLICT DO NOTHING (one view per user per idea)
    // DB trigger handles view_count increment
    const { error: viewError } = await supabase
      .from('idea_views')
      .upsert(
        { idea_id: ideaId, user_id: user.id },
        { onConflict: 'idea_id,user_id', ignoreDuplicates: true }
      )

    if (viewError) {
      console.error('[API] view POST error:', viewError)
      return NextResponse.json(
        { error: 'Failed to record view' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[API] POST /api/ideas/[id]/view:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
