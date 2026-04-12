'use client'

import { type FC, type ReactNode } from 'react'
import Link from 'next/link'

interface NavbarProps {
  logoHref?: string
  children?: ReactNode
}

export const Navbar: FC<NavbarProps> = ({ logoHref = '/dashboard', children }) => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[rgba(255,255,255,0.8)] dark:bg-[rgba(15,23,42,0.8)] backdrop-blur-[12px] dark:backdrop-blur-[24px] shadow-modal">
      <div className="flex justify-between items-center px-6 md:px-8 h-16 w-full max-w-screen-2xl mx-auto">
        <Link href={logoHref}>
          {/* eslint-disable-next-line @next/next/no-img-element -- SVG, no optimization needed */}
          <img
            src="/ideaforge-logo-horizontal.svg"
            alt="IdeaForge"
            width={140}
            height={31}
          />
        </Link>
        <div className="flex items-center gap-3">
          {children}
        </div>
      </div>
    </nav>
  )
}
