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

    // Ignore test files in node_modules
    webpackConfig.module = webpackConfig.module || {}
    webpackConfig.module.rules = webpackConfig.module.rules || []
    webpackConfig.module.rules.push({
      test: /[\\/]node_modules[\\/](thread-stream|pino)[\\/].*\.(test|spec)\.(js|ts)$/,
      use: 'null-loader',
    })

    // Also ignore the test directory entirely
    webpackConfig.resolve.alias = {
      ...webpackConfig.resolve.alias,
      'thread-stream/test': false,
      'pino/test': false,
    }

    return webpackConfig
  },

  // Server external packages (Node.js modules that should not be bundled)
  serverExternalPackages: [
    'pino',
    'pino-pretty',
    'thread-stream',
    'pino-worker',
    'sonic-boom',
    'real-require',
    'on-exit-leak-free',
  ],

  reactStrictMode: true,
  redirects,

  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-select'],
  },

  // Empty turbopack config to silence warning (we use --webpack flag for build)
  turbopack: {},
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
