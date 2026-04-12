import Link from 'next/link'

export default function UnsubscribeSuccessPage() {
  return (
    <div className="flex min-h-screen min-h-dvh items-center justify-center px-4">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-on-surface">You&apos;ve been unsubscribed</h1>
        <p className="mt-2 text-on-surface-muted">
          You won&apos;t receive any more digest emails from IdeaForge.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block text-sm font-medium text-primary hover:text-primary-hover"
        >
          &larr; Back to IdeaForge
        </Link>
      </div>
    </div>
  )
}
