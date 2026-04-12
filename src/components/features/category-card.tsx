'use client'

import { type FC } from 'react'
import { type Category } from '@/config/categories'

interface CategoryCardProps {
  category: Category
  selected: boolean
  onToggle: (slug: string) => void
}

export const CategoryCard: FC<CategoryCardProps> = ({ category, selected, onToggle }) => {
  return (
    <button
      type="button"
      onClick={() => onToggle(category.slug)}
      className={`
        relative flex flex-col items-center gap-2 rounded-xl p-5 cursor-pointer
        border-2 transition-all duration-200 ease-out
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
        ${
          selected
            ? 'border-primary bg-primary/5 scale-[1.02] shadow-md'
            : 'border-transparent bg-surface-lowest hover:border-surface-highest hover:shadow-sm hover:-translate-y-0.5'
        }
      `}
    >
      {/* Checkmark overlay */}
      <div
        className={`
          absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full
          transition-all duration-200
          ${selected ? 'bg-primary scale-100 opacity-100' : 'bg-surface-highest scale-75 opacity-0'}
        `}
      >
        <svg
          className="h-3 w-3 text-on-primary"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={3}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>

      <span className="text-3xl select-none" role="img" aria-label={category.name}>
        {category.icon}
      </span>

      <div className="text-center">
        <p className="font-heading font-semibold text-sm text-on-surface">
          {category.name}
        </p>
        <p className="mt-0.5 text-xs text-on-surface-muted leading-snug">
          {category.subreddits.length} subreddits tracked
        </p>
      </div>
    </button>
  )
}
