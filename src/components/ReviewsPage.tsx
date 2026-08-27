'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { testimonialsExact } from '@/content/testimonials-exact'

// Reviews landing page ("Read all testimonials"):
// - NO stars anywhere.
// - Reviews WITH a photo come FIRST (ascending by quote length), then the rest.
// - Photo cards: click the photo -> it drops down + FLIPS (3D) -> reveals that
//   review. Click again -> flips back.
// - Text-only cards: drop-down reveal on scroll (no click).
// - 6 shown initially; "Show more" reveals the rest (with the same animation).
type Review = (typeof testimonialsExact)[number]
const withImg = (r: Review) => r.images && r.images.length > 0

export function ReviewsPage() {
  const [showAll, setShowAll] = useState(false)
  const [active, setActive] = useState(0)
  // image reviews first (ascending), then the rest (ascending)
  const reviews = [...testimonialsExact]
    .sort((a, b) => a.quote.length - b.quote.length)
    .sort((a, b) => Number(withImg(b)) - Number(withImg(a)))
  const visible = showAll ? reviews : reviews.slice(0, 6)

  return <div className="reviews-page-wrap">
    <div className="reviews-summary"><div className="reviews-summary-item"><strong>74</strong><span>Client reviews</span></div><div className="reviews-summary-item"><strong>Top 3%</strong><span>Texas Monthly since 2010</span></div></div>
    <div className="testimonial-flow">
      {visible.map((review, i) => <DropCard key={`${review.author}-${i}`} review={review} active={active === i} onActive={() => setActive(i)} />)}
    </div>
    {!showAll
      ? <div className="reviews-more-wrap"><button className="reviews-more" onClick={() => setShowAll(true)}>Show more reviews <span>↓</span></button><p className="reviews-more-note">Showing 6 of {reviews.length} reviews — click to see all</p></div>
      : <div className="reviews-more-wrap"><button className="reviews-more" onClick={() => setShowAll(false)}>Show fewer reviews <span>↑</span></button><p className="reviews-more-note">Showing all {reviews.length} reviews — click to shorten back to 6</p></div>}
    <div className="trust-banner"><span className="trust-banner-label">Proud members of</span><div className="trust-banner-logos"><img src="/assets/client/Texas-Monthly-5-Star-Real-Estate-Agent.png" alt="Texas Monthly Five-Star Real Estate Agent" className="badge-logo" /><img src="/assets/client/Equal-Housing-Opportunity-Realtors.gif" alt="Equal Housing Opportunity" /><img src="/assets/client/Multiple-Listing-Service-Realtors.gif" alt="Member of the Multiple Listing Service" /><img src="/assets/client/Realtor-Association.gif" alt="Realtor Association Member" /></div></div>
    <p className="area-note">1st Texas Realtors reviews in Baytown, Clear Lake City, Clear Lake Shores, Deer Park, Dickinson, El Lago, Friendswood, Galveston, Kemah, La Porte, League City, Nassau Bay, Pasadena, Pearland, Seabrook, Taylor Lake Village, Texas City, Tiki Island and Webster.</p>
  </div>
}

// one review card — drops down into view on scroll; photo cards flip on click
function DropCard({ review, active, onActive }: { review: Review; active: boolean; onActive: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState(false)
  const [open, setOpen] = useState(false)

  // two-way scroll trigger: entering viewport -> drop in; leaving -> rise back up
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { setOn(true); onActive() }
        else setOn(false)
      })
    }, { threshold: 0.2 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [onActive])

  const hasPhoto = withImg(review)
  const img = hasPhoto ? `/assets/client/${review.images[0]}` : null
  const cleaned = review.quote.replace(/^[“”"'`\s]+/, '').replace(/[”"'`\s]+$/, '')
  const name = review.author.replace(/^—\s*|^–\s*/, '')

  // photo card: dedicated image on top; click -> drops + flips -> the review
  if (hasPhoto && img) {
    return <div ref={ref} className={`testimonial-block drop-card photo-card${on ? ' is-on' : ''}${open ? ' is-open' : ''}${active ? ' is-active' : ''}`}>
      <button type="button" className="photo-front" onClick={() => setOpen(o => !o)} aria-label={`Show review from ${name}`}>
        <span className="photo-frame"><img src={img} alt={`${name} — 1st Texas Realtors in Clear Lake`} loading="lazy" /></span>
        <span className="photo-name">{name}</span>
      </button>
      <div
        role="button"
        tabIndex={0}
        className="photo-back"
        onClick={() => setOpen(false)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setOpen(false)
          }
        }}
        aria-expanded={open}
        aria-label={`Hide review from ${name}, back to photo`}
      >
        <span className="photo-back-inner">
          <blockquote>“{cleaned}”</blockquote>
          <cite>{review.author}</cite>
        </span>
      </div>
    </div>
  }

  // text-only card: drop-down reveal (stars removed — normal font quote)
  return <div ref={ref} className={`testimonial-block drop-card${on ? ' is-on' : ''}${active ? ' is-active' : ''}`}>
    <blockquote>
      <p className="drop-cap-text">“{cleaned}”</p>
      {review.author && <cite>{review.author}</cite>}
    </blockquote>
  </div>
}
