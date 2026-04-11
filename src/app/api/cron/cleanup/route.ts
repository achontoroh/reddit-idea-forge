import { NextRequest, NextResponse } from 'next/server'
import { supabaseServiceRole } from '@/lib/supabase/service'
import { validateCronAuth } from '@/lib/utils/validation'

export async function POST(request: NextRequest) {
  const authError = validateCronAuth(request)
  if (authError) return authError

  try {
    const now = new Date().toISOString()
    console.log(`[Cron/Cleanup] Starting cleanup (now: ${now})...`)

    // Delete expired processed reddit posts
    const { data: deletedPosts, error: postsError } = await supabaseServiceRole
      .from('reddit_posts')
      .delete()
      .lt('expires_at', now)
      .eq('processed', true)
      .select('id')

    if (postsError) {
      throw new Error(`Failed to delete expired posts: ${postsError.message}`)
    }

    const deletedPostsCount = deletedPosts?.length ?? 0
    console.log(`[Cron/Cleanup] Deleted ${deletedPostsCount} expired posts`)

    // Delete expired ideas
    const { data: deletedIdeas, error: ideasError } = await supabaseServiceRole
      .from('ideas')
      .delete()
      .lt('expires_at', now)
      .select('id')

    if (ideasError) {
      throw new Error(`Failed to delete expired ideas: ${ideasError.message}`)
    }

    const deletedIdeasCount = deletedIdeas?.length ?? 0
    console.log(`[Cron/Cleanup] Deleted ${deletedIdeasCount} expired ideas`)

    return NextResponse.json({
      success: true,
      deletedPosts: deletedPostsCount,
      deletedIdeas: deletedIdeasCount,
    })
  } catch (error) {
    console.error('[Cron/Cleanup] Failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
