import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SubscriptionForm } from '@/components/features/subscription/subscription-form'
import { type Subscription } from '@/lib/types/subscription'

export default async function SettingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const typedSubscription = subscription as Subscription | null

  const initialData = typedSubscription
    ? {
        email: user.email ?? '',
        categories: typedSubscription.categories,
        is_active: typedSubscription.is_active,
      }
    : {
        email: user.email ?? '',
        categories: [] as string[],
        is_active: true,
      }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
      <SubscriptionForm initialData={typedSubscription ? initialData : null} />
    </div>
  )
}
