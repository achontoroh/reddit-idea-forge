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
        className="block text-sm font-medium text-ink-900 mb-1"
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
            block w-full rounded-lg border px-3 py-2 text-base md:text-sm
            placeholder:text-ink-400
            focus:outline-none focus:ring-2 focus:ring-offset-1
            disabled:cursor-not-allowed disabled:bg-ink-100 disabled:text-ink-300
            ${suffix ? 'pr-10' : ''}
            ${error
              ? 'border-danger/50 text-danger focus:border-danger focus:ring-danger/30'
              : 'border-transparent bg-ink-paper-2 text-ink-900 focus:border-accent/30 focus:ring-accent/30'
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
        <p id={`${id}-error`} className="mt-1 text-sm text-danger" role="alert">
          {error}
        </p>
      )}
      {!error && hint && (
        <p className="mt-1 text-xs text-ink-400">{hint}</p>
      )}
    </div>
  )
}
