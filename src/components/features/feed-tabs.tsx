'use client'

import { type FC } from 'react'

export type TabMode = 'latest' | 'rating' | 'foryou'

interface FeedTabsProps {
  activeTab: TabMode
  onTabChange: (tab: TabMode) => void
}

const TABS: { key: TabMode; label: string }[] = [
  { key: 'latest', label: 'Latest' },
  { key: 'rating', label: 'By Rating' },
  { key: 'foryou', label: 'For You' },
]

export const FeedTabs: FC<FeedTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="flex gap-6">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onTabChange(tab.key)}
          className={`pb-3 text-sm font-medium relative transition-colors ${
            activeTab === tab.key
              ? 'text-ink-900 font-semibold'
              : 'text-ink-400 hover:text-ink-900'
          }`}
        >
          {tab.label}
          {activeTab === tab.key && (
            <span className="absolute bottom-0 left-0 w-full h-[3px] bg-accent rounded-full" />
          )}
        </button>
      ))}
    </div>
  )
}
