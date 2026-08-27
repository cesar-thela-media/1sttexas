'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

// Hero: "SERVING {area} AND NEARBY" — each area has its OWN high-quality
// looping motion clip (an MP4 "video GIF"). The 4 original aerial clips are
// kept; the rest are real stock motion scenes sourced for this hero. The area
// text and its clip change TOGETHER every 2.5 seconds, instantly (no crossfade).
const AREAS = [
  // original aerial clips (unchanged)
  { name: 'Clear Lake City', src: '/videos/hero-clear-lake-city.mp4', poster: '/assets/reference/Clear-Lake-Texas-e1736781694121.jpg', alt: 'Clear Lake City Texas aerial' },
  { name: 'League City',     src: '/videos/hero-league-city.mp4',     poster: '/assets/reference/leaguecityhomesforsale.jpg',          alt: 'League City Texas aerial' },
  { name: 'Seabrook',        src: '/videos/hero-seabrook.mp4',        poster: '/assets/reference/seabrookhomesforsale.jpg',            alt: 'Seabrook Texas aerial' },
  { name: 'Friendswood',     src: '/videos/hero-friendswood.mp4',     poster: '/assets/reference/friendswoodhomesforsale.jpg',         alt: 'Friendswood Texas aerial' },
  // new real-motion scenes for the other service areas
  { name: 'Kemah',           src: '/videos/hero-lakehouse.mp4',  poster: '/assets/reference/seabrookhomesforsale02.jpg',          alt: 'Lakeside home near Kemah' },
  { name: 'Nassau Bay',      src: '/videos/hero-golf.mp4',            poster: '/assets/reference/clearlaketxhomesforsale.jpg',         alt: 'Aerial golf course near Nassau Bay' },
  { name: 'Galveston',       src: '/videos/hero-fishing.mp4',         poster: '/assets/reference/leaguecityhomesforsale.jpg',          alt: 'Fishing the Texas coast near Galveston' },
  { name: 'Pearland',        src: '/videos/hero-mower.mp4',           poster: '/assets/reference/NASAhomesforsale.jpg',               alt: 'Lawn care in Pearland Texas' },
  { name: 'Baytown',         src: '/videos/hero-construction.mp4',    poster: '/assets/reference/Clear-Lake-Texas-e1736781694121.jpg', alt: 'New home construction in Baytown' },
  { name: 'Dickinson',       src: '/videos/hero-mom-baby.mp4',        poster: '/assets/reference/clearlaketxhomesforsale.jpg',         alt: 'Family life in Dickinson' },
  { name: 'Webster',         src: '/videos/hero-grandma.mp4',         poster: '/assets/reference/seabrookhomesforsale.jpg',            alt: 'Talking with loved ones in Webster' },
  { name: 'La Porte',        src: '/videos/hero-showing.mp4',         poster: '/assets/reference/leaguecityhomesforsale.jpg',          alt: 'Homes for sale in La Porte' },
  { name: 'Texas City',      src: '/videos/hero-bighouse.mp4',        poster: '/assets/reference/NASAhomesforsale.jpg',               alt: 'Luxury homes in Texas City' },
]

const SLIDE_MS = 2500 // 2.5 seconds per area — text + motion clip change together, instant cut

export function VideoHero({ started = true }: { started?: boolean }) {
  const [active, setActive] = useState(0)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  // single 2.5s timer drives BOTH the area text and its motion clip
  useEffect(() => {
    if (!started) return
    const interval = setInterval(() => setActive(a => (a + 1) % AREAS.length), SLIDE_MS)
    return () => clearInterval(interval)
  }, [started])

  // only the ACTIVE clip plays; others pause at frame 1 (no simultaneous
  // decode, no stutter, no flicker when switching)
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return
      if (i === active) { v.currentTime = 0; v.play().catch(() => {}) }
      else v.pause()
    })
  }, [active, started])

  return <section className="video-hero" aria-label="1st Texas Realtors">
    <div className="video-hero-media" aria-hidden="true">
      {AREAS.map((area, i) => (
        <div key={area.name} className={`video-hero-slide${i === active ? ' is-active' : ''}`}>
          <Image className="hero-poster" src={area.poster} alt="" fill sizes="100vw" priority={i === 0} loading={i === 0 ? undefined : 'lazy'} />
          {/* all videos preload (buffered before their turn); the effect plays only the ACTIVE one and pauses the rest */}
          <video
            ref={el => { videoRefs.current[i] = el }}
            muted loop playsInline preload="auto" poster={area.poster}
            className="hero-video" aria-hidden="true"
          >
            <source src={area.src} type="video/mp4" />
          </video>
        </div>
      ))}
    </div>
    <div className="video-hero-overlay" aria-hidden="true" />
    <div className="video-hero-glow" aria-hidden="true" />
    <div className="video-hero-content">
      <h1 className="display-hero" style={{ opacity: 0, transform: 'translateY(32px)', animation: 'heroUp 1s var(--ease-expo) forwards .15s' }}>
        <span className="hero-line">Real estate guidance</span>
        <span className="hero-line hero-line-accent">that feels personal.</span>
      </h1>
      {/* area cycler — text changes every 2.5s, synced with the motion clip */}
      <p className="video-hero-cycler" style={{ opacity: 0, transform: 'translateY(24px)', animation: 'heroUp 1s var(--ease-expo) forwards .3s' }}>
        <span className="mono-label">Serving</span>
        <span className="cycler-line" aria-live="polite"><span key={active} className="cycler-word">{AREAS[active].name}</span></span>
        <span className="mono-label">and nearby</span>
      </p>
      <p className="video-hero-sub" style={{ opacity: 0, transform: 'translateY(24px)', animation: 'heroUp 1s var(--ease-expo) forwards .45s' }}>Top 3% Realtors in Clear Lake, great reviews, and real-time listings for the next move in your story.</p>
      <form className="hero-search" action="/home-search/" method="get" style={{ opacity: 0, transform: 'translateY(24px)', animation: 'heroUp 1s var(--ease-expo) forwards .6s' }}><input name="q" placeholder="Search homes in Clear Lake" aria-label="Search homes" /><button type="submit" aria-label="Search"><span>↗</span></button></form>
      <div className="hero-actions" style={{ opacity: 0, transform: 'translateY(24px)', animation: 'heroUp 1s var(--ease-expo) forwards .75s' }}><Link className="button button-red" href="/contact/">Contact a Realtor <span className="btn-arrow" aria-hidden="true">→</span></Link><Link className="button button-glass" href="/home-search/">Browse listings <span className="btn-arrow" aria-hidden="true">→</span></Link></div>
    </div>
    <div className="video-hero-proof"><div className="hero-trust"><div className="avatar-stack"><img src="/assets/reference/agents/David-Karstedt.jpg" alt="David Karstedt" /><img src="/assets/reference/agents/Mark-Bocado.jpg" alt="Mark Bocado" /><img src="/assets/reference/agents/Nancy-Estes.jpg" alt="Nancy Estes" /><img src="/assets/reference/agents/Matt-Bradley.jpg" alt="Matt Bradley" /></div><div><span className="stars" aria-label="Rated 5 out of 5 stars">★★★★★</span><small>Trusted by families across Clear Lake NASA</small></div></div><div className="hero-features"><div><strong>Family owned</strong><small>Since 2004 in Clear Lake</small></div><div><strong>Top 3% Realtors</strong><small>Clear Lake NASA expertise</small></div><div><strong>Real-time listings</strong><small>Homes for sale &amp; rent</small></div></div></div>
  </section>
}
