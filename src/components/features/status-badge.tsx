import { type FC } from 'react'

export type IdeaStatus = 'new' | 'hot' | 'top' | 'trending'

interface StatusBadgeProps {
  status: IdeaStatus
}

const STATUS_CONFIG: Record<IdeaStatus, { label: string; emoji: string; className: string }> = {
  new: {
    label: 'New',
    emoji: '✨',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  },
  hot: {
    label: 'Hot',
    emoji: '🔥',
    className: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  },
  top: {
    label: 'Top',
    emoji: '👑',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  },
  trending: {
    label: 'Trending',
    emoji: '📈',
    className: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  },
}

export const StatusBadge: FC<StatusBadgeProps> = ({ status }) => {
  const config = STATUS_CONFIG[status]

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold leading-tight ${config.className}`}
    >
      <span aria-hidden="true">{config.emoji}</span>
      {config.label}
    </span>
  )
}

interface StatusBadgeListProps {
  statuses: IdeaStatus[]
}

export const StatusBadgeList: FC<StatusBadgeListProps> = ({ statuses }) => {
  if (statuses.length === 0) return null

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {statuses.map((status) => (
        <StatusBadge key={status} status={status} />
      ))}
    </div>
  )
}

/** Derive status badges from idea properties */
export function deriveStatuses(idea: {
  created_at: string
  community_score: number
  ai_score: number
  view_count: number
}): IdeaStatus[] {
  const statuses: IdeaStatus[] = []
  const ageHours = (Date.now() - new Date(idea.created_at).getTime()) / (1000 * 60 * 60)

  if (ageHours <= 24) statuses.push('new')
  if (idea.community_score >= 10 && ageHours <= 72) statuses.push('hot')
  if (idea.ai_score >= 76) statuses.push('top')
  if (idea.view_count >= 20 && ageHours <= 48) statuses.push('trending')

  return statuses
}
