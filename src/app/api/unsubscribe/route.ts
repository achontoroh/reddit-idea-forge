import { NextRequest, NextResponse } from 'next/server'
import { supabaseServiceRole } from '@/lib/supabase/service'

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const token = request.nextUrl.searchParams.get('token')

    if (!token) {
      return NextResponse.json({ error: 'Missing token parameter' }, { status: 400 })
    }

    const { data: subscription, error: findError } = await supabaseServiceRole
      .from('subscriptions')
      .select('id')
      .eq('unsubscribe_token', token)
      .single()

    if (findError || !subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
    }

    const { error: updateError } = await supabaseServiceRole
      .from('subscriptions')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('unsubscribe_token', token)

    if (updateError) {
      console.error('[API] unsubscribe:', updateError)
      return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 })
    }

    const baseUrl = request.nextUrl.origin
    return NextResponse.redirect(new URL('/unsubscribe/success', baseUrl))
  } catch (error) {
    console.error('[API] unsubscribe:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
