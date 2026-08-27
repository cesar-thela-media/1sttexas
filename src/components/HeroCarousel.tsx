'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const slides = [
  { src: '/assets/reference/Clear-Lake-Texas-e1736781694121.jpg', alt: 'Clear Lake Texas waterfront homes' },
  { src: '/assets/reference/clearlaketxhomesforsale.jpg',         alt: 'Home for sale in Clear Lake TX' },
  { src: '/assets/reference/leaguecityhomesforsale.jpg',          alt: 'Home for sale in League City TX' },
  { src: '/assets/reference/seabrookhomesforsale.jpg',            alt: 'Home for sale in Seabrook TX' },
  { src: '/assets/reference/friendswoodhomesforsale.jpg',         alt: 'Home for sale in Friendswood TX' },
  { src: '/assets/reference/NASAhomesforsale.jpg',                alt: 'Home for sale near NASA Clear Lake' },
  { src: '/assets/reference/seabrookhomesforsale02.jpg',          alt: 'Waterfront home in Seabrook TX' },
]

export function HeroCarousel() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const interval = setInterval(() => setActive(a => (a + 1) % slides.length), 6000)
    return () => clearInterval(interval)
  }, [paused])

  useEffect(() => {
    const onVisibility = () => { if (document.hidden) setPaused(true); else setPaused(false) }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  return <section className="hero hero-carousel" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
    {slides.map((s, i) => (
      <div key={s.src} className={`hero-slide${i === active ? ' is-active' : ''}`} aria-hidden={i !== active}>
        <Image src={s.src} alt={s.alt} fill sizes="100vw" quality={80} priority={i === 0} loading={i === 0 ? undefined : 'lazy'} className="hero-slide-img" />
        <div className="hero-slide-scrim" />
      </div>
    ))}
    <div className="hero-gradient-overlay" aria-hidden="true" />
    <div className="hero-gradient-darken" aria-hidden="true" />
    <div className="hero-glow" aria-hidden="true" />
    <div className="hero-content" key={active}>
      <p className="hero-badge">Family owned since 2004 · Clear Lake NASA</p>
      <h1>Real estate guidance that feels <em>personal.</em></h1>
      <p className="hero-sub">Top 3% Realtors in Clear Lake, great reviews, and real-time listings for the next move in your story.</p>
      <div className="hero-actions">
        <Link className="button button-primary" href="/contact/">Contact a Realtor <span className="btn-icon">↗</span></Link>
        <Link className="button button-glass" href="/home-search/">Search homes <span className="btn-icon">↗</span></Link>
      </div>
      <div className="hero-trust"><div className="avatar-stack"><img src="/assets/reference/agents/David-Karstedt.jpg" alt="David Karstedt" /><img src="/assets/reference/agents/Mark-Bocado.jpg" alt="Mark Bocado" /><img src="/assets/reference/agents/Nancy-Estes.jpg" alt="Nancy Estes" /><img src="/assets/reference/agents/Matt-Bradley.jpg" alt="Matt Bradley" /></div><div><span className="stars" aria-label="Rated 5 out of 5 stars">★★★★★</span><small>Trusted by families across Clear Lake NASA</small></div></div>
      <div className="hero-features"><div><strong>Family owned</strong><small>Since 2004 in Clear Lake</small></div><div><strong>Top 3% Realtors</strong><small>Clear Lake NASA expertise</small></div><div><strong>Real-time listings</strong><small>Homes for sale &amp; rent</small></div></div>
    </div>
    <div className="hero-trust-notes"><span>Family owned since 2004</span><i /><span>Top 3% Realtors</span><i /><span>100+ years combined experience</span></div>
    <div className="hero-controls">{slides.map((_, i) => <button key={i} className={`hero-bar${i === active ? ' is-active' : ''}`} onClick={() => setActive(i)} aria-label={`Slide ${i + 1}`} />)}</div>
  </section>
}
