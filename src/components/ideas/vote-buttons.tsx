'use client'

import { type FC } from 'react'
import { useVote } from '@/hooks/useVote'

interface VoteButtonsProps {
  ideaId: string
  initialVote: 1 | -1 | null
  initialScore: number
  size?: 'sm' | 'lg'
}

export const VoteButtons: FC<VoteButtonsProps> = ({
  ideaId,
  initialVote,
  initialScore,
  size = 'sm',
}) => {
  const { communityScore, userVote, handleUpvote, handleDownvote, isLoading } =
    useVote(ideaId, initialVote, initialScore)

  const iconSize = size === 'lg' ? 20 : 16
  const btnPadding = size === 'lg' ? 'p-2' : 'p-1.5'
  const scoreText = size === 'lg' ? 'text-base font-bold' : 'text-sm font-semibold'

  return (
    <div
      className="inline-flex items-center gap-1 rounded-full bg-surface-low"
      onClick={(e) => e.preventDefault()}
    >
      <button
        type="button"
        onClick={handleUpvote}
        disabled={isLoading}
        aria-label="Upvote"
        className={`${btnPadding} rounded-full transition-colors ${
          userVote === 1
            ? 'text-green-500'
            : 'text-on-surface-muted hover:text-green-500'
        } disabled:opacity-50`}
      >
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill={userVote === 1 ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>

      <span className={`min-w-[2ch] text-center tabular-nums ${scoreText} text-on-surface`}>
        {communityScore}
      </span>

      <button
        type="button"
        onClick={handleDownvote}
        disabled={isLoading}
        aria-label="Downvote"
        className={`${btnPadding} rounded-full transition-colors ${
          userVote === -1
            ? 'text-red-500'
            : 'text-on-surface-muted hover:text-red-500'
        } disabled:opacity-50`}
      >
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill={userVote === -1 ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </button>
    </div>
  )
}
