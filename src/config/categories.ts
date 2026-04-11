export const CATEGORIES = [
  'devtools',
  'saas',
  'productivity',
  'finance',
  'health',
  'education',
  'ecommerce',
] as const

export type Category = (typeof CATEGORIES)[number]

export const CATEGORY_LABELS: Record<Category, string> = {
  devtools: 'DevTools',
  saas: 'SaaS',
  productivity: 'Productivity',
  finance: 'Finance',
  health: 'Health',
  education: 'Education',
  ecommerce: 'E-commerce',
}
