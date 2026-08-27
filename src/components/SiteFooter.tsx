import Link from 'next/link'
import { areaSlug, email, phone, serviceAreas } from '@/content/site'

const socials = [
  ['Facebook', 'https://www.facebook.com/1stTexasRealtors/', 'M12 2.04c-5.5 0-10 4.46-10 9.96 0 4.98 3.66 9.1 8.44 9.85v-6.96H7.9v-2.9h2.54V9.85c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34v6.96c4.78-.75 8.44-4.87 8.44-9.85 0-5.5-4.5-9.96-10-9.96z'],
  ['Instagram', 'https://www.instagram.com/1sttexasrealtors/', 'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.13 1.38A5.9 5.9 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13a5.9 5.9 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.9 5.9 0 0 0 2.13-1.38 5.9 5.9 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.38-2.13A5.9 5.9 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z'],
  ['LinkedIn', 'https://www.linkedin.com/in/david-karstedt-1st-texas-realtors-677b5217/', 'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z'],
]

// NWS-style organized footer columns
const services = [
  ['Buy a Home', '/home-buyers/'],
  ['Sell Your Home', '/seller-services/'],
  ['Homes for Rent', '/homes-for-rent/'],
  ['New Home Construction', '/new-home-construction/'],
  ['Home Staging', '/home-staging/'],
  ['Relocation Service', '/relocation-service/'],
  ['Commercial Property', '/commercial-property-realtors/'],
]

const moreServices = [
  ['Home Search', '/home-search/'],
  ['Register', '/register/'],
  ['Member Login', '/login/'],
  ['Clear Lake Homes for Sale', '/clear-lake-tx-homes-for-sale/'],
  ['View All Our Services', '/home-buyers/'],
]

const quickLinks = [
  ['Home', '/'],
  ['About', '/about/'],
  ['Testimonials', '/realtor-reviews/'],
  ['Meet Our Agents', '/agents/'],
  ['FAQs', '/#faq'],
  ['Contact', '/contact/'],
]

export function SiteFooter() {
  return <footer className="footer">
    <div className="footer-cta"><div><p className="eyebrow">Ready when you are</p><h2>Ready to make your move?</h2><p>Local knowledge. Personal service. Family owned since 2004.</p></div><Link className="button button-primary" href="/contact/">Contact a Realtor <span className="btn-icon">↗</span></Link></div>

    {/* NWS-style top row: logo + tagline left, socials right */}
    <div className="footer-top">
      <div className="footer-brand">
        <img src="/assets/reference/1stTexasRealtors-logo-new.png" alt="1st TEXAS REALTORS — Full Service Brokerage" />
        <p>Family owned since 2004 · Clear Lake NASA, Texas</p>
      </div>
      <div className="footer-socials">{socials.map(([label, href, path]) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={path} /></svg><span>{label}</span></a>)}</div>
    </div>

    {/* NWS-style 4-column grid */}
    <div className="footer-grid">
      <div className="footer-col"><p className="eyebrow">Services</p>{services.map(([label, href]) => <Link key={label} href={href}>{label}</Link>)}</div>
      <div className="footer-col"><p className="eyebrow">Services</p>{moreServices.map(([label, href]) => <Link key={label} href={href}>{label}</Link>)}</div>
      <div className="footer-col"><p className="eyebrow">Quick Links</p>{quickLinks.map(([label, href]) => <Link key={label} href={href}>{label}</Link>)}</div>
      <div className="footer-col footer-contact"><p className="eyebrow">Contact</p><span className="footer-city">Clear Lake NASA, Texas</span><a className="footer-phone" href="tel:+12812413121">{phone}</a><a className="footer-mail" href={`mailto:${email}`}>{email}</a><span className="footer-hours">Monday–Saturday · 9am–6pm</span></div>
    </div>

    {/* NWS-style area badges row */}
    <div className="footer-areas-row"><p className="eyebrow">Service Areas</p><div className="footer-areas">{serviceAreas.map(area => <Link key={area} href={`/realtors-in-${areaSlug(area)}/`}>{area}</Link>)}</div></div>

    <div className="footer-badges"><img src="/assets/client/Texas-Monthly-5-Star-Real-Estate-Agent.png" alt="Texas Monthly Five-Star Real Estate Agent" className="badge-logo" /><img src="/assets/client/Equal-Housing-Opportunity-Realtors.gif" alt="Equal Housing Opportunity" /><img src="/assets/client/Multiple-Listing-Service-Realtors.gif" alt="Member of the Multiple Listing Service" /><img src="/assets/client/Realtor-Association.gif" alt="Realtor Association Member" /></div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} 1st Texas Realtors. All rights reserved.</span><div className="footer-legal"><Link href="/privacy-policy/">Privacy</Link><Link href="/privacy-policy/">Terms</Link></div></div>
  </footer>
}
