import type { FC, ReactNode } from 'react'

interface SettingsHeadProps {
  kicker: string
  title: ReactNode
  lede?: string
}

export const SettingsHead: FC<SettingsHeadProps> = ({ kicker, title, lede }) => {
  return (
    <header className="settings-head">
      <span className="kicker">{kicker}</span>
      <h2 className="settings-head-title">{title}</h2>
      {lede && <p className="settings-head-lede">{lede}</p>}
    </header>
  )
}
