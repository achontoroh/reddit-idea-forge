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
    <div
      className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
      style={{
        maskImage: 'linear-gradient(to right, black calc(100% - 32px), transparent)',
        WebkitMaskImage: 'linear-gradient(to right, black calc(100% - 32px), transparent)',
      }}
    >
      <Chip
        label="All"
        selected={selected === 'all'}
        onClick={() => onChange('all')}
      />
      {ordered.map((cat) => (
        <Chip
          key={cat.slug}
          label={`${cat.icon} ${cat.name}`}
          selected={selected === cat.slug}
          onClick={() => onChange(cat.slug)}
        />
      ))}
    </div>
  )
}
