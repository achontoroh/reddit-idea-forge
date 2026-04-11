'use client'

import { type FC, type ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Navbar } from '@/components/layout/navbar'
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
      <Navbar logoHref="/">
        <ThemeToggle />
        {isLoggedIn ? (
          <Link href="/dashboard">
            <Button size="sm">Dashboard</Button>
          </Link>
        ) : (
          <>
            <Link
              href="/login"
              className="text-sm font-medium text-on-surface-muted hover:text-on-surface transition-colors"
            >
              Log in
            </Link>
            <Link href="/register">
              <Button size="sm">Sign up</Button>
            </Link>
          </>
        )}
      </Navbar>
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
    </div>
  )
}

export default MarketingLayout
