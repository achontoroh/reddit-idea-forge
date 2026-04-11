'use client'

import { type FC } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'

export const LogoutButton: FC = () => {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout}>
      Log out
    </Button>
  )
}
