import { type FC } from 'react'
import { scoreSignalLevel } from '@/lib/utils/score'

interface ScoreBadgeProps {
  /** Display score on the 0–10 scale. Convert DB /100 with `displayScore()` first. */
  score: number
  variant?: 'compact' | 'full'
}

const SIGNAL_CLASSES: Record<'high' | 'mid' | 'low', string> = {
  high: 'bg-signal-high/10 text-signal-high',
  mid: 'bg-signal-mid/10 text-signal-mid',
  low: 'bg-signal-low/10 text-signal-low',
}

export const ScoreBadge: FC<ScoreBadgeProps> = ({ score, variant = 'compact' }) => {
  const display = score.toFixed(1)
  const classes = SIGNAL_CLASSES[scoreSignalLevel(score)]

  return (
    <div
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full shrink-0 ${classes}`}
      title={`Score: ${display}/10`}
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
      <span className="text-xs font-bold tabular-nums">
        {display}/10{variant === 'full' && ' Score'}
      </span>
    </div>
  )
}
