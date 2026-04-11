import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { type Idea } from '@/lib/types/idea'
import { BackLink } from '@/components/ui/back-link'
import { ScoreBadge } from '@/components/ui/score-badge'
import { CATEGORY_LABELS, type Category } from '@/config/categories'

interface IdeaDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function IdeaDetailPage({ params }: IdeaDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: idea } = await supabase
    .from('ideas')
    .select('*')
    .eq('id', id)
    .single()

  if (!idea) {
    notFound()
  }

  const typedIdea = idea as Idea
  const categoryLabel = CATEGORY_LABELS[typedIdea.category as Category] ?? typedIdea.category

  return (
    <div className="max-w-[720px] mx-auto">
      <BackLink href="/dashboard" />

      <article>
        <div className="flex items-center gap-4 mb-8">
          <span className="px-4 py-1.5 bg-primary-container/20 text-primary rounded-full text-[0.6875rem] font-bold tracking-widest uppercase">
            {categoryLabel}
          </span>
          <ScoreBadge score={typedIdea.score} variant="full" />
        </div>

        <h1 className="text-3xl md:text-[3.5rem] leading-[1.1] font-bold text-on-surface tracking-[-0.02em] mb-8 font-heading">
          {typedIdea.title}
        </h1>

        <p className="text-lg leading-relaxed text-on-surface-muted mb-16">
          {typedIdea.pitch}
        </p>

        <section className="mb-20">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <h2 className="text-[0.6875rem] font-bold tracking-[0.05em] uppercase text-on-surface-muted">
              Pain Point
            </h2>
          </div>
          <div className="p-6 rounded-xl bg-surface-lowest">
            <p className="text-on-surface leading-relaxed">
              {typedIdea.pain_point}
            </p>
          </div>
        </section>

        <div className="flex justify-center pt-12">
          <a
            href={typedIdea.source_url ?? `https://reddit.com/r/${typedIdea.source_subreddit}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full hover:bg-surface-low transition-all group"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-on-surface-muted group-hover:text-accent transition-colors"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span className="text-sm font-semibold text-on-surface-muted">
              View Reddit source discussion
            </span>
          </a>
        </div>
      </article>
    </div>
  )
}
