import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  output: 'standalone',
  experimental: {
    // @ts-ignore
    devIndicators: {
      appIsrStatus: false,
      buildActivity: false,
    },
  },
};

export default nextConfig;
