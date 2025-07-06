import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Set Cache-Control headers for all pages
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=30, stale-while-revalidate=59',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
