'use client'

import { type FC, useState, useCallback } from 'react'
import { CATEGORIES } from '@/config/categories'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface SubscriptionFormProps {
  initialData?: {
    email: string
    categories: string[]
    is_active: boolean
  } | null
}

export const SubscriptionForm: FC<SubscriptionFormProps> = ({ initialData }) => {
  const [email] = useState(initialData?.email ?? '')
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialData?.categories ?? []
  )
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const toggleCategory = useCallback((category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    )
  }, [])

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
        <Input
          label="Email address"
          type="email"
          value={email}
          disabled
          hint="Email from your account"
        />

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
    </Card>
  )
}
