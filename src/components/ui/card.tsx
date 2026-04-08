import { type FC } from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
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
}) => {
  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white ${paddingClasses[padding]} ${className}`}
    >
      {children}
    </div>
  )
}
