'use client'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

// Hero: "SERVING {area} AND NEARBY" — each area has its OWN high-quality
// looping motion clip (an MP4 "video GIF"). The 4 original aerial clips are
// kept; the rest are real stock motion scenes sourced for this hero. The area
// text and its clip change TOGETHER every 2.5 seconds; the headline fades between
// phrases so the video scene and the copy do not feel like a hard cut.
const AREAS = [
  // original aerial clips (unchanged)
  { name: 'Clear Lake City', src: '/videos/hero-clear-lake-city.mp4', poster: '/assets/reference/clearlaketxhomesforsale.jpg',         alt: 'Clear Lake City Texas aerial' },
  { name: 'League City',     src: '/videos/hero-league-city.mp4',     poster: '/assets/reference/leaguecityhomesforsale.jpg',          alt: 'League City Texas aerial' },
  { name: 'Seabrook',        src: '/videos/hero-seabrook.mp4',        poster: '/assets/reference/seabrookhomesforsale.jpg',            alt: 'Seabrook Texas aerial' },
  { name: 'Friendswood',     src: '/videos/hero-friendswood.mp4',     poster: '/assets/reference/friendswoodhomesforsale.jpg',         alt: 'Friendswood Texas aerial' },
  // new real-motion scenes for the other service areas
  { name: 'Kemah',           src: '/videos/hero-lakehouse.mp4',  poster: '/assets/reference/seabrookhomesforsale02.jpg',          alt: 'Lakeside home near Kemah' },
  { name: 'Nassau Bay',      src: '/videos/hero-golf.mp4',            poster: '/assets/reference/NASAhomesforsale.jpg',               alt: 'Aerial golf course near Nassau Bay' },
  { name: 'Galveston',       src: '/videos/hero-fishing.mp4',         poster: '/assets/reference/leaguecityhomesforsale.jpg',          alt: 'Fishing the Texas coast near Galveston' },
  { name: 'Pearland',        src: '/videos/hero-mower.mp4',           poster: '/assets/reference/clearlaketxhomesforsale.jpg',         alt: 'Lawn care in Pearland Texas' },
  { name: 'Baytown',         src: '/videos/hero-construction.mp4',    poster: '/assets/reference/NASAhomesforsale.jpg',               alt: 'New home construction in Baytown' },
  { name: 'Dickinson',       src: '/videos/hero-mom-baby.mp4',        poster: '/assets/reference/clearlaketxhomesforsale.jpg',         alt: 'Family life in Dickinson' },
  { name: 'Webster',         src: '/videos/hero-grandma.mp4',         poster: '/assets/reference/seabrookhomesforsale.jpg',            alt: 'Talking with loved ones in Webster' },
  { name: 'La Porte',        src: '/videos/hero-showing.mp4',         poster: '/assets/reference/leaguecityhomesforsale.jpg',          alt: 'Homes for sale in La Porte' },
  { name: 'Texas City',      src: '/videos/hero-bighouse.mp4',        poster: '/assets/reference/NASAhomesforsale.jpg',               alt: 'Luxury homes in Texas City' },
]

const HERO_LINES = [
  'Family Owned since 2004',
  'Top 3% Realtors in Clear Lake',
  'Great Reviews & Testimonials',
  'Local Realtors in Clear Lake',
  'Real Time Home Listings',
]

const SLIDE_MS = 2500 // 2.5 seconds per area — text + motion clip change together

export function VideoHero({ started = true }: { started?: boolean }) {
  const [active, setActive] = useState(0)
  const [visible, setVisible] = useState(0)
  const [playing, setPlaying] = useState<number | null>(null)
  const [headlineIndex, setHeadlineIndex] = useState(0)
  const [headlineVisible, setHeadlineVisible] = useState(true)
  const [motionPreference, setMotionPreference] = useState<'pending' | 'full' | 'reduce'>('full')
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const readyVideos = useRef(new Set<number>())
  const activeRef = useRef(active)
  const visibleRef = useRef(visible)
  activeRef.current = active
  visibleRef.current = visible

  // Do not start or rotate media until the browser has reported its motion
  // preference. This avoids a client-only preference race during hydration.
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setMotionPreference(mediaQuery.matches ? 'reduce' : 'full')
    updatePreference()
    if (mediaQuery.addEventListener) mediaQuery.addEventListener('change', updatePreference)
    else mediaQuery.addListener(updatePreference)
    return () => {
      if (mediaQuery.removeEventListener) mediaQuery.removeEventListener('change', updatePreference)
      else mediaQuery.removeListener(updatePreference)
    }
  }, [])

  // A single fixed timer keeps scene changes deterministic. Video duration is
  // intentionally not used here because clips have different lengths.
  useEffect(() => {
    if (!started || motionPreference !== 'full') return
    const interval = setInterval(() => setActive(a => (a + 1) % AREAS.length), SLIDE_MS)
    return () => clearInterval(interval)
  }, [started, motionPreference])

  // Let the headline breathe over the current scene, then crossfade it halfway
  // through the same fixed scene interval.
  useEffect(() => {
    if (!started || motionPreference !== 'full') return
    let revealTimer: ReturnType<typeof setTimeout> | undefined
    const fadeTimer = setTimeout(() => {
      setHeadlineVisible(false)
      revealTimer = setTimeout(() => {
        setHeadlineIndex(i => (i + 1) % HERO_LINES.length)
        setHeadlineVisible(true)
      }, 180)
    }, SLIDE_MS / 2)
    return () => {
      clearTimeout(fadeTimer)
      if (revealTimer) clearTimeout(revealTimer)
    }
  }, [active, started, motionPreference])

  // Keep the active clip playing. Reveal it as soon as it can render a frame so
  // we never leave a paused outgoing slide on screen while the next one loads.
  useEffect(() => {
    const shouldPlay = started && motionPreference === 'full'
    const video = videoRefs.current[active]
    if (!shouldPlay) {
      videoRefs.current.forEach(v => { v?.pause() })
      setPlaying(null)
      return
    }

    if (!video) return

    let cancelled = false
    const markPlaying = () => {
      if (cancelled || videoRefs.current[active] !== video) return
      setVisible(active)
      setPlaying(active)
    }

    const startVideo = () => {
      if (cancelled || videoRefs.current[active] !== video) return
      if (video.readyState < 2) return
      const playAttempt = video.play()
      if (playAttempt && typeof playAttempt.then === 'function') {
        playAttempt.then(markPlaying).catch(() => {
          // Autoplay blocked — poster stays visible; do not flip to "playing".
          if (!cancelled) setPlaying(current => (current === active ? null : current))
        })
      } else if (!video.paused) {
        markPlaying()
      }
    }

    video.addEventListener('loadeddata', startVideo)
    video.addEventListener('canplay', startVideo)
    video.addEventListener('playing', markPlaying)
    startVideo()
    if (readyVideos.current.has(active)) setVisible(active)

    // Pause clips that are neither the new active nor the one still on screen.
    videoRefs.current.forEach((v, i) => {
      if (v && i !== active && i !== visibleRef.current) v.pause()
    })

    return () => {
      cancelled = true
      video.removeEventListener('loadeddata', startVideo)
      video.removeEventListener('canplay', startVideo)
      video.removeEventListener('playing', markPlaying)
      const outgoing = video
      window.setTimeout(() => {
        if (videoRefs.current[activeRef.current] !== outgoing) outgoing.pause()
      }, 900)
    }
  }, [active, started, motionPreference])

  const revealReadyVideo = (index: number) => {
    readyVideos.current.add(index)
    if (index === active && started && motionPreference === 'full') setVisible(index)
  }

  return <section className="video-hero" aria-label="1st Texas Realtors">
    <div className="video-hero-media" aria-hidden="true">
      {AREAS.map((area, i) => (
        <div key={area.name} className={`video-hero-slide${i === visible ? ' is-active' : ''}${i === active ? ' is-current' : ''}${i === playing ? ' is-playing' : ''}`}>
          <Image className="hero-poster" src={area.poster} alt="" fill sizes="100vw" priority={i === 0} loading={i === 0 || i === (active + 1) % AREAS.length ? 'eager' : 'lazy'} />
          {/* Keep only the current and next clip warm; the rest retain a poster
              and metadata without competing for decode bandwidth. */}
          <video
            ref={el => {
              videoRefs.current[i] = el
              if (el) el.setAttribute('webkit-playsinline', 'true')
            }}
            muted
            loop
            playsInline
            autoPlay={i === active && started && motionPreference === 'full'}
            preload={i === active || i === (active + 1) % AREAS.length ? 'auto' : 'metadata'}
            poster={area.poster}
            onLoadedData={() => revealReadyVideo(i)}
            onPlaying={() => {
              if (i !== active) return
              setVisible(i)
              setPlaying(i)
            }}
            onError={() => {
              revealReadyVideo(i)
              if (i === active) setPlaying(null)
            }}
            className="hero-video"
            aria-hidden="true"
          >
            <source src={area.src} type="video/mp4" />
          </video>
        </div>
      ))}
    </div>
    <div className="video-hero-overlay" aria-hidden="true" />
    <div className="video-hero-glow" aria-hidden="true" />
    <div className="video-hero-content">
      <h1 className="display-hero">
        <span className={`hero-line hero-line-transition${headlineVisible ? ' is-visible' : ' is-fading'}`}>{HERO_LINES[headlineIndex]}</span>
        <span className="hero-line hero-line-accent">1st Texas Realtors</span>
      </h1>
      <p className="video-hero-sub">Family Owned since 2004 · Top 3% Realtors in Clear Lake · Great Reviews &amp; Testimonials · Local Realtors in Clear Lake · Real Time Home Listings</p>
      <form className="hero-search" action="/home-search/" method="get"><input name="q" placeholder="Search homes in Clear Lake" aria-label="Search homes" /><button type="submit" aria-label="Search"><span>↗</span></button></form>
    </div>
    <div className="video-hero-proof"><div className="hero-trust"><div className="avatar-stack"><img src="/assets/reference/agents/David-Karstedt.jpg" alt="David Karstedt" /><img src="/assets/reference/agents/Mark-Bocado.jpg" alt="Mark Bocado" /><img src="/assets/reference/agents/Nancy-Estes.jpg" alt="Nancy Estes" /><img src="/assets/reference/agents/Matt-Bradley.jpg" alt="Matt Bradley" /></div><div><span className="stars" aria-label="Rated 5 out of 5 stars">★★★★★</span><small>Trusted by families across Clear Lake NASA</small></div></div><div className="hero-features"><div><strong>Family owned</strong><small>Since 2004 in Clear Lake</small></div><div><strong>Top 3% Realtors</strong><small>Clear Lake NASA expertise</small></div><div><strong>Real-time listings</strong><small>Homes for sale &amp; rent</small></div></div></div>
  </section>
}
