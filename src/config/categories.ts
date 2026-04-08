export const CATEGORIES = [
  'devtools',
  'health',
  'education',
  'finance',
  'productivity',
] as const

export type Category = (typeof CATEGORIES)[number]
