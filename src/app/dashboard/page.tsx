import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { DashboardFeed } from '@/components/features/dashboard-feed'

async function DashboardContent() {
  const supabase = await createClient()

  // Auth is already guarded by DashboardLayout — user is guaranteed here
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch user's preferred categories for chip ordering and "For You" tab
  const { data: prefs } = await supabase
    .from('user_preferences')
    .select('categories')
    .eq('user_id', user!.id)
    .maybeSingle()

  const userCategories = prefs?.categories ?? []

  return <DashboardFeed userCategories={userCategories} />
}

/** Loading skeleton for the dashboard feed */
function DashboardSkeleton() {
  return (
    <div>
      {/* Tab skeleton */}
      <div className="flex gap-6 border-b border-[var(--ghost-border-color)] mb-6 pb-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-4 w-12 bg-surface-highest rounded animate-pulse" />
        ))}
      </div>
      {/* Chip skeleton */}
      <div className="flex gap-2 mb-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-9 w-20 bg-surface-highest rounded-full animate-pulse" />
        ))}
      </div>
      {/* Card skeleton grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg bg-surface-lowest p-6 animate-pulse">
            <div className="flex justify-between items-start mb-3">
              <div className="h-5 bg-surface-highest rounded w-2/3" />
              <div className="h-8 w-14 bg-surface-highest rounded-full" />
            </div>
            <div className="mb-4">
              <div className="h-5 w-24 bg-surface-highest rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-surface-highest rounded w-full" />
              <div className="h-4 bg-surface-highest rounded w-4/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-4xl md:text-[3.5rem] font-bold font-heading tracking-[-0.02em] leading-tight text-on-surface">
          Ideas
        </h1>
      </header>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  )
}
