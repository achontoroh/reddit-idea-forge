'use client'

import { type FC, useState, useCallback } from 'react'
import { CATEGORIES } from '@/config/categories'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

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
  const [unsubscribing, setUnsubscribing] = useState(false)
  const [unsubscribed, setUnsubscribed] = useState(false)

  const toggleCategory = useCallback((category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    )
  }, [])

  const handleUnsubscribe = async () => {
    setError(null)
    setUnsubscribing(true)

    try {
      const response = await fetch('/api/subscribe', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: false }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error ?? 'Failed to unsubscribe')
      }

      setUnsubscribed(true)
      setIsActive(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setUnsubscribing(false)
    }
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
      setUnsubscribed(false)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card padding="lg">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Email Digest Settings</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-1">Digests will be sent to</p>
          <p className="text-sm font-medium text-gray-900">{email}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categories
          </label>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => toggleCategory(category)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                  selectedCategories.includes(category)
                    ? 'bg-indigo-600 text-white'
                    : 'border border-gray-300 text-gray-700 hover:border-indigo-400'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label htmlFor="digest-toggle" className="text-sm font-medium text-gray-700">
            Receive weekly digest
          </label>
          <input
            id="digest-toggle"
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
        </div>

        <Button type="submit" loading={loading} className="w-full">
          {loading ? 'Saving...' : 'Save settings'}
        </Button>

        {success && (
          <p className="text-sm text-green-600 text-center">Settings saved!</p>
        )}

        {error && (
          <p className="text-sm text-red-600 text-center">{error}</p>
        )}
      </form>

      {initialData && (
        <div className="mt-4 border-t border-gray-200 pt-4 text-center">
          {unsubscribed ? (
            <p className="text-sm text-red-600">Unsubscribed</p>
          ) : (
            <button
              type="button"
              disabled={unsubscribing}
              onClick={handleUnsubscribe}
              className="w-full mt-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {unsubscribing ? 'Unsubscribing...' : 'Unsubscribe from digest emails'}
            </button>
          )}
        </div>
      )}
    </Card>
  )
}
