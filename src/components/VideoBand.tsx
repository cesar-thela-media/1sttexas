'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

export function VideoBand() {
  const ref = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(false)

  // reveal as soon as ANY part enters the viewport (never leave dead space)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { setOpen(true); observer.disconnect() } })
    }, { threshold: 0, rootMargin: '0px 0px -10% 0px' })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return <section className={`video-band${open ? ' is-open' : ''}`} ref={ref as never} aria-label="Your next move">
    <div className="video-band-overlay" aria-hidden="true" />
    <div className="video-band-inner"><p className="mono-label video-band-eyebrow">Clear Lake NASA</p><h2 className="display-section">Your next move starts here.</h2><p>Call us for immediate assistance or explore our service areas and real-time home search.</p><Link className="button button-red" href="/contact/">Contact a Realtor <span>↗</span></Link></div>
  </section>
}
