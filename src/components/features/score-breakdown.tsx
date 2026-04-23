'use client'

import { type FC } from 'react'
import { type ScoreBreakdown as ScoreBreakdownType } from '@/lib/types/idea'

interface ScoreBreakdownProps {
  breakdown: ScoreBreakdownType
}

const SCORE_LABELS: Record<keyof ScoreBreakdownType, string> = {
  pain_intensity: 'Pain Intensity',
  willingness_to_pay: 'Willingness to Pay',
  competition: 'Competition Gap',
  tam: 'Market Size (TAM)',
}

function getBarColor(value: number): string {
  if (value >= 20) return 'bg-signal-high'
  if (value >= 14) return 'bg-accent'
  if (value >= 8) return 'bg-signal-mid'
  return 'bg-signal-low'
}

export const ScoreBreakdown: FC<ScoreBreakdownProps> = ({ breakdown }) => {
  const entries = Object.entries(SCORE_LABELS) as [keyof ScoreBreakdownType, string][]

  return (
    <div className="space-y-4">
      {entries.map(([key, label]) => {
        const value = breakdown[key]
        const pct = (value / 25) * 100

        return (
          <div key={key}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-ink-900">
                {label}
              </span>
              <span className="text-sm font-bold tabular-nums text-ink-400">
                {value}/25
              </span>
            </div>
            <div className="h-2 rounded-full bg-ink-paper-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${getBarColor(value)}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
