import { NextResponse } from 'next/server'
import { supabaseServiceRole } from '@/lib/supabase/service'

/**
 * POST /api/dev/cleanup — run TTL cleanup (dev only, no auth required).
 * Mirrors /api/cron/cleanup logic without CRON_SECRET validation.
 */
export async function POST() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { success: false, error: 'Dev only' },
      { status: 403 }
    )
  }

  try {
    const now = new Date().toISOString()

    const { data: deletedPosts, error: postsError } = await supabaseServiceRole
      .from('reddit_posts')
      .delete()
      .lt('expires_at', now)
      .eq('processed', true)
      .select('id')

    if (postsError) {
      throw new Error(`Failed to delete expired posts: ${postsError.message}`)
    }

    const { data: deletedIdeas, error: ideasError } = await supabaseServiceRole
      .from('ideas')
      .delete()
      .lt('expires_at', now)
      .select('id')

    if (ideasError) {
      throw new Error(`Failed to delete expired ideas: ${ideasError.message}`)
    }

    return NextResponse.json({
      success: true,
      deletedPosts: deletedPosts?.length ?? 0,
      deletedIdeas: deletedIdeas?.length ?? 0,
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
