import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Performance: sample 10% of transactions in production
  tracesSampleRate: 0.1,

  // Disable in development
  enabled: process.env.NODE_ENV === "production",
});
