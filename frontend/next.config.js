/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output for optimal Vercel deployment
  output: 'standalone',

  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },

  // Environment variables configuration
  env: {
    // These will be available as process.env.NEXT_PUBLIC_* on client side
    // Define server-only env vars in your .env.local without NEXT_PUBLIC_ prefix
  },

  // TypeScript and linting
  typescript: {
    // Set this to false if you want production builds to succeed even if there are type errors
    tsconfigPath: './tsconfig.json',
  },

  // Optimization settings
  experimental: {},
}

module.exports = nextConfig
