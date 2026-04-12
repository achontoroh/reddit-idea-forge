import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  // Fetch logging disabled — it produces noisy "Cache skipped reason" and
  // URL lines for every Supabase/Arctic Shift request, hiding pipeline output.
  // Re-enable with logging.fetches.fullUrl: true when debugging fetch caching.
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
  },
};

export default withSentryConfig(nextConfig, {
  // Suppress source map upload logs during build
  silent: true,

  // Upload source maps for better stack traces
  org: "a-chontoroh",
  project: "ideaforge",

  // Tree-shake Sentry debug logging to reduce bundle size
  bundleSizeOptimizations: {
    excludeDebugStatements: true,
  },
});
