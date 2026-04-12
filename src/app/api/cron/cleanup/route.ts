import { NextRequest, NextResponse } from 'next/server'
import { validateCronAuth } from '@/lib/utils/validation'
import { runCleanup } from '@/lib/pipeline/cleanup'

export async function POST(request: NextRequest) {
  const authError = validateCronAuth(request)
  if (authError) return authError

  try {
    console.log('[Cron/Cleanup] Starting cleanup...')

    const result = await runCleanup()

    console.log(`[Cron/Cleanup] Deleted ${result.deletedPosts} expired posts`)
    console.log(`[Cron/Cleanup] Deleted ${result.deletedIdeas} expired ideas`)

    return NextResponse.json({
      success: true,
      ...result,
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
