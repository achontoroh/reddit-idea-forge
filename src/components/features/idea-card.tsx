'use client'

import type { FC } from 'react'
import { Tag } from '@/components/ui/tag'
import { ScoreDial } from '@/components/ui/score-dial'
import { Kicker } from '@/components/ui/kicker'
import type { CategoryKey } from '@/lib/design-system/categories'

export type IdeaCardVariant = 'list' | 'featured' | 'compact' | 'grid'

export interface IdeaCardProps {
  idea: {
    id: string
    title: string
    category: CategoryKey
    score: number
    summary?: string
    publishedAt: Date
    isNew?: boolean
  }
  variant: IdeaCardVariant
  onClick?: () => void
  className?: string
}

const VARIANTS_WITH_SUMMARY: ReadonlySet<IdeaCardVariant> = new Set(['list', 'featured'])

export const IdeaCard: FC<IdeaCardProps> = ({ idea, variant, onClick, className }) => {
  const { title, category, score, summary, isNew } = idea
  const classes = className ? `idea-card ${className}` : 'idea-card'
  const showSummary = VARIANTS_WITH_SUMMARY.has(variant) && Boolean(summary)
  const useDial = variant !== 'compact'
  const dialSize = variant === 'featured' ? 'md' : 'sm'
  const display = score.toFixed(1)

  const scoreSlot = useDial ? (
    <ScoreDial value={score} size={dialSize} />
  ) : (
    <span className="idea-card-numeral" aria-label={`${display} out of 10`}>
      <span data-idea-card-num>{display}</span>
      <span data-idea-card-denom aria-hidden="true">/10</span>
    </span>
  )

  const body = (
    <>
      <div className="idea-card-head">
        <Tag category={category} size="sm" />
        {isNew ? <Kicker label="NEW" className="idea-card-new" /> : null}
      </div>
      <h3 className="idea-card-title">{title}</h3>
      {showSummary ? <p className="idea-card-summary">{summary}</p> : null}
      <div className="idea-card-score-slot">{scoreSlot}</div>
    </>
  )

  if (onClick) {
    return (
      <button
        type="button"
        className={classes}
        data-component="idea-card"
        data-variant={variant}
        onClick={onClick}
      >
        {body}
      </button>
    )
  }

  return (
    <div className={classes} data-component="idea-card" data-variant={variant}>
      {body}
    </div>
  )
}
