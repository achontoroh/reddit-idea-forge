import type { Metadata } from 'next'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = {
  title: 'Sign In — IdeaForge',
  description: 'Sign in to your IdeaForge account',
}

export default function LoginPage() {
  return <LoginForm />
}
