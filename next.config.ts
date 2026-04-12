import type { NextConfig } from "next";

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

export default nextConfig;
