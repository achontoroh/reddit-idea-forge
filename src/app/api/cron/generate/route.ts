import { NextRequest, NextResponse } from 'next/server'
import { fetchAndStorePosts } from '@/lib/reddit/fetch-service'
import { generateSharedIdeas } from '@/lib/pipeline/generate-ideas'

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  // Validate CRON_SECRET
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) {
    console.error('[Cron/Generate] CRON_SECRET env var is not set')
    return NextResponse.json(
      { success: false, error: 'Server misconfiguration' },
      { status: 500 }
    )
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    console.log('[Cron/Generate] Starting pipeline...')

    // Step 1: Fetch Reddit posts and store new ones
    const fetchResult = await fetchAndStorePosts()
    console.log(
      `[Cron/Generate] Fetch complete: ${fetchResult.newCount} new posts, ` +
      `${fetchResult.skippedCount} duplicates`
    )

    // Step 2: Generate ideas from unprocessed posts
    const genResult = await generateSharedIdeas()
    console.log(
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
    console.error('[Cron/Generate] Pipeline failed:', error)
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
