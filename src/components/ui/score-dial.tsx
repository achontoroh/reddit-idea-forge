'use client'

import { type CSSProperties, type FC, useEffect, useRef } from 'react'
import { scoreSignalToken } from '@/lib/utils/score'

export type ScoreDialSize = 'sm' | 'md' | 'lg'

interface ScoreDialProps {
  value: number
  size?: ScoreDialSize
  label?: string
  animate?: boolean
  className?: string
}

const SIZE_SPECS: Record<ScoreDialSize, { dial: number; numeral: number }> = {
  sm: { dial: 44, numeral: 22 },
  md: { dial: 72, numeral: 30 },
  lg: { dial: 128, numeral: 48 },
}

const STROKE = 2

const CENTER_STYLE: CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 1,
  pointerEvents: 'none',
}

function clampValue(value: number): number {
  if (!Number.isFinite(value)) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[ScoreDial] value ${value} is not a finite number; clamped to 0.`)
    }
    return 0
  }
  if (value < 0 || value > 10) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[ScoreDial] value ${value} is outside [0, 10]; clamped.`)
    }
  }
  return Math.min(10, Math.max(0, value))
}

export const ScoreDial: FC<ScoreDialProps> = ({
  value,
  size = 'md',
  label,
  animate = true,
  className,
}) => {
  const { dial, numeral } = SIZE_SPECS[size]
  const clamped = clampValue(value)
  const radius = dial / 2 - STROKE
  const circumference = 2 * Math.PI * radius
  const targetOffset = circumference * (1 - clamped / 10)

  // Animate via direct DOM mutation: render starts at empty (circumference), then
  // an rAF-scheduled style write triggers the CSS transition to targetOffset.
  // Bypassing React state here avoids a guaranteed second render per dial — meaningful
  // when a feed mounts dozens at once. Reduced-motion is handled by tokens.css
  // (`--dur-dial` collapses to 0ms), so the transition snaps instantly.
  const indicatorRef = useRef<SVGCircleElement>(null)

  useEffect(() => {
    if (!animate) return
    const raf = requestAnimationFrame(() => {
      if (indicatorRef.current) {
        indicatorRef.current.style.strokeDashoffset = String(targetOffset)
      }
    })
    return () => cancelAnimationFrame(raf)
  }, [animate, targetOffset])

  const display = clamped.toFixed(1)
  const denomSize = Math.round(numeral * 0.7)
  const ringColor = scoreSignalToken(clamped)
  const initialOffset = animate ? circumference : targetOffset

  const numeralStyle: CSSProperties = {
    fontFamily: 'var(--font-serif)',
    fontWeight: 700,
    fontSize: `${numeral}px`,
    lineHeight: 1,
    letterSpacing: '-0.02em',
    color: 'var(--ink-900)',
  }

  const denomStyle: CSSProperties = {
    fontFamily: 'var(--font-italic)',
    fontStyle: 'italic',
    fontWeight: 400,
    fontSize: `${denomSize}px`,
    lineHeight: 1,
    color: 'var(--ink-400)',
    marginLeft: 2,
  }

  const indicatorStyle: CSSProperties = {
    transform: 'rotate(-90deg)',
    transformOrigin: '50% 50%',
    transition: animate ? 'stroke-dashoffset var(--dur-dial) var(--ease-dial)' : undefined,
  }

  return (
    <div
      className={className ? `score-dial ${className}` : 'score-dial'}
      data-size={size}
      role="img"
      aria-label={`${display} out of 10`}
    >
      {label && (
        <span className="kicker score-dial-label" aria-hidden="true">
          {label}
        </span>
      )}
      <div className="score-dial-ring" style={{ width: dial, height: dial }}>
        <svg
          width={dial}
          height={dial}
          viewBox={`0 0 ${dial} ${dial}`}
          style={{ display: 'block' }}
          aria-hidden="true"
        >
          <circle
            cx={dial / 2}
            cy={dial / 2}
            r={radius}
            fill="none"
            stroke="var(--ink-paper-3)"
            strokeWidth={STROKE}
          />
          <circle
            ref={indicatorRef}
            cx={dial / 2}
            cy={dial / 2}
            r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth={STROKE}
            strokeLinecap="butt"
            strokeDasharray={circumference}
            strokeDashoffset={initialOffset}
            style={indicatorStyle}
            data-score-dial-indicator
          />
        </svg>
        <span style={CENTER_STYLE} aria-hidden="true">
          <span style={numeralStyle} data-score-dial-numeral>
            {display}
          </span>
          <span style={denomStyle} data-score-dial-denom>
            /10
          </span>
        </span>
      </div>
    </div>
  )
}
