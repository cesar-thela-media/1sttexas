'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

// Service pages — like the About page: ONE image pinned on the left (sticky),
// sections scroll on the right; when each section's text finishes, the pinned
// image transitions (crossfade + zoom) to the next image.
export type ServiceSection = { title: string; body: string }
export type ServiceAreaLink = { name: string; href: string }

export function StickyServicePage({
  eyebrow, title, intro, sections, images, ctaHref = '/contact/', ctaLabel = 'Talk with a Realtor',
  areaLinks, testimonial, mlsLine, areaNote,
}: {
  eyebrow: string
  title: string
  intro: string
  sections: ServiceSection[]
  images: string[]
  ctaHref?: string
  ctaLabel?: string
  areaLinks?: ServiceAreaLink[]
  testimonial?: { quote: string; author: string }
  mlsLine?: string
  areaNote?: string
}) {
  const [active, setActive] = useState(0)

  // scroll-spy: the active section drives which image shows in the pinned panel
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting)
        if (visible.length) {
          const top = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
          const idx = sections.findIndex(s => s.title === top.target.id)
          if (idx >= 0) setActive(idx)
        }
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: 0 }
    )
    sections.forEach((s, i) => {
      const el = document.getElementById(`svc-${i}`)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [sections])

  const panelImages = images.length === sections.length ? images : sections.map((_, i) => images[Math.min(i, images.length - 1)])

  return <div className="svcpage-layout">
    {/* LEFT — the single stationary (sticky) image panel; changes as sections finish */}
    <div className="svcpage-media">
      <div className="svcpage-panel">
        {panelImages.map((src, i) => (
          <div key={i} className={`svcpage-img${active === i ? ' is-active' : ''}`} aria-hidden={active !== i || undefined}>
            <Image src={src} alt={sections[i]?.title ?? title} fill sizes="(max-width: 900px) 100vw, 42vw" className="svcpage-photo" priority={i === 0} />
          </div>
        ))}
        <span className="svcpage-label">{eyebrow} · {String(active + 1).padStart(2, '0')}</span>
      </div>
    </div>

    {/* RIGHT — the text scrolls; when each section's text finishes, the image changes */}
    <div className="svcpage-content">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="display-section svcpage-title">{title}</h1>
      <p className="svcpage-intro">{intro}</p>
      {areaLinks && (
        <div className="svc-area-links">
          <h2 className="svc-area-links-title">View Homes for Sale:</h2>
          <div className="svc-area-links-row">
            {areaLinks.map((a, i) => <Link key={a.name} href={a.href} className="svc-area-link">{a.name}{i < areaLinks.length - 1 && <span className="svc-area-sep">|</span>}</Link>)}
          </div>
        </div>
      )}
      {sections.map((section, i) => (
        <section key={section.title} id={`svc-${i}`} className="svcpage-section">
          <h2>{section.title}</h2>
          <p>{section.body}</p>
        </section>
      ))}
      {mlsLine && <p className="svc-mls-line">{mlsLine}</p>}
      {testimonial && (
        <figure className="svc-testimonial">
          <blockquote>“{testimonial.quote}”</blockquote>
          <figcaption>— {testimonial.author}</figcaption>
        </figure>
      )}
      {areaNote && <h2 className="svc-area-note">{areaNote}</h2>}
      <div className="page-cta"><p>For immediate assistance, call <strong>(281) 241-3121</strong>.</p><Link className="button button-dark" href={ctaHref}>{ctaLabel} <span>↗</span></Link></div>
    </div>
  </div>
}
