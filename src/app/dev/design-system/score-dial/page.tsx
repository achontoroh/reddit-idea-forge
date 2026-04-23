import type { Metadata } from 'next'
import { ScoreDialPreview } from './score-dial-preview'

export const metadata: Metadata = {
  title: 'Design System — ScoreDial',
  robots: { index: false, follow: false },
}

export default function DesignSystemScoreDialPage() {
  return <ScoreDialPreview />
}
