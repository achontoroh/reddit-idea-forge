import type { Metadata } from 'next'
import { TagsPreview } from './tags-preview'

export const metadata: Metadata = {
  title: 'Design System — Tags & InterestChip',
  robots: { index: false, follow: false },
}

export default function DesignSystemTagsPage() {
  return <TagsPreview />
}
