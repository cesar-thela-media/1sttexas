'use client'
import Link from 'next/link'
import { useState } from 'react'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { ScrollReveals } from '@/components/Motion'
import { LeadModal } from '@/components/LeadModal'
import { VideoHero } from '@/components/VideoHero'
import { FeaturedStrip } from '@/components/FeaturedStrip'
import { ChatFab } from '@/components/ChatFab'
import { AreaChoiceModal } from '@/components/AreaChoiceModal'
import { ServicesSlider } from '@/components/ServicesSlider'
import { WordReveal } from '@/components/WordReveal'
import { areaSlug, serviceAreas, testimonials, faqs } from '@/content/site'
import { testimonialsExact } from '@/content/testimonials-exact'
import { areaCards } from '@/content/area-cards'

const services = [
  ['Buying a Home', 'Real-time listings, pre-approval guidance, saved searches, and support through closing.', '/home-buyers/', '/assets/reference/leaguecityhomesforsale.jpg', 'Buy'],
  ['Selling a Home', 'Market analysis, staging, marketing, negotiation, and focused closing support.', '/seller-services/', '/assets/reference/seabrookhomesforsale.jpg', 'Sell'],
  ['Homes for Rent', 'Neighborhood guidance, rental listings, leasing, and property management.', '/homes-for-rent/', '/assets/reference/clearlaketxhomesforsale.jpg', 'Rent'],
  ['New Construction', 'Builder guidance and experienced representation from plans to closing.', '/new-home-construction/', '/assets/reference/friendswoodhomesforsale.jpg', 'Build'],
  ['Home Staging', 'Simple guidelines that add significant value to your home at little to no cost.', '/home-staging/', '/assets/reference/NASAhomesforsale.jpg', 'Stage'],
  ['Relocation Service', 'Clear Lake expertise for families moving into the NASA area — neighborhoods, schools, and commutes.', '/relocation-service/', '/assets/reference/Clear-Lake-Texas-e1736781694121.jpg', 'Relocate'],
  ['Commercial Property', 'Realtor experts for commercial real estate, land, and investment property.', '/commercial-property-realtors/', '/assets/reference/seabrookhomesforsale02.jpg', 'Commercial'],
]

export default function Home() {
  const [started] = useState(true)
  const [choiceArea, setChoiceArea] = useState<{ name: string; image: string } | null>(null)

  return <div className="site-shell"><SiteHeader /><main id="main-content">
    <VideoHero started={started} />
    <section className="section intro-section reveal" id="welcome"><div className="section-heading"><p className="eyebrow">Welcome to 1st Texas Realtors</p><WordReveal as="h2" className="display-section">Clarity for buying, selling, and everything between.</WordReveal><p><strong>Family owned since 2004,</strong> we provide expert Realtors in Clear Lake, dedicated customer service and real-time listings of homes for sale and rent.</p><p><strong>David Karstedt and wife Simone</strong> work as a team at 1st Texas Realtors, receive overwhelmingly positive reviews highlighting their exceptional responsiveness, deep knowledge and strong negotiation skills. This dynamic duo is known for personalized, patient service making the complex home buying and selling process smooth and enjoyable for their clients. They are praised for exceeding expectations and trusted advisors earning loyalty through high-quality service. Please see more <Link className="text-link" href="/realtor-reviews/">Testimonials <span>↗</span></Link>.</p><p>Our team of talented Realtors provide you with the critical elements of success; local experience, dedicated customer service and real-time property listings. <strong>Every year since 2010, we have been recognized by Texas Monthly Magazine as Top 3% Realtors in Clear Lake – NASA.</strong></p></div><div className="intro-copy"><div className="stats-band"><div className="stat"><strong>50+</strong><small>Years combined experience</small></div><div className="stat"><strong>Top 3%</strong><small>Realtor ranking</small></div><div className="stat"><strong>2004</strong><small>Family owned since</small></div></div><Link className="button button-dark" href="/contact/">Contact a Realtor <span>↗</span></Link></div></section>
    <section className="section section-dark nws-services reveal" id="services"><div className="section-heading"><p className="eyebrow">How we help</p><WordReveal as="h2" className="display-section">A better way forward.</WordReveal><p>From buying and selling to renting, staging, relocation, and commercial property — a full-service brokerage for every move.</p></div><ServicesSlider services={services.map(([title, body, href, image, badge]) => ({ title, body, href, image, badge }))} /></section>
    <section className="section split-section reveal" id="team"><div><p className="eyebrow">Local knowledge</p><WordReveal as="h2" className="display-section">People who know the place.</WordReveal><p>From Clear Lake City and Friendswood to League City, Kemah, Seabrook, and Galveston, we know the neighborhoods, schools, grocery stores, commutes, and local people.</p><Link className="button button-navy" href="/agents/">Meet our Realtors <span className="btn-icon">↗</span></Link></div><img src="/assets/reference/1st-Texas-Realtors-Team2.png" alt="The 1st Texas Realtors team" /></section>
    <section className="nws-reviews reveal" id="reviews"><div className="nws-reviews-inner"><div className="nws-reviews-head"><span className="nws-pill-badge">Client feedback</span><h2 className="nws-reviews-title">Check what our clients are saying</h2><p className="nws-reviews-sub">Don’t take our word for it</p></div>
      {/* 3 columns, each slowly auto-scrolling through every testimonial */}
      <div className="nws-reviews-grid">
        {[0, 1, 2].map(col => <div className="nws-rev-col" key={col}>
          <div className="nws-rev-scroll">
            <div className={`nws-rev-track${col === 0 ? ' nws-rev-track-down' : col === 1 ? ' nws-rev-track-up' : ' nws-rev-track-down'}`}>
              {[...testimonialsExact.slice(col * 25, col * 25 + 25), ...testimonialsExact.slice(col * 25, col * 25 + 25)].map((review, i) => <figure className="nws-review-card" key={`${col}-${i}`} aria-hidden={i >= 25 || undefined}><span className="nws-avatar" aria-hidden="true">{review.author.replace('— ', '').charAt(0)}</span><figcaption><b>{review.author.replace('— ', '')}</b></figcaption><blockquote>“{review.quote}”</blockquote></figure>)}
            </div>
          </div>
        </div>)}
      </div>
    <Link className="nws-reviews-cta" href="/realtor-reviews/">Read all testimonials <span>→</span></Link></div></section>
    <section className="section reveal" id="next-move"><div className="cta-showcase"><p className="eyebrow">Your next move</p><h2>Let’s make a plan.</h2><p>Call us for immediate assistance or explore our service areas and real-time home search.</p><Link className="button button-red" href="/contact/">Contact a Realtor <span className="btn-icon">↗</span></Link></div><div className="cta-steps"><Link className="reveal-item" href="/register/"><span>01</span>Register <b>↗</b></Link><Link className="reveal-item" href="/home-search/"><span>02</span>Home search <b>↗</b></Link><Link className="reveal-item" href="/contact/"><span>03</span>Contact us <b>↗</b></Link></div></section>
    <FeaturedStrip />
    <section className="section faq-section reveal" id="faq"><div className="section-heading"><p className="eyebrow">Common questions</p><WordReveal as="h2" className="display-section">Answers before you ask.</WordReveal><p>Everything you need to know about buying, selling, renting, and working with our team.</p></div><div className="faq-list">{faqs.map(([question, answer], index) => <details key={question}><summary><span className="faq-index">{String(index + 1).padStart(2, '0')}</span>{question}<i className="faq-chip">+</i></summary><p>{answer}</p></details>)}</div></section>
    <section className="section areas-section reveal" id="areas"><div className="section-heading"><p className="eyebrow">Areas we serve</p><WordReveal as="h2" className="display-section">Local Realtors across Clear Lake NASA.</WordReveal><p>We complete every move promptly, effectively, and with the utmost attention to detail.</p></div>
      {/* NWS-style dual sliding rows — row 1 slides left, row 2 slides right */}
      <div className="areas-slider" aria-label="Service areas carousel">
        <div className="areas-slide-row">
          <div className="areas-slide-track areas-slide-left">{areaCards.slice(0, 11).map(card => <AreaCard key={card.slug} card={card} onChoose={setChoiceArea} />)}{areaCards.slice(0, 11).map(card => <AreaCard key={`dup-${card.slug}`} card={card} onChoose={setChoiceArea} ariaHidden />)}</div>
        </div>
        <div className="areas-slide-row">
          <div className="areas-slide-track areas-slide-right">{areaCards.slice(11).map(card => <AreaCard key={card.slug} card={card} onChoose={setChoiceArea} />)}{areaCards.slice(11).map(card => <AreaCard key={`dup-${card.slug}`} card={card} onChoose={setChoiceArea} ariaHidden />)}</div>
        </div>
      </div>
    </section>
  </main><SiteFooter /><ScrollReveals /><LeadModal /><ChatFab />
  {choiceArea && <AreaChoiceModal area={choiceArea.name} image={choiceArea.image} onClose={() => setChoiceArea(null)} />}
</div>
}

// Area card used in the sliding rows — click opens the Buy/Rent/Sell choice
function AreaCard({ card, ariaHidden = false, onChoose }: { card: { name: string; slug: string; image: string; desc: string }; ariaHidden?: boolean; onChoose: (a: { name: string; image: string }) => void }) {
  return <button
    type="button"
    className="nws-area-card"
    aria-hidden={ariaHidden || undefined}
    tabIndex={ariaHidden ? -1 : undefined}
    onClick={() => onChoose({ name: card.name, image: card.image })}
  >
    <div className="nws-area-media"><img src={card.image} alt={ariaHidden ? '' : `Homes in ${card.name}`} loading="lazy" /><span className="nws-area-tag">Service area</span></div>
    <div className="nws-area-body"><h3>{card.name}, TX</h3><p>{card.desc}</p><span className="nws-area-link">Explore area <span>→</span></span></div>
  </button>
}
