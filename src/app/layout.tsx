import type { Metadata, Viewport } from 'next'
import { Geist, Manrope } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

// Geist for body/UI text, Manrope for headings
const geist = Geist({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const display = Manrope({ subsets: ['latin'], weight: ['500', '600', '700', '800'], variable: '--font-display', display: 'swap' })

export const metadata: Metadata = {
  title: 'Clear Lake Tx Realtors | Realtors in Clear Lake Texas',
  description: '1st Texas Realtors in Clear Lake — local realtors, real-time listings, buying, selling, renting, and property management.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://1sttexasrealtors.com'),
  openGraph: { title: '1st Texas Realtors', description: 'Local real estate guidance in Clear Lake NASA and surrounding communities.', type: 'website' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn('font-sans', geist.variable)}>
      <body className={`${geist.variable} ${display.variable}`}>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'RealEstateAgent',
              name: '1st Texas Realtors',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://1sttexasrealtors.com',
              telephone: '+1-281-241-3121',
              email: 'info@1sttexasrealtors.com',
              areaServed: 'Clear Lake NASA, Texas',
            }),
          }}
        />
      </body>
    </html>
  )
}
