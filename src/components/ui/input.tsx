'use client'

import { type FC, useId } from 'react'

interface InputProps {
  label: string
  placeholder?: string
  type?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  disabled?: boolean
  className?: string
}

export const Input: FC<InputProps> = ({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  disabled = false,
  className = '',
}) => {
  const id = useId()

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`
          block w-full rounded-lg border px-3 py-2 text-sm
          placeholder:text-gray-400
          focus:outline-none focus:ring-2 focus:ring-offset-1
          disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500
          ${error
            ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500'
          }
        `}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
