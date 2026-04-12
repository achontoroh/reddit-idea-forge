'use client'

import { type FC, useCallback } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { FeedTabs, type TabMode, type TopPeriod } from './feed-tabs'
import { CategoryChips } from './category-chips'
import { IdeaCard } from '@/components/ideas/idea-card'
import { useDashboardFeed } from '@/hooks/useDashboardFeed'

interface DashboardFeedProps {
  userCategories: string[]
}

const DEFAULT_LIMIT = 20

const EMPTY_STATES: Record<TabMode, { title: string; description: string }> = {
  hot: {
    title: 'No trending ideas yet',
    description: 'Check back soon!',
  },
  top: {
    title: 'No ideas for this period',
    description: 'Try a different time range.',
  },
  new: {
    title: 'No new ideas since your last visit',
    description: 'New ideas are generated automatically — check back soon.',
  },
  foryou: {
    title: 'No ideas in your categories yet',
    description: 'Try adding more categories in Settings.',
  },
}

/** Skeleton card for loading state */
const IdeaCardSkeleton: FC = () => (
  <div className="rounded-lg bg-surface-lowest p-6 animate-pulse">
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
)

export const DashboardFeed: FC<DashboardFeedProps> = ({ userCategories }) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const tab = (searchParams.get('tab') as TabMode) ?? 'hot'
  const category = searchParams.get('category') ?? 'all'
  const period = (searchParams.get('period') as TopPeriod) ?? 'week'
  const offset = Math.max(parseInt(searchParams.get('offset') ?? '0', 10), 0)

  const { ideas, total, isLoading, isValidating } = useDashboardFeed({
    tab,
    category,
    period,
    offset,
  })

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || (key === 'category' && value === 'all') || (key === 'offset' && value === '0')) {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      }
      // Remove tab param if it's the default
      if (params.get('tab') === 'hot') params.delete('tab')
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [searchParams, router, pathname]
  )

  const handleTabChange = useCallback(
    (newTab: TabMode) => {
      updateParams({ tab: newTab, offset: '0' })
    },
    [updateParams]
  )

  const handlePeriodChange = useCallback(
    (newPeriod: TopPeriod) => {
      updateParams({ period: newPeriod, offset: '0' })
    },
    [updateParams]
  )

  const handleCategoryChange = useCallback(
    (newCategory: string) => {
      updateParams({ category: newCategory, offset: '0' })
    },
    [updateParams]
  )

  const hasMore = offset + DEFAULT_LIMIT < total
  const hasPrevious = offset > 0
  const showFirstLoad = isLoading && ideas.length === 0
  const emptyState = EMPTY_STATES[tab]

  return (
    <div>
      {/* Feed tabs */}
      <div className="border-b border-[var(--ghost-border-color)] mb-6">
        <FeedTabs
          activeTab={tab}
          activePeriod={period}
          onTabChange={handleTabChange}
          onPeriodChange={handlePeriodChange}
        />
      </div>

      {/* Category chips */}
      <div className="mb-8">
        <CategoryChips
          userCategories={userCategories}
          selected={category}
          onChange={handleCategoryChange}
        />
      </div>

      {/* Loading skeletons — first load only */}
      {showFirstLoad && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <IdeaCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!showFirstLoad && ideas.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="text-lg text-on-surface font-medium">{emptyState.title}</p>
          <p className="text-sm text-on-surface-muted">{emptyState.description}</p>
        </div>
      )}

      {/* Idea grid */}
      {!showFirstLoad && ideas.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
            {isValidating && (
              <div className="absolute inset-0 bg-surface-base/50 rounded-lg z-10 pointer-events-none" />
            )}
            {ideas.map((idea) => (
              <Link key={idea.id} href={`/dashboard/ideas/${idea.id}`}>
                <IdeaCard idea={idea} />
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {(hasPrevious || hasMore) && (
            <div className="flex justify-center gap-4 mt-8">
              {hasPrevious && (
                <button
                  type="button"
                  onClick={() =>
                    updateParams({ offset: String(Math.max(0, offset - DEFAULT_LIMIT)) })
                  }
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-on-surface-muted hover:text-on-surface bg-surface-low hover:bg-surface-highest transition-colors"
                >
                  Previous
                </button>
              )}
              {hasMore && (
                <button
                  type="button"
                  onClick={() =>
                    updateParams({ offset: String(offset + DEFAULT_LIMIT) })
                  }
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-on-primary bg-primary hover:bg-primary-hover transition-colors"
                >
                  Load more
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
