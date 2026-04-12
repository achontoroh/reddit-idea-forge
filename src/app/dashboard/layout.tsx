import { type ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/navbar'
import { DashboardNavActions } from '@/components/layout/dashboard-nav-actions'
import dynamic from 'next/dynamic'

const DevPipelinePanel =
  process.env.NODE_ENV === 'development'
    ? dynamic(() =>
        import('@/components/features/dev-pipeline-panel').then(
          (mod) => mod.DevPipelinePanel
        )
      )
    : null

/** Routes exempt from the onboarding redirect */
const ONBOARDING_EXEMPT = ['/dashboard/onboarding', '/dashboard/settings']

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check onboarding status — redirect to onboarding if not completed
  const headerList = await headers()
  const pathname = headerList.get('x-next-pathname') ?? headerList.get('x-invoke-path') ?? ''
  const isExempt = ONBOARDING_EXEMPT.some((p) => pathname.startsWith(p))

  if (!isExempt) {
    const { data: prefs } = await supabase
      .from('user_preferences')
      .select('onboarding_completed')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!prefs?.onboarding_completed) {
      redirect('/dashboard/onboarding')
    }
  }

  return (
    <>
      <Navbar>
        <DashboardNavActions email={user.email} />
      </Navbar>
      <main className="pt-24 pb-20 px-6 md:px-8 mx-auto w-full max-w-4xl">
        {children}
      </main>
      {DevPipelinePanel && <DevPipelinePanel />}
    </>
  )
}
