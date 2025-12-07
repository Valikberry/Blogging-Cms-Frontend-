import { withPayload } from '@payloadcms/next/withPayload'
import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL].map((item) => {
        const url = new URL(item)

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', ''),
        }
      }),
      {
        hostname: '**.blob.vercel-storage.com',
        protocol: 'https',
      },
      {
        hostname: '**.public.blob.vercel-storage.com',
        protocol: 'https',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },

  // Your existing webpack config (keep this)
  webpack: (webpackConfig, { isServer }) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    // Fix for pino/thread-stream in serverless environments
    if (isServer) {
      webpackConfig.externals = webpackConfig.externals || []
      webpackConfig.externals.push({
        'thread-stream': 'commonjs thread-stream',
        'pino-worker': 'commonjs pino-worker',
        'pino-pretty': 'commonjs pino-pretty',
      })
    }

    return webpackConfig
  },

  // Transpile payload packages
  transpilePackages: ['payload', '@payloadcms/next', '@payloadcms/ui'],

  // Server external packages (Node.js modules that should not be bundled)
  serverExternalPackages: ['pino', 'pino-pretty', 'thread-stream'],

  reactStrictMode: true,
  redirects,

  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-select'],

    // 🔥<<< ADD THIS LINE TO FIX THE BUILD
    turbo: false,
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
