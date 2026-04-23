'use client'

import { useEffect, useMemo, useState } from 'react'
import { Kicker } from '@/components/ui/kicker'
import { InterestChip } from '@/components/ui/interest-chip'
import { Tag } from '@/components/ui/tag'
import { CATEGORY_KEYS, type CategoryKey } from '@/lib/design-system/categories'

type AssertionResult = { pass: boolean; failures: string[] }

function assertTagBackgroundsTransparent(): AssertionResult {
  if (typeof window === 'undefined') return { pass: true, failures: [] }
  const tags = document.querySelectorAll<HTMLElement>('.tag')
  const failures: string[] = []
  tags.forEach((el) => {
    const bg = window.getComputedStyle(el).backgroundColor
    // Transparent computes as `rgba(0, 0, 0, 0)` (or `transparent` in older engines).
    const isTransparent = bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent'
    if (!isTransparent) {
      const cat = el.getAttribute('data-category') ?? '(no category)'
      const active = el.getAttribute('data-active') === 'true'
      failures.push(`tag[category=${cat}, active=${active}] background = ${bg}`)
    }
  })
  return { pass: failures.length === 0, failures }
}

export function TagsPreview() {
  const [assertion, setAssertion] = useState<AssertionResult | null>(null)
  const [selected, setSelected] = useState<Set<CategoryKey>>(
    () => new Set<CategoryKey>(['prod', 'ai']),
  )

  useEffect(() => {
    const raf = requestAnimationFrame(() => setAssertion(assertTagBackgroundsTransparent()))
    return () => cancelAnimationFrame(raf)
  }, [])

  const sizes = useMemo(() => ['md', 'sm'] as const, [])

  const toggle = (key: CategoryKey) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-12">
        <Kicker number={128} label="Design System" />
        <h1 className="mt-3 font-serif text-h1 text-ink-900">Tag &amp; InterestChip</h1>
        <p className="mt-4 max-w-prose text-body text-ink-500">
          The editorial tag is flat text: a 6px colored dot plus a mono-caps label on a
          transparent background. The pill-shaped <code>InterestChip</code> is a separate
          component used only inside interest pickers.
        </p>
      </header>

      {/* Visual assertion — audit-enforced: `.tag` background must be transparent everywhere. */}
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
              ? 'Running transparent-background assertion…'
              : assertion.pass
                ? `Pass — every .tag computed background is transparent (${CATEGORY_KEYS.length * 4} rendered)`
                : `Fail — ${assertion.failures.length} tag(s) have a non-transparent background`}
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
        <Kicker label="Tags — all 16 categories × 2 sizes × 2 active states" />
        <div className="mt-6 overflow-hidden rounded-sm border border-ink-100">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-ink-100 bg-ink-paper-2 text-left">
                <th className="px-4 py-3 font-mono text-tag uppercase tracking-[0.12em] text-ink-500">
                  Category
                </th>
                {sizes.map((s) => (
                  <th
                    key={`${s}-default`}
                    className="px-4 py-3 font-mono text-tag uppercase tracking-[0.12em] text-ink-500"
                  >
                    {s} · default
                  </th>
                ))}
                {sizes.map((s) => (
                  <th
                    key={`${s}-active`}
                    className="px-4 py-3 font-mono text-tag uppercase tracking-[0.12em] text-ink-500"
                  >
                    {s} · active
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CATEGORY_KEYS.map((key) => (
                <tr key={key} className="border-b border-ink-100 last:border-b-0">
                  <td className="px-4 py-3 font-mono text-meta text-ink-500">{key}</td>
                  {sizes.map((s) => (
                    <td key={`${key}-${s}-default`} className="px-4 py-3">
                      <Tag category={key} size={s} />
                    </td>
                  ))}
                  {sizes.map((s) => (
                    <td key={`${key}-${s}-active`} className="px-4 py-3">
                      <Tag category={key} size={s} active />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <Kicker label="InterestChip — selected and unselected" />
        <p className="mt-3 max-w-prose text-body-sm text-ink-500">
          Click to toggle. <kbd>Enter</kbd> and <kbd>Space</kbd> also toggle when focused.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {CATEGORY_KEYS.map((key) => (
            <InterestChip
              key={key}
              category={key}
              selected={selected.has(key)}
              onToggle={() => toggle(key)}
            />
          ))}
        </div>
        <div className="mt-6 font-mono text-meta text-ink-500">
          aria-pressed reflects <code>selected</code> state · {selected.size} of{' '}
          {CATEGORY_KEYS.length} selected
        </div>
      </section>
    </main>
  )
}
