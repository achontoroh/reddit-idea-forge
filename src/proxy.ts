import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request)

  const { pathname } = request.nextUrl

  const isAuthPage = pathname === '/login' || pathname === '/register'
  const isDashboardPage = pathname.startsWith('/dashboard')

  // Redirect authenticated users away from landing and auth pages
  if ((pathname === '/' || isAuthPage) && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Redirect unauthenticated users away from protected pages
  if (isDashboardPage && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon)
     * - public assets (svg, png, jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
