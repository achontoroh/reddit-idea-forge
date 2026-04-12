'use client'

import { type FC, useRef, useState, useEffect, useCallback } from 'react'

interface IdeaCardTooltipProps {
  pitch: string
  painPoint: string
  targetAudience: string | null
  anchorRef: React.RefObject<HTMLElement | null>
  visible: boolean
}

export const IdeaCardTooltip: FC<IdeaCardTooltipProps> = ({
  pitch,
  painPoint,
  targetAudience,
  anchorRef,
  visible,
}) => {
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<'below' | 'above'>('below')

  const updatePosition = useCallback(() => {
    if (!anchorRef.current || !tooltipRef.current) return

    const anchorRect = anchorRef.current.getBoundingClientRect()
    const tooltipHeight = tooltipRef.current.offsetHeight
    const spaceBelow = window.innerHeight - anchorRect.bottom
    const spaceAbove = anchorRect.top

    setPosition(spaceBelow < tooltipHeight + 16 && spaceAbove > spaceBelow ? 'above' : 'below')
  }, [anchorRef])

  useEffect(() => {
    if (visible) updatePosition()
  }, [visible, updatePosition])

  if (!visible) return null

  return (
    <div
      ref={tooltipRef}
      role="tooltip"
      className={`
        absolute left-0 right-0 z-30 mx-auto max-w-[400px]
        rounded-lg border border-[var(--ghost-border-color)] bg-surface-lowest p-4
        shadow-modal pointer-events-none
        animate-in fade-in-0 zoom-in-95 duration-150
        ${position === 'above' ? 'bottom-full mb-2' : 'top-full mt-2'}
      `}
      style={{ contentVisibility: 'auto' }}
    >
      <div className="space-y-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-muted mb-1">
            Pitch
          </p>
          <p className="text-sm text-on-surface leading-relaxed">{pitch}</p>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-muted mb-1">
            Pain Point
          </p>
          <p className="text-sm text-on-surface leading-relaxed">{painPoint}</p>
        </div>

        {targetAudience && (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-muted mb-1">
              Target Audience
            </p>
            <p className="text-sm text-on-surface leading-relaxed">{targetAudience}</p>
          </div>
        )}

        <p className="text-[11px] text-primary font-medium pt-1">
          Click for full details &rarr;
        </p>
      </div>
    </div>
  )
}
