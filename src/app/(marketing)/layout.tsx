'use client'

import { type FC, type ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Footer } from '@/components/layout/footer'
import { createClient } from '@/lib/supabase/client'

interface MarketingLayoutProps {
  children: ReactNode
}

const MarketingLayout: FC<MarketingLayoutProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user)
    })
  }, [])

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-surface-highest bg-surface-lowest">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/">
            <img src="/ideaforge-logo-horizontal.svg" alt="IdeaForge" width="140" height="auto" />
          </Link>
          <nav className="flex items-center gap-3">
            <ThemeToggle />
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button size="sm">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm text-on-surface-muted hover:text-on-surface">
                  Login
                </Link>
                <Link href="/register">
                  <Button size="sm">Get started</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default MarketingLayout
