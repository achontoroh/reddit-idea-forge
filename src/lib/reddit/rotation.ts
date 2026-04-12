import { CATEGORIES, type Category } from '@/config/categories'
import { config } from '@/config/app'

/**
 * Computes which categories to fetch based on the current UTC hour.
 *
 * With fetchIntervalHours=6, we get 4 rotation slots per day (0-3).
 * Each slot picks `categoriesPerRun` categories from the ordered list,
 * wrapping around when the index exceeds the number of categories.
 *
 * Example with categoriesPerRun=3, 8 categories:
 *   Slot 0 (00:00-05:59 UTC): devtools, saas, productivity
 *   Slot 1 (06:00-11:59 UTC): finance, health, education
 *   Slot 2 (12:00-17:59 UTC): ecommerce, ai, devtools
 *   Slot 3 (18:00-23:59 UTC): saas, productivity, finance
 */
/**
 * @param overrideIndex — explicit rotation slot index (used by dev panel).
 *   When omitted, computes the slot from the current UTC hour (prod behavior).
 */
export function getCategoriesToFetch(overrideIndex?: number): Category[] {
  const { fetchIntervalHours, categoriesPerRun } = config.cron
  const rotationIndex =
    overrideIndex ?? Math.floor(new Date().getUTCHours() / fetchIntervalHours)
  const start = (rotationIndex * categoriesPerRun) % CATEGORIES.length

  const categories: Category[] = []
  for (let i = 0; i < categoriesPerRun; i++) {
    const index = (start + i) % CATEGORIES.length
    categories.push(CATEGORIES[index])
  }

  return categories
}

/** Total number of unique rotation slots before categories wrap around */
export function getRotationSlotCount(): number {
  return Math.ceil(CATEGORIES.length / config.cron.categoriesPerRun)
}

/** Returns all subreddits for the given categories (flat, deduplicated) */
export function getSubredditsForCategories(categories: Category[]): string[] {
  return [...new Set(categories.flatMap((c) => c.subreddits))]
}
