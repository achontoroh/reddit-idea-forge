'use client'

import { type FC, useEffect, useState, useCallback } from 'react'
import { toast } from 'sonner'
import { type Idea, type IdeaBadge } from '@/lib/types/idea'
import { type RedditPost } from '@/lib/types/reddit-post'
import { BackLink } from '@/components/ui/back-link'
import { Card } from '@/components/ui/card'
import { ScoreBadge } from '@/components/ui/score-badge'
import { VoteButtons } from '@/components/ideas/vote-buttons'
import { ScoreBreakdown } from '@/components/features/score-breakdown'
import { RedditSourceCard } from '@/components/features/reddit-source-card'
import { StatusBadgeList } from '@/components/features/status-badge'
import { CATEGORY_LABELS } from '@/config/categories'

interface IdeaDetailClientProps {
  idea: Idea
  userVote: 1 | -1 | null
  isFavorited: boolean
  badges: IdeaBadge[]
  redditPosts: RedditPost[]
  isAuthenticated: boolean
}

const MVP_LABELS: Record<string, { label: string; color: string }> = {
  low: { label: 'Low Complexity', color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
  medium: { label: 'Medium Complexity', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
  high: { label: 'High Complexity', color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
}

const MONETIZATION_LABELS: Record<string, string> = {
  subscription: 'Subscription',
  'one-time': 'One-time Purchase',
  freemium: 'Freemium',
  marketplace: 'Marketplace',
}

export const IdeaDetailClient: FC<IdeaDetailClientProps> = ({
  idea,
  userVote,
  isFavorited: initialFavorited,
  badges,
  redditPosts,
  isAuthenticated,
}) => {
  const [isFavorited, setIsFavorited] = useState(initialFavorited)
  const [isSaving, setIsSaving] = useState(false)

  const categoryLabel = CATEGORY_LABELS[idea.category] ?? idea.category

  // Track view on mount
  useEffect(() => {
    if (!isAuthenticated) return
    fetch(`/api/ideas/${idea.id}/view`, { method: 'POST' }).catch(() => {
      // Silent fail — view tracking is non-critical
    })
  }, [idea.id, isAuthenticated])

  const handleShare = useCallback(() => {
    const subreddit = idea.source_subreddit
    const text = [
      idea.title,
      `Score: ${idea.ai_score}/100`,
      idea.pitch,
      `Source: r/${subreddit}`,
      'Found on IdeaForge',
    ].join(' — ')

    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard!')
    }).catch(() => {
      toast.error('Failed to copy')
    })
  }, [idea])

  const handleFavorite = useCallback(async () => {
    if (!isAuthenticated) {
      toast.error('Sign in to save ideas')
      return
    }
    if (isSaving) return
    setIsSaving(true)

    const prev = isFavorited
    setIsFavorited(!prev)

    try {
      const res = await fetch(`/api/ideas/${idea.id}/favorite`, {
        method: prev ? 'DELETE' : 'POST',
      })
      if (!res.ok) throw new Error()
    } catch {
      setIsFavorited(prev)
      toast.error('Failed to update favorite')
    } finally {
      setIsSaving(false)
    }
  }, [idea.id, isFavorited, isSaving, isAuthenticated])

  return (
    <div className="max-w-[720px] mx-auto pb-16">
      <BackLink href="/dashboard" />

      <article>
        {/* ── Header: category + status + score ── */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="px-3 py-1 bg-primary-container/20 text-primary rounded-full text-[11px] font-bold tracking-widest uppercase">
            {categoryLabel}
          </span>
          <StatusBadgeList badges={badges} />
          <div className="ml-auto">
            <ScoreBadge score={idea.ai_score} variant="full" />
          </div>
        </div>

        {/* ── Title ── */}
        <h1 className="text-3xl md:text-[2.75rem] leading-[1.15] font-bold text-on-surface tracking-[-0.02em] mb-4 font-heading">
          {idea.title}
        </h1>

        {/* ── Pitch ── */}
        <p className="text-lg leading-relaxed text-on-surface-muted mb-8">
          {idea.pitch}
        </p>

        {/* ── Action buttons row ── */}
        <div className="flex items-center gap-3 mb-12">
          <VoteButtons
            ideaId={idea.id}
            initialVote={userVote}
            initialScore={idea.community_score}
            size="lg"
          />

          <div className="flex items-center gap-1 text-sm text-on-surface-muted ml-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span className="tabular-nums">{idea.view_count}</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Save/Favorite */}
            <button
              type="button"
              onClick={handleFavorite}
              disabled={isSaving}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                isFavorited
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                  : 'bg-surface-low text-on-surface-muted hover:bg-surface-lowest hover:text-on-surface'
              } disabled:opacity-50`}
              aria-label={isFavorited ? 'Remove from saved' : 'Save idea'}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={isFavorited ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              {isFavorited ? 'Saved' : 'Save'}
            </button>

            {/* Share */}
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-surface-low text-on-surface-muted hover:bg-surface-lowest hover:text-on-surface transition-all"
              aria-label="Share idea"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              Share
            </button>

            {/* Deep Dive (disabled) */}
            <div className="relative group">
              <button
                type="button"
                disabled
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-surface-low text-on-surface-muted opacity-50 cursor-not-allowed"
                aria-label="Deep Dive — coming soon"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                Deep Dive
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-on-surface text-surface text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                Coming soon
              </div>
            </div>
          </div>
        </div>

        {/* ── Pain Point ── */}
        <section className="mb-12">
          <SectionHeader icon="pain" label="Pain Point" />
          <Card padding="lg" elevated>
            <p className="text-on-surface leading-relaxed">
              {idea.pain_point}
            </p>
          </Card>
        </section>

        {/* ── Target Audience ── */}
        {idea.target_audience && (
          <section className="mb-12">
            <SectionHeader icon="audience" label="Target Audience" />
            <Card padding="lg" elevated>
              <p className="text-on-surface leading-relaxed">
                {idea.target_audience}
              </p>
            </Card>
          </section>
        )}

        {/* ── AI Score Breakdown ── */}
        <section className="mb-12">
          <SectionHeader icon="score" label="AI Score Breakdown" />
          <Card padding="lg" elevated>
            <ScoreBreakdown breakdown={idea.ai_score_breakdown} />
          </Card>
        </section>

        {/* ── MVP & Monetization Tags ── */}
        {(idea.mvp_complexity || idea.monetization_model) && (
          <section className="mb-12">
            <SectionHeader icon="tags" label="Details" />
            <div className="flex flex-wrap gap-3">
              {idea.mvp_complexity && (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${MVP_LABELS[idea.mvp_complexity].color}`}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                  {MVP_LABELS[idea.mvp_complexity].label}
                </span>
              )}
              {idea.monetization_model && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                  {MONETIZATION_LABELS[idea.monetization_model]}
                </span>
              )}
            </div>
          </section>
        )}

        {/* ── Reddit Source ── */}
        <section className="mb-12">
          <SectionHeader icon="reddit" label="Based On" />
          {redditPosts.length > 0 ? (
            <div className="space-y-3">
              {redditPosts.map((post) => (
                <RedditSourceCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <a
              href={idea.source_url ?? `https://reddit.com/r/${idea.source_subreddit}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-5 py-3 rounded-lg bg-surface-lowest hover:bg-surface-low transition-all group"
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
              <span className="text-sm font-semibold text-on-surface-muted group-hover:text-on-surface transition-colors">
                View discussion on r/{idea.source_subreddit}
              </span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-on-surface-muted opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          )}
        </section>
      </article>
    </div>
  )
}

/* ── Section Header helper ── */

type SectionIcon = 'pain' | 'audience' | 'score' | 'tags' | 'reddit'

const SECTION_ICONS: Record<SectionIcon, { color: string }> = {
  pain: { color: 'bg-red-500' },
  audience: { color: 'bg-blue-500' },
  score: { color: 'bg-accent' },
  tags: { color: 'bg-purple-500' },
  reddit: { color: 'bg-orange-500' },
}

const SectionHeader: FC<{ icon: SectionIcon; label: string }> = ({ icon, label }) => (
  <div className="flex items-center gap-2 mb-4">
    <span className={`w-1.5 h-1.5 rounded-full ${SECTION_ICONS[icon].color}`} />
    <h2 className="text-[11px] font-bold tracking-[0.05em] uppercase text-on-surface-muted">
      {label}
    </h2>
  </div>
)
