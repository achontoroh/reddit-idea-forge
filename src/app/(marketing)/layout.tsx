import { type FC, type ReactNode } from 'react'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/features/header'
import { Footer } from '@/components/layout/footer'

interface MarketingLayoutProps {
  children: ReactNode
}

const MarketingLayout: FC<MarketingLayoutProps> = async ({ children }) => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const headerUser = user?.email ? { email: user.email } : null

  return (
    <div className="flex min-h-full flex-col">
      <Header user={headerUser} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default MarketingLayout
