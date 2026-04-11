'use client'

import { type FC } from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Button } from '@/components/ui/button'
import { LogoutButton } from '@/components/auth/logout-button'

interface DashboardNavActionsProps {
  email?: string
}

export const DashboardNavActions: FC<DashboardNavActionsProps> = ({ email }) => {
  return (
    <>
      <ThemeToggle />
      {email && (
        <span className="hidden md:inline text-on-surface-muted text-sm">
          {email}
        </span>
      )}
      <Link href="/dashboard/settings">
        <Button variant="ghost" size="sm">
          Settings
        </Button>
      </Link>
      <LogoutButton />
    </>
  )
}
