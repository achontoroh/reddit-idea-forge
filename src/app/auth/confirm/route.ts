import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { EmailOtpType } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null

  const supabase = await createClient()

  // PKCE flow: Supabase sends a `code` param for email confirmation
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(new URL('/dashboard', origin))
    }

    console.error('Email confirmation code exchange failed:', error.message)
  }

  // Fallback: token_hash flow (magic links, older email templates)
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type })

    if (!error) {
      return NextResponse.redirect(new URL('/dashboard', origin))
    }

    console.error('Email confirmation OTP verification failed:', error.message)
  }

  return NextResponse.redirect(
    new URL('/login?error=confirmation_failed', request.url)
  )
}
