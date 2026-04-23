'use client'

import { type FC, type ButtonHTMLAttributes, type ReactNode, useEffect } from 'react'
import { Spinner } from './spinner'

type ButtonIntent = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md'

interface ButtonProps
  extends Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onClick' | 'aria-label'> {
  children: ReactNode
  intent?: ButtonIntent
  size?: ButtonSize
  trailingIcon?: boolean
  accent?: boolean
  disabled?: boolean
  loading?: boolean
  className?: string
}

let accentMountedCount = 0

export const Button: FC<ButtonProps> = ({
  children,
  intent = 'primary',
  size = 'md',
  trailingIcon = false,
  accent = false,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className,
  'aria-label': ariaLabel,
}) => {
  useEffect(() => {
    if (!accent) return
    accentMountedCount += 1
    if (process.env.NODE_ENV !== 'production' && accentMountedCount > 1) {
      // Single-accent rule: only one accent button per viewport (see docs/design/components.md §Button).
      console.warn(
        `[ideaforge] ${accentMountedCount} accent buttons mounted simultaneously — only one is allowed per viewport.`,
      )
    }
    return () => {
      accentMountedCount -= 1
    }
  }, [accent])

  const isDisabled = disabled || loading

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={ariaLabel}
      data-intent={intent}
      data-size={size}
      data-accent={accent ? 'true' : undefined}
      className={className ? `btn ${className}` : 'btn'}
    >
      {loading && <Spinner size="sm" />}
      <span className="btn-label">
        {children}
        {trailingIcon && <span aria-hidden="true">{' →'}</span>}
      </span>
    </button>
  )
}
