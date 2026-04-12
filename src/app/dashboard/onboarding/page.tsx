'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CATEGORIES } from '@/config/categories'
import { CategoryCard } from '@/components/features/category-card'
import { Button } from '@/components/ui/button'

const MIN_CATEGORIES = 2
const MAX_CATEGORIES = 4

export default function OnboardingPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleToggle(slug: string) {
    setSelected((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug)
      if (prev.length >= MAX_CATEGORIES) return prev
      return [...prev, slug]
    })
  }

  async function handleSubmit() {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/user/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories: selected }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error ?? 'Failed to save preferences')
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const canSubmit = selected.length >= MIN_CATEGORIES

  return (
    <div className="flex flex-col items-center">
      {/* Header */}
      <div className="text-center max-w-lg">
        <h1 className="text-3xl md:text-4xl font-bold font-heading tracking-[-0.02em] text-on-surface">
          Welcome to IdeaForge
        </h1>
        <p className="mt-3 text-on-surface-muted text-base leading-relaxed">
          Pick the categories you care about most. We&apos;ll surface the best SaaS ideas from those communities.
        </p>
      </div>

      {/* Selection count */}
      <div className="mt-8 flex items-center gap-3">
        <span className="text-sm font-medium text-on-surface-muted">
          {selected.length} of {MAX_CATEGORIES} selected
        </span>
        <div className="flex gap-1.5">
          {Array.from({ length: MAX_CATEGORIES }).map((_, i) => (
            <div
              key={i}
              className={`
                h-1.5 w-6 rounded-full transition-colors duration-200
                ${i < selected.length ? 'bg-primary' : 'bg-surface-highest'}
              `}
            />
          ))}
        </div>
      </div>

      {/* Category grid */}
      <div className="mt-6 grid w-full grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {CATEGORIES.map((cat) => (
          <CategoryCard
            key={cat.slug}
            category={cat}
            selected={selected.includes(cat.slug)}
            onToggle={handleToggle}
          />
        ))}
      </div>

      {/* Minimum hint */}
      {selected.length > 0 && selected.length < MIN_CATEGORIES && (
        <p className="mt-4 text-xs text-on-surface-muted">
          Pick at least {MIN_CATEGORIES} categories to continue
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {/* Submit */}
      <Button
        size="lg"
        disabled={!canSubmit}
        loading={loading}
        onClick={handleSubmit}
        className="mt-8 w-full max-w-xs"
      >
        Start Exploring
      </Button>
    </div>
  )
}
