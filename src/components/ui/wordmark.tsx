import type { FC, CSSProperties } from 'react'
import Link from 'next/link'

interface WordmarkProps {
  size?: number
  accent?: string
  mono?: boolean
  href?: string
  className?: string
}

export const Wordmark: FC<WordmarkProps> = ({
  size = 22,
  accent,
  mono = false,
  href,
  className,
}) => {
  const periodColor = mono ? 'var(--ink-900)' : accent ?? 'var(--accent)'
  const rootStyle: CSSProperties = {
    fontSize: `${size}px`,
    lineHeight: 1,
    display: 'inline-flex',
    alignItems: 'baseline',
    color: 'var(--ink-900)',
  }

  const content = (
    <span style={rootStyle} className={className}>
      <span
        style={{
          fontFamily: 'var(--font-italic)',
          fontStyle: 'italic',
          fontWeight: 400,
        }}
      >
        idea
      </span>
      <span
        style={{
          fontFamily: 'var(--font-serif)',
          fontWeight: 500,
          letterSpacing: '-0.02em',
        }}
      >
        forge
      </span>
      <span
        style={{
          fontFamily: 'var(--font-serif)',
          fontWeight: 700,
          color: periodColor,
        }}
      >
        .
      </span>
    </span>
  )

  if (href) {
    return (
      <Link href={href} aria-label="ideaforge" style={{ textDecoration: 'none' }}>
        {content}
      </Link>
    )
  }

  return content
}
