import { type FC } from 'react'
import { type IdeaBadge } from '@/lib/types/idea'

interface StatusBadgeProps {
  status: IdeaBadge
}

const STATUS_CONFIG: Record<IdeaBadge, { label: string; className: string }> = {
  new: {
    label: 'New',
    className: 'bg-accent/10 text-accent',
  },
  hot: {
    label: 'Hot',
    className: 'bg-danger/10 text-danger',
  },
  top: {
    label: 'Top',
    className: 'bg-signal-mid/10 text-signal-mid',
  },
  trending: {
    label: 'Trending',
    className: 'bg-signal-high/10 text-signal-high',
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
