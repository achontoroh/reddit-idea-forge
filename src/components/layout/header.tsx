'use client'

import { type FC } from 'react'
import Link from 'next/link'
import { LogoutButton } from '@/components/auth/logout-button'

interface HeaderProps {
  email?: string
}

export const Header: FC<HeaderProps> = ({ email }) => {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <span className="text-lg font-bold text-indigo-600">IdeaForge</span>
        {email && (
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-gray-500 sm:inline">{email}</span>
            <Link
              href="/dashboard/settings"
              className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
            >
              Settings
            </Link>
            <LogoutButton />
          </div>
        )}
      </div>
    </header>
  )
}
