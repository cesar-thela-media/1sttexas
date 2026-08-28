import type { MetadataRoute } from 'next'
import { canonicalPublicPaths } from '@/content/paths'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://1sttexasrealtors.com'

export default function sitemap(): MetadataRoute.Sitemap {
  return canonicalPublicPaths.map(path => ({
    url: path === '/' ? `${baseUrl}/` : `${baseUrl}${path}`,
    changeFrequency: path === '/' ? 'weekly' as const : 'monthly' as const,
    priority: path === '/' ? 1 : path.split('/').filter(Boolean).length > 1 ? 0.6 : 0.8,
  }))
}
