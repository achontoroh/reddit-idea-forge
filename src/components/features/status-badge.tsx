import { type FC } from 'react'
import { type IdeaBadge } from '@/lib/types/idea'

interface StatusBadgeProps {
  status: IdeaBadge
}

const STATUS_CONFIG: Record<IdeaBadge, { label: string; className: string }> = {
  new: {
    label: 'New',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  },
  hot: {
    label: 'Hot',
    className: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  },
  top: {
    label: 'Top',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  },
  trending: {
    label: 'Trending',
    className: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  },
}

export const StatusBadge: FC<StatusBadgeProps> = ({ status }) => {
  const config = STATUS_CONFIG[status]

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold leading-tight ${config.className}`}
    >
      {config.label}
    </span>
  )
}

/** Badge priority order: New > Hot > Top > Trending */
const BADGE_PRIORITY: IdeaBadge[] = ['new', 'hot', 'top', 'trending']

interface StatusBadgeListProps {
  badges: IdeaBadge[]
  maxVisible?: number
}

export const StatusBadgeList: FC<StatusBadgeListProps> = ({ badges, maxVisible }) => {
  if (badges.length === 0) return null

  // Sort by priority order and limit if needed
  const sorted = [...badges].sort(
    (a, b) => BADGE_PRIORITY.indexOf(a) - BADGE_PRIORITY.indexOf(b)
  )
  const visible = maxVisible ? sorted.slice(0, maxVisible) : sorted

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {visible.map((badge) => (
        <StatusBadge key={badge} status={badge} />
      ))}
    </div>
  )
}
