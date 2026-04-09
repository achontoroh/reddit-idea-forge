'use client'

import { type FC, useState, useMemo } from 'react'
import { type Idea } from '@/lib/types/idea'
import { CategoryFilter } from './category-filter'
import { IdeaCard } from './idea-card'
import { IdeaDetailModal } from './idea-detail-modal'

interface IdeaFeedProps {
  ideas: Idea[]
}

export const IdeaFeed: FC<IdeaFeedProps> = ({ ideas }) => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null)

  const filteredIdeas = useMemo(() => {
    if (selectedCategory === 'all') return ideas
    return ideas.filter((idea) => idea.category === selectedCategory)
  }, [ideas, selectedCategory])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <CategoryFilter selected={selectedCategory} onChange={setSelectedCategory} />
        <span className="text-sm text-gray-500">
          Showing {filteredIdeas.length} of {ideas.length} ideas
        </span>
      </div>

      {filteredIdeas.length === 0 ? (
        <p className="py-12 text-center text-gray-400">
          No ideas in this category yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredIdeas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} onClick={() => setSelectedIdea(idea)} />
          ))}
        </div>
      )}

      {selectedIdea && (
        <IdeaDetailModal idea={selectedIdea} onClose={() => setSelectedIdea(null)} />
      )}
    </div>
  )
}
