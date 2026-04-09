'use client'

import { type FC } from 'react'
import { CATEGORIES } from '@/config/categories'

interface CategoryFilterProps {
  selected: string
  onChange: (category: string) => void
}

const CATEGORY_COLORS: Record<string, string> = {
  devtools: 'bg-blue-600 text-white',
  health: 'bg-green-600 text-white',
  education: 'bg-purple-600 text-white',
  finance: 'bg-amber-500 text-white',
  productivity: 'bg-orange-500 text-white',
  all: 'bg-gray-900 text-white',
}

const CATEGORY_OUTLINE: Record<string, string> = {
  devtools: 'border-blue-300 text-blue-700 hover:border-blue-400',
  health: 'border-green-300 text-green-700 hover:border-green-400',
  education: 'border-purple-300 text-purple-700 hover:border-purple-400',
  finance: 'border-amber-300 text-amber-700 hover:border-amber-400',
  productivity: 'border-orange-300 text-orange-700 hover:border-orange-400',
  all: 'border-gray-200 text-gray-600 hover:border-gray-400',
}

export const CategoryFilter: FC<CategoryFilterProps> = ({ selected, onChange }) => {
  const categories = ['all', ...CATEGORIES]

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`rounded-full px-3 py-1 text-sm font-medium capitalize transition-colors cursor-pointer ${
            selected === cat
              ? CATEGORY_COLORS[cat] ?? 'bg-gray-900 text-white'
              : `border ${CATEGORY_OUTLINE[cat] ?? 'border-gray-200 text-gray-600 hover:border-gray-400'}`
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
