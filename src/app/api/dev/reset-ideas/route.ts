import { NextResponse } from 'next/server'
import { supabaseServiceRole } from '@/lib/supabase/service'

/**
 * POST /api/dev/reset-ideas — delete all ideas and reset posts to unprocessed (dev only).
 */
export async function POST() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { success: false, error: 'Dev only' },
      { status: 403 }
    )
  }

  try {
    // Delete all ideas
    const { data: deletedRows, error: ideasError } = await supabaseServiceRole
      .from('ideas')
      .delete()
      .gte('id', '00000000-0000-0000-0000-000000000000')
      .select('id')

    if (ideasError) throw ideasError

    // Reset all posts to unprocessed so they can be re-generated
    const { data: resetRows, error: postsError } = await supabaseServiceRole
      .from('reddit_posts')
      .update({ processed: false })
      .eq('processed', true)
      .select('id')

    if (postsError) throw postsError

    return NextResponse.json({
      success: true,
      deletedIdeas: deletedRows?.length ?? 0,
      resetPosts: resetRows?.length ?? 0,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
