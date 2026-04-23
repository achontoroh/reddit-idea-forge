'use client'

import { useEffect, useState } from 'react'
import { Kicker } from '@/components/ui/kicker'
import { ScoreDial, type ScoreDialSize } from '@/components/ui/score-dial'

const SIZES: ScoreDialSize[] = ['sm', 'md', 'lg']
const EDGE_VALUES = [0, 5.5, 6.0, 7.9, 8.0, 9.1, 10] as const

type AssertionResult = { pass: boolean; failures: string[] }

/**
 * Runtime assertions — verify the three hard contracts for ScoreDial
 * directly against the rendered DOM. Mirrors the pattern used by the Tag
 * preview page (IF-128). The project has no Jest/Vitest setup, so this is
 * how we enforce the acceptance criteria listed in the ticket.
 */
function runAssertions(): AssertionResult {
  if (typeof window === 'undefined') return { pass: true, failures: [] }
  const failures: string[] = []
  const assertedColor = (cssVar: string): string => {
    const hex = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim()
    if (!hex) return ''
    // Normalise to rgb(...) for comparison with getComputedStyle output.
    const probe = document.createElement('span')
    probe.style.color = hex
    document.body.appendChild(probe)
    const rgb = getComputedStyle(probe).color
    probe.remove()
    return rgb
  }

  const cases: Array<{ selector: string; expectVar: string; label: string }> = [
    {
      selector: '[data-assert="high-8.0"] [data-score-dial-indicator]',
      expectVar: '--signal-high',
      label: 'value 8.0 → --signal-high',
    },
    {
      selector: '[data-assert="mid-7.9"] [data-score-dial-indicator]',
      expectVar: '--signal-mid',
      label: 'value 7.9 → --signal-mid',
    },
    {
      selector: '[data-assert="low-5.9"] [data-score-dial-indicator]',
      expectVar: '--signal-low',
      label: 'value 5.9 → --signal-low',
    },
  ]

  for (const { selector, expectVar, label } of cases) {
    const el = document.querySelector<SVGElement>(selector)
    if (!el) {
      failures.push(`${label}: element not found (${selector})`)
      continue
    }
    const actual = getComputedStyle(el).stroke
    const expected = assertedColor(expectVar)
    if (actual !== expected) {
      failures.push(`${label}: expected stroke ${expected} (${expectVar}), got ${actual}`)
    }
  }

  const numeral = document.querySelector<HTMLElement>('[data-assert="mid-7.9"] [data-score-dial-numeral]')
  const denom = document.querySelector<HTMLElement>('[data-assert="mid-7.9"] [data-score-dial-denom]')
  if (!numeral || !denom) {
    failures.push('numeral/denom elements not found')
  } else {
    const numeralFont = getComputedStyle(numeral).fontFamily
    const denomFont = getComputedStyle(denom).fontFamily
    if (!/Fraunces/i.test(numeralFont)) {
      failures.push(`numeral font-family expected to include "Fraunces", got ${numeralFont}`)
    }
    if (!/Instrument Serif/i.test(denomFont)) {
      failures.push(`denominator font-family expected to include "Instrument Serif", got ${denomFont}`)
    }
    if (getComputedStyle(denom).fontStyle !== 'italic') {
      failures.push(`denominator font-style expected "italic", got ${getComputedStyle(denom).fontStyle}`)
    }
  }

  return { pass: failures.length === 0, failures }
}

export function ScoreDialPreview() {
  const [assertion, setAssertion] = useState<AssertionResult | null>(null)

  useEffect(() => {
    // Wait one frame so fonts + SVG paint before we read computed styles.
    const raf = requestAnimationFrame(() => setAssertion(runAssertions()))
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-12">
        <Kicker number={130} label="Design System" />
        <h1 className="mt-3 font-serif text-h1 text-ink-900">ScoreDial</h1>
        <p className="mt-4 max-w-prose text-body text-ink-500">
          A 0–10 score rendered as deliberate typography — Fraunces 700 numeral inside a
          2px SVG ring, with Instrument Serif italic <code>/10</code> immediately after.
          Replaces every progress bar in the app. Three sizes: <code>sm</code> (list cards),{' '}
          <code>md</code> (featured card), <code>lg</code> (detail page hero).
        </p>
      </header>

      {/* Visual assertion bar — enforces ring color thresholds and typeface contracts. */}
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
              ? 'Running ScoreDial contract assertions…'
              : assertion.pass
                ? 'Pass — color thresholds (8.0/7.9/5.9) and numeral/denom typefaces match spec'
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
        {/* Hidden dials used solely for assertions — animate=false so the test reads
            the final stroke color on first paint without waiting for the 900ms fill. */}
        <div
          aria-hidden="true"
          style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}
        >
          <div data-assert="high-8.0">
            <ScoreDial value={8.0} size="md" animate={false} />
          </div>
          <div data-assert="mid-7.9">
            <ScoreDial value={7.9} size="md" animate={false} />
          </div>
          <div data-assert="low-5.9">
            <ScoreDial value={5.9} size="md" animate={false} />
          </div>
        </div>
      </section>

      <section className="mb-16">
        <Kicker label="Sizes × edge-case values — animated on mount" />
        <div className="mt-6 overflow-hidden rounded-sm border border-ink-100">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-ink-100 bg-ink-paper-2 text-left">
                <th className="px-4 py-3 font-mono text-tag uppercase tracking-[0.12em] text-ink-500">
                  Size
                </th>
                {EDGE_VALUES.map((v) => (
                  <th
                    key={v}
                    className="px-4 py-3 text-center font-mono text-tag uppercase tracking-[0.12em] text-ink-500"
                  >
                    {v.toFixed(1)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SIZES.map((s) => (
                <tr key={s} className="border-b border-ink-100 last:border-b-0">
                  <td className="px-4 py-6 align-middle font-mono text-meta uppercase tracking-[0.12em] text-ink-700">
                    {s}
                  </td>
                  {EDGE_VALUES.map((v) => (
                    <td key={`${s}-${v}`} className="px-4 py-6 text-center align-middle">
                      <div className="inline-flex justify-center">
                        <ScoreDial value={v} size={s} />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-16">
        <Kicker label="With label — mono-caps kicker above the dial" />
        <div className="mt-6 flex flex-wrap items-start gap-12">
          <ScoreDial value={8.4} size="sm" label="Signal" />
          <ScoreDial value={8.4} size="md" label="Signal" />
          <ScoreDial value={8.4} size="lg" label="Signal" />
        </div>
      </section>

      <section>
        <Kicker label="animate=false — final state on first paint, no transition" />
        <div className="mt-6 flex flex-wrap items-start gap-12">
          <ScoreDial value={0} size="md" animate={false} />
          <ScoreDial value={5.5} size="md" animate={false} />
          <ScoreDial value={7.9} size="md" animate={false} />
          <ScoreDial value={8.0} size="md" animate={false} />
          <ScoreDial value={10} size="md" animate={false} />
        </div>
        <p className="mt-6 max-w-prose text-body-sm text-ink-500">
          Users with <code>prefers-reduced-motion: reduce</code> see the same instant final
          state, enforced by the global <code>--dur-dial: 0ms</code> override in{' '}
          <code>tokens.css</code> plus a JS guard in the component.
        </p>
      </section>
    </main>
  )
}
