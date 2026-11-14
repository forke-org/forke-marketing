/**
 * @fileoverview Forke Platform
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

import type { NextConfig } from "next";

// R2 public bucket host, so uploaded avatars can go through next/image (the ID card paints them on a canvas).
const r2Host = (() => {
  try {
    return process.env.CLOUDFLARE_R2_PUBLIC_URL ? new URL(process.env.CLOUDFLARE_R2_PUBLIC_URL).hostname : null
  } catch {
    return null
  }
})()

const nextConfig: NextConfig = {
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Serve AVIF first (smaller than WebP), fall back to WebP.
    formats: ['image/avif', 'image/webp'],
    // Cache optimized images on the CDN for a year so repeat views are free.
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
        pathname: '**',
      },      { protocol: 'https', hostname: '*.r2.dev', pathname: '**' },
      ...(r2Host ? [{ protocol: 'https' as const, hostname: r2Host, pathname: '**' }] : []),
    ],
  },
  async redirects() {
    const isProd = process.env.NODE_ENV === 'production';
    const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL || (isProd ? 'https://dashboard.forke.space' : 'http://localhost:3001');
    const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || (isProd ? 'https://admin.forke.space' : 'http://localhost:3002');
    return [
      {
        source: '/dashboard/:path*',
        destination: `${dashboardUrl}/dashboard/:path*`,
        permanent: false,
      },
      {
        source: '/ide/:path*',
        destination: `${dashboardUrl}/ide/:path*`,
        permanent: false,
      },
      {
        source: '/admin/:path*',
        destination: `${adminUrl}/admin/:path*`,
        permanent: false,
      },
      {
        source: '/mail',
        destination: 'https://mail.forke.space',
        permanent: false,
      },
      {
        source: '/mail/:path*',
        destination: 'https://mail.forke.space/:path*',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
