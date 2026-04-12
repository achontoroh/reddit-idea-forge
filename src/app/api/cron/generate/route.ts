import { NextRequest, NextResponse } from 'next/server'
import { fetchAndStorePosts } from '@/lib/reddit/fetch-service'
import { generateSharedIdeas } from '@/lib/pipeline/generate-ideas'
import { validateCronAuth } from '@/lib/utils/validation'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  const authError = validateCronAuth(request)
  if (authError) return authError

  try {
    logger.info('[Cron/Generate] Starting pipeline...')

    // Step 1: Fetch Reddit posts and store new ones
    const fetchResult = await fetchAndStorePosts()
    logger.info(
      `[Cron/Generate] Fetch complete: ${fetchResult.newCount} new posts, ` +
      `${fetchResult.skippedCount} duplicates`
    )

    // Step 2: Generate ideas from unprocessed posts
    const genResult = await generateSharedIdeas()
    logger.info(
      `[Cron/Generate] Generation complete: ${genResult.ideasGenerated} ideas`
    )

    const durationMs = Date.now() - startTime

    return NextResponse.json({
      success: true,
      fetched: fetchResult.fetchedCount,
      newPosts: fetchResult.newCount,
      ideasGenerated: genResult.ideasGenerated,
      ideasSkippedDuplicate: genResult.ideasSkippedDuplicate,
      model: genResult.model,
      durationMs,
      errors: [...fetchResult.errors, ...genResult.errors],
    })
  } catch (error) {
    logger.error('[Cron/Generate] Pipeline failed', {
      error: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        durationMs: Date.now() - startTime,
      },
      { status: 500 }
    )
  }
}
