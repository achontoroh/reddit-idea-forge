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

function buildFeedUrl(params: FeedParams): string {
  const sp = new URLSearchParams()
  sp.set('tab', params.tab)
  sp.set('limit', String(DEFAULT_LIMIT))
  sp.set('offset', String(params.offset))

  if (params.category !== 'all') {
    sp.set('category', params.category)
  }
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
      revalidateOnFocus: false,
      dedupingInterval: 15_000,
      keepPreviousData: true,
    }
  )

  return {
    ideas: data?.data ?? [],
    total: data?.pagination.total ?? 0,
    isLoading,
    isValidating,
    error,
    mutate,
  }
}
