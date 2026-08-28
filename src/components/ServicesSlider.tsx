'use client'

import Link from 'next/link'
import { IDX_SIGNUP_URL } from '@/content/idx'
import { salePath, serviceAreas } from '@/content/site'

// Sticky stack: each item is a true edge-to-edge viewport SECTION.
// Next section slides over and covers the previous one (paper stack).

export type ServiceItem = {
  title: string
  body: string
  href: string
  image: string
  badge: string
  cta?: string
  showAreas?: boolean
}

function StickySection({
  service,
  index,
}: {
  service: ServiceItem
  index: number
}) {
  return (
    <div className="svc-section-pin" style={{ zIndex: index + 1 }}>
      <section className="svc-section-panel" aria-label={service.title}>
        <div className="svc-section-media">
          <img
            src={service.image}
            alt={service.title}
            loading={index === 0 ? 'eager' : 'lazy'}
          />
          <span className="svc-stack-badge">{service.badge}</span>
        </div>
        <div className="svc-section-body">
          <p className="eyebrow">{service.badge}</p>
          <h3>{service.title}</h3>
          <p>{service.body}</p>
          {service.showAreas && (
            <div className="svc-stack-areas">
              <p className="area-note">View homes for sale:</p>
              <div className="area-directory">
                <div className="area-grid">
                  {serviceAreas.slice(0, 8).map(area => (
                    <Link key={area} href={salePath(area)}>{area}<span>↗</span></Link>
                  ))}
                </div>
                <details className="area-more">
                  <summary>More areas <span aria-hidden="true">↗</span></summary>
                  <div className="area-grid">
                    {serviceAreas.slice(8).map(area => (
                      <Link key={area} href={salePath(area)}>{area}<span>↗</span></Link>
                    ))}
                  </div>
                </details>
              </div>
              <p className="svc-stack-register">
                <a className="text-link" href={IDX_SIGNUP_URL} target="_blank" rel="noopener noreferrer">
                  Register <span>↗</span>
                </a>
                {' '}for email alerts on new listings.
              </p>
            </div>
          )}
          <Link className="button button-navy svc-stack-cta" href={service.href}>
            {service.cta ?? 'Learn more'} <span className="btn-icon">↗</span>
          </Link>
        </div>
      </section>
    </div>
  )
}

export function ServicesSlider({ services }: { services: ServiceItem[] }) {
  if (services.length === 0) return null

  return (
    <div className="svc-section-stack" aria-label="Our services">
      {services.map((service, index) => (
        <StickySection key={service.title} service={service} index={index} />
      ))}
    </div>
  )
}
