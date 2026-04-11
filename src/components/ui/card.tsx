import { type FC } from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
  modal?: boolean
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
  onClick,
}) => {
  return (
    <div
      className={`rounded-lg bg-surface-lowest ${modal ? 'shadow-modal' : ''} ${paddingClasses[padding]} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
