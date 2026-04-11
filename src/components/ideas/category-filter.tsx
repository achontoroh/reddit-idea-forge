'use client'

import { type FC } from 'react'
import { CATEGORIES, CATEGORY_LABELS } from '@/config/categories'
import { Chip } from '@/components/ui/chip'

interface CategoryFilterProps {
  selected: string
  onChange: (category: string) => void
}

export const CategoryFilter: FC<CategoryFilterProps> = ({ selected, onChange }) => {
  return (
    <div className="flex gap-2 flex-nowrap overflow-x-auto pb-1 -mb-1">
      <Chip label="All" selected={selected === 'all'} onClick={() => onChange('all')} />
      {CATEGORIES.map((cat) => (
        <Chip
          key={cat}
          label={CATEGORY_LABELS[cat]}
          selected={selected === cat}
          onClick={() => onChange(cat)}
        />
      ))}
    </div>
  )
}
