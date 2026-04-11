'use client'

import { useCallback, useEffect, useSyncExternalStore } from 'react'

type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'ideaforge-theme'
const THEME_ORDER: Theme[] = ['light', 'dark', 'system']

let cachedTheme: Theme = 'system'

function readStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system'
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  return 'system'
}

function applyTheme(theme: Theme): void {
  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  document.documentElement.classList.toggle('dark', isDark)
}

const listeners = new Set<() => void>()

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

function emitChange(): void {
  for (const listener of listeners) {
    listener()
  }
}

function getSnapshot(): Theme {
  return cachedTheme
}

function getServerSnapshot(): Theme {
  return 'system'
}

// Initialise cache on module load (client only)
if (typeof window !== 'undefined') {
  cachedTheme = readStoredTheme()
}

export function useTheme(): { theme: Theme; setTheme: (t: Theme) => void; cycleTheme: () => void } {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    if (theme !== 'system') return

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => applyTheme(readStoredTheme())
    mq.addEventListener('change', handleChange)
    return () => mq.removeEventListener('change', handleChange)
  }, [theme])

  const setTheme = useCallback((next: Theme) => {
    localStorage.setItem(STORAGE_KEY, next)
    cachedTheme = next
    applyTheme(next)
    emitChange()
  }, [])

  const cycleTheme = useCallback(() => {
    const next = THEME_ORDER[(THEME_ORDER.indexOf(cachedTheme) + 1) % THEME_ORDER.length]
    setTheme(next)
  }, [setTheme])

  return { theme, setTheme, cycleTheme }
}
