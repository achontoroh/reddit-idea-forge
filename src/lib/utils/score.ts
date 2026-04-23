/**
 * UI-layer score helpers.
 *
 * The database stores `ai_score` and `community_score` on a 0–100 scale. The
 * editorial UI shows `/10` with one decimal. Callers convert at the display
 * boundary via `displayScore`; ranking math (computeBadges etc.) continues to
 * use the raw /100 value.
 */

export type ScoreSignalLevel = 'high' | 'mid' | 'low'

/**
 * Convert the DB 0–100 score to the /10 display value with one decimal.
 * displayScore(84)  → 8.4
 * displayScore(100) → 10
 * displayScore(0)   → 0
 * displayScore(-5)  → 0    (clamped)
 * displayScore(150) → 10   (clamped)
 */
export function displayScore(db100: number): number {
  if (!Number.isFinite(db100)) return 0
  const clamped = Math.max(0, Math.min(100, db100))
  return Math.round(clamped) / 10
}

/**
 * Map a /10 display score to its editorial signal level.
 * >= 8.0 → 'high', 6.0–7.9 → 'mid', < 6.0 → 'low'
 */
export function scoreSignalLevel(display: number): ScoreSignalLevel {
  if (display >= 8) return 'high'
  if (display >= 6) return 'mid'
  return 'low'
}

/**
 * Return the CSS var reference for the signal color on a /10 display score.
 * Use for inline `style={{ color: scoreSignalToken(v) }}` / stroke etc.
 */
export function scoreSignalToken(display: number): string {
  return `var(--signal-${scoreSignalLevel(display)})`
}
