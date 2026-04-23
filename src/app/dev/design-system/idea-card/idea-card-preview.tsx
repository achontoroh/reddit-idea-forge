'use client'

import { useEffect, useState } from 'react'
import { Kicker } from '@/components/ui/kicker'
import { IdeaCard, type IdeaCardProps, type IdeaCardVariant } from '@/components/features/idea-card'
import type { CategoryKey } from '@/lib/design-system/categories'

type Idea = IdeaCardProps['idea']

const baseDate = new Date('2026-04-20T09:00:00Z')

const mkIdea = (over: Partial<Idea> & Pick<Idea, 'id' | 'title' | 'category' | 'score'>): Idea => ({
  summary: undefined,
  publishedAt: baseDate,
  isNew: false,
  ...over,
})

const REAL: Record<IdeaCardVariant, Idea> = {
  list: mkIdea({
    id: 'l1',
    title: 'Postgres branching for feature environments',
    category: 'devt' as CategoryKey,
    score: 8.4,
    summary: 'Dev teams waste 40min/day on staging conflicts. $340/mo ceiling.',
    isNew: true,
  }),
  featured: mkIdea({
    id: 'f1',
    title: 'AI-assisted incident post-mortems with linked evidence',
    category: 'ai' as CategoryKey,
    score: 9.1,
    summary:
      'Every SRE we talked to runs post-mortems in Google Docs with grep-and-paste logs. Fix that.',
    isNew: true,
  }),
  compact: mkIdea({
    id: 'c1',
    title: 'Stripe billing audit co-pilot',
    category: 'fin' as CategoryKey,
    score: 7.6,
  }),
  grid: mkIdea({
    id: 'g1',
    title: 'Calendar block for focus rituals',
    category: 'prod' as CategoryKey,
    score: 6.8,
  }),
}

type AssertionResult = { pass: boolean; failures: string[] }

/**
 * Runtime DOM assertions — mirror the ScoreDial preview pattern (IF-130).
 * Enforces the IF-131 contract rules directly against computed styles.
 */
function runAssertions(): AssertionResult {
  if (typeof window === 'undefined') return { pass: true, failures: [] }
  const failures: string[] = []

  const pick = (sel: string): HTMLElement | null => document.querySelector<HTMLElement>(sel)

  // 1. list — hairline BOTTOM border only, other sides 0
  const list = pick('[data-assert="variant-list"]')
  if (!list) failures.push('list: root not found')
  else {
    const cs = getComputedStyle(list)
    if (parseFloat(cs.borderBottomWidth) < 0.5) {
      failures.push(`list: expected border-bottom ≥1px, got ${cs.borderBottomWidth}`)
    }
    if (parseFloat(cs.borderTopWidth) > 0.5) {
      failures.push(`list: expected no border-top, got ${cs.borderTopWidth}`)
    }
    if (parseFloat(cs.borderLeftWidth) > 0.5 || parseFloat(cs.borderRightWidth) > 0.5) {
      failures.push(`list: expected no left/right border`)
    }
  }

  // 2. featured — full border on all sides + paper-2 background
  const featured = pick('[data-assert="variant-featured"]')
  if (!featured) failures.push('featured: root not found')
  else {
    const cs = getComputedStyle(featured)
    for (const side of ['Top', 'Right', 'Bottom', 'Left'] as const) {
      const w = parseFloat(cs[`border${side}Width` as const])
      if (w < 0.5) failures.push(`featured: expected border-${side.toLowerCase()} ≥1px, got ${w}`)
    }
    const expected = getComputedStyle(document.documentElement)
      .getPropertyValue('--ink-paper-2')
      .trim()
    const probe = document.createElement('span')
    probe.style.background = expected
    document.body.appendChild(probe)
    const expectedRgb = getComputedStyle(probe).backgroundColor
    probe.remove()
    if (cs.backgroundColor !== expectedRgb) {
      failures.push(`featured: bg expected ${expectedRgb} (--ink-paper-2), got ${cs.backgroundColor}`)
    }
  }

  // 3. compact — max-width ≤ 300px
  const compact = pick('[data-assert="variant-compact"]')
  if (!compact) failures.push('compact: root not found')
  else {
    const cs = getComputedStyle(compact)
    const mw = parseFloat(cs.maxWidth)
    if (!Number.isFinite(mw) || mw > 300.5) {
      failures.push(`compact: expected max-width ≤300px, got ${cs.maxWidth}`)
    }
  }

  // 4. Titles on every variant use Fraunces
  for (const v of ['list', 'featured', 'compact', 'grid'] as const) {
    const t = document.querySelector<HTMLElement>(`[data-assert="variant-${v}"] .idea-card-title`)
    if (!t) {
      failures.push(`${v}: title not found`)
      continue
    }
    const ff = getComputedStyle(t).fontFamily
    if (!/Fraunces/i.test(ff)) {
      failures.push(`${v}: title font-family expected to include "Fraunces", got ${ff}`)
    }
  }

  // 5. NEW kicker uses accent color
  const newKicker = document.querySelector<HTMLElement>('[data-assert="variant-list"] .idea-card-new')
  if (!newKicker) failures.push('list with isNew: NEW kicker not found')
  else {
    const expected = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
    const probe = document.createElement('span')
    probe.style.color = expected
    document.body.appendChild(probe)
    const expectedRgb = getComputedStyle(probe).color
    probe.remove()
    if (getComputedStyle(newKicker).color !== expectedRgb) {
      failures.push(
        `NEW kicker: color expected ${expectedRgb} (--accent), got ${getComputedStyle(newKicker).color}`
      )
    }
  }

  return { pass: failures.length === 0, failures }
}

export function IdeaCardPreview() {
  const [assertion, setAssertion] = useState<AssertionResult | null>(null)

  useEffect(() => {
    // Wait a frame so fonts + CSS paint before reading computed styles.
    const raf = requestAnimationFrame(() => setAssertion(runAssertions()))
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-12">
        <Kicker number={131} label="Design System" />
        <h1 className="mt-3 font-serif text-h1 text-ink-900">IdeaCard</h1>
        <p className="mt-4 max-w-prose text-body text-ink-500">
          One data contract, four variants: <code>list</code>, <code>featured</code>,{' '}
          <code>compact</code>, <code>grid</code>. Composed from <code>Tag</code> (IF-128) +{' '}
          <code>ScoreDial</code> (IF-130) + a Fraunces title. Variant switching via{' '}
          <code>data-variant</code> on the root — no per-variant component files.
        </p>
      </header>

      {/* Assertion bar */}
      <section className="mb-12 rounded-sm border border-ink-100 bg-ink-paper-2 p-4">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className={`inline-block h-2 w-2 rounded-full ${
              assertion == null
                ? 'bg-ink-300'
                : assertion.pass
                  ? 'bg-signal-high'
                  : 'bg-danger'
            }`}
          />
          <span className="font-mono text-tag uppercase tracking-[0.12em] text-ink-700">
            {assertion == null
              ? 'Running IdeaCard contract assertions…'
              : assertion.pass
                ? 'Pass — hairline-bottom list, full-border featured, ≤300px compact, Fraunces titles, accent NEW kicker'
                : `Fail — ${assertion.failures.length} assertion(s) failed`}
          </span>
        </div>
        {assertion && !assertion.pass && (
          <ul className="mt-3 list-disc pl-5 text-body-sm text-danger">
            {assertion.failures.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="mb-16">
        <Kicker label="List — dashboard feed default" />
        <div className="mt-6" data-assert="variant-list">
          <IdeaCard idea={REAL.list} variant="list" onClick={() => console.log('click list')} />
        </div>
        <div className="mt-2">
          <IdeaCard
            idea={mkIdea({
              id: 'l2',
              title: 'Unified changelog generator for monorepos',
              category: 'devt' as CategoryKey,
              score: 5.4,
              summary: 'Conventional-commits not enough once 8 teams ship from one repo.',
            })}
            variant="list"
            onClick={() => console.log('click list 2')}
          />
        </div>
        <div className="mt-2">
          <IdeaCard
            idea={mkIdea({
              id: 'l3',
              title: 'No summary field — edge case for optional prop',
              category: 'saas' as CategoryKey,
              score: 7.1,
            })}
            variant="list"
          />
        </div>
      </section>

      <section className="mb-16">
        <Kicker label="Featured — top-of-dashboard hero" />
        <div className="mt-6" data-assert="variant-featured">
          <IdeaCard
            idea={REAL.featured}
            variant="featured"
            onClick={() => console.log('click featured')}
          />
        </div>
      </section>

      <section className="mb-16">
        <Kicker label="Compact — right rail, sidebar digest, email preview (≤300px)" />
        <div className="mt-6 flex flex-col gap-1" data-assert-wrap="compact-stack">
          <div data-assert="variant-compact">
            <IdeaCard
              idea={REAL.compact}
              variant="compact"
              onClick={() => console.log('click compact')}
            />
          </div>
          <IdeaCard
            idea={mkIdea({
              id: 'c2',
              title: 'Very long title that must clamp to a single line in the compact variant',
              category: 'ai' as CategoryKey,
              score: 9.9,
            })}
            variant="compact"
          />
          <IdeaCard
            idea={mkIdea({
              id: 'c3',
              title: 'Low score example',
              category: 'health' as CategoryKey,
              score: 2.3,
            })}
            variant="compact"
          />
        </div>
      </section>

      <section className="mb-16">
        <Kicker label="Grid — category page, 3-column layout" />
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div data-assert="variant-grid">
            <IdeaCard idea={REAL.grid} variant="grid" onClick={() => console.log('click grid')} />
          </div>
          <IdeaCard
            idea={mkIdea({
              id: 'g2',
              title: 'Portfolio rebalancer with tax-loss harvesting',
              category: 'fin' as CategoryKey,
              score: 8.9,
              isNew: true,
            })}
            variant="grid"
            onClick={() => console.log('click grid 2')}
          />
          <IdeaCard
            idea={mkIdea({
              id: 'g3',
              title: 'Legal brief summarizer with cite-check',
              category: 'legal' as CategoryKey,
              score: 7.2,
            })}
            variant="grid"
            onClick={() => console.log('click grid 3')}
          />
        </div>
      </section>

      <section>
        <Kicker label="Anti-patterns rejected" />
        <ul className="mt-4 max-w-prose list-disc pl-5 text-body-sm text-ink-500">
          <li>No colored left border — category color lives only in the Tag dot.</li>
          <li>No &ldquo;Read more →&rdquo; affordance — the entire card is the click target.</li>
          <li>Score is never a badge, bar, or corner pill — always ScoreDial, except compact&apos;s inline numeral.</li>
          <li>Title is always Fraunces 500 — never Inter.</li>
          <li>Hover shifts background only — no lift, scale, or shadow.</li>
        </ul>
      </section>
    </main>
  )
}
