'use client'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

// NWS-style services coverflow carousel:
// - the MIDDLE card is bigger than its neighbors, focused card stays centered
// - SEAMLESS INFINITE LOOP: cards are rendered 4x and the position advances
//   only rightward; at the wrap point the position resets invisibly (identical
//   card copies) so the loop never jumps backwards
// - auto-advances every 3 seconds (loading progress on the active dot)
// - pauses on hover
export type ServiceItem = { title: string; body: string; href: string; image: string; badge: string }

const GAP = 18
const START = 7 // visual start index (center of the 2nd copy => services[0])

export function ServicesSlider({ services }: { services: ServiceItem[] }) {
  const n = services.length
  const [pos, setPos] = useState(START) // visual position into the 4x expanded list
  const [anim, setAnim] = useState(true) // false during the invisible wrap reset
  const [cardW, setCardW] = useState(360)
  const [progressKey, setProgressKey] = useState(0)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const hover = useRef(false)
  const cardRef = useRef<HTMLElement | null>(null)

  // measure the actual card LAYOUT width so centering works at every screen
  // size — offsetWidth ignores the scale transform (getBoundingClientRect
  // would report a scaled width and break the centering math)
  useEffect(() => {
    const measure = () => {
      if (cardRef.current) {
        const w = cardRef.current.offsetWidth
        if (w > 0) setCardW(w)
      }
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (cardRef.current) ro.observe(cardRef.current)
    window.addEventListener('resize', measure)
    return () => { ro.disconnect(); window.removeEventListener('resize', measure) }
  }, [])

  // auto-advance every 3 seconds — always to the right; at the wrap point
  // (pos 14 == services[0] again) reset invisibly to pos 7 (identical copy)
  useEffect(() => {
    const tick = () => {
      if (hover.current) return
      setPos(p => {
        if (p >= 14) {
          setAnim(false)
          setTimeout(() => setAnim(true), 90)
          return START
        }
        return p + 1
      })
      setProgressKey(k => k + 1)
    }
    timer.current = setInterval(tick, 3000)
    return () => { if (timer.current) clearInterval(timer.current) }
  }, [])

  const go = useCallback((target: number) => {
    // jump to the given service (0..n-1) at its position in the 2nd copy
    setPos(target + START)
    setProgressKey(k => k + 1)
  }, [])

  // render 4 identical copies so rightward motion never runs out of cards
  const loop = [...services, ...services, ...services, ...services]
  const activeIndex = pos % n
  const trackX = `calc(50% - ${pos * (cardW + GAP) + cardW / 2}px)`

  return <div className="svc-slider svc-coverflow" role="region" aria-label="Our services carousel">
    <div className="svc-coverflow-viewport" onMouseEnter={() => { hover.current = true }} onMouseLeave={() => { hover.current = false }}>
      <div className="svc-coverflow-track" style={{ transform: `translateX(${trackX})`, transition: anim ? undefined : 'none' }}>
        {loop.map((s, i) => {
          const dist = i - pos // plain distance — no wrap math needed
          const isCenter = dist === 0
          // scale: center 1.12, immediate neighbors 0.92, far 0.84; opacity fades with distance
          const scale = isCenter ? 1.12 : Math.abs(dist) === 1 ? 0.92 : 0.84
          const opacity = isCenter ? 1 : Math.abs(dist) === 1 ? 0.85 : 0.45
          const z = isCenter ? 3 : Math.abs(dist) === 1 ? 2 : 1
          return <article key={`${s.title}-${i}`} ref={i === 0 ? (cardRef as never) : undefined} className={`svc-coverflow-card${isCenter ? ' is-center' : ''}`} style={{ transform: `scale(${scale})`, opacity, zIndex: z }} aria-hidden={!isCenter && Math.abs(dist) > 2 || undefined}>
            <div className="nws-card-media"><img src={s.image} alt={s.title} loading="lazy" /><span className="nws-card-badge">{s.badge}</span><Link href={s.href} className="nws-card-arrow" aria-label={`${s.title} — learn more`}><span>→</span></Link></div>
            <div className="nws-card-body"><h3>{s.title}</h3><p>{s.body}</p><Link className="nws-card-btn" href={s.href}>Learn more <span>→</span></Link></div>
          </article>
        })}
      </div>
    </div>

    <div className="svc-slider-controls">
      <button className="svc-slider-arrow" onClick={() => go((activeIndex - 1 + n) % n)} aria-label="Previous services">←</button>
      <div className="svc-slider-dots" role="tablist" aria-label="Service pages">
        {Array.from({ length: n }, (_, i) => <button key={i} className={`svc-slider-dot${i === activeIndex ? ' is-active' : ''}`} onClick={() => go(i)} aria-label={`Service ${i + 1}`} aria-selected={i === activeIndex}>
          {i === activeIndex && <span className="svc-progress" key={progressKey} aria-hidden="true" />}
        </button>)}
      </div>
      <button className="svc-slider-arrow" onClick={() => go((activeIndex + 1) % n)} aria-label="Next services">→</button>
    </div>
  </div>
}
