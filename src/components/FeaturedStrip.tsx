'use client'
import { useEffect, useRef, useState } from 'react'

const featured = [
  'Clear Lake Chamber of Commerce',
  'Houston Association of Realtors',
  'Texas Monthly',
  'NASA Area Community',
]

export function FeaturedStrip() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  // reveal the whole strip as soon as ANY part enters the viewport,
  // then items animate in one-by-one via CSS transition-delay (text-by-text)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      })
    }, { threshold: 0.15 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return <section className={`press-row${visible ? ' is-visible' : ''}`} ref={ref as never} aria-label="Featured in">
    <span className="press-label" style={{ transitionDelay: visible ? '0s' : undefined }}>Featured in</span>
    {featured.map((item, i) => (
      <span key={item} className="press-item" style={{ transitionDelay: visible ? `${0.45 + i * 0.55}s` : undefined }}>{item}</span>
    ))}
    <span className="press-mapnote" style={{ transitionDelay: visible ? `${0.45 + featured.length * 0.55}s` : undefined }}>Seabrook Quadrangle · USGS · Surveyed 1915–1920</span>
  </section>
}
