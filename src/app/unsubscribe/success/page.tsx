import Link from 'next/link'

export default function UnsubscribeSuccessPage() {
  return (
    <div className="flex min-h-screen min-h-dvh items-center justify-center px-4">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-signal-high/10">
          <svg
            className="h-8 w-8 text-signal-high"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-ink-900">You&apos;ve been unsubscribed</h1>
        <p className="mt-2 text-ink-400">
          You won&apos;t receive any more digest emails from IdeaForge.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block text-sm font-medium text-accent hover:text-accent"
        >
          &larr; Back to IdeaForge
        </Link>
      </div>
    </div>
  )
}
