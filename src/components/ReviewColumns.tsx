'use client'
import { useEffect, useRef, useState } from 'react'
import { testimonialsExact } from '@/content/testimonials-exact'

// Homepage review columns — 3 auto-scrolling tracks.
// - NO stars anywhere.
// - Reviews WITH a photo come FIRST (sorted by quote length ascending),
//   then the rest (also ascending).
// - Photo cards: click the photo -> it drops down + FLIPS (3D) -> reveals the
//   review dedicated to that photo. Click again -> flips back.
// - Text-only cards: drop-down reveal on scroll (no click needed).

type Review = (typeof testimonialsExact)[number]
const withImg = (r: Review) => r.images && r.images.length > 0

function sortReviews(list: Review[]): Review[] {
  const imgs = list.filter(withImg).sort((a, b) => a.quote.length - b.quote.length)
  const rest = list.filter(r => !withImg(r)).sort((a, b) => a.quote.length - b.quote.length)
  return [...imgs, ...rest]
}

function columnSlice(list: Review[], col: number): Review[] {
  const size = 25
  const start = col * size
  return list.slice(start, start + size)
}

export function ReviewColumns() {
  // build the three column slices ONCE (image reviews bubble to the top of each)
  const cols = useRef<Review[][]>([0, 1, 2].map(c => columnSlice(sortReviews(testimonialsExact), c)))
  const [opened, setOpened] = useState<Record<string, boolean>>({})
  const toggle = (id: string) => setOpened(o => ({ ...o, [id]: !o[id] }))

  return <div className="nws-reviews-grid">
    {cols.current.map((colReviews, col) => (
      <div className="nws-rev-col" key={col}>
        <div className="nws-rev-scroll">
          <div className={`nws-rev-track${col === 0 ? ' nws-rev-track-down' : col === 1 ? ' nws-rev-track-up' : ' nws-rev-track-down'}`}>
            {/* each column loops its slice twice for a seamless infinite scroll */}
            {[...colReviews, ...colReviews].map((review, i) => (
              <ReviewCard key={`${col}-${i}`} review={review} hidden={i >= colReviews.length} opened={opened[`${col}-${i}`]} onToggle={() => toggle(`${col}-${i}`)} />
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
}

function ReviewCard({ review, hidden, opened, onToggle }: { review: Review; hidden: boolean; opened: boolean; onToggle: () => void }) {
  const ref = useRef<HTMLElement>(null)
  const [on, setOn] = useState(false)

  // drop-down reveal when the card enters the viewport (works for all cards)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { setOn(true); obs.disconnect() } })
    }, { threshold: 0.15 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const hasPhoto = withImg(review)
  const img = hasPhoto ? `/assets/client/${review.images[0]}` : null
  const name = review.author.replace(/^—\s*|^–\s*/, '')

  // photo card: photo on top, click flips to reveal the review
  if (hasPhoto && img) {
    return <article ref={ref} className={`nws-review-card nws-photo-card${on ? ' is-on' : ''}${opened ? ' is-open' : ''}`} aria-hidden={hidden || undefined}>
      <button type="button" className="nws-photo-front" onClick={onToggle} aria-label={`Show review from ${name}`}>
        <span className="nws-photo-frame"><img src={img} alt={`${name} — 1st Texas Realtors in Clear Lake`} loading="lazy" /></span>
        <span className="nws-photo-name">{name}</span>
      </button>
      <div
        role="button"
        tabIndex={0}
        className="nws-photo-back"
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle() }
        }}
        aria-expanded={opened}
        aria-label={`Hide review from ${name}, back to photo`}
      >
        <figcaption><b>{name}</b></figcaption>
        <blockquote>“{review.quote}”</blockquote>
      </div>
    </article>
  }

  // text-only card: simple drop-down reveal
  return <figure ref={ref} className={`nws-review-card${on ? ' is-on' : ''}`} aria-hidden={hidden || undefined}>
    <span className="nws-avatar" aria-hidden="true">{name.charAt(0)}</span>
    <figcaption><b>{name}</b></figcaption>
    <blockquote>“{review.quote}”</blockquote>
  </figure>
}
