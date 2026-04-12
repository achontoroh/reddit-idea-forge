'use client'

import { type FC, useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface PipelineResult {
  success: boolean
  fetched?: number
  newPosts?: number
  categories?: string[]
  ideasGenerated?: number
  ideasSkippedDuplicate?: number
  model?: string
  durationMs?: number
  deletedPosts?: number
  deletedIdeas?: number
  resetPosts?: number
  error?: string
  errors?: string[]
}

const AUTO_MODEL = '__auto__'

export const DevPipelinePanel: FC = () => {
  const router = useRouter()
  const [generating, setGenerating] = useState(false)
  const [cleaning, setCleaning] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [result, setResult] = useState<PipelineResult | null>(null)
  const [collapsed, setCollapsed] = useState(false)
  const [rotationIndex, setRotationIndex] = useState(0)
  const [availableModels, setAvailableModels] = useState<string[]>([])
  const [selectedModel, setSelectedModel] = useState(AUTO_MODEL)

  useEffect(() => {
    fetch('/api/dev/pipeline')
      .then((res) => res.json())
      .then((data: { availableModels?: string[] }) => {
        if (data.availableModels) setAvailableModels(data.availableModels)
      })
      .catch(() => {/* ignore — dev only */})
  }, [])

  const runGenerate = useCallback(async () => {
    setGenerating(true)
    setResult(null)
    try {
      const body: Record<string, unknown> = { rotationIndex }
      if (selectedModel !== AUTO_MODEL) {
        body.modelOverride = selectedModel
      }
      const res = await fetch('/api/dev/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data: PipelineResult = await res.json()
      setResult(data)
      setRotationIndex((prev) => prev + 1)
      if (data.success && data.ideasGenerated && data.ideasGenerated > 0) {
        router.refresh()
      }
    } catch (err) {
      setResult({
        success: false,
        error: err instanceof Error ? err.message : 'Network error',
      })
    } finally {
      setGenerating(false)
    }
  }, [router, rotationIndex, selectedModel])

  const runCleanup = useCallback(async () => {
    setCleaning(true)
    setResult(null)
    try {
      const res = await fetch('/api/dev/cleanup', {
        method: 'POST',
      })
      const data: PipelineResult = await res.json()
      setResult(data)
      if (data.success) {
        router.refresh()
      }
    } catch (err) {
      setResult({
        success: false,
        error: err instanceof Error ? err.message : 'Network error',
      })
    } finally {
      setCleaning(false)
    }
  }, [router])

  const runReset = useCallback(async () => {
    setResetting(true)
    setResult(null)
    try {
      const res = await fetch('/api/dev/reset-ideas', {
        method: 'POST',
      })
      const data: PipelineResult = await res.json()
      setResult(data)
      if (data.success) {
        router.refresh()
      }
    } catch (err) {
      setResult({
        success: false,
        error: err instanceof Error ? err.message : 'Network error',
      })
    } finally {
      setResetting(false)
    }
  }, [router])

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="fixed bottom-4 right-4 z-50 rounded-full bg-amber-500 p-3 text-white shadow-lg hover:bg-amber-600 transition-colors"
        title="Open Dev Pipeline Panel"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      </button>
    )
  }

  const isRunning = generating || cleaning || resetting

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 rounded-lg border border-amber-500/30 bg-surface-lowest shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-amber-500/20 px-4 py-2">
        <span className="text-sm font-semibold text-amber-500">
          Dev Pipeline
        </span>
        <button
          onClick={() => setCollapsed(true)}
          className="text-on-surface-muted hover:text-on-surface transition-colors"
          title="Collapse"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Actions */}
      <div className="flex gap-2 px-4 py-3">
        <Button
          variant="primary"
          size="sm"
          onClick={runGenerate}
          loading={generating}
          disabled={isRunning}
        >
          Fetch & Generate
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={runCleanup}
          loading={cleaning}
          disabled={isRunning}
        >
          Cleanup
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={runReset}
          loading={resetting}
          disabled={isRunning}
          className="!border-red-500/30 !text-red-400 hover:!bg-red-500/10"
        >
          Reset Ideas
        </Button>
      </div>

      {/* Model selector — inline radio buttons */}
      <div className="px-4 pb-2">
        <p className="mb-1.5 text-xs text-on-surface-muted">Model</p>
        <div className="flex flex-col gap-1">
          {[{ value: AUTO_MODEL, label: 'Auto (rotation)' }, ...availableModels.map((m) => ({ value: m, label: m }))].map(
            ({ value, label }) => (
              <label
                key={value}
                className={`flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs transition-colors ${
                  selectedModel === value
                    ? 'bg-amber-500/15 text-amber-500'
                    : 'text-on-surface-muted hover:bg-surface-low'
                } ${isRunning ? 'pointer-events-none opacity-50' : ''}`}
              >
                <input
                  type="radio"
                  name="dev-model"
                  value={value}
                  checked={selectedModel === value}
                  onChange={() => setSelectedModel(value)}
                  className="sr-only"
                />
                <span
                  className={`inline-block h-3 w-3 shrink-0 rounded-full border-2 ${
                    selectedModel === value
                      ? 'border-amber-500 bg-amber-500'
                      : 'border-on-surface-muted/40 bg-transparent'
                  }`}
                />
                <span className="truncate">{label}</span>
              </label>
            )
          )}
        </div>
      </div>

      {/* Rotation info */}
      <div className="px-4 pb-2 text-xs text-on-surface-muted">
        Next rotation slot: {rotationIndex}
      </div>

      {/* Result */}
      {result && (
        <div className="border-t border-surface-low px-4 py-3">
          <div
            className={`mb-1 text-xs font-semibold ${result.success ? 'text-green-500' : 'text-red-500'}`}
          >
            {result.success ? 'Success' : 'Failed'}
            {result.durationMs != null && (
              <span className="ml-1 font-normal text-on-surface-muted">
                ({(result.durationMs / 1000).toFixed(1)}s)
              </span>
            )}
          </div>
          <div className="space-y-0.5 text-xs text-on-surface-muted">
            {result.categories && (
              <p>Categories: {result.categories.join(', ')}</p>
            )}
            {result.fetched != null && <p>Posts fetched: {result.fetched}</p>}
            {result.newPosts != null && <p>New posts: {result.newPosts}</p>}
            {result.ideasGenerated != null && (
              <p>Ideas generated: {result.ideasGenerated}</p>
            )}
            {result.ideasSkippedDuplicate != null && (
              <p>Skipped duplicates: {result.ideasSkippedDuplicate}</p>
            )}
            {result.model && <p>Model: {result.model}</p>}
            {result.deletedPosts != null && (
              <p>Deleted posts: {result.deletedPosts}</p>
            )}
            {result.deletedIdeas != null && (
              <p>Deleted ideas: {result.deletedIdeas}</p>
            )}
            {result.resetPosts != null && (
              <p>Reset posts: {result.resetPosts}</p>
            )}
            {result.error && <p className="text-red-400">{result.error}</p>}
            {result.errors && result.errors.length > 0 && (
              <div className="mt-1">
                {result.errors.map((e, i) => (
                  <p key={i} className="text-red-400">{e}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
