'use client'

import { type FC } from 'react'
import { CATEGORIES } from '@/config/categories'
import { Chip } from '@/components/ui/chip'

interface CategoryFilterProps {
  selected: string
  onChange: (category: string) => void
}

export const CategoryFilter: FC<CategoryFilterProps> = ({ selected, onChange }) => {
  return (
    <div className="flex gap-2 flex-wrap">
      <Chip label="All" selected={selected === 'all'} onClick={() => onChange('all')} />
      {CATEGORIES.map((cat) => (
        <Chip
          key={cat.slug}
          label={cat.name}
          selected={selected === cat.slug}
          onClick={() => onChange(cat.slug)}
        />
      ))}
    </div>
  )
}
