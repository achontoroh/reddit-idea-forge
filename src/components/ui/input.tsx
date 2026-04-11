'use client'

import { type FC, useId } from 'react'

interface InputProps {
  label: string
  placeholder?: string
  type?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  error?: string
  hint?: string
  suffix?: React.ReactNode
  disabled?: boolean
  className?: string
}

export const Input: FC<InputProps> = ({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  hint,
  suffix,
  disabled = false,
  className = '',
}) => {
  const id = useId()

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-on-surface mb-1"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          disabled={disabled}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`
            block w-full rounded-lg border px-3 py-2 text-sm
            placeholder:text-on-surface-muted
            focus:outline-none focus:ring-2 focus:ring-offset-1
            disabled:cursor-not-allowed disabled:bg-surface-low disabled:text-on-surface-muted
            ${suffix ? 'pr-10' : ''}
            ${error
              ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500'
              : 'border-transparent bg-surface-low text-on-surface focus:border-primary/30 focus:ring-primary/30'
            }
          `}
        />
        {suffix && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-2.5">
            {suffix}
          </div>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {!error && hint && (
        <p className="mt-1 text-xs text-on-surface-muted">{hint}</p>
      )}
    </div>
  )
}
