import { config } from '@/config/app'
import type { Idea } from '@/lib/types/idea'

export function buildDigestHtml(
  ideas: Idea[],
  unsubscribeToken: string,
  appUrl: string
): string {
  const topIdeas = ideas.slice(0, config.email.maxIdeasPerEmail)
  const unsubscribeUrl = `${appUrl}/unsubscribe?token=${unsubscribeToken}`

  const ideaCards = topIdeas
    .map(
      (idea) => `
      <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
        <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: 700; color: #111;">
          ${escapeHtml(idea.title)}
        </p>
        <p style="margin: 0 0 8px 0; font-size: 14px; color: #374151; line-height: 1.5;">
          ${escapeHtml(idea.pitch)}
        </p>
        <p style="margin: 0; font-size: 13px; font-weight: 600; color: ${scoreColor(idea.score)};">
          Score: ${idea.score}/100
        </p>
      </div>`
    )
    .join('')

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /></head>
<body style="margin: 0; padding: 0; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 560px; margin: 0 auto; padding: 32px 16px;">
    <p style="margin: 0 0 4px 0; font-size: 20px; font-weight: 700; color: #111;">
      IdeaForge
    </p>
    <p style="margin: 0 0 24px 0; font-size: 14px; color: #6b7280;">
      Your weekly product ideas digest
    </p>

    ${ideaCards}

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />

    <p style="margin: 0 0 8px 0; font-size: 12px; color: #9ca3af;">
      You're receiving this because you subscribed to IdeaForge.
    </p>
    <a href="${unsubscribeUrl}" style="font-size: 12px; color: #6b7280;">
      Unsubscribe
    </a>
  </div>
</body>
</html>`
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function scoreColor(score: number): string {
  if (score >= 70) return '#16a34a'
  if (score >= 40) return '#d97706'
  return '#6b7280'
}
