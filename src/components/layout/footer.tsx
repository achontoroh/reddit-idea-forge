import { type FC } from 'react'

export const Footer: FC = () => {
  return (
    <footer className="border-t border-ink-200/50 px-6 py-8">
      <div className="mx-auto max-w-4xl flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-ink-400">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/ideaforge-wordmark.svg"
          alt="IdeaForge"
          className="h-6 w-auto"
        />
        <span>&copy; 2026 IdeaForge. All rights reserved.</span>
      </div>
    </footer>
  )
}
