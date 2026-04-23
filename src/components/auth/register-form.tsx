'use client'

import { type FC, type FormEvent, useState } from 'react'
import Link from 'next/link'
import { Button, Input } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'
import { isValidEmail } from '@/lib/utils/validation'
import { PasswordStrength, isPasswordValid } from './password-strength'

export const RegisterForm: FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [formError, setFormError] = useState('')
  const [passwordFocused, setPasswordFocused] = useState(false)

  function validateEmail(value: string) {
    if (value && !isValidEmail(value)) {
      setEmailError('Email must be valid.')
    } else {
      setEmailError('')
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError('')

    if (!isPasswordValid(password)) {
      setFormError('Password must meet all requirements.')
      return
    }

    setLoading(true)

    const supabase = createClient()
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
        data: {
          full_name: fullName || undefined,
        },
      },
    })

    if (authError) {
      setFormError(authError.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-ink-900 mb-2">Check your email</h1>
        <p className="text-sm text-ink-400 mb-6">
          We sent a confirmation link to <strong>{email}</strong>. Click it to
          activate your account.
        </p>
        <Link
          href="/login"
          className="text-sm font-medium text-accent hover:text-accent-hover"
        >
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900 mb-1">Create account</h1>
      <p className="text-sm text-ink-400 mb-6">
        Sign up to start discovering product ideas
      </p>

      {formError && (
        <p className="mb-4 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger" role="alert">
          {formError}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full name"
          placeholder="Jane Doe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={loading}
        />

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setEmailError(''); setFormError('') }}
          onBlur={(e) => validateEmail(e.target.value)}
          error={emailError}
          disabled={loading}
        />

        <div>
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setFormError('') }}
            onBlur={() => setPasswordFocused(password.length > 0)}
            onFocus={() => setPasswordFocused(true)}
            disabled={loading}
          />
          {(passwordFocused || password.length > 0) && (
            <PasswordStrength password={password} />
          )}
        </div>

        <Button type="submit" loading={loading} className="w-full">
          Create account →
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-ink-400">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-accent hover:text-accent-hover">
          Sign in
        </Link>
      </p>
    </div>
  )
}
