import { logger } from '@/lib/logger'

const TELEGRAM_API = 'https://api.telegram.org/bot'

export async function sendTelegramNotification(message: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    logger.warn('[Telegram] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set — skipping notification')
    return
  }

  try {
    const response = await fetch(`${TELEGRAM_API}${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    })

    if (!response.ok) {
      const body = await response.text()
      logger.error('[Telegram] Failed to send notification', {
        status: response.status,
        body,
      })
    }
  } catch (error) {
    logger.error('[Telegram] Network error sending notification', {
      error: error instanceof Error ? error.message : String(error),
    })
  }
}
