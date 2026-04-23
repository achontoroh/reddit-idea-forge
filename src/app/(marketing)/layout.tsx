import { type FC, type ReactNode } from 'react'
import { Header } from '@/components/features/header'
import { Footer } from '@/components/layout/footer'

interface MarketingLayoutProps {
  children: ReactNode
}

// Middleware (src/proxy.ts) redirects authenticated users away from /, so the
// marketing layout always renders for signed-out visitors. Skipping the
// Supabase round-trip keeps this layout statically renderable.
const MarketingLayout: FC<MarketingLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-full flex-col">
      <Header user={null} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default MarketingLayout
