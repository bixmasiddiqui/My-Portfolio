const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control',       value: 'on' },
  { key: 'X-Frame-Options',              value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options',       value: 'nosniff' },
  { key: 'Referrer-Policy',              value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy',           value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,   // Don't advertise Next.js in response headers
  compress: true,           // Enable gzip/brotli compression

  // ── Image optimisation ───────────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],  // Prefer AVIF, fallback to WebP
    minimumCacheTTL: 86400,                 // Cache optimised images for 24h
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'github-readme-stats.vercel.app' },
    ],
  },

  // ── Experimental ────────────────────────────────────────
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },

  // ── HTTP headers ────────────────────────────────────────
  async headers() {
    return [
      // Security headers on all routes
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      // Immutable cache for hashed static assets
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // No-store for the chat API (streaming, dynamic)
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0' },
        ],
      },
      // Cache the OG image for 1 hour
      {
        source: '/opengraph-image',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400' },
        ],
      },
    ]
  },

  // ── Redirects — www → non-www (update to match your domain) ──
  async redirects() {
    return [
      // Uncomment and update when you have a real domain:
      // {
      //   source: '/:path*',
      //   has: [{ type: 'host', value: 'www.yourdomain.com' }],
      //   destination: 'https://yourdomain.com/:path*',
      //   permanent: true,
      // },
    ]
  },
}

export default nextConfig
