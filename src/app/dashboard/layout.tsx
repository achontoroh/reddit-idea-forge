import { type ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/features/header'
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
      <Header user={user.email ? { email: user.email } : null} />
      <main className="pt-10 pb-20 px-6 md:px-8 mx-auto w-full max-w-4xl">
        {children}
      </main>
      {DevPipelinePanel && <DevPipelinePanel />}
    </>
  )
}
