import { type FC } from 'react'
import { type IdeaWithVote } from '@/lib/types/idea'
import { Card } from '@/components/ui/card'
import { ScoreBadge } from '@/components/ui/score-badge'
import { VoteButtons } from '@/components/ideas/vote-buttons'
import { CATEGORY_LABELS } from '@/config/categories'
import { displayScore } from '@/lib/utils/score'

interface IdeaCardProps {
  idea: IdeaWithVote
}

export const IdeaCard: FC<IdeaCardProps> = ({ idea }) => {
  const categoryLabel = CATEGORY_LABELS[idea.category] ?? idea.category

  return (
    <Card padding="lg" elevated className="[content-visibility:auto] [contain-intrinsic-size:auto_140px]">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-ink-900 font-semibold text-lg">{idea.title}</h3>
        <div className="flex items-center gap-3 shrink-0">
          <VoteButtons
            ideaId={idea.id}
            initialVote={idea.userVote}
            initialScore={idea.community_score}
          />
          <ScoreBadge score={displayScore(idea.ai_score)} />
        </div>
      </div>
      <div className="mb-4">
        <span className="bg-accent-soft text-accent px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">
          {categoryLabel}
        </span>
      </div>
      <p className="text-ink-500 text-base leading-relaxed line-clamp-2">
        {idea.pitch}
      </p>
    </Card>
  )
}
