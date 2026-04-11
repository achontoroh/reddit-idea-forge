'use client'

import { type FC, useEffect, useCallback } from 'react'
import { type Idea } from '@/lib/types/idea'
import { isWithin24Hours } from '@/lib/utils/date'
import { Badge } from '@/components/ui/badge'
import { ScoreBadge } from '@/components/ui/score-badge'

interface IdeaDetailModalProps {
  idea: Idea
  onClose: () => void
}

const CATEGORY_BADGE_VARIANT: Record<string, 'info' | 'success' | 'warning' | 'danger' | 'default'> = {
  devtools: 'info',
  health: 'success',
  education: 'default',
  finance: 'warning',
  productivity: 'default',
}

const SCORE_LABELS: { key: keyof Idea['ai_score_breakdown']; label: string; description: string }[] = [
  { key: 'pain_intensity', label: 'Pain Intensity', description: 'How severe is the problem?' },
  { key: 'willingness_to_pay', label: 'Willingness to Pay', description: 'Would users pay for a solution?' },
  { key: 'competition', label: 'Competition Gap', description: 'How underserved is this space?' },
  { key: 'tam', label: 'Market Size (TAM)', description: 'How large is the potential market?' },
]

function getBarColor(value: number): string {
  const pct = (value / 25) * 100
  if (pct >= 70) return 'bg-green-500'
  if (pct >= 40) return 'bg-amber-500'
  return 'bg-gray-400'
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const IdeaDetailModal: FC<IdeaDetailModalProps> = ({ idea, onClose }) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [handleKeyDown])

  const isNew = isWithin24Hours(idea.created_at)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 cursor-pointer"
          aria-label="Close"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-4 flex items-start gap-3 pr-8">
          <div className="flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {isNew && <Badge variant="success">NEW</Badge>}
              <Badge variant={CATEGORY_BADGE_VARIANT[idea.category] ?? 'default'}>
                {idea.category}
              </Badge>
            </div>
            <h2 className="text-xl font-bold text-gray-900">{idea.title}</h2>
          </div>
          <ScoreBadge score={idea.ai_score} />
        </div>

        {/* Pitch — full, no truncation */}
        <div className="mb-4">
          <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">Pitch</h4>
          <p className="text-sm leading-relaxed text-gray-700">{idea.pitch}</p>
        </div>

        {/* Pain point */}
        <div className="mb-4">
          <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">Pain Point</h4>
          <p className="text-sm leading-relaxed text-gray-700">{idea.pain_point}</p>
        </div>

        {/* Score breakdown — full labels */}
        <div className="mb-4">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Score Breakdown</h4>
          <div className="flex flex-col gap-3">
            {SCORE_LABELS.map(({ key, label, description }) => {
              const value = idea.ai_score_breakdown[key]
              return (
                <div key={key}>
                  <div className="mb-0.5 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                    <span className="text-sm font-semibold text-gray-900">{value}/25</span>
                  </div>
                  <p className="mb-1 text-xs text-gray-400">{description}</p>
                  <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${getBarColor(value)} transition-all`}
                      style={{ width: `${(value / 25) * 100}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Source */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-400">
          <span>{formatDate(idea.created_at)}</span>
          <a
            href={idea.source_url ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-500 hover:underline"
          >
            r/{idea.source_subreddit}
          </a>
        </div>
      </div>
    </div>
  )
}
