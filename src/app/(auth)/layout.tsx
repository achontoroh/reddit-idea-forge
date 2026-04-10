import { type FC, type ReactNode } from 'react'
import { Card } from '@/components/ui'
import { ThemeToggle } from '@/components/ui/theme-toggle'

interface AuthLayoutProps {
  children: ReactNode
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-surface-base px-4 py-12">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card padding="lg" className="w-full max-w-md">
        {children}
      </Card>
    </div>
  )
}

export default AuthLayout
