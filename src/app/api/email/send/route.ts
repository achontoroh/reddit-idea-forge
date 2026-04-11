import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { config } from '@/config/app'
import { createClient } from '@/lib/supabase/server'
import { supabaseServiceRole } from '@/lib/supabase/service'
import { sendIdeaDigest } from '@/lib/email/client'
import type { Idea } from '@/lib/types/idea'

const EmailLogInsertSchema = z.object({
  user_id: z.string().uuid(),
  email: z.string().email(),
  status: z.enum(['sent', 'failed']),
  ideas_count: z.number().int().min(0),
  error_message: z.string().optional(),
})

async function isAuthorized(request: NextRequest): Promise<boolean> {
  const authHeader = request.headers.get('authorization')
  if (
    authHeader &&
    process.env.CRON_SECRET &&
    authHeader === `Bearer ${process.env.CRON_SECRET}`
  ) {
    return true
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return !!user
}

export async function POST(request: NextRequest) {
  try {
    const authorized = await isAuthorized(request)
    if (!authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: subscriptions, error: subError } = await supabaseServiceRole
      .from('subscriptions')
      .select('*')
      .eq('is_active', true)

    if (subError) {
      console.error('[API] email/send — fetch subscriptions:', subError)
      return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 })
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ data: { sent: 0, skipped: 0, failed: 0 } })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
    const windowStart = new Date(Date.now() - config.email.windowDays * 24 * 60 * 60 * 1000).toISOString()

    let sent = 0
    let skipped = 0
    let failed = 0

    for (const subscription of subscriptions) {
      const { data: profile } = await supabaseServiceRole
        .from('profiles')
        .select('email')
        .eq('id', subscription.user_id)
        .single()

      if (!profile) {
        skipped++
        continue
      }

      const { data: ideas } = await supabaseServiceRole
        .from('ideas')
        .select('*')
        .in('category', subscription.categories.length > 0 ? subscription.categories : ['devtools', 'health', 'education', 'finance', 'productivity'])
        .gte('created_at', windowStart)
        .order('ai_score', { ascending: false })
        .limit(config.email.maxIdeasPerEmail)

      const typedIdeas = (ideas ?? []) as Idea[]

      if (typedIdeas.length === 0) {
        skipped++
        continue
      }

      const result = await sendIdeaDigest({
        to: profile.email,
        ideas: typedIdeas,
        unsubscribeToken: subscription.unsubscribe_token,
        appUrl,
      })

      const logEntry = EmailLogInsertSchema.parse({
        user_id: subscription.user_id,
        email: profile.email,
        status: result.success ? 'sent' : 'failed',
        ideas_count: typedIdeas.length,
        error_message: result.error,
      })

      await supabaseServiceRole.from('email_logs').insert(logEntry)

      if (result.success) {
        sent++
      } else {
        console.error('[API] email/send — failed for', profile.email, result.error)
        failed++
      }
    }

    return NextResponse.json({ data: { sent, skipped, failed } })
  } catch (error) {
    console.error('[API] email/send:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
