'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

// About page — like basehabitation.com: ONE image pinned on the left
// (sticky/stationary). The text scrolls on the right; when each section's
// text finishes, the pinned image transitions (crossfade + zoom) to the next.
const sections = [
  {
    id: 'about-story',
    image: '/assets/client/Team-239.jpg',
    alt: 'The 1st Texas Realtors team',
    label: '01 · Our story',
  },
  {
    id: 'about-services',
    image: '/assets/client/Karstedt-e1780697422281.jpg',
    alt: 'The Karstedt family celebrating with clients',
    label: '02 · A full-service brokerage',
  },
  {
    id: 'about-buy-sell',
    image: '/assets/client/David-Simone-239.jpg',
    alt: 'David and Simone Karstedt',
    label: '03 · Buying & selling',
  },
]

// word-split + mask reveal on scroll (basehabitation wordsMask feel)
function MaskHeadline({ text, accent }: { text: string; accent: string }) {
  const ref = useRef<HTMLHeadingElement>(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { setOn(true); obs.disconnect() } })
    }, { threshold: 0.35 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  const accentKey = accent.replace(/[.,!]/g, '').toLowerCase()
  const words = text.split(/\s+/).filter(Boolean)
  let idx = 0
  return <h2 className={`display-section mask-headline${on ? ' is-on' : ''}`} ref={ref as never} aria-label={text}>
    <span className="mask-line">{words.map((w, i) => {
      const isAccent = w.replace(/[.,!]/g, '').toLowerCase() === accentKey
      const delay = 0.08 * (idx++)
      return <span key={i} className={`mask-word${isAccent ? ' mask-accent' : ''}`} style={{ transitionDelay: `${delay}s` }}>{w}</span>
    })}</span>
  </h2>
}

export function StickyAbout() {
  const [active, setActive] = useState(0)

  // scroll-spy: the active section drives which image is shown in the pinned panel
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting)
        if (visible.length) {
          const top = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
          const idx = sections.findIndex(s => s.id === top.target.id)
          if (idx >= 0) setActive(idx)
        }
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: 0 }
    )
    sections.forEach(s => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return <div className="about-sticky-layout">
    {/* LEFT — the single stationary (sticky) image panel; changes as sections finish */}
    <div className="about-sticky-media">
      <div className="about-sticky-panel">
        {sections.map((s, i) => (
          <div key={s.id} className={`about-sticky-img${active === i ? ' is-active' : ''}`} aria-hidden={active !== i || undefined}>
            <Image src={s.image} alt={s.alt} fill sizes="(max-width: 900px) 100vw, 42vw" className="about-sticky-photo" priority={i === 0} />
          </div>
        ))}
        <span className="about-sticky-label">{sections[active].label}</span>
      </div>
    </div>

    {/* RIGHT — the text scrolls; when each section's text finishes, the image changes */}
    <div className="about-sticky-content">
      <section id="about-story" className="about-section">
        <p className="eyebrow">Since 2004</p>
        <MaskHeadline text="We get it right the first time." accent="right." />
        <p><strong>1st Texas Realtors</strong> for a full service real estate brokerage operated by husband and wife, <strong>David &amp; Simone Karstedt</strong>, and a host of expert Realtors totaling over <strong>100-years combined experience</strong>. When you hire one, you get the experience and knowledge of all. If you’re looking for a Realtor in the Clear Lake NASA area, we’re glad you came to our website. Every year since 2010, we have been named by <strong>Texas Monthly Magazine</strong> as Top 3% Realtors in the NASA Clear Lake area. Real estate, or your home, might be the biggest transaction of your life so having a great relationship with clients is our priority.</p>
        <p>As life long residents of the Clear Lake area, <strong>we know the neighborhoods, schools, grocery stores, commutes and many people.</strong></p>
      </section>

      <section id="about-services" className="about-section">
        <p className="eyebrow">Broker &amp; expert Realtors</p>
        <MaskHeadline text="A full-service brokerage." accent="brokerage." />
        <ul className="about-bullets">
          <li>Broker and expert Realtors.</li>
          <li>Real-time MLS Home Search and property listings.</li>
          <li>Full Service Real Estate Brokerage.</li>
          <li>Represent Home Buyers and Sellers.</li>
          <li>REO Broker, Foreclosure, Asset Companies.</li>
          <li>Negotiation and Transaction Coordination.</li>
          <li>Commercial Real Estate.</li>
          <li>New Home Construction and Builders.</li>
          <li>Home Renting, Property Management and Leasing.</li>
        </ul>
      </section>

      <section id="about-buy-sell" className="about-section">
        <p className="eyebrow">Buying · Selling · Renting</p>
        <MaskHeadline text="Guidance at every step." accent="every step." />
        <p>If you are interested in buying or renting a home, use our <Link className="text-link" href="/home-search/">Home Search <span>↗</span></Link> to view real-time home listings. If you’re selling, we’ll complete a <strong>no-obligation Market Analysis</strong> to determine the most accurate price for your home using comparable home sales, current listings and comparing all amenities.</p>
        <p><Link className="text-link" href="/contact/">Click here to Contact a Realtor <span>↗</span></Link>. Our team of talented Realtors provide you with the critical elements of success; local experience, dedication to customer service and real-time property listings. Every year since 2010, we have been recognized by <strong>Texas Monthly</strong> as Top 3% Realtors in the NASA – Clear Lake area.</p>
        <p className="about-callout">For immediate assistance, please call <a href="tel:+12812413121"><strong>(281) 241-3121</strong></a>.</p>
        <div className="about-side-ctas">
          <div><Link className="button button-dark" href="/home-search/">Home Search <span>↗</span></Link><p>Use our free MLS Home Search to browse homes for sale.</p></div>
          <div><Link className="button button-dark" href="/contact/">Contact Us <span>↗</span></Link><p>Send us an email with any questions you have about Realtors and services.</p></div>
        </div>
      </section>
    </div>
  </div>
}
