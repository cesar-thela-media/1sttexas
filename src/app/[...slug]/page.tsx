import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ContactForm } from '@/components/ContactForm'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { ScrollReveals } from '@/components/Motion'
import { agents, allStaticPaths, areaSlug, email, faqs, phone, rentPath, serviceAreas, servicePages, testimonials } from '@/content/site'
import { testimonialsExact } from '@/content/testimonials-exact'
import { areaListings } from '@/content/area-listings'
import { HomeSearch } from '@/components/HomeSearch'
import { AreaSearch } from '@/components/AreaSearch'
import { StickyAbout } from '@/components/StickyAbout'
import { StickyServicePage } from '@/components/StickyServicePage'
import { ReviewsPage } from '@/components/ReviewsPage'

export function generateStaticParams() { return allStaticPaths.map(path => ({ slug: path.split('/') })) }

function AreaPage({ area, rent }: { area: string; rent: boolean }) {
  const slug = areaSlug(area)
  const listing = areaListings.find(item => item.slug === slug) || areaListings.find(item => item.kind === (rent ? 'rent' : 'sale') && item.slug === 'clear-lake-sale')
  const title = rent ? `${area} Homes for Rent` : `${area} Realtors & Homes for Sale`
  return <PageFrame eyebrow="Local service area" title={title} intro={listing ? listing.intro : rent ? `Find homes for rent in ${area} with local guidance on neighborhoods, schools, commutes, and leasing.` : `Work with 1st Texas Realtors for homes for sale and expert local service in ${area}.`}>
    {listing && listing.images.length > 0 && <div className="listing-gallery">{listing.images.map(src => <img key={src} src={src} alt={`${listing.title} in ${area}`} loading="lazy" />)}</div>}
    <h2 className="subheading">{rent ? `Homes for rent in ${area}` : `Homes for sale in ${area}`}</h2>
    <AreaSearch area={area} rent={rent} />
    <div className="area-hero-card"><h2>{rent ? 'View homes for rent' : 'View homes for sale'}</h2><p>Use our real-time Home Search or contact a Realtor for current listings, market guidance, and a plan tailored to your move.</p><div className="hero-actions"><Link className="button button-dark" href="/home-search/">Search listings <span>↗</span></Link><Link className="button button-red" href="/contact/">Contact a Realtor <span>↗</span></Link></div></div>
    {listing && listing.paragraphs.length > 0 && <div className="rich-sections">{listing.paragraphs.map((text, i) => <article key={i}><p>{text}</p></article>)}</div>}
    <h2 className="subheading">Nearby service areas</h2><div className="area-grid">{serviceAreas.filter(item => item !== area).slice(0, 10).map(item => <Link key={item} href={rentPath(item)}>{item}<span>↗</span></Link>)}</div>
  </PageFrame>
}

function PageFrame({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: React.ReactNode }) {
  return <div className="site-shell"><SiteHeader /><main className="page-main" id="main-content"><section className="page-hero"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{intro}</p></section><section className="page-content reveal">{children}</section></main><SiteFooter /><ScrollReveals /></div>
}

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const key = slug.join('/')
  // legacy aliases → canonical keys (original site URL parity)
  const aliasMap: Record<string, string> = {
    'realtors-in-clear-lake-shores-2': 'realtors-in-clear-lake-shores',
    'realtors-in-deer-park-2': 'realtors-in-deer-park',
    'realtors-in-friendswood-2': 'realtors-in-friendswood',
    'realtors-in-la-porte-2': 'realtors-in-la-porte',
    'realtors-in-pearland-2': 'realtors-in-pearland',
    'realtors-in-san-leon-2': 'realtors-in-san-leon',
    'realtors-in-shoreacres-2': 'realtors-in-shoreacres',
    'realtors-in-texas-city-2': 'realtors-in-texas-city',
    'realtors-in-webster-2': 'realtors-in-webster',
    'galveston-homes-for-rent': 'galveston-tx-homes-for-rent',
    'league-city-homes-for-rent': 'league-city-tx-homes-for-rent',
  }
  const canonical = aliasMap[key] || key
  const areaSale = canonical.startsWith('realtors-in-') ? serviceAreas.find(area => `realtors-in-${areaSlug(area)}` === canonical) : undefined
  const areaRent = serviceAreas.find(area => `${areaSlug(area)}-tx-homes-for-rent` === canonical)
  if (key === 'agents/nancy-van-estes') { const agent = agents.find(item => item.slug === 'nancy-estes'); if (!agent) notFound(); return <PageFrame eyebrow={agent.role} title={agent.name} intro={agent.bio}><div className="agent-profile"><img className="profile-image" src={agent.image} alt={agent.name} /><div><h2>Professional and caring from first conversation through closing and funding.</h2><p>{agent.bio} Contact {agent.name} through the 1st Texas Realtors team to discuss your next move.</p>{agent.phone && agent.email && <div className="agent-contact-list"><div className="agent-contact"><strong>{agent.name}</strong><a href={`tel:${agent.phone.replaceAll('-', '')}`}>{agent.phone}</a><a href={`mailto:${agent.email}`}>{agent.email}</a></div></div>}<Link className="button button-dark" href="/contact/">Contact the team <span>↗</span></Link></div></div></PageFrame> }
  if (key === 'clear-lake-tx-homes-for-sale') { const listing = areaListings.find(item => item.slug === 'clear-lake-sale'); return <PageFrame eyebrow="Homes for sale" title={listing?.title ?? 'Clear Lake Tx Homes for Sale'} intro={listing?.intro ?? ''}><div className="rich-layout">{listing && listing.images.length > 0 && <div className="listing-gallery">{listing.images.map(src => <img key={src} src={src} alt="Clear Lake TX homes for sale" loading="lazy" />)}</div>}<div className="rich-sections">{listing?.paragraphs.map((text, i) => <article key={i}><p>{text}</p></article>)}</div></div><h2 className="subheading">Homes for sale in Clear Lake</h2><AreaSearch area="Clear Lake City" rent={false} /><div className="area-hero-card"><h2>View homes for sale</h2><p>Use our real-time Home Search or contact a Realtor for current listings, market guidance, and a plan tailored to your move.</p><div className="hero-actions"><Link className="button button-dark" href="/home-search/">Search listings <span>↗</span></Link><Link className="button button-red" href="/contact/">Contact a Realtor <span>↗</span></Link></div></div></PageFrame> }
  if (areaSale || areaRent) return <AreaPage area={(areaSale || areaRent)!} rent={Boolean(areaRent)} />
  if (servicePages[key]) { const page = servicePages[key]; return <PageFrame eyebrow={page.eyebrow} title={page.title} intro={page.intro}><StickyServicePage eyebrow={page.eyebrow} title={page.title} intro={page.intro} sections={page.sections} images={page.images ?? (page.image ? [page.image] : ['/assets/reference/clearlaketxhomesforsale.jpg'])} areaLinks={page.areaLinks} testimonial={page.testimonial} mlsLine={page.mlsLine} areaNote={page.areaNote} /></PageFrame> }
  if (key === 'about') return <PageFrame eyebrow="About 1st Texas Realtors" title="About 1st Texas Realtors in Clear Lake" intro="Since 2004, 1st Texas Realtors for a full service real estate brokerage operated by husband and wife, David & Simone Karstedt, and a host of expert Realtors totaling over 100-years combined experience. When you hire one, you get the experience and knowledge of all."><StickyAbout /><p className="area-note about-area-note">1st Texas Realtors for local Realtor experts and real time listings of homes for sale in Baytown, Clear Lake City, Clear Lake Shores, Deer Park, Dickinson, El Lago, Friendswood, Galveston, Kemah, La Porte, League City, Nassau Bay, Pasadena, Pearland, Seabrook, Taylor Lake Village, Texas City, Tiki Island and Webster.</p></PageFrame>
  if (key === 'faqs') return <PageFrame eyebrow="Frequently asked questions" title="FAQs — 1st Texas Realtors" intro="Everything you need to know about buying, selling, renting, and working with our team."><div className="faq-list faq-list-page">{faqs.map(([question, answer], index) => <details key={question} open={index < 2}><summary><span className="faq-index">{String(index + 1).padStart(2, '0')}</span>{question}<i className="faq-chip">+</i></summary><p>{answer}</p></details>)}</div><div className="page-cta"><p>Still have questions? Call <strong>{phone}</strong> or send us a note — we're happy to help.</p><Link className="button button-dark" href="/contact/">Contact a Realtor <span>↗</span></Link></div></PageFrame>
  if (key === 'realtor-reviews') return <PageFrame eyebrow="Clear Lake Tx Realtor Reviews" title="1st Texas Realtors in Clear Lake" intro="The experience and expertise of 1st Texas Realtors made the buying experience easy to navigate and gave me confidence through the entire process."><ReviewsPage /></PageFrame>
  if (key === 'agents') return <PageFrame eyebrow="Meet our agents" title="A team for the whole journey." intro="David, Simone, and our Realtors bring local experience, dedicated customer service, and real-time property listings to every conversation."><div className="agent-grid agent-grid-large">{agents.map(agent => <Link className="agent-card" key={agent.slug} href={`/agents/${agent.slug}/`}><img src={agent.image} alt={agent.name} /><div className="agent-info"><h2>{agent.name}</h2><p>{agent.role}</p><span>View profile ↗</span></div></Link>)}</div></PageFrame>
  if (key.startsWith('agents/')) { const agent = agents.find(item => item.slug === slug[1]); if (!agent) notFound(); return <PageFrame eyebrow={agent.role} title={agent.name} intro={agent.bio}><div className="agent-profile"><img className="profile-image" src={agent.image} alt={agent.name} /><div><h2>Professional and caring from first conversation through closing and funding.</h2><p>{agent.bio} Contact {agent.name} through the 1st Texas Realtors team to discuss your next move.</p>{agent.phone && agent.email && <div className="agent-contact-list"><div className="agent-contact"><strong>{agent.name}</strong><a href={`tel:${agent.phone.replaceAll('-', '')}`}>{agent.phone}</a><a href={`mailto:${agent.email}`}>{agent.email}</a></div></div>}<Link className="button button-dark" href="/contact/">Contact the team <span>↗</span></Link></div></div></PageFrame> }
  if (key === 'contact') return <PageFrame eyebrow="Contact" title="Contact the 1st Texas Realtors" intro="Contact the 1st Texas Realtors for expert and local real estate service on homes, land, and commercial property for rent"><div className="contact-layout"><div><h2>We’re here to help.</h2><p>Hours: Monday through Saturday from 9am to 6pm.</p><a className="contact-detail" href="tel:+12812413121">{phone}</a><a className="contact-detail" href={`mailto:${email}`}>{email}</a><p>To contact one of our Realtors, please click <Link className="text-link" href="/agents/">Meet Our Agents <span>↗</span></Link>.</p><div className="agent-contact-list">{agents.map(agent => <div className="agent-contact" key={agent.slug}><strong>{agent.name}</strong><a href={`tel:${agent.phone?.replaceAll('-', '')}`}>{agent.phone}</a><a href={`mailto:${agent.email}`}>{agent.email}</a></div>)}</div></div><ContactForm /></div></PageFrame>
  if (key === 'privacy-policy') return <PageFrame eyebrow="1st Texas Realtors" title="Privacy Policy" intro="We respect your privacy and collect only the information required to provide the services you request."><div className="rich-sections"><article><h2>Information we collect</h2><p>Information is collected only as required for membership registration and custom Home Searches. It is not shared, distributed, sold, or used for unrelated purposes.</p></article><article><h2>Security and choices</h2><p>Security partners may include GoDaddy, WordPress, IDX Broker, and Google Recaptcha. Registered users can unsubscribe through account settings or by contacting the company.</p></article></div></PageFrame>
  if (key === 'home-search') return <PageFrame eyebrow="Real-time Home Search" title="Find your home" intro="Choose buying, renting, or selling — then filter by area, price, size, and bedrooms to find the home that fits you."><HomeSearch /></PageFrame>
  if (key === 'register') return <PageFrame eyebrow="1st Texas Realtors" title="Register for custom searches" intro="Register to save custom home searches and receive automatic email alerts when matching listings are added."><div className="area-hero-card"><p>Free membership! Build custom searches and receive email alerts when newly listed homes are added to your search. To get the home, you must be first!</p><Link className="button button-dark" href="/contact/">Register with a Realtor <span>↗</span></Link></div></PageFrame>
  if (key === 'login') return <PageFrame eyebrow="1st Texas Realtors" title="Member login" intro="Existing members can contact us for assistance accessing their saved searches."><div className="area-hero-card"><p>Contact a Realtor for help with your saved searches and email alerts.</p><Link className="button button-dark" href="/contact/">Get assistance <span>↗</span></Link></div></PageFrame>
  notFound()
}
