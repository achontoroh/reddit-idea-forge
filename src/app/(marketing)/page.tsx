import Link from 'next/link'
import { Button } from '@/components/ui/button'

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

function AuthCta() {
  return (
    <div className="flex items-center justify-center gap-4">
      <Link href="/register">
        <Button size="lg" className="rounded-full px-8">
          Sign up
        </Button>
      </Link>
      <Link
        href="/login"
        className="text-sm font-medium text-on-surface-muted hover:text-on-surface transition-colors"
      >
        Log in
      </Link>
    </div>
  )
}

export default function LandingPage() {
  return (
    <>
      <section className="pt-12 pb-32 text-center px-6">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-[3.5rem] font-bold font-heading tracking-[-0.02em] leading-tight text-on-surface mb-6">
            Discover your next SaaS idea
          </h1>
          <p className="text-lg text-on-surface-muted max-w-xl mx-auto mb-10">
            Stop guessing what people want. We analyze market gaps and high-intent signals to
            deliver validated opportunities directly to your inbox.
          </p>
          <AuthCta />
        </div>
      </section>

      <section className="px-6 pb-32">
        <div className="mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="flex flex-col items-start text-left p-8 rounded-xl bg-surface-lowest"
            >
              <div className="text-4xl font-bold text-accent mb-4 font-heading">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-on-surface mb-2 font-heading">
                {step.title}
              </h3>
              <p className="text-on-surface-muted text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-32">
        <div className="mx-auto max-w-4xl py-20 rounded-[2.5rem] bg-surface-highest/30 flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold text-on-surface mb-10 font-heading">
            Ready to build?
          </h2>
          <AuthCta />
        </div>
      </section>
    </>
  )
}
