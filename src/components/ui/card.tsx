import { type FC } from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
  modal?: boolean
  elevated?: boolean
  onClick?: () => void
}

const paddingClasses: Record<NonNullable<CardProps['padding']>, string> = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
}

export const Card: FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  modal = false,
  elevated = false,
  onClick,
}) => {
  const shadow = modal
    ? 'shadow-modal'
    : elevated
      ? 'shadow-md hover:shadow-lg'
      : ''

  return (
    <div
      className={`rounded-lg bg-surface-lowest transition-shadow ${shadow} ${paddingClasses[padding]} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
