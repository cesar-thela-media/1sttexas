'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { email, phone, serviceAreas } from '@/content/site'

// NWS-style categorized nav
const navServices = [
  { label: 'Buy a Home', href: '/home-buyers/' },
  { label: 'Sell Your Home', href: '/seller-services/' },
  { label: 'Homes for Rent', href: '/homes-for-rent/' },
  { label: 'New Home Construction', href: '/new-home-construction/' },
  { label: 'Home Staging', href: '/home-staging/' },
  { label: 'Relocation Service', href: '/relocation-service/' },
  { label: 'Commercial Property', href: '/commercial-property-realtors/' },
]

const navGalleries = [
  { label: 'Testimonials', href: '/realtor-reviews/' },
  { label: 'Meet Our Agents', href: '/agents/' },
  { label: 'Home Search', href: '/home-search/' },
]

const menuColumns = [
  { label: 'About us', href: '/about/' },
  { label: 'Buy', href: '/home-buyers/' },
  { label: 'Sell', href: '/seller-services/' },
  { label: 'Rent', href: '/homes-for-rent/' },
  { label: 'Commercial', href: '/commercial-property-realtors/' },
]

const menuSecondary = [
  { label: 'Available Listings', href: '/home-search/' },
  { label: 'Testimonials', href: '/realtor-reviews/' },
  { label: 'Meet our agents', href: '/agents/' },
  { label: 'New Homes', href: '/new-home-construction/' },
  { label: 'Contact', href: '/contact/' },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [openDrop, setOpenDrop] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpenDrop(null); setMenuOpen(false) } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const closeMenu = () => setMenuOpen(false)
  const closeDrop = () => setOpenDrop(null)
  const drop = (name: string) => setOpenDrop(v => (v === name ? null : name))

  return <>
    {/* NWS-style promo bar — your message, your theme */}
    <div className="promo-bar">
      <span>Family owned since 2004 · Top 3% Realtors in Clear Lake NASA</span>
      <a href="tel:+12812413121" className="promo-bar-phone">{phone}</a>
    </div>

    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-wrap">
        {/* logo LEFT (NWS position) — client's real logo */}
        <Link href="/" onClick={closeMenu} className="header-logo" aria-label="1st Texas Realtors"><img src="/assets/reference/1stTexasRealtors-logo-new.png" alt="1st TEXAS REALTORS — Full Service Brokerage" width={126} height={42} /></Link>

        {/* nav CENTER with categorized dropdowns (NWS anatomy) */}
        <nav className="nav-desktop" aria-label="Main navigation">
          <Link href="/" className={`nav-link${pathname === '/' ? ' active' : ''}`}>Home</Link>
          <Link href="/about/" className={`nav-link${pathname.startsWith('/about') ? ' active' : ''}`}>About</Link>
          <div className="nav-drop">
            <button className="nav-link nav-drop-btn" aria-expanded={openDrop === 'services'} onClick={() => drop('services')}>Services <span className="nav-caret" aria-hidden="true">▾</span></button>
            {openDrop === 'services' && <div className="nav-panel" onMouseLeave={closeDrop}>
              <div className="nav-panel-cols">{navServices.map(s => <Link key={s.href} href={s.href} onClick={closeDrop}>{s.label} <span>↗</span></Link>)}</div>
              <div className="nav-panel-feature"><span className="mono-label">Full service</span><b>Real-time MLS listings &amp; expert Realtors</b><Link className="text-link" href="/home-search/">Browse listings <span>↗</span></Link></div>
            </div>}
          </div>
          <div className="nav-drop">
            <button className="nav-link nav-drop-btn" aria-expanded={openDrop === 'galleries'} onClick={() => drop('galleries')}>Galleries <span className="nav-caret" aria-hidden="true">▾</span></button>
            {openDrop === 'galleries' && <div className="nav-panel nav-panel-sm" onMouseLeave={closeDrop}>
              <div className="nav-panel-cols">{navGalleries.map(s => <Link key={s.href} href={s.href} onClick={closeDrop}>{s.label} <span>↗</span></Link>)}</div>
            </div>}
          </div>
          <div className="nav-drop">
            <button className="nav-link nav-drop-btn" aria-expanded={openDrop === 'areas'} onClick={() => drop('areas')}>Areas <span className="nav-caret" aria-hidden="true">▾</span></button>
            {openDrop === 'areas' && <div className="nav-panel nav-panel-areas" onMouseLeave={closeDrop}>
              <div className="nav-panel-cols areas-cols">{serviceAreas.map(area => <Link key={area} href={`/realtors-in-${area.toLowerCase().replaceAll(' ', '-')}/`} onClick={closeDrop}>{area} <span>↗</span></Link>)}</div>
              <div className="nav-panel-feature"><span className="mono-label">Areas we serve</span><b>Clear Lake NASA &amp; surrounding communities</b><Link className="text-link" href="/clear-lake-tx-homes-for-sale/">Clear Lake homes for sale <span>↗</span></Link></div>
            </div>}
          </div>
          <Link href="/faqs/" className="nav-link">FAQs</Link>
        </nav>

        {/* CTA RIGHT (NWS "Book Now" position) */}
        <div className="header-actions">
          <Link className="button button-red header-cta" href="/contact/">Contact a Realtor</Link>
          <a className="phone" href="tel:+12812413121">{phone}</a>
        </div>

        {/* mobile menu button */}
        <button className="menu-btn menu-btn-mobile" aria-expanded={menuOpen} aria-controls="full-menu" onClick={() => setMenuOpen(value => !value)}>
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true"><path d="M1 1h16M1 7h16M1 13h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          <span className="mono-label">Menu</span>
        </button>
      </div>
    </header>

    <div id="full-menu" className={`full-menu${menuOpen ? ' is-open' : ''}`} role="dialog" aria-modal="true" aria-label="Site menu">
      <div className="full-menu-inner">
        <div className="full-menu-head">
          <button className="menu-close-btn" aria-label="Close menu" onClick={closeMenu}><svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true"><path d="M1 1h16M1 7h16M1 13h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg><span className="mono-label">Close</span></button>
          <Link href="/" onClick={closeMenu} className="header-logo" aria-label="1st Texas Realtors"><img src="/assets/reference/1stTexasRealtors-logo-new.png" alt="1st TEXAS REALTORS — Full Service Brokerage" width={126} height={42} /></Link>
          <div className="full-menu-actions">
            <a className="account-link" href="/home-search/">Available listings</a>
            <a className="account-link register-link" href="/register/">Inquire</a>
          </div>
        </div>
        <div className="full-menu-body">
          <div className="full-menu-columns">
            <nav className="full-menu-links" onClick={closeMenu}>
              {menuColumns.map(link => <Link key={link.href} href={link.href}><span className="menu-num">{String(menuColumns.indexOf(link) + 1).padStart(2, '0')}</span>{link.label}<b>↗</b></Link>)}
            </nav>
            <nav className="full-menu-links is-secondary" onClick={closeMenu}>
              {menuSecondary.map(link => <Link key={link.href} href={link.href}><span className="menu-num">{String(menuColumns.length + menuSecondary.indexOf(link) + 1).padStart(2, '0')}</span>{link.label}<b>↗</b></Link>)}
            </nav>
          </div>
          <div className="menu-promo">
            <img src="/assets/reference/1st-tx-realtors-couple-slider.png" alt="David and Simone Karstedt of 1st Texas Realtors" />
            <div className="menu-promo-box"><b>Get a free Market Analysis*</b><a href="/contact/">Claim offer <span>→</span></a></div>
          </div>
        </div>
        <div className="full-menu-foot">
          <div className="menu-contact"><span className="mono-label">Contact us</span><a href={`mailto:${email}`}>{email}</a><a className="menu-foot-phone" href="tel:+12812413121">{phone}</a></div>
          <div className="menu-contact"><span className="mono-label">Office</span><span>Monday through Saturday, 9am to 6pm</span><span>Clear Lake NASA, Texas</span></div>
          <div className="menu-lang"><span className="mono-label">Clear Lake · League City · Friendswood · Seabrook</span></div>
        </div>
      </div>
    </div>
  </>
}
