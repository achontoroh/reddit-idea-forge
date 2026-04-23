import type { Metadata } from 'next'
import { HeaderPreview } from './header-preview'

export const metadata: Metadata = {
  title: 'Design System — Header',
  robots: { index: false, follow: false },
}

export default function DesignSystemHeaderPage() {
  return <HeaderPreview />
}
