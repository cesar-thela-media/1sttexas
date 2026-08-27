'use client'
import { useEffect, useRef } from 'react'

export function WordReveal({ as: Tag = 'h2', className = '', children, play = false, emWord }: { as?: 'h1' | 'h2' | 'h3' | 'p'; className?: string; children: string; play?: boolean; emWord?: string }) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const words = Array.from(el.querySelectorAll<HTMLElement>('.wr-word'))
    const reveal = () => words.forEach((w, i) => setTimeout(() => w.classList.add('is-in'), i * 60))
    if (play) {
      reveal()
      return
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { reveal(); observer.disconnect() } })
    }, { threshold: 0.4 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [play])

  const words = children.split(' ')

  return <Tag ref={ref as never} className={className}>{words.map((word, i) => {
    const clean = word.replace(/[.,!?;:]$/, '')
    const punct = word.slice(clean.length)
    const isEm = emWord && clean.toLowerCase() === emWord.toLowerCase()
    return <span className="wr-mask" key={i}><span className="wr-word">{isEm ? <em>{clean}</em> : clean}{punct}</span></span>
  })}</Tag>
}
