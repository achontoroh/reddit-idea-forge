'use client'

import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
} from 'react'

type InputType = 'text' | 'email' | 'password' | 'number' | 'url'

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  type?: InputType
  label?: string
  hint?: string
  error?: string
  className?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    type = 'text',
    label,
    hint,
    error,
    className,
    disabled,
    id: idProp,
    ...rest
  },
  ref,
) {
  const generatedId = useId()
  const id = idProp ?? generatedId
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const resolvedState = error ? 'error' : disabled ? 'disabled' : 'default'

  return (
    <div className={className ? `input-field ${className}` : 'input-field'}>
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        type={type}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId ?? hintId}
        data-state={resolvedState}
        data-error={error ? 'true' : undefined}
        className="input"
        {...rest}
      />
      {error ? (
        <p id={errorId} className="input-error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="input-hint">
          {hint}
        </p>
      ) : null}
    </div>
  )
})
