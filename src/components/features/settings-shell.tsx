import type { FC, CSSProperties, ReactNode } from 'react'
import Link from 'next/link'
import { Header } from './header'

export interface SettingsTab {
  key: string
  label: string
  href: string
}

interface SettingsShellUser {
  email: string
  avatarUrl?: string | null
}

interface SettingsShellProps {
  tabs: SettingsTab[]
  activeTab: string
  children: ReactNode
  user?: SettingsShellUser | null
}

const SIDE_COLUMN_WIDTH = '260px'

export const SettingsShell: FC<SettingsShellProps> = ({
  tabs,
  activeTab,
  children,
  user,
}) => {
  const active = tabs.find((tab) => tab.key === activeTab)

  return (
    <div className="settings-shell">
      <Header
        user={user}
        breadcrumb={[
          { label: 'Settings', href: '/dashboard/settings' },
          ...(active ? [{ label: active.label }] : []),
        ]}
      />

      <div className="settings-shell-layout">
        <SideTabs tabs={tabs} activeTab={activeTab} />
        <main className="settings-shell-content">{children}</main>
      </div>
    </div>
  )
}

const SideTabs: FC<{ tabs: SettingsTab[]; activeTab: string }> = ({
  tabs,
  activeTab,
}) => {
  return (
    <nav aria-label="Settings sections" className="settings-shell-tabs">
      <span className="settings-shell-tabs-kicker">Settings</span>
      <ul className="settings-shell-tab-list">
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab
          return (
            <li key={tab.key}>
              <Link
                href={tab.href}
                className="settings-shell-tab"
                data-active={isActive ? 'true' : undefined}
                aria-current={isActive ? 'page' : undefined}
              >
                <span>{tab.label}</span>
                <span
                  aria-hidden="true"
                  className="settings-shell-tab-dot"
                  style={DOT_STYLE}
                >
                  •
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

const DOT_STYLE: CSSProperties = {
  color: 'var(--accent)',
}

export const SETTINGS_SHELL_SIDE_WIDTH = SIDE_COLUMN_WIDTH
