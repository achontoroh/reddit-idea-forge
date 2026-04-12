type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogMeta {
  [key: string]: unknown
}

const isDev = process.env.NODE_ENV === 'development'

const LEVEL_COLORS: Record<LogLevel, string> = {
  debug: '\x1b[90m',  // gray
  info:  '\x1b[36m',  // cyan
  warn:  '\x1b[33m',  // yellow
  error: '\x1b[31m',  // red
}
const RESET = '\x1b[0m'

function formatTimestamp(): string {
  return new Date().toISOString()
}

function log(level: LogLevel, message: string, meta?: LogMeta): void {
  // debug only in dev
  if (level === 'debug' && !isDev) return

  if (isDev) {
    const color = LEVEL_COLORS[level]
    const tag = `${color}[${level.toUpperCase()}]${RESET}`
    const ts = `\x1b[90m${formatTimestamp()}${RESET}`
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : ''
    const fn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log
    fn(`${ts} ${tag} ${message}${metaStr}`)
  } else {
    // Production: JSON lines for Vercel / Sentry
    const entry = { level, message, timestamp: formatTimestamp(), ...meta }
    const fn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log
    fn(JSON.stringify(entry))
  }
}

export const logger = {
  debug: (message: string, meta?: LogMeta) => log('debug', message, meta),
  info:  (message: string, meta?: LogMeta) => log('info', message, meta),
  warn:  (message: string, meta?: LogMeta) => log('warn', message, meta),
  error: (message: string, meta?: LogMeta) => log('error', message, meta),
}
