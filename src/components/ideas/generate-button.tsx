'use client'

import { type FC, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export const GenerateButton: FC = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleGenerate() {
    setLoading(true)

    try {
      const res = await fetch('/api/ideas/generate', { method: 'POST' })

      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: 'Generation failed' }))
        // safe cast: we control the API response shape
        toast.error((body as { error?: string }).error ?? 'Failed to generate ideas')
        return
      }

      toast.success('Ideas generated!')
      router.refresh()
    } catch {
      toast.error('Network error — please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleGenerate} loading={loading}>
      Generate Ideas
    </Button>
  )
}
