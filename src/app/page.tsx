'use client'
import Link from 'next/link'
import { useState } from 'react'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { ScrollReveals } from '@/components/Motion'

import { VideoHero } from '@/components/VideoHero'
import { ChatFab } from '@/components/ChatFab'
import { AreaChoiceModal } from '@/components/AreaChoiceModal'
import { ServicesSlider } from '@/components/ServicesSlider'

import { ReviewColumns } from '@/components/ReviewColumns'
import { areaCards } from '@/content/area-cards'

const services = [
  {
    title: 'Contact a Realtor.',
    body: 'Our team of talented Realtors provide you with the critical elements of success; local experience, dedicated customer service and real-time property listings. Every year since 2010, we have been recognized by Texas Monthly Magazine as Top 3% Realtors in Clear Lake – NASA.',
    href: '/contact/',
    image: '/assets/reference/1st-tx-realtors-couple-slider.png',
    badge: 'Contact',
    cta: 'Contact a Realtor',
  },
  {
    title: 'Buying a Home.',
    body: 'Find the home first — use our Home Search to view real-time listings of homes for sale and rent that are available today. Register to save custom home searches with automatic email alerts for new listings in Clear Lake that match your search.',
    href: '/home-buyers/',
    image: '/assets/reference/leaguecityhomesforsale.jpg',
    badge: 'Buy',
    cta: 'Home Buying',
    showAreas: true,
  },
  {
    title: 'Selling a Home.',
    body: 'Read about our Home Selling services starting with a free Market Analysis to determine the best price to sell your home. We provide comprehensive Realtor services when selling single family residential homes, town homes and high-rise condominiums.',
    href: '/seller-services/',
    image: '/assets/reference/seabrookhomesforsale.jpg',
    badge: 'Sell',
    cta: 'Home Selling',
  },
  {
    title: 'Homes for Rent.',
    body: 'As long-time residents of Clear Lake NASA, we have helped many families find the best home in the best neighborhood with the best commutes and schools. We negotiate with the owner for the best deal.',
    href: '/homes-for-rent/',
    image: '/assets/reference/clearlaketxhomesforsale.jpg',
    badge: 'Rent',
    cta: 'Homes for Rent',
  },
  {
    title: 'Leasing | Property Management.',
    body: 'We provide expert property management and home leasing services including maintenance, repairs and home leasing service. All prospective tenants are interviewed with a completed background check, references verified and complete the lease with a deposit.',
    href: '/homes-for-rent/',
    image: '/assets/client/David-Simone-239.jpg',
    badge: 'Lease',
    cta: 'Homes for Rent',
  },
]

export default function Home() {
  const [started] = useState(true)
  const [choiceArea, setChoiceArea] = useState<{ name: string; image: string } | null>(null)

  return <div className="site-shell"><SiteHeader /><main id="main-content">
    <VideoHero started={started} />
    <section className="section intro-section reveal" id="welcome"><div className="section-heading"><p className="eyebrow">1st Texas Realtors</p><h2 className="display-section">Welcome to 1st Texas Realtors in Clear Lake!</h2><p><strong>Family owned since 2004,</strong> we provide expert Realtors in Clear Lake, dedicated customer service and real-time listings of homes for sale and rent.</p><p><strong>David Karstedt and wife Simone</strong> work as a team at 1st Texas Realtors, receive overwhelmingly positive reviews highlighting their exceptional responsiveness, deep knowledge and strong negotiation skills. This dynamic duo is known for personalized, patient service making the complex home buying and selling process smooth and enjoyable for their clients. They are praised for exceeding expectations and trusted advisors earning loyalty through high-quality service.</p><p className="intro-testimonials-cta">Please see more <Link className="text-link" href="/realtor-reviews/">Testimonials <span>↗</span></Link>.</p></div></section>
    <section className="section section-dark nws-services-intro reveal" id="services">
      <div className="section-heading">
        <p className="eyebrow">Realtor services</p>
        <h2 className="display-section">How we help.</h2>
        <p>From your first call to closing day — buying, selling, renting, and property management with local Clear Lake NASA expertise.</p>
      </div>
    </section>
    <ServicesSlider services={services} />
    <section className="nws-reviews reveal" id="reviews"><div className="nws-reviews-inner"><div className="nws-reviews-head"><span className="nws-pill-badge">Great Reviews &amp; Testimonials</span><h2 className="nws-reviews-title">Great Reviews &amp; Testimonials</h2><p className="nws-reviews-sub">Please see more Testimonials.</p></div><ReviewColumns /><Link className="nws-reviews-cta" href="/realtor-reviews/">Testimonials <span>→</span></Link></div></section>
    <section className="section reveal" id="next-move"><div className="cta-showcase"><h2>For immediate service, please<br />call (281) 241-3121.</h2><p>1st Texas Realtors for local Realtors and real-time listings of homes for sale in Baytown, Clear Lake City, Clear Lake Shores, Deer Park, Dickinson, El Lago, Friendswood, Galveston, Kemah, La Porte, League City, Nassau Bay, Pasadena, Pearland, Seabrook, Taylor Lake Village, Texas City, Tiki Island and Webster.</p><p>Texas Real Estate Commission Consumer Protection Notice Texas Real Estate Commission Information About Brokerage Services</p><Link className="button button-red" href="/contact/">Contact Us <span className="btn-icon">↗</span></Link></div></section>
    <section className="section areas-section reveal" id="areas"><div className="section-heading"><p className="eyebrow">Local Realtors in Clear Lake</p><h2 className="display-section">Local Realtors in Clear Lake</h2><p>1st Texas Realtors for local Realtors and real-time listings of homes for sale in Baytown, Clear Lake City, Clear Lake Shores, Deer Park, Dickinson, El Lago, Friendswood, Galveston, Kemah, La Porte, League City, Nassau Bay, Pasadena, Pearland, Seabrook, Taylor Lake Village, Texas City, Tiki Island and Webster.</p></div>
      <div className="areas-slider" aria-label="Service areas carousel">
        <div className="areas-slide-row">
          <div className="areas-slide-track areas-slide-left">{areaCards.slice(0, 11).map(card => <AreaCard key={card.slug} card={card} onChoose={setChoiceArea} />)}{areaCards.slice(0, 11).map(card => <AreaCard key={`dup-${card.slug}`} card={card} onChoose={setChoiceArea} ariaHidden />)}</div>
        </div>
        <div className="areas-slide-row">
          <div className="areas-slide-track areas-slide-right">{areaCards.slice(11).map(card => <AreaCard key={card.slug} card={card} onChoose={setChoiceArea} />)}{areaCards.slice(11).map(card => <AreaCard key={`dup-${card.slug}`} card={card} onChoose={setChoiceArea} ariaHidden />)}</div>
        </div>
      </div>
    </section>
  </main><SiteFooter /><ScrollReveals /><ChatFab />
  {choiceArea && <AreaChoiceModal area={choiceArea.name} image={choiceArea.image} onClose={() => setChoiceArea(null)} />}
</div>
}

function AreaCard({ card, ariaHidden = false, onChoose }: { card: { name: string; slug: string; image: string; desc: string }; ariaHidden?: boolean; onChoose: (a: { name: string; image: string }) => void }) {
  return <button
    type="button"
    className="nws-area-card"
    aria-hidden={ariaHidden || undefined}
    tabIndex={ariaHidden ? -1 : undefined}
    onClick={() => onChoose({ name: card.name, image: card.image })}
  >
    <div className="nws-area-media"><img src={card.image} alt={ariaHidden ? '' : `Homes in ${card.name}`} loading="lazy" /><span className="nws-area-tag">Service area</span></div>
    <div className="nws-area-body"><h3>{card.name}, TX</h3><p>{card.desc}</p><span className="nws-area-link">{card.name} <span>→</span></span></div>
  </button>
}
