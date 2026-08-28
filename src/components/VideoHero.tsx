'use client'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

// Hero: each area has its own looping MP4. Only two <video> nodes are mounted
// at a time — Chrome silently refuses autoplay when 13 clips compete.
const AREAS = [
  { name: 'Clear Lake City', src: '/videos/hero-clear-lake-city.mp4', poster: '/assets/reference/clearlaketxhomesforsale.jpg', alt: 'Clear Lake City Texas aerial' },
  { name: 'League City',     src: '/videos/hero-league-city.mp4',     poster: '/assets/reference/leaguecityhomesforsale.jpg',  alt: 'League City Texas aerial' },
  { name: 'Seabrook',        src: '/videos/hero-seabrook.mp4',        poster: '/assets/reference/seabrookhomesforsale.jpg',    alt: 'Seabrook Texas aerial' },
  { name: 'Friendswood',     src: '/videos/hero-friendswood.mp4',     poster: '/assets/reference/friendswoodhomesforsale.jpg', alt: 'Friendswood Texas aerial' },
  { name: 'Kemah',           src: '/videos/hero-lakehouse.mp4',       poster: '/assets/reference/seabrookhomesforsale02.jpg',  alt: 'Lakeside home near Kemah' },
  { name: 'Nassau Bay',      src: '/videos/hero-golf.mp4',            poster: '/assets/reference/NASAhomesforsale.jpg',       alt: 'Aerial golf course near Nassau Bay' },
  { name: 'Galveston',       src: '/videos/hero-fishing.mp4',         poster: '/assets/reference/leaguecityhomesforsale.jpg',  alt: 'Fishing the Texas coast near Galveston' },
  { name: 'Pearland',        src: '/videos/hero-mower.mp4',           poster: '/assets/reference/clearlaketxhomesforsale.jpg', alt: 'Lawn care in Pearland Texas' },
  { name: 'Baytown',         src: '/videos/hero-construction.mp4',    poster: '/assets/reference/NASAhomesforsale.jpg',       alt: 'New home construction in Baytown' },
  { name: 'Dickinson',       src: '/videos/hero-mom-baby.mp4',        poster: '/assets/reference/clearlaketxhomesforsale.jpg', alt: 'Family life in Dickinson' },
  { name: 'Webster',         src: '/videos/hero-grandma.mp4',         poster: '/assets/reference/seabrookhomesforsale.jpg',    alt: 'Talking with loved ones in Webster' },
  { name: 'La Porte',        src: '/videos/hero-showing.mp4',         poster: '/assets/reference/leaguecityhomesforsale.jpg',  alt: 'Homes for sale in La Porte' },
  { name: 'Texas City',      src: '/videos/hero-bighouse.mp4',        poster: '/assets/reference/NASAhomesforsale.jpg',       alt: 'Luxury homes in Texas City' },
]

const HERO_LINES = [
  'Family Owned since 2004',
  'Top 3% Realtors in Clear Lake',
  'Great Reviews & Testimonials',
  'Local Realtors in Clear Lake',
  'Real Time Home Listings',
]

const SLIDE_MS = 2500

function armVideo(video: HTMLVideoElement) {
  video.muted = true
  video.defaultMuted = true
  video.playsInline = true
  video.setAttribute('muted', '')
  video.setAttribute('playsinline', '')
  video.setAttribute('webkit-playsinline', 'true')
}

export function VideoHero({ started = true }: { started?: boolean }) {
  const [active, setActive] = useState(0)
  const [visible, setVisible] = useState(0)
  const [playing, setPlaying] = useState<number | null>(null)
  const [headlineIndex, setHeadlineIndex] = useState(0)
  const [headlineVisible, setHeadlineVisible] = useState(true)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const activeRef = useRef(active)
  const visibleRef = useRef(visible)
  activeRef.current = active
  visibleRef.current = visible

  const next = (active + 1) % AREAS.length
  const warm = new Set([active, visible, next])

  useEffect(() => {
    if (!started) return
    const interval = setInterval(() => setActive(a => (a + 1) % AREAS.length), SLIDE_MS)
    return () => clearInterval(interval)
  }, [started])

  useEffect(() => {
    if (!started) return
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
  }, [active, started])

  useEffect(() => {
    if (!started) return
    const video = videoRefs.current[active]
    if (!video) return

    let cancelled = false
    armVideo(video)

    const markPlaying = () => {
      if (cancelled || videoRefs.current[active] !== video) return
      setVisible(active)
      setPlaying(active)
    }

    const startVideo = () => {
      if (cancelled || videoRefs.current[active] !== video) return
      armVideo(video)
      const attempt = video.play()
      if (attempt && typeof attempt.then === 'function') {
        attempt.then(markPlaying).catch(() => {})
      } else if (!video.paused) {
        markPlaying()
      }
    }

    video.addEventListener('loadeddata', startVideo)
    video.addEventListener('canplay', startVideo)
    video.addEventListener('playing', markPlaying)
    startVideo()

    videoRefs.current.forEach((v, i) => {
      if (v && i !== active && i !== visibleRef.current) v.pause()
    })

    return () => {
      cancelled = true
      video.removeEventListener('loadeddata', startVideo)
      video.removeEventListener('canplay', startVideo)
      video.removeEventListener('playing', markPlaying)
    }
  }, [active, started])

  // Chrome often blocks autoplay until a user gesture. First click/scroll retries.
  useEffect(() => {
    const retry = () => {
      const video = videoRefs.current[activeRef.current]
      if (!video) return
      armVideo(video)
      video.play().then(() => {
        setVisible(activeRef.current)
        setPlaying(activeRef.current)
      }).catch(() => {})
    }
    window.addEventListener('pointerdown', retry, { once: true })
    window.addEventListener('scroll', retry, { once: true, passive: true })
    return () => {
      window.removeEventListener('pointerdown', retry)
      window.removeEventListener('scroll', retry)
    }
  }, [])

  return <section className="video-hero" aria-label="1st Texas Realtors">
    <div className="video-hero-media" aria-hidden="true">
      {AREAS.map((area, i) => (
        <div key={area.name} className={`video-hero-slide${i === visible ? ' is-active' : ''}${i === active ? ' is-current' : ''}${i === playing ? ' is-playing' : ''}`}>
          <Image className="hero-poster" src={area.poster} alt="" fill sizes="100vw" priority={i === 0} loading={i === 0 || i === next ? 'eager' : 'lazy'} />
          {warm.has(i) && (
            <video
              ref={el => { videoRefs.current[i] = el }}
              muted
              loop
              playsInline
              autoPlay={i === active && started}
              preload={i === active ? 'auto' : 'metadata'}
              poster={area.poster}
              onPlaying={() => {
                if (i !== active) return
                setVisible(i)
                setPlaying(i)
              }}
              className="hero-video"
              aria-hidden="true"
            >
              <source src={area.src} type="video/mp4" />
            </video>
          )}
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
