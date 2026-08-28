import type { NextConfig } from 'next'
import { IDX_LOGIN_URL, IDX_SIGNUP_URL } from './src/content/idx'
import { permanentRedirects } from './src/content/paths'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Standalone is for Docker/Railway. Vercel sets VERCEL=1 and uses its own runner.
  ...(process.env.VERCEL ? {} : { output: 'standalone' as const }),
  trailingSlash: true,
  images: { qualities: [75, 80, 90] },
  async redirects() {
    return [
      // Local register/login pages are retired — send users to live IDX.
      { source: '/register', destination: IDX_SIGNUP_URL, permanent: true },
      { source: '/register/', destination: IDX_SIGNUP_URL, permanent: true },
      { source: '/login', destination: IDX_LOGIN_URL, permanent: true },
      { source: '/login/', destination: IDX_LOGIN_URL, permanent: true },
      ...permanentRedirects.map(({ source, destination, statusCode }) => ({
        source,
        destination,
        statusCode,
      })),
    ]
  },
}

export default nextConfig
