'use client'

import { type FC, type ButtonHTMLAttributes } from 'react'
import { Spinner } from './spinner'

interface ButtonProps extends Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onClick'> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  className?: string
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-active focus-visible:ring-primary',
  secondary: 'bg-surface-highest text-primary hover:bg-surface-low focus-visible:ring-primary',
  ghost: 'text-primary hover:bg-surface-low focus-visible:ring-primary',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
}

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export const Button: FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
}) => {
  const isDisabled = disabled || loading

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center gap-2 rounded-md font-semibold font-heading cursor-pointer
        transition-colors duration-150
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-50
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  )
}
