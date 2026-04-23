import type { Metadata } from 'next'
import { IdeaCardPreview } from './idea-card-preview'

export const metadata: Metadata = {
  title: 'Design System — IdeaCard',
  robots: { index: false, follow: false },
}

export default function DesignSystemIdeaCardPage() {
  return <IdeaCardPreview />
}
