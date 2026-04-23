'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Kicker } from '@/components/ui/kicker'
import { Toggle } from '@/components/ui/toggle'
import { SettingsHead } from '@/components/features/settings-head'
import { SettingsRow } from '@/components/features/settings-row'
import {
  SettingsShell,
  type SettingsTab,
} from '@/components/features/settings-shell'

const TABS: SettingsTab[] = [
  { key: 'profile', label: 'Profile', href: '/dev/design-system/settings' },
  {
    key: 'subscription',
    label: 'Subscription',
    href: '/dev/design-system/settings',
  },
  {
    key: 'newsletter',
    label: 'Newsletter',
    href: '/dev/design-system/settings',
  },
  {
    key: 'appearance',
    label: 'Appearance',
    href: '/dev/design-system/settings',
  },
  { key: 'account', label: 'Account', href: '/dev/design-system/settings' },
]

const SAMPLE_USER = {
  email: 'yaroslav@ideaforge.dev',
}

export function SettingsPreview() {
  const [displayName, setDisplayName] = useState('Yaroslav')
  const [senderEmail, setSenderEmail] = useState('digest@ideaforge.dev')
  const [weeklyDigest, setWeeklyDigest] = useState(true)
  const [dailyPing, setDailyPing] = useState(false)
  const [manifesto, setManifesto] = useState(false)

  return (
    <div>
      {/* ── INTRO ─────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-5xl px-6 pt-16 pb-10">
        <header className="mb-4">
          <Kicker number={133} label="Design System" />
          <h1 className="mt-3 font-serif text-h1 text-ink-900">
            Settings primitives
          </h1>
          <p className="mt-4 max-w-prose text-body text-ink-500">
            The three layout primitives that structure every page under{' '}
            <code>/settings/*</code>. <strong>SettingsShell</strong> hosts the
            side-tab navigation and content pane. <strong>SettingsHead</strong>{' '}
            opens a section with a kicker, an editorial h2, and the strong
            section-break rule. <strong>SettingsRow</strong> lines up label and
            control on a fixed 240px / 1fr / auto grid.
          </p>
        </header>
      </main>

      {/* ── SHELL — full-width (escapes the preview container) ───── */}
      <section className="mb-20">
        <div className="mx-auto max-w-5xl px-6 mb-4">
          <Kicker label="SettingsShell — Profile tab active" />
          <p className="mt-3 max-w-prose text-body-sm text-ink-500">
            Header on top (breadcrumb <code>SETTINGS / Profile</code>), 260px
            side tabs on the left (mono-caps kicker then tab rows), content
            column with <code>48px 56px</code> padding. Below{' '}
            <code>768px</code> the tabs collapse to a horizontal scrollable
            strip above the content. The active tab is filled{' '}
            <code>--ink-900</code> with <code>--ink-paper</code> text and an
            accent <code>•</code> on the right.
          </p>
        </div>

        <div className="border-t border-b border-ink-200 bg-ink-paper">
          <SettingsShell tabs={TABS} activeTab="profile" user={SAMPLE_USER}>
            <SettingsHead
              kicker="01 · Profile"
              title={
                <>
                  Your <span className="italic-accent">profile.</span>
                </>
              }
              lede="A handful of fields that show up in exported briefs and the weekly digest. Changes save immediately."
            />

            <SettingsRow
              label="Display name"
              description="Shown in exported briefs."
              control={
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  style={{ width: '280px' }}
                />
              }
            />
            <SettingsRow
              label="Email"
              description="Verification required on change."
              control={
                <Input
                  type="email"
                  defaultValue={SAMPLE_USER.email}
                  style={{ width: '280px' }}
                />
              }
            />
            <SettingsRow
              label="Weekly digest"
              description="Sent Sunday 06:00 in your timezone."
              control={
                <Toggle on={weeklyDigest} onChange={setWeeklyDigest} />
              }
            />
            <SettingsRow
              label="Cancel plan"
              description="Immediate downgrade to Free."
              control={
                <Button intent="danger" size="sm">
                  Cancel plan
                </Button>
              }
              last
            />
          </SettingsShell>
        </div>
      </section>

      {/* ── SettingsHead variants ─────────────────────────────────── */}
      <main className="mx-auto max-w-5xl px-6 mb-20">
        <Kicker label="SettingsHead — variants" />
        <p className="mt-3 mb-6 max-w-prose text-body-sm text-ink-500">
          Kicker (mono-caps) + Fraunces <code>h2</code> title + optional lede.
          Titles accept one <code>italic-accent</code> span for the
          one-italic-word pattern. The block ends with a strong{' '}
          <code>1px --ink-900</code> editorial rule.
        </p>

        <div className="rounded-sm border border-ink-200 p-8">
          <SettingsHead
            kicker="02 · Subscription"
            title={
              <>
                Your <span className="italic-accent">plan.</span>
              </>
            }
            lede="Free for as long as you like. Upgrade when the weekly digest is doing real work for you."
          />
        </div>

        <div className="mt-8 rounded-sm border border-ink-200 p-8">
          <SettingsHead
            kicker="03 · Newsletter"
            title="Delivery preferences"
          />
        </div>
      </main>

      {/* ── SettingsRow variants ──────────────────────────────────── */}
      <main className="mx-auto max-w-5xl px-6 mb-20">
        <Kicker label="SettingsRow — control variants" />
        <p className="mt-3 mb-6 max-w-prose text-body-sm text-ink-500">
          3-column grid: 240px label (with optional 12.5px description) / 1fr
          spacer / auto right-aligned control. Each row has a hairline bottom
          border; <code>last={'{true}'}</code> omits it on the final row of a
          group.
        </p>

        <div className="rounded-sm border border-ink-200 px-6">
          <SettingsRow
            label="Display name"
            description="Shown in exported briefs."
            control={
              <Input
                defaultValue="Yaroslav"
                style={{ width: '280px' }}
              />
            }
          />
          <SettingsRow
            label="Daily ping"
            description="Email when a new idea crosses your threshold."
            control={<Toggle on={dailyPing} onChange={setDailyPing} />}
          />
          <SettingsRow
            label="Manifesto essays"
            description="Occasional long-form pieces from the team."
            control={<Toggle on={manifesto} onChange={setManifesto} />}
          />
          <SettingsRow
            label="Sender email"
            control={
              <Input
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                style={{ width: '280px' }}
              />
            }
          />
          <SettingsRow
            label="Export data"
            description="Download everything we have on you as JSON."
            control={
              <Button intent="secondary" size="sm">
                Export
              </Button>
            }
            last
          />
        </div>
      </main>
    </div>
  )
}
