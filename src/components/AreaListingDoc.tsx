import Link from 'next/link'
import { LiveBlocks } from '@/components/LiveBlocks'
import { ContentSection, PageCta } from '@/components/InnerPage'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import type { LiveBlock, LivePage } from '@/content/live-pages'
import { IDX_SEARCH_URL, IDX_SIGNUP_URL } from '@/content/idx'
import { rentPath, salePath, serviceAreas } from '@/content/site'

const external = { target: '_blank', rel: 'noopener noreferrer' } as const

/** Branded area sale/rent layout. Keeps every live block (leftovers rendered). */
export function AreaListingDoc({
  page,
  area,
  kind,
  images,
}: {
  page: LivePage
  area: string
  kind: 'sale' | 'rent'
  images: string[]
}) {
  const raw = page.blocks[0]?.text === page.header ? page.blocks.slice(1) : page.blocks
  // Skip duplicate h2 that repeats the page header
  const blocks = raw[0]?.tag === 'h2' && raw[0].text === page.header ? raw.slice(1) : raw

  const used = new Set<LiveBlock>()
  const use = (b: LiveBlock | undefined) => {
    if (!b) return undefined
    used.add(b)
    return b
  }

  const paragraphs = blocks.filter(b => b.tag === 'p')
  const lists = blocks.filter(b => b.tag === 'li')
  const headings = blocks.filter(b => b.tag === 'h2' || b.tag === 'h3' || b.tag === 'h4')
  const quote = use(blocks.find(b => b.tag === 'blockquote'))

  const intro = use(paragraphs[0])
  const listingsPitch = use(paragraphs.find(p =>
    p !== intro && (
      kind === 'rent'
        ? /^(Rent:)|homes for rent that are available|Register to save custom Home Searches/i.test(p.text)
        : /Register|real-time listings|Stay ahead/i.test(p.text)
    )
  ))
  const leasingPitch = kind === 'rent'
    ? use(paragraphs.find(p => !used.has(p) && /^(Lease:)|property management and home leasing|leasing services/i.test(p.text)))
    : undefined
  const counseling = use(paragraphs.find(p => /Buyer Counseling|first time home buyers/i.test(p.text)))
  const communities = use(paragraphs.find(p => /featured communities|include /i.test(p.text) && p !== intro && !used.has(p)))
  const callLine = use(paragraphs.find(p => /please call|speak with a Realtor|For a Realtor/i.test(p.text)))
  const aboutArea = use(paragraphs.find(p =>
    !used.has(p) && /master-planned|Harris County|Galveston County|population|Johnson Space|adjacent to|established as a city|surrounded by/i.test(p.text)
  ))

  const strategyHeading = use(headings.find(h => /Strategy/i.test(h.text)))
  const strategyStart = strategyHeading ? blocks.indexOf(strategyHeading) : -1
  const strategyParas = (
    strategyStart >= 0
      ? blocks.slice(strategyStart + 1).filter(b => b.tag === 'p').slice(0, 4)
      : paragraphs.filter(p =>
          !used.has(p) && (
            kind === 'rent'
              ? /demand for|supply|competitive housing|coveted neighborhoods|residents of|get it right/i.test(p.text)
              : /pre-approved|contract value|inventory|foreclosure|interest rates|maximize the contract|Strategy of/i.test(p.text)
          )
        ).slice(0, 4)
  ).filter(p => !used.has(p))
  strategyParas.forEach(use)

  const servicesHeading = use(headings.find(h => /Buyer Services|Home Buyer|Rental Services|services/i.test(h.text)))
  lists.forEach(use)

  const experienceLine = use(paragraphs.find(p =>
    !used.has(p) && /average 20-years|Top 3%|Testimonials|combined real estate experience|homes for rent\. Our Realtors/i.test(p.text)
  ))
  const quoteDup = paragraphs.find(p => quote && p.text.slice(0, 40) === quote.text.slice(0, 40))
  if (quoteDup) use(quoteDup)
  const quoteAuthor = use(paragraphs.find(p => /^[—–-]/.test(p.text.trim()) && !used.has(p)))
  const closing = use(paragraphs.find(p =>
    !used.has(p) && /1st Texas Realtors in .* for expert|real time listings of homes|property management and leasing/i.test(p.text)
  ))

  // Any leftover live blocks — still rendered, never dropped
  const leftovers = blocks.filter(b => !used.has(b) && !(b.tag === 'h2' && b.text === page.header))

  const heroImage = images[0]
  const stripImages = images.slice(1, 4)
  const splitImage = images[4] ?? images[1]
  const kindLabel = kind === 'sale' ? 'Homes for Sale' : 'Homes for Rent'
  const introTitle = kind === 'sale' ? 'Find the home first.' : 'Rent or lease with locals.'
  const guidanceTitle = kind === 'sale' ? `Buying in ${area}.` : `Renting in ${area}.`
  const servicesTitle = kind === 'sale' ? 'Home Buyer Services.' : 'Rental & leasing services.'
  const searchHref = '/home-search/'
  const neighborHref = (name: string) => (kind === 'rent' ? rentPath(name) : salePath(name))

  const strategyTitles = kind === 'sale'
    ? ['Get pre-approved', 'Maximize contract value', "Today's market", 'Foreclosure specialists']
    : ['Renting', 'Leasing & management', 'Market conditions', 'Local expertise']

  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="page-main inner-page area-listing-page" id="main-content">
        <section className="area-hero" aria-label={page.header}>
          {heroImage && (
            <div className="area-hero-media" aria-hidden="true">
              <img src={heroImage} alt="" />
              <div className="area-hero-overlay" />
            </div>
          )}
          <div className="area-hero-copy">
            <p className="eyebrow">{kindLabel}</p>
            <h1 className="display-section">{area}</h1>
            {intro && <p className="area-hero-lead">{intro.text}</p>}
            <div className="area-hero-actions">
              <a className="button button-red" href={IDX_SEARCH_URL} {...external}>
                View listings <span className="btn-icon">↗</span>
              </a>
              {callLine && (
                <a className="button button-glass" href="/contact/">
                  Contact a Realtor <span className="btn-icon">↗</span>
                </a>
              )}
            </div>
          </div>
        </section>

        <section className="section intro-section about-intro">
          <div className="section-heading">
            <p className="eyebrow">Local Realtors in {area}</p>
            <h2 className="display-section">{introTitle}</h2>
            {listingsPitch && <p>{listingsPitch.text}</p>}
            {leasingPitch && <p>{leasingPitch.text}</p>}
            {counseling && <p>{counseling.text}</p>}
            {callLine && <p className="area-call-line">{callLine.text}</p>}
            <p className="intro-testimonials-cta">
              <Link className="text-link" href={searchHref}>Home Search <span>↗</span></Link>
              {' · '}
              <a className="text-link" href={IDX_SIGNUP_URL} {...external}>Register <span>↗</span></a>
            </p>
          </div>
        </section>

        {stripImages.length > 0 && (
          <ContentSection className="about-photos">
            <div className={`about-photo-strip${stripImages.length === 2 ? ' about-photo-strip-2' : ''}`}>
              {stripImages.map((src, i) => (
                <figure key={src}>
                  <img src={src} alt={`${area} homes ${i + 1}`} />
                  <figcaption>{area}</figcaption>
                </figure>
              ))}
            </div>
          </ContentSection>
        )}

        {(communities || aboutArea) && (
          <ContentSection
            className="area-split-section"
            eyebrow="The community"
            title={communities ? 'Featured communities.' : `About ${area}.`}
          >
            <div className={`area-split${splitImage ? '' : ' is-text-only'}`}>
              {splitImage && (
                <div className="area-split-media">
                  <img src={splitImage} alt={`${area} community`} />
                </div>
              )}
              <div className="area-split-body">
                {communities && <p>{communities.text}</p>}
                {aboutArea && <p>{aboutArea.text}</p>}
              </div>
            </div>
          </ContentSection>
        )}

        {strategyParas.length > 0 && (
          <ContentSection dark eyebrow={strategyHeading?.text ?? (kind === 'rent' ? 'How we help' : 'Strategy')} title={guidanceTitle}>
            <div className="buy-market-grid">
              {strategyParas.map((block, i) => (
                <article className="buy-market-card" key={i}>
                  <span className="about-service-num">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{strategyTitles[i] ?? `Guidance ${i + 1}`}</h3>
                  <p>{block.text.replace(/^(Rent|Lease)[;:]\s*/i, '')}</p>
                </article>
              ))}
            </div>
          </ContentSection>
        )}

        {lists.length > 0 && (
          <ContentSection eyebrow={servicesHeading?.text ?? 'What you get'} title={servicesTitle}>
            <div className="about-service-grid buy-service-grid">
              {lists.map((item, i) => (
                <article className="about-service-card buy-service-card" key={item.text}>
                  <span className="about-service-num">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{item.text.replace(/\.$/, '')}</h3>
                </article>
              ))}
            </div>
          </ContentSection>
        )}

        <section className="section intro-section about-closing">
          <div className="section-heading">
            <p className="eyebrow">{quote ? 'Client voice' : 'Next step'}</p>
            <h2 className="display-section">Trusted locally.</h2>
            {quote && (
              <blockquote className="buy-quote">
                <p>{quote.text.replace(/^[“”"'`\s]+/, '').replace(/[”"'`\s]+$/, '')}</p>
                {quoteAuthor && <cite>{quoteAuthor.text.replace(/^—\s*|^–\s*/, '')}</cite>}
              </blockquote>
            )}
            {experienceLine && <p>{experienceLine.text}</p>}
            {closing && <p>{closing.text}</p>}
            <p className="intro-testimonials-cta">
              <Link className="text-link" href="/realtor-reviews/">Testimonials <span>↗</span></Link>
              {' · '}
              <Link className="text-link" href="/contact/">Contact a Realtor <span>↗</span></Link>
            </p>
          </div>
        </section>

        <ContentSection eyebrow="Nearby areas" title={`More ${kindLabel.toLowerCase()}.`}>
          <div className="buy-area-chips">
            {serviceAreas.filter(name => name !== area).slice(0, 8).map(name => (
              <Link key={name} href={neighborHref(name)}>{name}<span>↗</span></Link>
            ))}
          </div>
          <details className="buy-area-more">
            <summary>More areas <span aria-hidden="true">↗</span></summary>
            <div className="buy-area-chips">
              {serviceAreas.filter(name => name !== area).slice(8).map(name => (
                <Link key={name} href={neighborHref(name)}>{name}<span>↗</span></Link>
              ))}
            </div>
          </details>
        </ContentSection>

        {leftovers.length > 0 && (
          <ContentSection className="area-leftover-copy" eyebrow="More from this page" title={page.header}>
            <div className="prose-panel">
              <LiveBlocks blocks={leftovers} />
            </div>
          </ContentSection>
        )}

        <PageCta />
      </main>
      <SiteFooter />
    </div>
  )
}
