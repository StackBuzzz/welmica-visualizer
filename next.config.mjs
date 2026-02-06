import { withPayload } from '@payloadcms/next/withPayload';

const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  compiler: {
    removeConsole: isProd
  },
  turbopack: {},
  trailingSlash: false, // Nextjs bug prevents revalidatePath if trailingSlash = true
  sassOptions: {
    quietDeps: true // Silence deprecation warnings from dependencies
  },
  typedRoutes: false,

  async headers() {
    if (!isProd) return [];

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value:
              'camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=()'
          },
          {
            key: 'Content-Security-Policy',
            value: 'upgrade-insecure-requests'
          }
        ]
      }
    ];
  }
};

export default withPayload(nextConfig);
