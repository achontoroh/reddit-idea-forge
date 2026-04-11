'use client'

import { type FC } from 'react'

export const Footer: FC = () => {
  return (
    <footer className="py-8 text-center text-sm text-on-surface-muted">
      &copy; {new Date().getFullYear()} IdeaForge. All rights reserved.
    </footer>
  )
}
