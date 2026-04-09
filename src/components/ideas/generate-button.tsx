'use client'

import { type FC, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export const GenerateButton: FC = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGenerate() {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/ideas/generate', { method: 'POST' })

      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: 'Generation failed' }))
        setError((body as { error?: string }).error ?? 'Generation failed')
        return
      }

      router.refresh()
    } catch {
      setError('Network error — please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      {error && <span className="text-sm text-red-500">{error}</span>}
      <Button onClick={handleGenerate} loading={loading}>
        Generate Ideas
      </Button>
    </div>
  )
}
