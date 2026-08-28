'use client'
import { useEffect, useRef, useState } from 'react'
import { testimonialsExact } from '@/content/testimonials-exact'

type Review = (typeof testimonialsExact)[number]

export function ReviewsPage() {
  const [showAll, setShowAll] = useState(false)
  const reviews = testimonialsExact
  const visible = showAll ? reviews : reviews.slice(0, 6)

  return <div className="reviews-page-wrap">
    <div className="testimonial-flow">
      {visible.map((review, i) => <DropCard key={`${review.author}-${i}`} review={review} index={i} />)}
    </div>
    {!showAll
      ? <div className="reviews-more-wrap"><button className="reviews-more" onClick={() => setShowAll(true)}>Show more reviews <span>↓</span></button><p className="reviews-more-note">Showing 6 of {reviews.length} reviews</p></div>
      : <div className="reviews-more-wrap"><button className="reviews-more" onClick={() => setShowAll(false)}>Show fewer reviews <span>↑</span></button><p className="reviews-more-note">Showing all {reviews.length} reviews</p></div>}
    <div className="trust-banner">
      <span className="trust-banner-label">Proud members of</span>
      <div className="trust-banner-logos">
        <img src="/assets/client/Texas-Monthly-5-Star-Real-Estate-Agent.png" alt="Texas Monthly Five-Star Real Estate Agent" className="badge-logo" />
        <img src="/assets/client/Equal-Housing-Opportunity-Realtors.gif" alt="Equal Housing Opportunity" />
        <img src="/assets/client/Multiple-Listing-Service-Realtors.gif" alt="Member of the Multiple Listing Service" />
        <img src="/assets/client/Realtor-Association.gif" alt="Realtor Association Member" />
      </div>
    </div>
    <p className="about-areas-note">1st Texas Realtors reviews in Baytown, Clear Lake City, Clear Lake Shores, Deer Park, Dickinson, El Lago, Friendswood, Galveston, Kemah, La Porte, League City, Nassau Bay, Pasadena, Pearland, Seabrook, Taylor Lake Village, Texas City, Tiki Island and Webster.</p>
  </div>
}

function DropCard({ review, index }: { review: Review; index: number }) {
  const ref = useRef<HTMLElement>(null)
  const [on, setOn] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) setOn(true)
        else setOn(false)
      })
    }, { threshold: 0.15 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const cleaned = review.quote.replace(/^[“”"'`\s]+/, '').replace(/[”"'`\s]+$/, '')
  const name = review.author.replace(/^—\s*|^–\s*/, '')

  return <article ref={ref} className={`testimonial-block drop-card${on ? ' is-on' : ''}`}>
    <span className="review-card-num">{String(index + 1).padStart(2, '0')}</span>
    <blockquote>
      <p className="drop-cap-text">{cleaned}</p>
      {name && <cite>{name}</cite>}
    </blockquote>
  </article>
}
