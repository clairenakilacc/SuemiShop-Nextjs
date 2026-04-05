import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,

  eslint: {
    ignoreDuringBuilds: true, // ignores ESLint errors/warnings on Vercel builds
  },
};

export default nextConfig;

