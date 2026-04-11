import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BackLink } from '@/components/ui/back-link'
import { SubscriptionForm } from '@/components/features/subscription/subscription-form'
import { type Subscription } from '@/lib/types/subscription'

export default async function SettingsPage() {
  const supabase = await createClient()

  // Auth is already guarded by DashboardLayout — user.id needed for subscription query
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const typedSubscription = subscription as Subscription | null

  const initialData = typedSubscription
    ? {
        categories: typedSubscription.categories,
        is_active: typedSubscription.is_active,
      }
    : null

  return (
    <div className="max-w-[560px] mx-auto">
      <BackLink href="/dashboard" />
      <div className="mb-12">
        <h1 className="text-4xl md:text-[3.5rem] font-bold leading-[1.1] tracking-[-0.02em] text-on-surface mb-2 font-heading">
          Settings
        </h1>
        <p className="text-on-surface-muted">
          Manage your account preferences and notification rules.
        </p>
      </div>
      <SubscriptionForm email={user.email ?? ''} initialData={initialData} />
    </div>
  )
}
