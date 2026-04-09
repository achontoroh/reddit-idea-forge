import { type FC } from 'react'
import { type Idea } from '@/lib/types/idea'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScoreBadge } from '@/components/ui/score-badge'

interface IdeaCardProps {
  idea: Idea
  onClick?: () => void
}

const CATEGORY_BADGE_VARIANT: Record<string, 'info' | 'success' | 'warning' | 'danger' | 'default'> = {
  devtools: 'info',
  health: 'success',
  education: 'default',
  finance: 'warning',
  productivity: 'default',
}

const SCORE_LABELS: { key: keyof Idea['score_breakdown']; label: string }[] = [
  { key: 'pain_intensity', label: 'Pain' },
  { key: 'willingness_to_pay', label: 'WTP' },
  { key: 'competition', label: 'Competition' },
  { key: 'tam', label: 'TAM' },
]

function isWithin24Hours(dateString: string): boolean {
  const created = new Date(dateString)
  const now = new Date()
  return now.getTime() - created.getTime() < 24 * 60 * 60 * 1000
}

function getBarColor(value: number): string {
  const pct = (value / 25) * 100
  if (pct >= 70) return 'bg-green-500'
  if (pct >= 40) return 'bg-amber-500'
  return 'bg-gray-400'
}

export const IdeaCard: FC<IdeaCardProps> = ({ idea, onClick }) => {
  const isNew = isWithin24Hours(idea.created_at)

  return (
    <Card className="flex flex-col gap-3 cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      {/* Header: title + badges + score */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-semibold text-gray-900">{idea.title}</h3>
          {isNew && (
            <Badge variant="success">NEW</Badge>
          )}
          <Badge variant={CATEGORY_BADGE_VARIANT[idea.category] ?? 'default'}>
            {idea.category}
          </Badge>
        </div>
        <ScoreBadge score={idea.score} />
      </div>

      {/* Pitch */}
      <p className="text-sm leading-relaxed text-gray-600 line-clamp-3">{idea.pitch}</p>

      {/* Score breakdown */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        {SCORE_LABELS.map(({ key, label }) => {
          const value = idea.score_breakdown[key]
          return (
            <div key={key} className="flex items-center gap-2">
              <span className="w-20 text-xs text-gray-500">{label}</span>
              <div className="h-1.5 flex-1 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className={`h-full rounded-full ${getBarColor(value)}`}
                  style={{ width: `${(value / 25) * 100}%` }}
                />
              </div>
              <span className="w-6 text-right text-xs font-medium text-gray-700">{value}</span>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-2 text-xs text-gray-400">
        <span className="italic line-clamp-1">{idea.pain_point}</span>
        <a
          href={idea.source_url ?? '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-indigo-500 hover:underline"
        >
          r/{idea.source_subreddit}
        </a>
      </div>
    </Card>
  )
}
