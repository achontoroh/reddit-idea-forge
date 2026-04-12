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
        aria-label="Like"
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
          <path d="M7 10v12M15 5.88L14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88z" />
        </svg>
      </button>

      <span className={`min-w-[2ch] text-center tabular-nums ${scoreText} text-on-surface`}>
        {communityScore}
      </span>

      <button
        type="button"
        onClick={handleDownvote}
        disabled={isLoading}
        aria-label="Dislike"
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
          <path d="M17 14V2M9 18.12L10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88z" />
        </svg>
      </button>
    </div>
  )
}
