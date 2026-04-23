/**
 * Editorial palette keys for the IF-125 design system (Tag, InterestChip,
 * IdeaCard, Header). These keys back the `--cat-*` color vars in tokens.css
 * and are decoupled from the canonical DB taxonomy in `@/config/categories`.
 *
 * IF-138 (Phase 11 dashboard wiring) introduces the slug → editorial-key
 * mapping that lets the editorial IdeaCard render real `IdeaWithVote` data.
 * Until then, do not pass DB category slugs (e.g. `'devtools'`, `'finance'`)
 * to consumers of `CategoryKey` — they will fall through `categoryLabels`.
 */
export const CATEGORY_KEYS = [
  'devt',
  'ai',
  'prod',
  'fin',
  'saas',
  'creator',
  'health',
  'climate',
  'edu',
  'ecom',
  'hw',
  'media',
  'gaming',
  'legal',
  'travel',
  'realestate',
] as const

export type CategoryKey = (typeof CATEGORY_KEYS)[number]

export const categoryLabels: Record<CategoryKey, string> = {
  devt: 'DevTools',
  ai: 'AI/ML',
  prod: 'Productivity',
  fin: 'Fintech',
  saas: 'SaaS',
  creator: 'Creator',
  health: 'Health',
  climate: 'Climate',
  edu: 'Education',
  ecom: 'E-commerce',
  hw: 'Hardware',
  media: 'Media',
  gaming: 'Gaming',
  legal: 'Legal',
  travel: 'Travel',
  realestate: 'Real Estate',
}
