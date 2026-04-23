import type { Metadata } from 'next'
import { FormsPreview } from './forms-preview'

export const metadata: Metadata = {
  title: 'Design System — Forms & Toggle',
  robots: { index: false, follow: false },
}

export default function DesignSystemFormsPage() {
  return <FormsPreview />
}
