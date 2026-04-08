import { type FC } from 'react'

interface ScoreBadgeProps {
  score: number
}

function getScoreColor(score: number): string {
  if (score >= 70) return 'bg-green-100 text-green-700 ring-green-600/20'
  if (score >= 40) return 'bg-amber-100 text-amber-700 ring-amber-600/20'
  return 'bg-red-100 text-red-700 ring-red-600/20'
}

export const ScoreBadge: FC<ScoreBadgeProps> = ({ score }) => {
  return (
    <span
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ring-1 ring-inset ${getScoreColor(score)}`}
      title={`Score: ${score}/100`}
    >
      {score}
    </span>
  )
}
