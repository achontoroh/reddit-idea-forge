import { NextResponse } from 'next/server'
import { runCleanup } from '@/lib/pipeline/cleanup'

/**
 * POST /api/dev/cleanup — run TTL cleanup (dev only, no auth required).
 */
export async function POST() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { success: false, error: 'Dev only' },
      { status: 403 }
    )
  }

  try {
    const result = await runCleanup()

    return NextResponse.json({
      success: true,
      ...result,
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
