'use client'

import { type FC, type KeyboardEvent } from 'react'
import { categoryLabels, type CategoryKey } from '@/lib/design-system/categories'

interface InterestChipProps {
  category: CategoryKey
  label?: string
  selected: boolean
  onToggle: (next: boolean) => void
  disabled?: boolean
  className?: string
}

export const InterestChip: FC<InterestChipProps> = ({
  category,
  label,
  selected,
  onToggle,
  disabled = false,
  className,
}) => {
  const display = label ?? categoryLabels[category]

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (!disabled) onToggle(!selected)
    }
  }

  return (
    <button
      type="button"
      role="button"
      aria-pressed={selected}
      data-category={category}
      data-selected={selected ? 'true' : 'false'}
      disabled={disabled}
      onClick={() => onToggle(!selected)}
      onKeyDown={handleKeyDown}
      className={className ? `interest-chip ${className}` : 'interest-chip'}
    >
      {display}
    </button>
  )
}
