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
