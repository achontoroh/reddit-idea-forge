import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ScoreBadge } from '@/components/ui/score-badge'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { CATEGORIES } from '@/config/categories'

const STEPS = [
  {
    number: '01',
    title: 'Reddit scans',
    description:
      'Our engine monitors thousands of subreddits to find recurring pain points and feature requests.',
  },
  {
    number: '02',
    title: 'AI scores ideas',
    description:
      'Advanced models evaluate difficulty, market size, and monetization potential for every signal.',
  },
  {
    number: '03',
    title: 'You get notified',
    description:
      'Receive a weekly digest of high-probability ideas that you can start building today.',
  },
]

const STATS = [
  { value: '500+', label: 'Ideas Generated' },
  { value: '30+', label: 'Subreddits Scanned' },
  { value: '8', label: 'Categories Covered' },
]

function AuthCta() {
  return (
    <div className="flex items-center justify-center gap-4">
      <Link href="/register">
        <Button size="md" className="rounded-full px-8">
          Sign up
        </Button>
      </Link>
      <Link
        href="/login"
        className="text-sm font-medium text-ink-400 hover:text-ink-900 transition-colors"
      >
        Log in
      </Link>
    </div>
  )
}

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-12 pb-32 text-center px-6">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-[3.5rem] font-bold font-serif tracking-[-0.02em] leading-tight text-ink-900 mb-6">
            Discover your next SaaS idea
          </h1>
          <p className="text-lg text-ink-400 max-w-xl mx-auto mb-10">
            Stop guessing what people want. We analyze market gaps and high-intent signals to
            deliver validated opportunities directly to your inbox.
          </p>
          <AuthCta />
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 pb-32">
        <div className="mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((step) => (
            <Card key={step.number} padding="lg" elevated className="flex flex-col items-start text-left p-8">
              <div className="text-4xl font-bold text-accent mb-4 font-serif">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-ink-900 mb-2 font-serif">
                {step.title}
              </h3>
              <p className="text-ink-400 text-sm leading-relaxed">{step.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-ink-paper-2 py-12 mb-32">
        <div className="mx-auto max-w-4xl flex flex-col md:flex-row items-center justify-center md:divide-x md:divide-ink-200">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center px-12 py-4 md:py-0">
              <span className="text-4xl font-bold font-serif text-accent">{stat.value}</span>
              <span className="text-sm text-ink-400 mt-1">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Category Preview Grid */}
      <section className="px-6 pb-32">
        <div className="mx-auto max-w-4xl text-center mb-12">
          <h2 className="text-3xl font-bold text-ink-900 font-serif mb-3">
            Browse Ideas By Category
          </h2>
          <p className="text-ink-400">Choose what matches your interests</p>
        </div>
        <div className="mx-auto max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <Card
              key={cat.slug}
              padding="lg"
              elevated
              className="flex flex-col items-center gap-2 transition-all duration-200 hover:-translate-y-1"
            >
              <span className="text-4xl">{cat.icon}</span>
              <span className="text-sm font-semibold text-ink-900 font-serif">
                {cat.name}
              </span>
              <span className="text-xs text-ink-400">
                {cat.subreddits.length} subreddits
              </span>
            </Card>
          ))}
        </div>
      </section>

      {/* Sample Idea Card */}
      <section className="px-6 pb-32">
        <div className="mx-auto max-w-2xl text-center mb-8">
          <h2 className="text-3xl font-bold text-ink-900 font-serif mb-3">
            Here&apos;s what you&apos;ll discover
          </h2>
        </div>
        <div className="mx-auto max-w-2xl">
          <p className="text-xs text-ink-400 uppercase tracking-widest mb-3 font-medium">
            Live example from the feed
          </p>
          <Card padding="lg" elevated className="space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <Badge variant="info">🛠️ DevTools</Badge>
              <ScoreBadge score={84} variant="full" />
            </div>
            <h3 className="text-lg font-bold text-ink-900 font-serif leading-snug">
              DebugFlow — Request tracing middleware for Next.js
            </h3>
            <p className="text-sm text-ink-400 leading-relaxed">
              Next.js developers spend hours manually logging middleware chains. DebugFlow adds
              visual request tracing with zero config — just install and see every request flow in
              real time.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge>mvp_complexity: Low</Badge>
              <Badge>monetization: Subscription</Badge>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-ink-200/50">
              <span className="text-xs text-ink-400">r/webdev · 342 upvotes</span>
              <div className="flex gap-2">
                <Button intent="ghost" size="sm" disabled>
                  ↑ Upvote
                </Button>
                <Button intent="ghost" size="sm" disabled>
                  ♡ Save
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 pb-32">
        <div className="mx-auto max-w-4xl py-20 rounded-[2.5rem] bg-ink-100/30 flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold text-ink-900 mb-10 font-serif">
            Ready to build?
          </h2>
          <AuthCta />
        </div>
      </section>
    </>
  )
}
