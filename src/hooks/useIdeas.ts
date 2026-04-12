import useSWR from 'swr'
import { type Idea } from '@/lib/types/idea'

interface IdeasResponse {
  data: Idea[]
  pagination: {
    total: number
    limit: number
    offset: number
  }
}

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error('Failed to fetch ideas')
    return res.json() as Promise<IdeasResponse>
  })

/**
 * Client-side ideas fetcher with stale-while-revalidate.
 * Shows cached data instantly on back-navigation, revalidates in background.
 */
export function useIdeas(fallbackData: Idea[]) {
  const { data, error, isLoading, isValidating } = useSWR(
    '/api/ideas?limit=100',
    fetcher,
    {
      fallbackData: {
        data: fallbackData,
        pagination: { total: fallbackData.length, limit: 100, offset: 0 },
      },
      revalidateOnFocus: false,
      revalidateOnMount: true,
      dedupingInterval: 30_000,
    }
  )

  return {
    ideas: data?.data ?? fallbackData,
    total: data?.pagination.total ?? fallbackData.length,
    error,
    isLoading,
    isValidating,
  }
}
