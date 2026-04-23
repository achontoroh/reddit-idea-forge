import type { FC, ReactNode } from 'react'

interface SettingsRowProps {
  label: string
  description?: string
  control: ReactNode
  last?: boolean
}

export const SettingsRow: FC<SettingsRowProps> = ({
  label,
  description,
  control,
  last,
}) => {
  return (
    <div className="settings-row" data-last={last ? 'true' : undefined}>
      <div className="settings-row-label">
        <span className="settings-row-label-text">{label}</span>
        {description && (
          <span className="settings-row-description">{description}</span>
        )}
      </div>
      <div className="settings-row-control">{control}</div>
    </div>
  )
}
