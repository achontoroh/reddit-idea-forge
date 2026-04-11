import { type FC } from 'react'
import { type Idea } from '@/lib/types/idea'
import { ScoreBadge } from '@/components/ui/score-badge'
import { CATEGORY_LABELS } from '@/config/categories'

interface IdeaCardProps {
  idea: Idea
}

export const IdeaCard: FC<IdeaCardProps> = ({ idea }) => {
  const categoryLabel = CATEGORY_LABELS[idea.category] ?? idea.category

  return (
    <div className="bg-surface-lowest p-6 rounded-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-on-surface font-semibold text-lg">{idea.title}</h3>
        <ScoreBadge score={idea.ai_score} />
      </div>
      <div className="mb-4">
        <span className="bg-primary-container/20 text-primary px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">
          {categoryLabel}
        </span>
      </div>
      <p className="text-on-surface-muted text-base leading-relaxed line-clamp-2">
        {idea.pitch}
      </p>
    </div>
  )
}
