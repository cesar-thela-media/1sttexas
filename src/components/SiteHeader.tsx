'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { IDX_LOGIN_URL, IDX_SIGNUP_URL } from '@/content/idx'
import { email, phone, salePath, serviceAreas } from '@/content/site'

const externalLinkProps = { target: '_blank', rel: 'noopener noreferrer' } as const

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
  const pathname = usePathname()
  const innerPage = pathname !== '/'
  const [homeScrolled, setHomeScrolled] = useState(false)
  const scrolled = innerPage || homeScrolled
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (innerPage) return
    const onScroll = () => setHomeScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [innerPage])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('menu-locked', menuOpen)
    return () => document.documentElement.classList.remove('menu-locked')
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

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

        {/* compact hamburger navigation — the full categorized menu opens below */}
        <button className="menu-btn" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="full-menu" onClick={() => setMenuOpen(value => !value)}>
          <svg width="24" height="18" viewBox="0 0 24 18" fill="none" aria-hidden="true"><path d="M1 1h22M1 9h22M1 17h22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
        </button>

        {/* CTA RIGHT (NWS "Book Now" position) */}
        <div className="header-actions">
          <a className="account-link" href={IDX_LOGIN_URL} {...externalLinkProps}>Login</a>
          <a className="account-link" href={IDX_SIGNUP_URL} {...externalLinkProps}>Register</a>
          <Link className="button button-red header-cta" href="/contact/">Contact a Realtor</Link>
        </div>
      </div>
    </header>

    <div id="full-menu" className={`full-menu${menuOpen ? ' is-open' : ''}`} role="dialog" aria-modal="true" aria-label="Site menu">
      <div className="full-menu-inner">
        <div className="full-menu-head">
          <Link href="/" onClick={closeMenu} className="header-logo" aria-label="1st Texas Realtors"><img src="/assets/reference/1stTexasRealtors-logo-new.png" alt="1st TEXAS REALTORS — Full Service Brokerage" width={126} height={42} /></Link>
          <div className="full-menu-actions">
            <a className="account-link" href={IDX_LOGIN_URL} {...externalLinkProps} onClick={closeMenu}>Login</a>
            <a className="account-link register-link" href={IDX_SIGNUP_URL} {...externalLinkProps} onClick={closeMenu}>Register</a>
            <button className="menu-close-btn" aria-label="Close menu" onClick={closeMenu}><svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true"><path d="M1 1h16M1 7h16M1 13h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg><span className="mono-label">Close</span></button>
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
