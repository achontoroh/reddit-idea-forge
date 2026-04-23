'use client'

import { forwardRef, type ButtonHTMLAttributes } from 'react'

export interface ToggleProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'onChange' | 'role' | 'aria-checked' | 'children' | 'type'
  > {
  on: boolean
  onChange: (next: boolean) => void
  label?: string
  ariaLabel?: string
}

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  { on, onChange, label, ariaLabel, disabled, className, ...rest },
  ref,
) {
  const pairedLabel = label ?? (on ? 'ON' : 'OFF')

  return (
    <span className={className ? `toggle-switch-group ${className}` : 'toggle-switch-group'}>
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={ariaLabel ?? label}
        disabled={disabled}
        data-on={on ? 'true' : 'false'}
        onClick={() => onChange(!on)}
        className="toggle"
        {...rest}
      >
        <span className="toggle-knob" aria-hidden="true" />
      </button>
      <span className="toggle-switch-label" aria-hidden="true">
        {pairedLabel}
      </span>
    </span>
  )
})
