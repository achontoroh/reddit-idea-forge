'use client'

import { type FC, useState, useRef, useEffect } from 'react'

export type TabMode = 'hot' | 'top' | 'new' | 'foryou'
export type TopPeriod = 'week' | 'month' | 'all'

interface FeedTabsProps {
  activeTab: TabMode
  activePeriod: TopPeriod
  onTabChange: (tab: TabMode) => void
  onPeriodChange: (period: TopPeriod) => void
}

const TABS: { key: TabMode; label: string }[] = [
  { key: 'hot', label: 'Hot' },
  { key: 'top', label: 'Top' },
  { key: 'new', label: 'New' },
  { key: 'foryou', label: 'For You' },
]

const PERIODS: { key: TopPeriod; label: string }[] = [
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
  { key: 'all', label: 'All Time' },
]

export const FeedTabs: FC<FeedTabsProps> = ({
  activeTab,
  activePeriod,
  onTabChange,
  onPeriodChange,
}) => {
  const [periodOpen, setPeriodOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    if (!periodOpen) return

    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setPeriodOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [periodOpen])

  const activePeriodLabel = PERIODS.find((p) => p.key === activePeriod)?.label ?? 'This Week'

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={`pb-3 text-sm font-medium relative transition-colors ${
              activeTab === tab.key
                ? 'text-primary font-semibold'
                : 'text-on-surface-muted hover:text-on-surface'
            }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Period dropdown — only visible when Top tab is active */}
      {activeTab === 'top' && (
        <div className="relative ml-4" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setPeriodOpen((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-on-surface-muted hover:text-on-surface bg-surface-low hover:bg-surface-highest transition-colors"
          >
            {activePeriodLabel}
            <svg
              className={`w-3.5 h-3.5 transition-transform ${periodOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {periodOpen && (
            <div className="absolute top-full left-0 mt-1 py-1 rounded-lg bg-surface-lowest shadow-modal border border-[var(--ghost-border-color)] z-20 min-w-[140px]">
              {PERIODS.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => {
                    onPeriodChange(p.key)
                    setPeriodOpen(false)
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    activePeriod === p.key
                      ? 'text-primary font-medium bg-primary/5'
                      : 'text-on-surface-muted hover:text-on-surface hover:bg-surface-low'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
