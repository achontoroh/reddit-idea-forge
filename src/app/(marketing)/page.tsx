import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const VALUE_PROPS = [
  {
    icon: '\uD83D\uDD0D',
    title: 'Reddit-powered signals',
    description: 'Pain points extracted from real user discussions across thousands of communities',
  },
  {
    icon: '\uD83E\uDD16',
    title: 'AI-scored ideas',
    description: 'Each idea rated 0\u2013100 across pain intensity, market size, and competition',
  },
  {
    icon: '\uD83D\uDCE7',
    title: 'Email alerts',
    description: 'Subscribe to get fresh ideas in your chosen categories delivered daily',
  },
]

const STEPS = [
  {
    number: 1,
    title: 'We scan Reddit',
    description: 'Our system monitors relevant subreddits for recurring pain points and complaints',
  },
  {
    number: 2,
    title: 'AI generates ideas',
    description: 'Claude analyzes patterns and generates actionable product ideas with detailed scoring',
  },
  {
    number: 3,
    title: 'You take action',
    description: 'Browse the feed, filter by score, and subscribe for email alerts in your categories',
  },
]

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-indigo-50 to-white py-24 text-center">
        <div className="mx-auto max-w-5xl px-4">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Reddit pain points &rarr; product ideas
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 md:text-xl">
            AI scans Reddit for real problems and generates scored startup ideas for you
          </p>
          <div className="mt-8">
            <Link href="/register">
              <Button size="lg">Get started &mdash; it&apos;s free</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {VALUE_PROPS.map((prop) => (
              <Card key={prop.title} padding="lg">
                <div className="text-3xl">{prop.icon}</div>
                <h3 className="mt-3 text-lg font-semibold text-gray-900">{prop.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{prop.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">How it works</h2>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.number} className="flex flex-col items-center text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">
                  {step.number}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-indigo-600 py-16 text-center">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-3xl font-bold text-white">Find your next product idea today</h2>
          <div className="mt-8">
            <Link href="/register">
              <Button
                variant="secondary"
                size="lg"
                className="border-white bg-white text-indigo-600 hover:bg-indigo-50"
              >
                Get started &mdash; it&apos;s free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
