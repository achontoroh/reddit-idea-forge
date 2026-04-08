import { type FC, type ReactNode } from 'react'
import { Card } from '@/components/ui'

interface AuthLayoutProps {
  children: ReactNode
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <Card padding="lg" className="w-full max-w-md">
        {children}
      </Card>
    </div>
  )
}

export default AuthLayout
