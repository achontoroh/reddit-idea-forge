'use client'

import { type FC } from 'react'

interface PasswordStrengthProps {
  password: string
}

const REQUIREMENTS = [
  { label: 'Min 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'Uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { label: 'Number', test: (p: string) => /\d/.test(p) },
  { label: 'Special character', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
] as const

function getBarColor(met: number): string {
  if (met <= 1) return 'bg-red-500'
  if (met <= 2) return 'bg-orange-500'
  if (met <= 3) return 'bg-amber-500'
  if (met === 4) return 'bg-lime-500'
  return 'bg-green-500'
}

export const PasswordStrength: FC<PasswordStrengthProps> = ({ password }) => {
  const results = REQUIREMENTS.map((req) => ({
    label: req.label,
    met: req.test(password),
  }))
  const metCount = results.filter((r) => r.met).length

  return (
    <div className="mt-2 space-y-2">
      {/* Progress bar */}
      <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${getBarColor(metCount)}`}
          style={{ width: `${(metCount / REQUIREMENTS.length) * 100}%` }}
        />
      </div>

      {/* Requirements list */}
      <ul className="space-y-0.5">
        {results.map(({ label, met }) => (
          <li key={label} className="flex items-center gap-1.5 text-xs">
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full transition-colors ${
                met ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
            <span className={met ? 'text-green-600' : 'text-gray-400'}>
              {label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Returns true when all 5 requirements pass. */
export function isPasswordValid(password: string): boolean {
  return REQUIREMENTS.every((req) => req.test(password))
}
