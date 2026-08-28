'use client'

import { useEffect, useRef, type ReactNode } from 'react'

export function LoopVideo({
  src,
  poster,
  className = '',
}: {
  src: string
  poster?: string
  className?: string
}) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const play = () => { el.play().catch(() => {}) }
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) play()
        else el.pause()
      })
    }, { threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [src])

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
    />
  )
}

export function HubVideoBand({
  src,
  poster,
  eyebrow,
  title,
  children,
}: {
  src: string
  poster?: string
  eyebrow?: string
  title?: string
  children?: ReactNode
}) {
  return (
    <section className="hub-video-band">
      <div className="hub-video-media" aria-hidden="true">
        <LoopVideo src={src} poster={poster} />
        <div className="hub-video-overlay" />
      </div>
      <div className="hub-video-copy">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        {title && <h2 className="display-section">{title}</h2>}
        {children}
      </div>
    </section>
  )
}
