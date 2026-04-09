'use client'

import { type FC, type FormEvent, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Button, Input } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'

export const RegisterForm: FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
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
      toast.error(authError.message)
      setLoading(false)
      return
    }

    toast.success('Account created! Check your email to confirm.')
    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
        <p className="text-sm text-gray-500 mb-6">
          We sent a confirmation link to <strong>{email}</strong>. Click it to
          activate your account.
        </p>
        <Link
          href="/login"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Create account</h1>
      <p className="text-sm text-gray-500 mb-6">
        Sign up to start discovering product ideas
      </p>

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
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <Button type="submit" loading={loading} className="w-full">
          Create account
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
          Sign in
        </Link>
      </p>
    </div>
  )
}
