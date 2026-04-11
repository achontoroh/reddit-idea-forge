/** Category definition with subreddit mapping for v2 */
export interface Category {
  slug: string
  name: string
  icon: string
  subreddits: string[]
}

export const CATEGORIES: Category[] = [
  {
    slug: 'devtools',
    name: 'DevTools',
    icon: '🛠️',
    subreddits: ['webdev', 'programming', 'SideProject', 'selfhosted'],
  },
  {
    slug: 'saas',
    name: 'SaaS & Startups',
    icon: '🚀',
    subreddits: ['SaaS', 'startups', 'Entrepreneur', 'microsaas'],
  },
  {
    slug: 'productivity',
    name: 'Productivity',
    icon: '⚡',
    subreddits: ['productivity', 'getdisciplined', 'Notion'],
  },
  {
    slug: 'finance',
    name: 'Personal Finance',
    icon: '💰',
    subreddits: ['personalfinance', 'financialindependence', 'Frugal'],
  },
  {
    slug: 'health',
    name: 'Health & Wellness',
    icon: '🧘',
    subreddits: ['HealthyFood', 'loseit', 'fitness'],
  },
  {
    slug: 'education',
    name: 'Education',
    icon: '📚',
    subreddits: ['learnprogramming', 'OnlineLearning', 'languagelearning'],
  },
  {
    slug: 'ecommerce',
    name: 'E-commerce',
    icon: '🛒',
    subreddits: ['ecommerce', 'dropship', 'AmazonSeller'],
  },
  {
    slug: 'ai',
    name: 'AI & Automation',
    icon: '🤖',
    subreddits: ['MachineLearning', 'ChatGPT', 'artificial'],
  },
]

export const CATEGORY_SLUGS: readonly string[] = CATEGORIES.map((c) => c.slug)

/** Backward-compat: slug → display name lookup */
export const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c.name])
)

/** Find a category by its slug */
export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug)
}

/** Flat deduplicated list of all subreddits across all categories */
export function getAllSubreddits(): string[] {
  return [...new Set(CATEGORIES.flatMap((c) => c.subreddits))]
}

/**
 * Backward-compat: CategorySlug union type for existing code
 * that uses `Category` as a string type
 */
export type CategorySlug =
  | 'devtools'
  | 'saas'
  | 'productivity'
  | 'finance'
  | 'health'
  | 'education'
  | 'ecommerce'
  | 'ai'
