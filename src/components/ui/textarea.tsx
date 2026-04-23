'use client'

import {
  forwardRef,
  useId,
  type TextareaHTMLAttributes,
} from 'react'

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: string
  error?: string
  state?: 'default' | 'focus' | 'error' | 'disabled'
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    { label, hint, error, state, className, disabled, id: idProp, rows = 4, ...rest },
    ref,
  ) {
    const generatedId = useId()
    const id = idProp ?? generatedId
    const hintId = hint ? `${id}-hint` : undefined
    const errorId = error ? `${id}-error` : undefined
    const resolvedState =
      state ?? (error ? 'error' : disabled ? 'disabled' : 'default')

    return (
      <div className={className ? `input-field ${className}` : 'input-field'}>
        {label && (
          <label htmlFor={id} className="input-label">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId ?? hintId}
          data-state={resolvedState}
          data-error={error ? 'true' : undefined}
          className="input textarea"
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
  },
)
