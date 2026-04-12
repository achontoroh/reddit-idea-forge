import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch the current last_seen_at before updating
    const { data: prefs } = await supabase
      .from('user_preferences')
      .select('last_seen_at')
      .eq('user_id', user.id)
      .maybeSingle()

    const previousLastSeenAt = prefs?.last_seen_at ?? null
    const updatedLastSeenAt = new Date().toISOString()

    const { error } = await supabase
      .from('user_preferences')
      .update({
        last_seen_at: updatedLastSeenAt,
        updated_at: updatedLastSeenAt,
      })
      .eq('user_id', user.id)

    if (error) {
      console.error('[API] last-seen PATCH error:', error)
      return NextResponse.json(
        { error: 'Failed to update last seen' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      previous_last_seen_at: previousLastSeenAt,
      updated_last_seen_at: updatedLastSeenAt,
    })
  } catch (error) {
    console.error('[API] PATCH /api/user/preferences/last-seen:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
