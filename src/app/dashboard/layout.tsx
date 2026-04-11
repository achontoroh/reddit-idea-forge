import { type ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/navbar'
import { DashboardNavActions } from '@/components/layout/dashboard-nav-actions'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <>
      <Navbar>
        <DashboardNavActions email={user.email} />
      </Navbar>
      <main className="pt-24 pb-20 px-6 md:px-8 mx-auto w-full max-w-4xl">
        {children}
      </main>
    </>
  )
}
