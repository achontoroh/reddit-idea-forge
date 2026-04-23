import { type FC } from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
}

const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-ink-paper-2 text-ink-900',
  success: 'bg-signal-high/10 text-signal-high',
  warning: 'bg-signal-mid/10 text-signal-mid',
  danger: 'bg-danger/10 text-danger',
  info: 'bg-accent/10 text-accent',
}

export const Badge: FC<BadgeProps> = ({ children, variant = 'default' }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]}`}
    >
      {children}
    </span>
  )
}
