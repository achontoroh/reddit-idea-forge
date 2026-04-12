import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { CATEGORY_SLUGS } from '@/config/categories'
import { type UserPreferences } from '@/lib/types/user-preferences'

const PostBodySchema = z.object({
  categories: z
    .array(z.enum(CATEGORY_SLUGS as [string, ...string[]]))
    .min(2, 'Select at least 2 categories')
    .max(4, 'Select at most 4 categories'),
})

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: unknown = await request.json()
    const parsed = PostBodySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { categories } = parsed.data

    const { data, error } = await supabase
      .from('user_preferences')
      .upsert(
        {
          user_id: user.id,
          categories,
          onboarding_completed: true,
          last_seen_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )
      .select()
      .single()

    if (error) {
      console.error('[API] user/preferences POST:', error)
      return NextResponse.json({ error: 'Failed to save preferences' }, { status: 500 })
    }

    return NextResponse.json({ preferences: data as UserPreferences })
  } catch (error) {
    console.error('[API] user/preferences POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
