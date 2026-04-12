import { type FC } from 'react'

interface ScoreBadgeProps {
  score: number
  variant?: 'compact' | 'full'
}

export const ScoreBadge: FC<ScoreBadgeProps> = ({ score, variant = 'compact' }) => {
  return (
    <div
      className="inline-flex items-center gap-1 bg-accent dark:bg-accent/20 px-3 py-1 rounded-full shrink-0"
      title={`Score: ${score}/100`}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="text-white dark:text-accent"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      <span className="text-white dark:text-accent text-xs font-bold">
        {score}
        {variant === 'full' && ' Score'}
      </span>
    </div>
  )
}
