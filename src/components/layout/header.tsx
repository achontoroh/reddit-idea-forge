'use client'

import { type FC } from 'react'
import Link from 'next/link'
import { LogoutButton } from '@/components/auth/logout-button'
import { ThemeToggle } from '@/components/ui/theme-toggle'

interface HeaderProps {
  email?: string
}

export const Header: FC<HeaderProps> = ({ email }) => {
  return (
    <header className="border-b border-surface-highest bg-surface-lowest">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/dashboard">
          <img src="/ideaforge-logo-horizontal.svg" alt="IdeaForge" width="140" height="auto" />
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {email && (
            <>
              <span className="hidden text-sm text-on-surface-muted sm:inline">{email}</span>
              <Link
                href="/dashboard/settings"
                className="text-sm text-on-surface-muted hover:text-primary transition-colors"
              >
                Settings
              </Link>
              <LogoutButton />
            </>
          )}
        </div>
      </div>
    </header>
  )
}
