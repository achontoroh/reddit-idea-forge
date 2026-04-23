import type { Metadata } from 'next'
import { SettingsPreview } from './settings-preview'

export const metadata: Metadata = {
  title: 'Design System — Settings Primitives',
  robots: { index: false, follow: false },
}

export default function DesignSystemSettingsPage() {
  return <SettingsPreview />
}
