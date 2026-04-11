'use client'

import { type FC } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

interface DashboardNavActionsProps {
  email?: string
}

export const DashboardNavActions: FC<DashboardNavActionsProps> = ({ email }) => {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

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
      <Button variant="secondary" size="sm" onClick={handleLogout}>
        Log out
      </Button>
    </>
  )
}
