import type { MetadataRoute } from 'next'
import { allStaticPaths } from '@/content/site'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://1sttexasrealtors.com'

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${baseUrl}/`, changeFrequency: 'weekly', priority: 1 }, ...allStaticPaths.map(path => ({ url: `${baseUrl}/${path}/`, changeFrequency: 'monthly' as const, priority: path.includes('/') ? .6 : .8 }))]
}
