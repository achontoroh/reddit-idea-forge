'use client'

import { type FC } from 'react'

export const Footer: FC = () => {
  return (
    <footer className="border-t border-gray-200 py-8 text-center text-sm text-gray-500">
      &copy; {new Date().getFullYear()} IdeaForge. All rights reserved.
    </footer>
  )
}
