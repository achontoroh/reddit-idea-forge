import { type FC } from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
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
  onClick,
}) => {
  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white ${paddingClasses[padding]} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
