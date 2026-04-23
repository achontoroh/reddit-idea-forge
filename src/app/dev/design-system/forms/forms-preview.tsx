'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Toggle } from '@/components/ui/toggle'
import { Kicker } from '@/components/ui/kicker'

export function FormsPreview() {
  const [displayName, setDisplayName] = useState('Yaroslav')
  const [email, setEmail] = useState('')
  const [bio, setBio] = useState(
    'Writing about product, systems, and the small things that compound.',
  )

  const [dailyPing, setDailyPing] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(false)
  const [density, setDensity] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  const emailError =
    email.length > 0 && !email.includes('@') ? 'Email is required.' : undefined

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-12">
        <Kicker number={129} label="Design System" />
        <h1 className="mt-3 font-serif text-h1 text-ink-900">Forms &amp; Toggle</h1>
        <p className="mt-4 max-w-prose text-body text-ink-500">
          Input, Textarea, and Toggle — the three form primitives used across auth,
          onboarding, and settings. Labels render as mono-caps kickers; focus paints
          the accent border + halo; errors name the field per{' '}
          <code>voice.md §6</code>.
        </p>
      </header>

      <section className="mb-16">
        <Kicker label="Form primitives — Input" />
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            label="Display name"
            placeholder="Yaroslav"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            hint="Shown in exported briefs."
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
          />
          <Input label="Password" type="password" placeholder="••••••••" />
          <Input
            label="Website"
            type="url"
            placeholder="https://example.com"
            defaultValue="https://ideaforge.dev"
          />
          <Input
            label="Disabled field"
            placeholder="Read-only"
            defaultValue="Read-only"
            disabled
          />
          <Input
            label="Error (hint hidden)"
            placeholder="you@example.com"
            hint="This hint should disappear when there's an error."
            error="Email is required."
          />
        </div>
      </section>

      <section className="mb-16">
        <Kicker label="Form primitives — Textarea" />
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Textarea
            label="Short bio"
            placeholder="One sentence on what you work on."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            hint="Up to 240 characters."
            rows={4}
          />
          <Textarea
            label="Notes"
            placeholder="What are you noticing?"
            error="Notes is required."
            rows={4}
          />
        </div>
      </section>

      <section className="mb-16">
        <Kicker label="Toggle — on/off with paired mono-caps label" />
        <div className="mt-6 overflow-hidden rounded-sm border border-ink-100">
          <ToggleRow
            title="Daily ping"
            description="Email me when the daily signal crosses 8.0."
          >
            <Toggle on={dailyPing} onChange={setDailyPing} ariaLabel="Daily ping" />
          </ToggleRow>
          <ToggleRow
            title="Weekly digest"
            description="Saturday mornings. Three ideas, one note."
          >
            <Toggle
              on={weeklyDigest}
              onChange={setWeeklyDigest}
              ariaLabel="Weekly digest"
            />
          </ToggleRow>
          <ToggleRow
            title="Compact density"
            description="Tighter idea cards. Reduces padding by 20%."
          >
            <Toggle on={density} onChange={setDensity} ariaLabel="Compact density" />
          </ToggleRow>
          <ToggleRow
            title="Reduce motion"
            description="Disables dial, chip, and page transitions."
            last
          >
            <Toggle
              on={reduceMotion}
              onChange={setReduceMotion}
              ariaLabel="Reduce motion"
            />
          </ToggleRow>
        </div>
        <div className="mt-6 font-mono text-meta text-ink-500">
          role=&quot;switch&quot; · aria-checked reflects `on` · knob animates via{' '}
          <code>left</code> over <code>--dur-fast</code>
        </div>
      </section>
    </main>
  )
}

function ToggleRow({
  title,
  description,
  children,
  last = false,
}: {
  title: string
  description: string
  children: React.ReactNode
  last?: boolean
}) {
  return (
    <div
      className={`grid grid-cols-[1fr_auto] items-center gap-6 px-5 py-4 ${last ? '' : 'border-b border-ink-100'}`}
    >
      <div>
        <div className="font-serif text-[17px] font-medium text-ink-900">{title}</div>
        <div className="mt-1 text-body-sm text-ink-600">{description}</div>
      </div>
      {children}
    </div>
  )
}
