import { type FC } from 'react'
import Link from 'next/link'

interface BackLinkProps {
  href: string
  label?: string
}

export const BackLink: FC<BackLinkProps> = ({ href, label = 'Back to feed' }) => {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-primary hover:bg-primary/5 px-3 py-2 rounded-md transition-colors font-medium mb-8"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      <span>{label}</span>
    </Link>
  )
}
