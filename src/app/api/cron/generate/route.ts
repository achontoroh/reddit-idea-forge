import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { fetchAndStorePosts } from '@/lib/reddit/fetch-service'
import { generateSharedIdeas } from '@/lib/pipeline/generate-ideas'
import { validateCronAuth } from '@/lib/utils/validation'
import { logger } from '@/lib/logger'
import { sendTelegramNotification } from '@/lib/notifications/telegram'

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

    sendTelegramNotification(
      `<b>✅ IdeaForge Pipeline</b>\n` +
      `📥 Fetched: ${fetchResult.newCount} new posts\n` +
      `💡 Ideas generated: ${genResult.ideasGenerated}\n` +
      `⏱ Duration: ${(durationMs / 1000).toFixed(1)}s`
    ).catch(() => {/* swallow — logged inside */})

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
    const durationMs = Date.now() - startTime
    const errorMessage = error instanceof Error ? error.message : String(error)

    logger.error('[Cron/Generate] Pipeline failed', { error: errorMessage })
    Sentry.captureException(error, { tags: { pipeline: 'cron' } })

    sendTelegramNotification(
      `<b>❌ IdeaForge Pipeline</b>\n` +
      `💥 ${errorMessage}\n` +
      `⏱ Duration: ${(durationMs / 1000).toFixed(1)}s`
    ).catch(() => {/* swallow — logged inside */})

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        durationMs,
      },
      { status: 500 }
    )
  }
}
