'use client'

import { type FC, type FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button, Input } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'
import { isValidEmail } from '@/lib/utils/validation'

export const LoginForm: FC = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [formError, setFormError] = useState('')

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
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setFormError("Email or password didn't match.")
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900 mb-1">Sign in</h1>
      <p className="text-sm text-ink-400 mb-6">
        Enter your credentials to access your account
      </p>

      {formError && (
        <p className="mb-4 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger" role="alert">
          {formError}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setFormError('') }}
          disabled={loading}
        />

        <Button type="submit" loading={loading} className="w-full">
          Sign in →
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-ink-400">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-medium text-accent hover:text-accent-hover">
          Create one
        </Link>
      </p>
    </div>
  )
}
