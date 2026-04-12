'use client'

import { useState, useCallback, useRef } from 'react'
import { toast } from 'sonner'

type VoteValue = 1 | -1 | null

interface VoteResponse {
  community_score: number
  userVote: VoteValue
}

export function useVote(ideaId: string, initialVote: VoteValue, initialScore: number) {
  const [userVote, setUserVote] = useState<VoteValue>(initialVote)
  const [communityScore, setCommunityScore] = useState(initialScore)
  const [isLoading, setIsLoading] = useState(false)
  const inflightRef = useRef(false)

  const applyVote = useCallback(async (newVote: VoteValue) => {
    if (inflightRef.current) return
    inflightRef.current = true
    setIsLoading(true)

    const prevVote = userVote
    const prevScore = communityScore

    // Optimistic score calculation
    let scoreDelta = 0
    if (prevVote === null) {
      // No previous vote → adding new vote
      scoreDelta = newVote!
    } else if (newVote === null) {
      // Removing previous vote
      scoreDelta = -prevVote
    } else {
      // Changing vote direction: remove old + add new
      scoreDelta = newVote - prevVote
    }

    setUserVote(newVote)
    setCommunityScore(prevScore + scoreDelta)

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
    } catch {
      // Revert optimistic update
      setUserVote(prevVote)
      setCommunityScore(prevScore)
      toast.error('Failed to save your vote. Please try again.')
    } finally {
      setIsLoading(false)
      inflightRef.current = false
    }
  }, [ideaId, userVote, communityScore])

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
