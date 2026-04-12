'use client'

import { type FC, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { type IdeaWithVote } from '@/lib/types/idea'
import { getCategoryBySlug, CATEGORY_LABELS } from '@/config/categories'
import { AiScoreBadge, CommunityScore } from './score-display'
import { StatusBadgeList, deriveStatuses } from './status-badge'
import { IdeaCardTooltip } from './idea-card-tooltip'

interface IdeaCardProps {
  idea: IdeaWithVote
}

export const IdeaCard: FC<IdeaCardProps> = ({ idea }) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [showTooltip, setShowTooltip] = useState(false)
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const categoryConfig = getCategoryBySlug(idea.category)
  const categoryLabel = CATEGORY_LABELS[idea.category] ?? idea.category
  const categoryEmoji = categoryConfig?.icon ?? '📁'
  const statuses = deriveStatuses(idea)

  const handleMouseEnter = useCallback(() => {
    // Only show tooltip on hover-capable devices
    if (!window.matchMedia('(hover: hover)').matches) return
    hoverTimeout.current = setTimeout(() => setShowTooltip(true), 300)
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current)
    setShowTooltip(false)
  }, [])

  return (
    <div
      ref={cardRef}
      className="group relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={`/dashboard/ideas/${idea.id}`}
        className="block rounded-lg bg-surface-lowest p-4 transition-all duration-200
          shadow-sm hover:shadow-md hover:-translate-y-0.5
          border border-transparent hover:border-[var(--ghost-border-color)]
          focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2
          [content-visibility:auto] [contain-intrinsic-size:auto_160px]"
      >
        {/* Top row: category badge + status badges + AI score */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0 flex-wrap">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-container/20 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary shrink-0">
              <span aria-hidden="true">{categoryEmoji}</span>
              {categoryLabel}
            </span>
            <StatusBadgeList statuses={statuses} />
          </div>
          <AiScoreBadge score={idea.ai_score} />
        </div>

        {/* Title */}
        <h3 className="text-on-surface font-semibold text-[15px] leading-snug mb-1.5 line-clamp-2 group-hover:text-primary transition-colors">
          {idea.title}
        </h3>

        {/* Pitch — single line truncated */}
        <p className="text-on-surface-muted text-sm leading-relaxed line-clamp-1 mb-3">
          {idea.pitch}
        </p>

        {/* Bottom row: community score, views, subreddit */}
        <div className="flex items-center justify-between gap-3">
          <CommunityScore
            ideaId={idea.id}
            initialVote={idea.userVote}
            initialScore={idea.community_score}
          />

          <div className="flex items-center gap-3 text-[12px] text-on-surface-muted">
            {/* View count */}
            <span className="inline-flex items-center gap-1" title={`${idea.view_count} views`}>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span className="tabular-nums">{idea.view_count}</span>
            </span>

            {/* Source subreddit */}
            <span className="truncate max-w-[120px]" title={`r/${idea.source_subreddit}`}>
              r/{idea.source_subreddit}
            </span>
          </div>
        </div>
      </Link>

      {/* Hover tooltip — hidden on touch devices (no hover capability) */}
      <IdeaCardTooltip
        pitch={idea.pitch}
        painPoint={idea.pain_point}
        targetAudience={idea.target_audience}
        anchorRef={cardRef}
        visible={showTooltip}
      />
    </div>
  )
}
