'use client'

import { type FC } from 'react'
import { CATEGORIES } from '@/config/categories'
import { Chip } from '@/components/ui/chip'

interface CategoryChipsProps {
  /** User's preferred category slugs from user_preferences */
  userCategories: string[]
  selected: string
  onChange: (category: string) => void
  /** When true, only show user's preferred categories (For You tab) */
  forYou?: boolean
}

export const CategoryChips: FC<CategoryChipsProps> = ({
  userCategories,
  selected,
  onChange,
  forYou = false,
}) => {
  const preferred = CATEGORIES.filter((c) => userCategories.includes(c.slug))

  // For You tab: only user's categories. Other tabs: preferred first, then rest.
  const visible = forYou
    ? preferred
    : [...preferred, ...CATEGORIES.filter((c) => !userCategories.includes(c.slug))]

  return (
    <div className="flex flex-wrap gap-2">
      <Chip
        label="All"
        selected={selected === 'all'}
        onClick={() => onChange('all')}
      />
      {visible.map((cat) => (
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
