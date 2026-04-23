'use client'

import { type FC } from 'react'
import { useVote } from '@/hooks/useVote'

/* ── AI Score ── */

interface AiScoreBadgeProps {
  score: number
}

function getScoreColor(score: number): string {
  if (score >= 76) return 'bg-signal-high/10 text-signal-high'
  if (score >= 51) return 'bg-accent/10 text-accent'
  if (score >= 26) return 'bg-signal-mid/10 text-signal-mid'
  return 'bg-signal-low/10 text-signal-low'
}

export const AiScoreBadge: FC<AiScoreBadgeProps> = ({ score }) => {
  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold tabular-nums ${getScoreColor(score)}`}
      title={`AI Score: ${score}/100`}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      {score}
    </div>
  )
}

/* ── Community Score with Like/Dislike ── */

interface CommunityScoreProps {
  ideaId: string
  initialVote: 1 | -1 | null
  initialScore: number
}

export const CommunityScore: FC<CommunityScoreProps> = ({
  ideaId,
  initialVote,
  initialScore,
}) => {
  const { communityScore, userVote, handleUpvote, handleDownvote, isLoading } =
    useVote(ideaId, initialVote, initialScore)

  return (
    <div
      className="inline-flex items-center gap-0.5 rounded-full bg-ink-paper-2 px-1"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          handleUpvote()
        }}
        disabled={isLoading}
        aria-label="Like"
        className={`p-1 rounded-full transition-colors ${
          userVote === 1
            ? 'text-signal-high'
            : 'text-ink-400 hover:text-signal-high'
        } disabled:opacity-50`}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={userVote === 1 ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M7 10v12M15 5.88L14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88z" />
        </svg>
      </button>

      <span className="min-w-[2ch] text-center tabular-nums text-xs font-bold text-ink-900">
        {communityScore}
      </span>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          handleDownvote()
        }}
        disabled={isLoading}
        aria-label="Dislike"
        className={`p-1 rounded-full transition-colors ${
          userVote === -1
            ? 'text-danger'
            : 'text-ink-400 hover:text-danger'
        } disabled:opacity-50`}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={userVote === -1 ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M17 14V2M9 18.12L10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88z" />
        </svg>
      </button>
    </div>
  )
}
