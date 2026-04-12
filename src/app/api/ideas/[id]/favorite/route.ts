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

    const { error } = await supabase
      .from('user_favorites')
      .upsert(
        { idea_id: ideaId, user_id: user.id },
        { onConflict: 'idea_id,user_id', ignoreDuplicates: true }
      )

    if (error) {
      console.error('[API] favorite POST error:', error)
      return NextResponse.json(
        { error: 'Failed to save favorite' },
        { status: 500 }
      )
    }

    return NextResponse.json({ favorited: true })
  } catch (error) {
    console.error('[API] POST /api/ideas/[id]/favorite:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: ideaId } = await context.params

    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('idea_id', ideaId)
      .eq('user_id', user.id)

    if (error) {
      console.error('[API] favorite DELETE error:', error)
      return NextResponse.json(
        { error: 'Failed to remove favorite' },
        { status: 500 }
      )
    }

    return NextResponse.json({ favorited: false })
  } catch (error) {
    console.error('[API] DELETE /api/ideas/[id]/favorite:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
