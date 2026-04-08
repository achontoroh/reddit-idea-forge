---
name: kit-create-ui
description: "Use when building UI pages, components, or layouts. Contains component patterns, Tailwind conventions, score visualization, category filter, and responsive design rules."
---

# Create UI — Component Patterns

## Component Template

```typescript
// src/components/features/idea-card.tsx
import { type FC } from 'react'
import { type Idea } from '@/lib/types/idea'
import { ScoreBadge } from '@/components/ui/score-badge'

interface IdeaCardProps {
  idea: Idea
  isNew?: boolean
}

export const IdeaCard: FC<IdeaCardProps> = ({ idea, isNew = false }) => {
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-4 hover:shadow-sm transition-shadow">
      {/* Header: title + score */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-gray-900">{idea.title}</h3>
          {isNew && (
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
              new
            </span>
          )}
        </div>
        <ScoreBadge score={idea.score} />
      </div>

      {/* Pitch */}
      <p className="text-sm text-gray-600 mb-2">{idea.pitch}</p>

      {/* Footer: pain point + source */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span className="italic">{idea.pain_point}</span>
        <a href={idea.source_url || '#'} className="text-indigo-500 hover:underline">
          r/{idea.source_subreddit}
        </a>
      </div>
    </article>
  )
}
```

## Score Visualization

Score colors follow a traffic-light system:

```typescript
// src/components/ui/score-badge.tsx
export const ScoreBadge: FC<{ score: number }> = ({ score }) => {
  const color = score >= 70
    ? 'text-green-600 bg-green-50'
    : score >= 40
    ? 'text-amber-600 bg-amber-50'
    : 'text-gray-500 bg-gray-50'

  const barColor = score >= 70
    ? 'bg-green-500'
    : score >= 40
    ? 'bg-amber-500'
    : 'bg-gray-400'

  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-1.5 rounded-full bg-gray-200 overflow-hidden">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-sm font-semibold ${color} rounded px-1.5 py-0.5`}>
        {score}
      </span>
    </div>
  )
}
```

## Category Filter Pattern

```typescript
// src/components/features/category-filter.tsx
import { CATEGORIES } from '@/config/categories'

interface CategoryFilterProps {
  selected: string
  onChange: (category: string) => void
}

export const CategoryFilter: FC<CategoryFilterProps> = ({ selected, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {['all', ...CATEGORIES].map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`rounded-full px-3 py-1 text-sm transition-colors ${
            selected === cat
              ? 'bg-gray-900 text-white'
              : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
```

## Page Layout Pattern

```typescript
// Dashboard page
export default async function DashboardPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Fresh ideas</h1>
      <CategoryFilter />
      <div className="mt-6 flex flex-col gap-4">
        {ideas.map(idea => <IdeaCard key={idea.id} idea={idea} />)}
      </div>
    </main>
  )
}
```

## Tailwind Conventions

- **Primary color:** indigo (buttons, links, accents)
- **Layout:** `max-w-4xl mx-auto px-4` for content width
- **Cards:** `rounded-lg border border-gray-200 bg-white p-4`
- **Buttons primary:** `bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg px-4 py-2`
- **Buttons secondary:** `border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg px-4 py-2`
- **Responsive:** mobile-first, add `md:` and `lg:` for larger screens
- **Dark mode:** NOT required for this MVP

## Existing Components (check before creating new)

Before creating a new component, check `src/components/ui/` for:
- `Button` — styled button with primary/secondary/danger/ghost variants
- `Card` — container with border and padding (sm/md/lg)
- `Badge` — small colored label (new/category/score variants)
- `Input` — styled text input with label and error state
- `ScoreBadge` — score display with color-coded progress bar (0-100)
- `Header` — top navigation bar (in `components/layout/`)

## Widget Registry Rule (MANDATORY)

When creating any new UI component:

1. **CHECK** if a similar component already exists in `src/components/ui/` (list above)
2. **REUSE** existing components — import and compose, don't recreate
3. **EVALUATE** if the new component is reusable across pages:
   - Used in 2+ places? → put in `src/components/ui/`
   - Feature-specific but complex? → put in `src/components/features/`
   - One-off, simple? → inline in the page
4. **UPDATE** this list when you add a new component to `src/components/ui/`
5. **EXTRACT** when you notice duplication — if you copy-paste a UI pattern, it should be a component

After adding a new ui/ component, append it to the "Existing Components" list above so future tasks know it exists.

## Loading & Empty States

Every page/component that fetches data should handle:

```typescript
if (isLoading) return <div className="text-center py-8 text-gray-500">Loading...</div>
if (error) return <div className="text-center py-8 text-red-500">Something went wrong</div>
if (!data?.length) return <div className="text-center py-8 text-gray-400">No ideas yet</div>
```
