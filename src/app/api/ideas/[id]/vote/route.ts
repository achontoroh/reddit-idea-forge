import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const VoteSchema = z.object({
  vote: z.union([z.literal(1), z.literal(-1)]),
})

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: ideaId } = await context.params

    const body = await request.json()
    const parsed = VoteSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid vote. Must be 1 or -1.' },
        { status: 400 }
      )
    }

    const { vote } = parsed.data

    // Upsert vote — ON CONFLICT (idea_id, user_id) DO UPDATE
    const { error: voteError } = await supabase
      .from('idea_votes')
      .upsert(
        { idea_id: ideaId, user_id: user.id, vote },
        { onConflict: 'idea_id,user_id' }
      )

    if (voteError) {
      console.error('[API] vote POST upsert error:', voteError)
      return NextResponse.json(
        { error: 'Failed to save vote' },
        { status: 500 }
      )
    }

    // Fetch updated community_score (trigger has already recalculated it)
    const { data: idea, error: ideaError } = await supabase
      .from('ideas')
      .select('community_score')
      .eq('id', ideaId)
      .single()

    if (ideaError || !idea) {
      console.error('[API] vote POST fetch score error:', ideaError)
      return NextResponse.json(
        { error: 'Failed to fetch updated score' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      community_score: idea.community_score,
      userVote: vote,
    })
  } catch (error) {
    console.error('[API] vote POST:', error)
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

    // Delete vote — RLS ensures user can only delete their own
    const { error: deleteError } = await supabase
      .from('idea_votes')
      .delete()
      .eq('idea_id', ideaId)
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('[API] vote DELETE error:', deleteError)
      return NextResponse.json(
        { error: 'Failed to remove vote' },
        { status: 500 }
      )
    }

    // Fetch updated community_score
    const { data: idea, error: ideaError } = await supabase
      .from('ideas')
      .select('community_score')
      .eq('id', ideaId)
      .single()

    if (ideaError || !idea) {
      console.error('[API] vote DELETE fetch score error:', ideaError)
      return NextResponse.json(
        { error: 'Failed to fetch updated score' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      community_score: idea.community_score,
      userVote: null,
    })
  } catch (error) {
    console.error('[API] vote DELETE:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
