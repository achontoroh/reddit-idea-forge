import useSWR from 'swr'
import { type IdeaWithVote } from '@/lib/types/idea'

const IDEAS_LIMIT = 100

interface IdeasResponse {
  data: IdeaWithVote[]
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
export function useIdeas(fallbackData: IdeaWithVote[]) {
  const { data, error, isLoading, isValidating } = useSWR(
    `/api/ideas?limit=${IDEAS_LIMIT}`,
    fetcher,
    {
      fallbackData: {
        data: fallbackData,
        pagination: { total: fallbackData.length, limit: IDEAS_LIMIT, offset: 0 },
      },
      revalidateOnFocus: false,
      revalidateOnMount: false,
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
