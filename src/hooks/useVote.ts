'use client'

import { useState, useCallback, useRef } from 'react'
import { toast } from 'sonner'
import { useSWRConfig } from 'swr'
import { type IdeaWithVote } from '@/lib/types/idea'

type VoteValue = 1 | -1 | null

interface VoteResponse {
  community_score: number
  userVote: VoteValue
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
 * Global in-memory vote cache — survives Next.js client router cache.
 * When useVote successfully saves a vote, it writes here.
 * On mount, the hook checks this cache first, falling back to server-provided initialVote.
 * This ensures vote state stays consistent across feed ↔ detail navigation.
 */
const voteCache = new Map<string, { vote: VoteValue; score: number }>()

function getInitialVote(ideaId: string, serverVote: VoteValue): VoteValue {
  const cached = voteCache.get(ideaId)
  return cached ? cached.vote : serverVote
}

function getInitialScore(ideaId: string, serverScore: number): number {
  const cached = voteCache.get(ideaId)
  return cached ? cached.score : serverScore
}

export function useVote(ideaId: string, initialVote: VoteValue, initialScore: number) {
  const [userVote, setUserVote] = useState<VoteValue>(() => getInitialVote(ideaId, initialVote))
  const [communityScore, setCommunityScore] = useState(() => getInitialScore(ideaId, initialScore))
  const [isLoading, setIsLoading] = useState(false)
  const inflightRef = useRef(false)
  const { mutate: globalMutate } = useSWRConfig()

  const applyVote = useCallback(async (newVote: VoteValue) => {
    if (inflightRef.current) return
    inflightRef.current = true
    setIsLoading(true)

    const prevVote = userVote
    const prevScore = communityScore

    // Optimistic score calculation
    let scoreDelta = 0
    if (prevVote === null) {
      scoreDelta = newVote!
    } else if (newVote === null) {
      scoreDelta = -prevVote
    } else {
      scoreDelta = newVote - prevVote
    }

    const optimisticScore = prevScore + scoreDelta
    setUserVote(newVote)
    setCommunityScore(optimisticScore)

    // Optimistic cache update
    voteCache.set(ideaId, { vote: newVote, score: optimisticScore })

    try {
      let res: Response
      if (newVote === null) {
        res = await fetch(`/api/ideas/${ideaId}/vote`, { method: 'DELETE' })
      } else {
        res = await fetch(`/api/ideas/${ideaId}/vote`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vote: newVote }),
        })
      }

      if (!res.ok) {
        throw new Error('Vote failed')
      }

      const data: VoteResponse = await res.json()
      setCommunityScore(data.community_score)

      // Update cache with server-confirmed score
      voteCache.set(ideaId, { vote: newVote, score: data.community_score })

      // Sync vote state into SWR feed cache
      globalMutate(
        (key: string) => typeof key === 'string' && key.startsWith('/api/ideas?'),
        (cached: FeedResponse | undefined) => {
          if (!cached) return cached
          return {
            ...cached,
            data: cached.data.map((idea) =>
              idea.id === ideaId
                ? { ...idea, userVote: newVote, community_score: data.community_score }
                : idea
            ),
          }
        },
        { revalidate: false }
      )
    } catch {
      // Revert optimistic update
      setUserVote(prevVote)
      setCommunityScore(prevScore)
      voteCache.set(ideaId, { vote: prevVote, score: prevScore })
      toast.error('Failed to save your vote. Please try again.')
    } finally {
      setIsLoading(false)
      inflightRef.current = false
    }
  }, [ideaId, userVote, communityScore, globalMutate])

  const handleUpvote = useCallback(() => {
    const newVote: VoteValue = userVote === 1 ? null : 1
    applyVote(newVote)
  }, [userVote, applyVote])

  const handleDownvote = useCallback(() => {
    const newVote: VoteValue = userVote === -1 ? null : -1
    applyVote(newVote)
  }, [userVote, applyVote])

  return { communityScore, userVote, handleUpvote, handleDownvote, isLoading }
}
