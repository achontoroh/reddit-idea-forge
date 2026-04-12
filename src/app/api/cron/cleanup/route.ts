import { NextRequest, NextResponse } from 'next/server'
import { validateCronAuth } from '@/lib/utils/validation'
import { runCleanup } from '@/lib/pipeline/cleanup'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  const authError = validateCronAuth(request)
  if (authError) return authError

  try {
    logger.info('[Cron/Cleanup] Starting cleanup...')

    const result = await runCleanup()

    logger.info(`[Cron/Cleanup] Deleted ${result.deletedPosts} expired posts`)
    logger.info(`[Cron/Cleanup] Deleted ${result.deletedIdeas} expired ideas`)

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    logger.error('[Cron/Cleanup] Failed', {
      error: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
