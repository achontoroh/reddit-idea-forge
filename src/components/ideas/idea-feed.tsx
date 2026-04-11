'use client'

import { type FC, useState, useMemo } from 'react'
import Link from 'next/link'
import { type Idea } from '@/lib/types/idea'
import { CategoryFilter } from './category-filter'
import { IdeaCard } from './idea-card'

type SortMode = 'hot' | 'new' | 'top'

interface IdeaFeedProps {
  ideas: Idea[]
}

const TABS: { key: SortMode; label: string }[] = [
  { key: 'hot', label: 'Hot' },
  { key: 'new', label: 'New' },
  { key: 'top', label: 'Top' },
]

export const IdeaFeed: FC<IdeaFeedProps> = ({ ideas }) => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortMode, setSortMode] = useState<SortMode>('hot')

  const filteredAndSorted = useMemo(() => {
    const filtered = selectedCategory === 'all'
      ? ideas
      : ideas.filter((idea) => idea.category === selectedCategory)

    switch (sortMode) {
      case 'new':
        return [...filtered].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      case 'top':
        return [...filtered].sort((a, b) => b.ai_score - a.ai_score)
      case 'hot':
      default:
        return filtered
    }
  }, [ideas, selectedCategory, sortMode])

  return (
    <div>
      <div className="flex gap-8 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSortMode(tab.key)}
            className={`pb-4 font-medium text-base relative transition-colors ${
              sortMode === tab.key
                ? 'text-primary font-semibold'
                : 'text-on-surface-muted hover:text-on-surface'
            }`}
          >
            {tab.label}
            {sortMode === tab.key && (
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      <div className="mb-8">
        <CategoryFilter selected={selectedCategory} onChange={setSelectedCategory} />
      </div>

      {filteredAndSorted.length === 0 ? (
        <p className="py-12 text-center text-on-surface-muted">
          No ideas in this category yet.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {filteredAndSorted.map((idea) => (
            <Link key={idea.id} href={`/dashboard/ideas/${idea.id}`}>
              <IdeaCard idea={idea} />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
