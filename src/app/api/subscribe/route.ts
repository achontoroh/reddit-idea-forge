import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { type Subscription } from '@/lib/types/subscription'

const PostBodySchema = z.object({
  categories: z.array(z.string()).min(1, 'Select at least one category'),
  is_active: z.boolean(),
})

const PutBodySchema = z
  .object({
    categories: z.array(z.string()).min(1, 'Select at least one category').optional(),
    is_active: z.boolean().optional(),
  })
  .refine((data) => data.categories !== undefined || data.is_active !== undefined, {
    message: 'At least one field (categories or is_active) is required',
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

    const { categories, is_active } = parsed.data

    const { data, error } = await supabase
      .from('subscriptions')
      .upsert(
        {
          user_id: user.id,
          categories,
          is_active,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )
      .select()
      .single()

    if (error) {
      console.error('[API] subscribe POST:', error)
      return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 })
    }

    return NextResponse.json({ subscription: data as Subscription })
  } catch (error) {
    console.error('[API] subscribe POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: unknown = await request.json()
    const parsed = PutBodySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const updateFields: {
      updated_at: string
      categories?: string[]
      is_active?: boolean
    } = {
      updated_at: new Date().toISOString(),
    }
    if (parsed.data.categories !== undefined) {
      updateFields.categories = parsed.data.categories
    }
    if (parsed.data.is_active !== undefined) {
      updateFields.is_active = parsed.data.is_active
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .update(updateFields)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
      }
      console.error('[API] subscribe PUT:', error)
      return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 })
    }

    return NextResponse.json({ subscription: data as Subscription })
  } catch (error) {
    console.error('[API] subscribe PUT:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
