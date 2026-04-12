'use client'

import { type FC } from 'react'

interface ChipProps {
  label: string
  selected: boolean
  onClick: () => void
}

export const Chip: FC<ChipProps> = ({ label, selected, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
        selected
          ? 'bg-primary text-on-primary'
          : 'bg-surface-highest text-on-surface hover:opacity-80'
      }`}
    >
      {label}
    </button>
  )
}
