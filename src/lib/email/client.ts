import { Resend } from 'resend'
import type { Idea } from '@/lib/types/idea'
import { buildDigestHtml } from './template'

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendIdeaDigestParams {
  to: string
  ideas: Idea[]
  unsubscribeToken: string
  appUrl: string
}

export async function sendIdeaDigest(
  params: SendIdeaDigestParams
): Promise<{ success: boolean; error?: string }> {
  const { to, ideas, unsubscribeToken, appUrl } = params

  const subject = `Your IdeaForge digest — ${new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  })}`

  const html = buildDigestHtml(ideas, unsubscribeToken, appUrl)

  try {
    const { error } = await resend.emails.send({
      from: 'IdeaForge <onboarding@resend.dev>',
      to,
      subject,
      html,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown email error'
    return { success: false, error: message }
  }
}
