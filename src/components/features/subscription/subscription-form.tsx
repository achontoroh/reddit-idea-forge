'use client'

import { type FC, useState, useEffect, useRef } from 'react'
import { CATEGORIES, CATEGORY_LABELS } from '@/config/categories'
import { Button } from '@/components/ui/button'
import { Chip } from '@/components/ui/chip'

interface SubscriptionFormProps {
  email: string
  initialData?: {
    categories: string[]
    is_active: boolean
  } | null
}

export const SubscriptionForm: FC<SubscriptionFormProps> = ({ email, initialData }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialData?.categories ?? []
  )
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const successTimer = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    return () => {
      if (successTimer.current) clearTimeout(successTimer.current)
    }
  }, [])

  function toggleCategory(category: string) {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (selectedCategories.length === 0) {
      setError('Select at least one category')
      return
    }

    setLoading(true)

    try {
      const method = initialData ? 'PUT' : 'POST'
      const response = await fetch('/api/subscribe', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categories: selectedCategories,
          is_active: isActive,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error ?? 'Failed to save settings')
      }

      setSuccess(true)
      successTimer.current = setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-[0.05em] text-on-surface-muted mb-6">
          Email notifications
        </h2>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <label className="font-medium text-on-surface" htmlFor="weekly-digest">
              Weekly digest
            </label>
            <button
              type="button"
              id="weekly-digest"
              role="switch"
              aria-checked={isActive}
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
                isActive ? 'bg-primary' : 'bg-surface-highest'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                  isActive ? 'translate-x-5' : 'translate-x-0.5'
                } mt-0.5`}
              />
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-on-surface-muted">Email</span>
            <span className="text-on-surface font-medium">{email}</span>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-[0.05em] text-on-surface-muted mb-6">
          Categories
        </h2>
        <div className="flex flex-col gap-4">
          <label className="text-on-surface font-medium">I&apos;m interested in:</label>
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map((category) => (
              <Chip
                key={category}
                label={CATEGORY_LABELS[category]}
                selected={selectedCategories.includes(category)}
                onClick={() => toggleCategory(category)}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="pt-8">
        <Button
          type="submit"
          loading={loading}
          className="w-full py-4 rounded-xl"
        >
          Save preferences
        </Button>
      </div>

      {success && (
        <p className="text-sm text-green-600 text-center">Settings saved!</p>
      )}
      {error && (
        <p className="text-sm text-red-600 text-center">{error}</p>
      )}
    </form>
  )
}
