import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { fetchAndStorePosts } from '@/lib/reddit/fetch-service'
import { generateSharedIdeas } from '@/lib/pipeline/generate-ideas'
import { getRotationSlotCount } from '@/lib/reddit/rotation'
import { AVAILABLE_MODELS } from '@/lib/llm/model-rotation'

function devOnly(): NextResponse | null {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { success: false, error: 'Dev only' },
      { status: 403 }
    )
  }
  return null
}

/**
 * POST /api/dev/pipeline — run one full generate cycle with explicit rotation index.
 * Body: { rotationIndex: number }
 */
export async function POST(request: NextRequest) {
  const guard = devOnly()
  if (guard) return guard

  const startTime = Date.now()

  try {
    const body = z
      .object({
        rotationIndex: z.number().int().min(0).optional().default(0),
        modelOverride: z.string().optional(),
      })
      .parse(await request.json())
    const { rotationIndex, modelOverride } = body

    const fetchResult = await fetchAndStorePosts(rotationIndex)
    const genResult = await generateSharedIdeas(
      modelOverride ? { modelOverride } : undefined
    )
    const durationMs = Date.now() - startTime

    return NextResponse.json({
      success: true,
      fetched: fetchResult.fetchedCount,
      newPosts: fetchResult.newCount,
      categories: fetchResult.categories,
      ideasGenerated: genResult.ideasGenerated,
      ideasSkippedDuplicate: genResult.ideasSkippedDuplicate,
      model: genResult.model,
      durationMs,
      errors: [...fetchResult.errors, ...genResult.errors],
    })
  } catch (error) {
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

/**
 * GET /api/dev/pipeline — return rotation metadata for the UI.
 */
export async function GET() {
  const guard = devOnly()
  if (guard) return guard

  return NextResponse.json({
    totalSlots: getRotationSlotCount(),
    availableModels: AVAILABLE_MODELS,
  })
}
