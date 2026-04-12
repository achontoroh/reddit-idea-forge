'use client'

import { type FC } from 'react'
import { CATEGORIES } from '@/config/categories'
import { Chip } from '@/components/ui/chip'

interface CategoryChipsProps {
  /** User's preferred category slugs from user_preferences */
  userCategories: string[]
  selected: string
  onChange: (category: string) => void
}

export const CategoryChips: FC<CategoryChipsProps> = ({
  userCategories,
  selected,
  onChange,
}) => {
  // Show user's preferred categories first, then remaining
  const preferred = CATEGORIES.filter((c) => userCategories.includes(c.slug))
  const remaining = CATEGORIES.filter((c) => !userCategories.includes(c.slug))
  const ordered = [...preferred, ...remaining]

  return (
    <div className="flex flex-wrap gap-2">
      <Chip
        label="All"
        selected={selected === 'all'}
        onClick={() => onChange('all')}
      />
      {ordered.map((cat) => (
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
