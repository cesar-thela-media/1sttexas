import type { NextConfig } from 'next'
const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: { qualities: [75, 80, 90] },
}
export default nextConfig
