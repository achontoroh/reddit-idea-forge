import type { FC, CSSProperties } from 'react'

interface GlyphProps {
  size?: number
  accent?: string
  className?: string
  title?: string
}

export const Glyph: FC<GlyphProps> = ({
  size = 24,
  accent,
  className,
  title = 'ideaforge',
}) => {
  const accentColor = accent ?? 'var(--accent)'
  const fSize = Math.round(size * 0.72)
  const dotSize = Math.round(size * 0.5)

  const rootStyle: CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    display: 'inline-flex',
    alignItems: 'baseline',
    justifyContent: 'center',
    lineHeight: 1,
    color: 'var(--ink-900)',
  }

  return (
    <span role="img" aria-label={title} style={rootStyle} className={className}>
      <span
        style={{
          fontFamily: 'var(--font-italic)',
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: `${fSize}px`,
          lineHeight: 1,
        }}
      >
        f
      </span>
      <span
        style={{
          fontFamily: 'var(--font-serif)',
          fontWeight: 700,
          fontSize: `${dotSize}px`,
          color: accentColor,
          lineHeight: 1,
        }}
      >
        .
      </span>
    </span>
  )
}
