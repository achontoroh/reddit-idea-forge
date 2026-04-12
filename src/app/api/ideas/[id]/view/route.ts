import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { type IdeaRouteContext } from '@/lib/types/idea'

export async function POST(_request: NextRequest, context: IdeaRouteContext) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: ideaId } = await context.params

    // ON CONFLICT DO NOTHING — FK constraint handles invalid idea_id
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

    const { data: updated } = await supabase
      .from('ideas')
      .select('view_count')
      .eq('id', ideaId)
      .single()

    return NextResponse.json({
      success: true,
      view_count: updated?.view_count ?? 0,
    })
  } catch (error) {
    console.error('[API] POST /api/ideas/[id]/view:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
