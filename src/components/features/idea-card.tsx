'use client'

import { type FC } from 'react'
import Link from 'next/link'
import { type IdeaWithVote } from '@/lib/types/idea'
import { CATEGORY_LABELS } from '@/config/categories'
import { AiScoreBadge, CommunityScore } from './score-display'
import { StatusBadgeList } from './status-badge'

interface IdeaCardProps {
  idea: IdeaWithVote
}

export const IdeaCard: FC<IdeaCardProps> = ({ idea }) => {
  const categoryLabel = CATEGORY_LABELS[idea.category] ?? idea.category

  return (
    <div className="group relative">
      <Link
        href={`/dashboard/ideas/${idea.id}`}
        className="block rounded-lg bg-surface-lowest p-4 transition-all duration-200
          shadow-sm hover:shadow-md hover:-translate-y-0.5
          border border-transparent hover:border-[var(--ghost-border-color)]
          focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2
          [content-visibility:auto] [contain-intrinsic-size:auto_160px]"
      >
        {/* Top row: status badges + AI score */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <StatusBadgeList badges={idea.badges} />
          <AiScoreBadge score={idea.ai_score} />
        </div>

        {/* Title */}
        <h3 className="text-on-surface font-semibold text-[15px] leading-snug mb-1.5 line-clamp-2 group-hover:text-primary transition-colors">
          {idea.title}
        </h3>

        {/* Pitch */}
        <p className="text-on-surface-muted text-sm leading-relaxed mb-3">
          {idea.pitch}
        </p>

        {/* Bottom row: like/dislike, category, views, subreddit */}
        <div className="flex items-center justify-between gap-3">
          <CommunityScore
            ideaId={idea.id}
            initialVote={idea.userVote}
            initialScore={idea.community_score}
          />

          <div className="flex items-center gap-3 text-[12px] text-on-surface-muted">
            {/* Category */}
            <span className="truncate max-w-[120px]">
              {categoryLabel}
            </span>

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

    </div>
  )
}
