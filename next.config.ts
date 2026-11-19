import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['pg'],
  experimental: {
    agentUpgrade: 'security',
  },
};

export default nextConfig;
