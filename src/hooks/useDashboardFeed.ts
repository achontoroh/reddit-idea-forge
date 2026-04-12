import { useMemo } from 'react'
import useSWR from 'swr'
import { type IdeaWithVote } from '@/lib/types/idea'
import { type TabMode, type TopPeriod } from '@/components/features/feed-tabs'

const DEFAULT_LIMIT = 20

interface FeedParams {
  tab: TabMode
  category: string
  period: TopPeriod
  offset: number
}

interface FeedResponse {
  data: IdeaWithVote[]
  pagination: {
    total: number
    limit: number
    offset: number
  }
}

/**
 * Build the SWR key — category is intentionally excluded so that
 * switching categories does NOT trigger a new server request.
 * Category filtering happens client-side in the hook.
 */
function buildFeedUrl(params: FeedParams): string {
  const sp = new URLSearchParams()
  sp.set('tab', params.tab)
  sp.set('limit', String(DEFAULT_LIMIT))
  sp.set('offset', String(params.offset))

  if (params.tab === 'top') {
    sp.set('period', params.period)
  }

  return `/api/ideas?${sp.toString()}`
}

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error('Failed to fetch ideas')
    return res.json() as Promise<FeedResponse>
  })

export function useDashboardFeed(params: FeedParams) {
  const url = buildFeedUrl(params)

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    url,
    fetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 5_000,
      keepPreviousData: true,
    }
  )

  const allIdeas = data?.data ?? []

  // Client-side category filtering — instant, no server round-trip
  const ideas = useMemo(() => {
    if (params.category === 'all') return allIdeas
    return allIdeas.filter((idea) => idea.category === params.category)
  }, [allIdeas, params.category])

  return {
    ideas,
    total: data?.pagination.total ?? 0,
    isLoading,
    isValidating,
    error,
    mutate,
  }
}
