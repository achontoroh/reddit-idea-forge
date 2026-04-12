import { supabaseServiceRole } from '@/lib/supabase/service'

interface CleanupResult {
  deletedPosts: number
  deletedIdeas: number
}

/** Delete expired posts and ideas. Shared by cron and dev cleanup routes. */
export async function runCleanup(): Promise<CleanupResult> {
  const now = new Date().toISOString()

  const [postsResult, ideasResult] = await Promise.all([
    supabaseServiceRole
      .from('reddit_posts')
      .delete()
      .lt('expires_at', now)
      .eq('processed', true)
      .select('id'),
    supabaseServiceRole
      .from('ideas')
      .delete()
      .lt('expires_at', now)
      .select('id'),
  ])

  if (postsResult.error) {
    throw new Error(`Failed to delete expired posts: ${postsResult.error.message}`)
  }
  if (ideasResult.error) {
    throw new Error(`Failed to delete expired ideas: ${ideasResult.error.message}`)
  }

  return {
    deletedPosts: postsResult.data?.length ?? 0,
    deletedIdeas: ideasResult.data?.length ?? 0,
  }
}
