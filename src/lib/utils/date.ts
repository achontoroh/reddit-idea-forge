const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000

export function isWithin24Hours(dateString: string): boolean {
  const created = new Date(dateString)
  const now = new Date()
  return now.getTime() - created.getTime() < TWENTY_FOUR_HOURS_MS
}
