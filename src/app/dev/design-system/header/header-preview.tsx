import { Kicker } from '@/components/ui/kicker'
import { Header } from '@/components/features/header'

export function HeaderPreview() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-12">
        <Kicker number={132} label="Design System" />
        <h1 className="mt-3 font-serif text-h1 text-ink-900">Header</h1>
        <p className="mt-4 max-w-prose text-body text-ink-500">
          The global nav bar. 63px, hairline bottom, flat. Not sticky — the
          header scrolls away with the page. Wordmark left, optional
          breadcrumb, avatar or &ldquo;Sign in&rdquo; right.
        </p>
      </header>

      <section className="mb-16">
        <Kicker label="Logged out" />
        <p className="mt-3 max-w-prose text-body-sm text-ink-500">
          No <code>user</code> prop. Right cluster is a ghost &ldquo;Sign
          in&rdquo; button linking to <code>/login</code>. Wordmark links to{' '}
          <code>/</code>.
        </p>
        <div className="mt-6 border border-ink-200">
          <Header />
        </div>
      </section>

      <section className="mb-16">
        <Kicker label="Logged in — no avatar image" />
        <p className="mt-3 max-w-prose text-body-sm text-ink-500">
          User present, <code>avatarUrl</code> absent. Email + 30×30 Glyph
          tile on <code>--ink-900</code> background. Wordmark links to{' '}
          <code>/dashboard</code>.
        </p>
        <div className="mt-6 border border-ink-200">
          <Header user={{ email: 'yaroslav@ideaforge.dev' }} />
        </div>
      </section>

      <section className="mb-16">
        <Kicker label="Logged in — with avatar image" />
        <p className="mt-3 max-w-prose text-body-sm text-ink-500">
          Avatar renders the user&rsquo;s uploaded image instead of the Glyph
          fallback.
        </p>
        <div className="mt-6 border border-ink-200">
          <Header
            user={{
              email: 'yaroslav@ideaforge.dev',
              avatarUrl:
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&h=60&fit=crop&auto=format',
            }}
          />
        </div>
      </section>

      <section className="mb-16">
        <Kicker label="With breadcrumb" />
        <p className="mt-3 max-w-prose text-body-sm text-ink-500">
          Breadcrumb slot renders <code>/</code> separators in{' '}
          <code>--ink-400</code> and section names in mono-caps 12.5px. Hidden
          below the <code>md</code> breakpoint.
        </p>
        <div className="mt-6 border border-ink-200">
          <Header
            user={{ email: 'yaroslav@ideaforge.dev' }}
            breadcrumb={[
              { label: 'Settings', href: '/dashboard/settings' },
              { label: 'Profile' },
            ]}
          />
        </div>
      </section>
    </main>
  )
}
