'use client'

import { type FC } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'

interface LogoutButtonProps {
  className?: string
}

export const LogoutButton: FC<LogoutButtonProps> = ({ className }) => {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <Button variant="ghost" onClick={handleLogout} className={className}>
      Sign out
    </Button>
  )
}
