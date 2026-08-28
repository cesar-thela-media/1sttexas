import Link from 'next/link'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { ContactForm } from '@/components/ContactForm'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { LiveBlocks } from '@/components/LiveBlocks'
import { ContentSection, InnerHero, MediaSplit, PageCta, SectionedLiveCopy } from '@/components/InnerPage'
import { HubVideoBand } from '@/components/HubMedia'
import SellHero from '@/components/shadcn-space/blocks/hero-03/hero'
import { agents, allStaticPaths, areaSlug, email, phone, rentPath, salePath, serviceAreas, servicePages } from '@/content/site'
import { areaFromRentSlug, areaFromSaleSlug, pageMeta } from '@/content/paths'
import { livePages, livePathForSlug, type LivePage } from '@/content/live-pages'
import { areaListings } from '@/content/area-listings'
import { HomeSearch } from '@/components/HomeSearch'
import { ReviewsPage } from '@/components/ReviewsPage'
import { AreaListingDoc } from '@/components/AreaListingDoc'
import { AgentBioDoc } from '@/components/AgentBioDoc'
import { IDX_SEARCH_URL } from '@/content/idx'
import AboutServices from '@/components/shadcn-space/blocks/services-02/services'
import { aboutServicesData } from '@/content/about-services'

export function generateStaticParams() { return allStaticPaths.map(path => ({ slug: path.split('/') })) }

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const key = (await params).slug.join('/')
  const live = livePages[livePathForSlug(key)]
  if (live) {
    const first = live.blocks.find(block => block.tag === 'p')?.text
    return { title: live.title || live.header, description: first }
  }
  if (pageMeta[key]) return { title: pageMeta[key].title, description: pageMeta[key].description }
  return { title: '1st Texas Realtors' }
}

function LiveDoc({ path, images, extra }: { path: string; images?: string[]; extra?: ReactNode }) {
  const page = livePages[path]
  if (!page) notFound()
  const header = page.header || page.blocks[0]?.text || '1st Texas Realtors'
  const rest = page.blocks[0]?.text === header ? page.blocks.slice(1) : page.blocks
  const leadImage = images?.[0]
  const sectionImages = images?.slice(1) ?? []

  return <div className="site-shell"><SiteHeader /><main className="page-main inner-page" id="main-content">
    <InnerHero title={header} media={leadImage} mediaAlt={header} />
    <SectionedLiveCopy blocks={rest} images={sectionImages.length ? sectionImages : (leadImage ? [leadImage] : [])} imageAlt={header} />
    {extra && <ContentSection className="inner-extra-section">{extra}</ContentSection>}
    <PageCta />
  </main><SiteFooter /></div>
}

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const key = slug.join('/')
  const path = livePathForSlug(key)
  const saleArea = areaFromSaleSlug(key)
  const rentArea = areaFromRentSlug(key)
  const listing = (saleArea || rentArea)
    ? areaListings.find(item => item.kind === (rentArea ? 'rent' : 'sale') && item.slug === areaSlug((saleArea || rentArea)!))
    : undefined

  if (livePages[path]) {
    if (key === 'about') return <AboutDoc page={livePages[path]!} />
    if (key === 'home-buyers') return <HomeBuyingDoc page={livePages[path]!} />
    if (key === 'seller-services') return <HomeSellingDoc page={livePages[path]!} />
    if (key === 'homes-for-rent') return <HomesForRentDoc page={livePages[path]!} />
    if (key === 'commercial-property-realtors') return <CommercialDoc page={livePages[path]!} />
    if (key === 'new-home-construction') return <NewHomesDoc page={livePages[path]!} />
    if (key === 'home-staging') return <HomeStagingDoc page={livePages[path]!} />
    if (key === 'relocation-service') return <RelocationDoc page={livePages[path]!} />
    if (key === 'realtor-reviews') return <ReviewsDoc page={livePages[path]!} />
    if (key === 'agents') return <AgentsDoc page={livePages[path]!} />
    if (key === 'contact') return <ContactDoc page={livePages[path]!} />
    if (key === 'privacy-policy') return <PrivacyDoc page={livePages[path]!} />
    // Pass 4: agent bio pages
    if (key.startsWith('agents/')) {
      const agent = agents.find(item => item.slug === slug[1])
      if (agent) return <AgentBioDoc page={livePages[path]!} agent={agent} />
    }
    // Pass 2–3: all sale + rent area pages use branded AreaListingDoc
    if (saleArea || rentArea) {
      const images = listing?.images
        ?? servicePages[key]?.images
        ?? (servicePages[key]?.image ? [servicePages[key].image!] : [])
      return (
        <AreaListingDoc
          page={livePages[path]!}
          area={(saleArea || rentArea)!}
          kind={rentArea ? 'rent' : 'sale'}
          images={images}
        />
      )
    }
    const extras = [] as ReactNode[]
    if (key === 'agents') extras.push(<div className="agent-grid agent-grid-large" key="grid">{agents.map(agent => <Link className="agent-card" key={agent.slug} href={`/agents/${agent.slug}/`}><img src={agent.image} alt={agent.name} /><div className="agent-info"><h2>{agent.name}</h2><p>{agent.role}</p><span>View Bio ↗</span></div></Link>)}</div>)
    if (key.startsWith('agents/')) {
      const agent = agents.find(item => item.slug === slug[1])
      if (agent) extras.push(<div className="agent-profile" key="photo"><img className="profile-image" src={agent.image} alt={agent.name} /></div>)
    }
    if (saleArea || rentArea) {
      extras.push(<div className="area-grid" key="areas">{serviceAreas.filter(item => item !== (saleArea || rentArea)).map(item => <Link key={item} href={rentArea ? rentPath(item) : salePath(item)}>{item}</Link>)}</div>)
    }
    const images = listing?.images ?? servicePages[key]?.images ?? (servicePages[key]?.image ? [servicePages[key].image!] : undefined)
    return <LiveDoc path={path} images={images} extra={extras} />
  }

  if (key === 'home-search') return <HomeSearchDoc />
  notFound()
}

function HomeBuyingDoc({ page }: { page: LivePage }) {
  const blocks = page.blocks[0]?.text === page.header ? page.blocks.slice(1) : page.blocks
  const intro = blocks.find(b => b.tag === 'p')
  const marketTitles = ['The first step', 'Beyond the purchase price', "Today's market", 'Foreclosure specialists']
  const marketBlocks = blocks.filter(b => b.tag === 'p' && !b.text.includes('Baytown |') && !b.text.startsWith('View homes') && !b.text.startsWith('“') && !b.text.startsWith('"') && !b.text.startsWith('–') && !b.text.startsWith('For immediate') && b !== intro).slice(0, 4)
  const serviceItems = blocks.filter(b => b.tag === 'li').map(b => b.text)
  const quote = blocks.find(b => b.tag === 'blockquote')?.text
    ?? blocks.find(b => b.tag === 'p' && (b.text.startsWith('“') || b.text.startsWith('"')))?.text
  const quoteAuthor = blocks.find(b => b.tag === 'p' && (b.text.startsWith('–') || b.text.startsWith('—')))?.text
  const closing = blocks.find(b => b.tag === 'p' && b.text.startsWith('For immediate'))
  const areasNote = blocks.find(b => b.tag === 'h4' && b.text.includes('expert Home Buying'))?.text
  const images = servicePages['home-buyers']?.images ?? []
  const photoCaptions = ['Clear Lake homes', 'League City', 'NASA area', 'Clear Lake waterfront', 'Our team']

  const marketMedia = [
    { media: images[1] ?? '/assets/reference/leaguecityhomesforsale.jpg', alt: 'League City homes for sale' },
    { media: '/assets/reference/seabrookhomesforsale.jpg', alt: 'Seabrook homes for sale' },
    { video: '/videos/hero-league-city.mp4', poster: images[0], alt: 'League City aerial' },
    { media: images[2] ?? '/assets/reference/NASAhomesforsale.jpg', alt: 'NASA Clear Lake homes' },
  ]

  return <div className="site-shell"><SiteHeader /><main className="page-main inner-page about-page home-buying-page hub-buy" id="main-content">
    <section className="section intro-section about-intro">
      <div className="section-heading">
        <p className="eyebrow">Home Buying</p>
        <h1 className="display-section">Buy with local experts.</h1>
        {intro && <LiveBlocks blocks={[intro]} />}
        <p className="intro-testimonials-cta"><Link className="text-link" href="/home-search/">Home Search <span>↗</span></Link></p>
      </div>
    </section>

    <ContentSection className="about-photos">
      <div className="about-photo-strip">
        {images.slice(0, 3).map((src, i) => (
          <figure key={src}><img src={src} alt={photoCaptions[i] ?? page.header} /><figcaption>{photoCaptions[i]}</figcaption></figure>
        ))}
      </div>
    </ContentSection>

    <HubVideoBand
      src="/videos/hero-showing.mp4"
      poster={images[0]}
      eyebrow="View homes for sale"
      title="Start with real-time listings."
    >
      <div className="buy-area-chips">
        {serviceAreas.slice(0, 8).map(name => (
          <Link key={name} href={salePath(name)}>{name}<span>↗</span></Link>
        ))}
      </div>
      <details className="buy-area-more">
        <summary>More areas <span aria-hidden="true">↗</span></summary>
        <div className="buy-area-chips">
          {serviceAreas.slice(8).map(name => (
            <Link key={name} href={salePath(name)}>{name}<span>↗</span></Link>
          ))}
        </div>
      </details>
    </HubVideoBand>

    <ContentSection eyebrow="Market guidance" title="Buying with clarity.">
      <div className="hub-media-stack">
        {marketBlocks.map((block, i) => (
          <MediaSplit
            key={marketTitles[i] ?? i}
            media={marketMedia[i]?.media}
            video={marketMedia[i]?.video}
            poster={marketMedia[i]?.poster}
            mediaAlt={marketMedia[i]?.alt ?? marketTitles[i]}
            flip={i % 2 === 1}
          >
            <p className="eyebrow">{String(i + 1).padStart(2, '0')}</p>
            <h3>{marketTitles[i] ?? `Guidance ${i + 1}`}</h3>
            <p>{block.text}</p>
          </MediaSplit>
        ))}
      </div>
    </ContentSection>

    <ContentSection className="section-dark" eyebrow="What you get" title="Home Buyer Services.">
      <MediaSplit
        video="/videos/hero-clear-lake-city.mp4"
        poster={images[3] ?? '/assets/client/Clear-Lake-239.jpg'}
        mediaAlt="Clear Lake City"
      >
        <p className="eyebrow">Buyer representation</p>
        <h3>Stay with you through closing & beyond.</h3>
        <div className="hub-service-stack">
          {serviceItems.map((item, i) => (
            <article key={item}>
              <span className="about-service-num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{item.replace(/\.$/, '')}</h3>
            </article>
          ))}
        </div>
      </MediaSplit>
    </ContentSection>

    <ContentSection eyebrow="Client voice" title="Trusted through closing.">
      <MediaSplit
        className="hub-quote-split"
        media="/assets/client/Simone-Closing-01-2023-e1673708197759.jpg"
        mediaAlt="Simone Karstedt at closing"
      >
        {quote && <blockquote className="buy-quote"><p>{quote.replace(/^[“”"'`\s]+/, '').replace(/[”"'`\s]+$/, '')}</p>{quoteAuthor && <cite>{quoteAuthor.replace(/^—\s*|^–\s*/, '')}</cite>}</blockquote>}
        {closing && <LiveBlocks blocks={[closing]} />}
        <p className="intro-testimonials-cta"><Link className="text-link" href="/contact/">Contact a Realtor <span>↗</span></Link></p>
      </MediaSplit>
      {areasNote && <p className="about-areas-note">{areasNote}</p>}
    </ContentSection>

    <PageCta />
  </main><SiteFooter /></div>
}

function HomeSellingDoc({ page }: { page: LivePage }) {
  const blocks = page.blocks[0]?.text === page.header ? page.blocks.slice(1) : page.blocks
  const paragraphs = blocks.filter(b => b.tag === 'p')
  const intro = paragraphs[0]
  const processCards = [
    { title: 'Market Analysis', body: paragraphs.find(p => p.text.startsWith('Market Analysis'))?.text.replace(/^Market Analysis\s*/, '') },
    { title: 'Home Staging & Renovations', body: paragraphs.find(p => p.text.startsWith('Less is More'))?.text },
    { title: 'Prepare your home', body: paragraphs.find(p => p.text.startsWith('Assemble documentation'))?.text },
    { title: 'Selling now, buying later', body: paragraphs.find(p => p.text.startsWith('Selling now'))?.text },
  ].filter(card => card.body)
  const serviceItems = blocks.filter(b => b.tag === 'li').map(b => b.text)
  const closing = paragraphs.filter(p =>
    p.text.startsWith('When choosing') || p.text.startsWith('For immediate')
  )
  const areasNote = blocks.find(b => b.tag === 'h4' && b.text.includes('Realtor experts'))?.text
  const images = servicePages['seller-services']?.images ?? []
  const photoCaptions = ['Seabrook homes', 'Waterfront living', 'Friendswood', 'League City', 'David & Simone']

  const processMedia = [
    { media: images[0], alt: 'Seabrook homes' },
    { media: images[1] ?? '/assets/reference/seabrookhomesforsale02.jpg', alt: 'Waterfront living' },
    { video: '/videos/hero-bighouse.mp4', poster: images[2], alt: 'Prepared home' },
    { media: images[3] ?? '/assets/reference/leaguecityhomesforsale.jpg', alt: 'League City homes' },
  ]

  return <div className="site-shell"><SiteHeader /><main className="page-main inner-page about-page selling-page hub-sell" id="main-content">
    <SellHero
      eyebrow="Home Selling"
      title="Sell with a plan."
      lead={intro?.text}
      video="/videos/hero-bighouse.mp4"
      poster={images[0]}
      ctaHref="/contact/"
      ctaLabel="Contact a Realtor"
    />

    <ContentSection className="about-photos">
      <div className="about-photo-strip">
        {images.slice(0, 3).map((src, i) => (
          <figure key={src}><img src={src} alt={photoCaptions[i] ?? page.header} /><figcaption>{photoCaptions[i]}</figcaption></figure>
        ))}
      </div>
    </ContentSection>

    <ContentSection eyebrow="The sale" title="Every step, locally.">
      <div className="hub-media-stack">
        {processCards.map((card, i) => (
          <MediaSplit
            key={card.title}
            media={processMedia[i]?.media}
            video={processMedia[i]?.video}
            poster={processMedia[i]?.poster}
            mediaAlt={processMedia[i]?.alt ?? card.title}
            flip={i % 2 === 1}
          >
            <p className="eyebrow">{String(i + 1).padStart(2, '0')}</p>
            <h3>{card.title}</h3>
            <p>{card.body}</p>
          </MediaSplit>
        ))}
      </div>
    </ContentSection>

    <ContentSection className="section-dark" eyebrow="What you get" title="Home Selling Services.">
      <MediaSplit
        media={images[4] ?? '/assets/client/David-Simone-239.jpg'}
        mediaAlt="David and Simone Karstedt"
      >
        <div className="hub-service-stack">
          {serviceItems.map((item, i) => (
            <article key={item}>
              <span className="about-service-num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{item.replace(/\.$/, '')}</h3>
            </article>
          ))}
        </div>
      </MediaSplit>
    </ContentSection>

    <section className="section intro-section about-closing">
      <div className="section-heading">
        <p className="eyebrow">Next step</p>
        <h2 className="display-section">Choose the right Realtor.</h2>
        {closing.length > 0 && <LiveBlocks blocks={closing} />}
        <p className="intro-testimonials-cta"><Link className="text-link" href="/home-staging/">Home Staging Guidelines <span>↗</span></Link></p>
        {areasNote && <p className="about-areas-note">{areasNote}</p>}
      </div>
    </section>

    <PageCta />
  </main><SiteFooter /></div>
}

function HomesForRentDoc({ page }: { page: LivePage }) {
  const blocks = page.blocks[0]?.text === page.header ? page.blocks.slice(1) : page.blocks
  const paragraphs = blocks.filter(b => b.tag === 'p')
  const intro = paragraphs[0]
  const renting = paragraphs.find(p => /^RENTING/i.test(p.text))
  const leasing = paragraphs.find(p => /^LEASING/i.test(p.text))
  const closing = paragraphs.find(p => p.text.startsWith('For a Realtor') || p.text.startsWith('For immediate'))
  const areasNote = blocks.find(b => b.tag === 'h4' && b.text.includes('rental services'))?.text
  const images = servicePages['homes-for-rent']?.images ?? []
  const photoCaptions = ['NASA Clear Lake', 'Waterfront living']
  const featureCards = [
    {
      title: 'Renting',
      body: renting?.text.replace(/^RENTING[;:]\s*/i, ''),
      href: '/home-search/',
      cta: 'View rentals',
    },
    {
      title: 'Leasing · Property Management',
      body: leasing?.text.replace(/^LEASING[;:]\s*/i, ''),
      href: '/contact/',
      cta: 'Talk leasing',
    },
  ].filter(card => card.body)

  return <div className="site-shell"><SiteHeader /><main className="page-main inner-page about-page rent-page hub-rent" id="main-content">
    <SellHero
      eyebrow="Homes for Rent"
      title="Rent or lease with locals."
      lead={intro?.text}
      video="/videos/hero-lakehouse.mp4"
      poster={images[0] ?? '/assets/reference/NASAhomesforsale.jpg'}
      ctaHref="/home-search/"
      ctaLabel="Home Search"
    >
      <div className="buy-area-chips">
        {serviceAreas.slice(0, 8).map(name => (
          <Link key={name} href={rentPath(name)}>{name}<span>↗</span></Link>
        ))}
      </div>
      <details className="buy-area-more">
        <summary>More areas <span aria-hidden="true">↗</span></summary>
        <div className="buy-area-chips">
          {serviceAreas.slice(8).map(name => (
            <Link key={name} href={rentPath(name)}>{name}<span>↗</span></Link>
          ))}
        </div>
      </details>
    </SellHero>

    <ContentSection eyebrow="How we help" title="Renting and leasing.">
      <div className="hub-media-stack">
        {featureCards.map((card, i) => (
          <MediaSplit
            key={card.title}
            media={images[i]}
            video={i === 0 ? '/videos/hero-golf.mp4' : undefined}
            poster={images[i]}
            mediaAlt={photoCaptions[i] ?? card.title}
            flip={i % 2 === 1}
          >
            <p className="eyebrow">{String(i + 1).padStart(2, '0')}</p>
            <h3>{card.title}</h3>
            <p>{card.body}</p>
            <Link className="button button-red" href={card.href}>
              {card.cta} <span className="btn-icon">↗</span>
            </Link>
          </MediaSplit>
        ))}
      </div>
    </ContentSection>

    <section className="section intro-section about-closing">
      <div className="section-heading">
        <p className="eyebrow">Next step</p>
        <h2 className="display-section">Ready to rent or lease?</h2>
        {closing && <LiveBlocks blocks={[closing]} />}
        <p className="intro-testimonials-cta"><Link className="text-link" href="/contact/">Contact a Realtor <span>↗</span></Link></p>
        {areasNote && <p className="about-areas-note">{areasNote}</p>}
      </div>
    </section>

    <PageCta />
  </main><SiteFooter /></div>
}

function CommercialDoc({ page }: { page: LivePage }) {
  const blocks = page.blocks[0]?.text === page.header ? page.blocks.slice(1) : page.blocks
  const paragraphs = blocks.filter(b => b.tag === 'p')
  const intro = paragraphs[0]
  const experience = paragraphs.find(p => p.text.includes('25-years experience'))
  const callLine = paragraphs.find(p => p.text.includes('please call David Karstedt'))
  const scopeCards = [
    {
      title: 'Multi Family Apartments or Condominiums',
      body: paragraphs.find(p => p.text.startsWith('(1)'))?.text.replace(/^\(1\)\s*Multi Family Apartments or Condominiums[;:]\s*/i, ''),
    },
    {
      title: 'Commercial Property',
      body: paragraphs.find(p => p.text.startsWith('(2)'))?.text.replace(/^\(2\)\s*Commercial Property[;:]\s*/i, ''),
    },
    {
      title: 'Schedule an Appointment',
      body: paragraphs.find(p => p.text.startsWith('(3)'))?.text.replace(/^\(3\)\s*Schedule an Appointment[;:]\s*/i, ''),
    },
  ].filter(card => card.body)
  const areasNote = blocks.find(b => b.tag === 'h4')?.text
  const images = servicePages['commercial-property-realtors']?.images ?? []
  const photoCaptions = ['Clear Lake Texas', 'Commercial corridor']

  return <div className="site-shell"><SiteHeader /><main className="page-main inner-page about-page commercial-page hub-commercial" id="main-content">
    <SellHero
      eyebrow="Commercial Property"
      title="Commercial done locally."
      lead={intro?.text}
      video="/videos/hero-construction.mp4"
      poster={images[0] ?? '/assets/reference/Clear-Lake-Texas-e1736781694121.jpg'}
      ctaHref="tel:+17138852228"
      ctaLabel="Call David Karstedt"
    />

    <ContentSection className="about-photos">
      <div className="about-photo-strip about-photo-strip-2">
        {images.slice(0, 2).map((src, i) => (
          <figure key={src}><img src={src} alt={photoCaptions[i] ?? page.header} /><figcaption>{photoCaptions[i]}</figcaption></figure>
        ))}
      </div>
    </ContentSection>

    <ContentSection eyebrow="Scope of work" title="Commercial Property and Multi Family.">
      <div className="hub-media-stack">
        {experience && (
          <MediaSplit
            video="/videos/hero-clear-lake-city.mp4"
            poster={images[0]}
            mediaAlt="Clear Lake Texas"
          >
            <p className="eyebrow">01</p>
            <h3>Commercial experience</h3>
            <p>{experience.text}</p>
          </MediaSplit>
        )}
        {scopeCards.map((card, i) => (
          <MediaSplit
            key={card.title}
            media={images[i % images.length] || images[0]}
            video={i === 1 ? '/videos/hero-construction.mp4' : undefined}
            poster={images[1] ?? images[0]}
            mediaAlt={photoCaptions[i % photoCaptions.length] ?? card.title}
            flip={i % 2 === 0}
          >
            <p className="eyebrow">{String(i + 2).padStart(2, '0')}</p>
            <h3>{card.title}</h3>
            <p>{card.body}</p>
          </MediaSplit>
        ))}
        {callLine && (
          <MediaSplit media="/assets/client/David-Simone-239.jpg" mediaAlt="David Karstedt" flip>
            <p className="eyebrow">Talk with David</p>
            <h3>Schedule an appointment.</h3>
            <p>{callLine.text}</p>
            <a className="button button-red" href="tel:+17138852228">
              Call (713) 885-2228 <span className="btn-icon">↗</span>
            </a>
          </MediaSplit>
        )}
      </div>
    </ContentSection>

    <section className="section intro-section about-closing">
      <div className="section-heading">
        <p className="eyebrow">Next step</p>
        <h2 className="display-section">Complex deals, clear guidance.</h2>
        <p>Whether buying, selling, financing, refinancing, zoning or regulatory — start with a Commercial Realtor who knows Clear Lake.</p>
        <p className="intro-testimonials-cta"><Link className="text-link" href="/contact/">Contact a Realtor <span>↗</span></Link></p>
        {areasNote && <p className="about-areas-note">{areasNote}</p>}
      </div>
    </section>

    <PageCta />
  </main><SiteFooter /></div>
}

function NewHomesDoc({ page }: { page: LivePage }) {
  const blocks = page.blocks[0]?.text === page.header ? page.blocks.slice(1) : page.blocks
  const intro = blocks.find(b => b.tag === 'h4' && b.text.includes('new home construction'))?.text
    ?? blocks.find(b => b.tag === 'h4')?.text
  const topicSections: { title: string; body: string }[] = []
  let current: { title: string; parts: string[] } | null = null
  for (const block of blocks) {
    if (block.tag === 'h3') {
      if (current) topicSections.push({ title: current.title, body: current.parts.join(' ') })
      current = { title: block.text.split('|')[0].trim(), parts: [] }
      continue
    }
    if (block.tag === 'p' && current) current.parts.push(block.text)
  }
  if (current) topicSections.push({ title: current.title, body: current.parts.join(' ') })
  const areasNote = [...blocks].reverse().find(b => b.tag === 'h4' && b.text.includes('Baytown'))?.text
  const images = servicePages['new-home-construction']?.images ?? []
  const photoCaptions = ['Friendswood new builds', 'Clear Lake homes', 'League City', 'Seabrook']
  const builders = ['Trendmaker Homes', 'Taylor Morrison', 'DR Horton', 'Gehan Homes']

  return <div className="site-shell"><SiteHeader /><main className="page-main inner-page about-page new-homes-page hub-newhomes" id="main-content">
    <SellHero
      eyebrow="New Home Construction"
      title="Build with the right guide."
      lead={intro}
      video="/videos/hero-construction.mp4"
      poster={images[0] ?? '/assets/reference/friendswoodhomesforsale.jpg'}
      ctaHref="/contact/"
      ctaLabel="Talk new construction"
    >
      <div className="buy-area-chips">
        {builders.map(name => (
          <span className="new-homes-builder-chip" key={name}>{name}</span>
        ))}
      </div>
    </SellHero>

    <ContentSection className="about-photos">
      <div className="about-photo-strip">
        {images.slice(0, 3).map((src, i) => (
          <figure key={src}><img src={src} alt={photoCaptions[i] ?? page.header} /><figcaption>{photoCaptions[i]}</figcaption></figure>
        ))}
      </div>
    </ContentSection>

    <ContentSection eyebrow="Guidance" title="New construction decisions.">
      <div className="hub-media-stack">
        {topicSections.map((section, i) => (
          <MediaSplit
            key={section.title}
            media={images[i % images.length]}
            video={i === 1 ? '/videos/hero-bighouse.mp4' : undefined}
            poster={images[i % images.length]}
            mediaAlt={photoCaptions[i % photoCaptions.length] ?? section.title}
            flip={i % 2 === 1}
          >
            <p className="eyebrow">{String(i + 1).padStart(2, '0')}</p>
            <h3>{section.title}</h3>
            <p>{section.body}</p>
          </MediaSplit>
        ))}
      </div>
    </ContentSection>

    <section className="section intro-section about-closing">
      <div className="section-heading">
        <p className="eyebrow">Next step</p>
        <h2 className="display-section">Choose the builder with a Realtor first.</h2>
        <p>Promotions, upgrades, preferred lenders, and lot issues are easier to navigate when local experience is on your side.</p>
        <p className="intro-testimonials-cta"><Link className="text-link" href="/contact/">Contact a Realtor <span>↗</span></Link></p>
        {areasNote && <p className="about-areas-note">{areasNote}</p>}
      </div>
    </section>

    <PageCta />
  </main><SiteFooter /></div>
}

function HomeStagingDoc({ page }: { page: LivePage }) {
  const raw = page.blocks[0]?.tag === 'h2' && page.blocks[0].text === page.header
    ? page.blocks.slice(1)
    : page.blocks.filter(b => !(b.tag === 'h2' && b.text === page.header))
  const lead = raw.find(b => b.tag === 'h4' && /guidelines|add significant value/i.test(b.text))
  const lessIsMore = raw.find(b => b.tag === 'h4' && /Less is More/i.test(b.text))
  const guidelines = raw.filter(b => b.tag === 'li')
  const closing = raw.find(b => b.tag === 'h4' && /1st Texas Realtors for expert home staging/i.test(b.text))
  const leftovers = raw.filter(b =>
    b !== lead && b !== lessIsMore && b !== closing && b.tag !== 'li' && !(b.tag === 'h2' && b.text === page.header)
  )
  const images = servicePages['home-staging']?.images ?? []
  const photoCaptions = ['NASA Clear Lake', 'Friendswood', 'League City']

  return <div className="site-shell"><SiteHeader /><main className="page-main inner-page about-page staging-page home-buying-page" id="main-content">
    <section className="section intro-section about-intro">
      <div className="section-heading">
        <p className="eyebrow">Home Staging</p>
        <h1 className="display-section">Stage to sell.</h1>
        {lead && <p>{lead.text}</p>}
        <p className="intro-testimonials-cta"><Link className="text-link" href="/seller-services/">Seller services <span>↗</span></Link></p>
      </div>
    </section>

    <HubVideoBand
      src="/videos/hero-mower.mp4"
      poster={images[0]}
      eyebrow={lessIsMore?.text ?? 'Guidelines'}
      title="Less is more."
    />

    {images.length > 0 && (
      <ContentSection className="about-photos">
        <div className="about-photo-strip">
          {images.slice(0, 3).map((src, i) => (
            <figure key={src}><img src={src} alt={photoCaptions[i] ?? page.header} /><figcaption>{photoCaptions[i]}</figcaption></figure>
          ))}
        </div>
      </ContentSection>
    )}

    <ContentSection eyebrow="Details that sell" title="Home staging guidelines.">
      <MediaSplit
        video="/videos/hero-showing.mp4"
        poster={images[1] ?? images[0]}
        mediaAlt="Staged Clear Lake home"
      >
        <div className="hub-service-stack">
          {guidelines.map((item, i) => (
            <article key={item.text.slice(0, 40)}>
              <span className="about-service-num">{String(i + 1).padStart(2, '0')}</span>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </MediaSplit>
    </ContentSection>

    <section className="section intro-section about-closing">
      <div className="section-heading">
        <p className="eyebrow">Next step</p>
        <h2 className="display-section">Sell with a staged home.</h2>
        {closing && <p className="about-areas-note">{closing.text}</p>}
        {leftovers.length > 0 && <LiveBlocks blocks={leftovers} />}
        <p className="intro-testimonials-cta"><Link className="text-link" href="/contact/">Contact a Realtor <span>↗</span></Link></p>
      </div>
    </section>

    <PageCta />
  </main><SiteFooter /></div>
}

function RelocationDoc({ page }: { page: LivePage }) {
  const raw = page.blocks[0]?.tag === 'h2' && page.blocks[0].text === page.header
    ? page.blocks.slice(1)
    : page.blocks.filter(b => !(b.tag === 'h2' && b.text === page.header))
  const intro = raw.find(b => b.tag === 'p')
  const challenge = raw.find(b => b.tag === 'p' && b !== intro && /relocating can be very difficult|children, pets/i.test(b.text))
  const contactCue = raw.find(b => b.tag === 'p' && /Click here to contact/i.test(b.text))
  const guidelines = raw.find(b => b.tag === 'p' && /relocation guidelines|NASA area communities/i.test(b.text))
  const stepsHeading = raw.find(b => b.tag === 'h3' && /Steps to relocating/i.test(b.text))
  const steps = raw.filter(b => b.tag === 'li')
  const closing = raw.find(b => b.tag === 'h4' && /expert relocation service/i.test(b.text))
  const used = new Set([intro, challenge, contactCue, guidelines, stepsHeading, closing, ...steps].filter(Boolean))
  const leftovers = raw.filter(b => !used.has(b) && !(b.tag === 'h2' && b.text === page.header))
  const images = servicePages['relocation-service']?.images ?? []
  const photoCaptions = ['Clear Lake Texas', 'Clear Lake NASA', 'Bay Area waterfront']
  const stepTitles = ['Make a visit', 'Make a Relocation Plan', 'Find a Home', 'Find a Job in Clear Lake', 'Establish yourself', 'Make the most of Clear Lake']

  return <div className="site-shell"><SiteHeader /><main className="page-main inner-page about-page relocation-page home-buying-page" id="main-content">
    <section className="section intro-section about-intro">
      <div className="section-heading">
        <p className="eyebrow">Relocation</p>
        <h1 className="display-section">Move to Clear Lake with confidence.</h1>
        {intro && <p>{intro.text}</p>}
        {challenge && <p>{challenge.text}</p>}
        {contactCue && (
          <p className="intro-testimonials-cta">
            <Link className="text-link" href="/contact/">{contactCue.text.replace(/^Click here to\s*/i, '').replace(/\.$/, '')} <span>↗</span></Link>
          </p>
        )}
      </div>
    </section>

    <HubVideoBand
      src="/videos/hero-mom-baby.mp4"
      poster={images[0]}
      eyebrow={stepsHeading?.text ?? 'Relocation plan'}
      title="Steps that work."
    />

    {images.length > 0 && (
      <ContentSection className="about-photos">
        <div className="about-photo-strip">
          {images.slice(0, 3).map((src, i) => (
            <figure key={src}><img src={src} alt={photoCaptions[i] ?? page.header} /><figcaption>{photoCaptions[i]}</figcaption></figure>
          ))}
        </div>
      </ContentSection>
    )}

    {guidelines && (
      <ContentSection eyebrow="Local guidance" title="Clear Lake NASA communities.">
        <MediaSplit media={images[1] ?? images[0]} mediaAlt="Clear Lake NASA">
          <p>{guidelines.text}</p>
        </MediaSplit>
      </ContentSection>
    )}

    <ContentSection eyebrow="The move" title="A plan for the whole family.">
      <div className="hub-media-stack">
        {steps.map((step, i) => (
          <MediaSplit
            key={step.text.slice(0, 40)}
            media={images[i % images.length]}
            video={i === 2 ? '/videos/hero-showing.mp4' : undefined}
            poster={images[i % images.length]}
            mediaAlt={photoCaptions[i % photoCaptions.length] ?? stepTitles[i]}
            flip={i % 2 === 1}
          >
            <p className="eyebrow">{String(i + 1).padStart(2, '0')}</p>
            <h3>{stepTitles[i] ?? `Step ${i + 1}`}</h3>
            <p>{step.text}</p>
          </MediaSplit>
        ))}
      </div>
    </ContentSection>

    <section className="section intro-section about-closing">
      <div className="section-heading">
        <p className="eyebrow">Next step</p>
        <h2 className="display-section">Ready to relocate?</h2>
        {closing && <p className="about-areas-note">{closing.text}</p>}
        {leftovers.length > 0 && <LiveBlocks blocks={leftovers} />}
        <p className="intro-testimonials-cta">
          <Link className="text-link" href="/home-search/">Home Search <span>↗</span></Link>
          {' · '}
          <Link className="text-link" href="/contact/">Contact a Realtor <span>↗</span></Link>
        </p>
      </div>
    </section>

    <PageCta />
  </main><SiteFooter /></div>
}

function PrivacyDoc({ page }: { page: LivePage }) {
  const raw = page.blocks.filter(b => !(b.tag === 'h2' && (b.text === page.header || b.text === 'Privacy Policy')))
  const policyHeading = raw.find(b => b.tag === 'h3' && /Privacy Policy/i.test(b.text))
  const linksHeading = raw.find(b => b.tag === 'h3' && /Links of Interest/i.test(b.text))
  const closing = raw.find(b => b.tag === 'h4')
  const policyStart = policyHeading ? raw.indexOf(policyHeading) : -1
  const linksStart = linksHeading ? raw.indexOf(linksHeading) : -1
  const policyParas = raw.filter((b, i) =>
    b.tag === 'p' &&
    (linksStart < 0 || i < linksStart) &&
    (policyStart < 0 || i > policyStart)
  )
  const linkParas = raw.filter((b, i) =>
    b.tag === 'p' && linksStart >= 0 && i > linksStart && b !== closing
  )
  const used = new Set([policyHeading, linksHeading, closing, ...policyParas, ...linkParas].filter(Boolean))
  const leftovers = raw.filter(b => !used.has(b))
  const linkTitles = [
    'June Marie Holistic Wellness',
    'recycleBMWs',
    'SeaDoo Parts Depot',
    'Sixth Gen Roofing',
    'Texas Coastal Properties',
    'Westside Powersports',
    'Used SeaDoo Mpem',
  ]

  return <div className="site-shell"><SiteHeader /><main className="page-main inner-page about-page privacy-page home-buying-page" id="main-content">
    <section className="section intro-section about-intro">
      <div className="section-heading">
        <p className="eyebrow">Legal</p>
        <h1 className="display-section">Privacy Policy.</h1>
        {policyHeading && <p className="privacy-kicker">{policyHeading.text}</p>}
        {policyParas.map(p => <p key={p.text.slice(0, 48)}>{p.text}</p>)}
        <p className="intro-testimonials-cta"><Link className="text-link" href="/contact/">Contact us <span>↗</span></Link></p>
      </div>
    </section>

    {linkParas.length > 0 && (
      <ContentSection dark eyebrow={linksHeading?.text ?? 'Links of Interest'} title="Partners & related brands.">
        <div className="buy-market-grid">
          {linkParas.map((p, i) => (
            <article className="buy-market-card" key={p.text.slice(0, 40)}>
              <span className="about-service-num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{linkTitles[i] ?? `Link ${i + 1}`}</h3>
              <p>{p.text}</p>
            </article>
          ))}
        </div>
      </ContentSection>
    )}

    <section className="section intro-section about-closing">
      <div className="section-heading">
        <p className="eyebrow">Service area</p>
        <h2 className="display-section">Clear Lake NASA &amp; beyond.</h2>
        {closing && <p className="about-areas-note">{closing.text}</p>}
        {leftovers.length > 0 && <LiveBlocks blocks={leftovers} />}
        <p className="intro-testimonials-cta"><Link className="text-link" href="/home-search/">Home Search <span>↗</span></Link></p>
      </div>
    </section>

    <PageCta />
  </main><SiteFooter /></div>
}

function ReviewsDoc({ page: _page }: { page: LivePage }) {
  return <div className="site-shell"><SiteHeader /><main className="page-main inner-page about-page reviews-page home-buying-page" id="main-content">
    <section className="section intro-section about-intro">
      <div className="section-heading">
        <p className="eyebrow">Great Reviews &amp; Testimonials</p>
        <h1 className="display-section">What clients say.</h1>
        <p>Family owned since 2004. Overwhelmingly positive reviews for responsiveness, local knowledge, and negotiation — the kind of service that earns loyalty through closing and beyond.</p>
        <p className="intro-testimonials-cta"><Link className="text-link" href="/contact/">Work with our team <span>↗</span></Link></p>
      </div>
    </section>

    <ContentSection eyebrow="Proof" title="Trusted in Clear Lake NASA." className="reviews-proof">
      <div className="reviews-proof-grid">
        <article className="reviews-proof-tile">
          <div className="reviews-proof-media">
            <img src="/assets/client/Team-239.jpg" alt="1st Texas Realtors team" />
          </div>
          <div className="reviews-proof-copy">
            <p className="eyebrow">01</p>
            <h3>74+</h3>
            <p>Client testimonials from buyers, sellers, and renters across the Clear Lake NASA area.</p>
          </div>
        </article>
        <article className="reviews-proof-tile">
          <div className="reviews-proof-media">
            <img src="/assets/client/Simone-Closing-01-2023-e1673708197759.jpg" alt="Closing with 1st Texas Realtors" />
          </div>
          <div className="reviews-proof-copy">
            <p className="eyebrow">02</p>
            <h3>Top 3%</h3>
            <p>Named by Texas Monthly as Top 3% Realtors in the NASA Clear Lake area every year since 2010.</p>
            <img className="reviews-proof-badge" src="/assets/client/Texas-Monthly-5-Star-Real-Estate-Agent.png" alt="Texas Monthly Five-Star Real Estate Agent" />
          </div>
        </article>
      </div>
    </ContentSection>

    <ContentSection eyebrow="Client voice" title="Real reviews. Real closings." className="reviews-page-content">
      <ReviewsPage />
    </ContentSection>

    <section className="section intro-section about-closing">
      <div className="section-heading">
        <p className="eyebrow">Next step</p>
        <h2 className="display-section">Ready for that kind of service?</h2>
        <p>Tell us what you are buying, selling, or renting — we will put a local Realtor on it.</p>
        <p className="intro-testimonials-cta"><Link className="text-link" href="/contact/">Contact a Realtor <span>↗</span></Link></p>
      </div>
    </section>

    <PageCta />
  </main><SiteFooter /></div>
}

function AgentsDoc({ page }: { page: LivePage }) {
  const blocks = page.blocks[0]?.text === page.header ? page.blocks.slice(1) : page.blocks
  const introBlocks = blocks.filter(b => b.tag === 'p').slice(0, 3)
  const photos = [
    { src: '/assets/client/David-Simone-239.jpg', caption: 'David & Simone Karstedt' },
    { src: '/assets/client/Team-239.jpg', caption: 'Our team' },
    { src: '/assets/client/Clear-Lake-239.jpg', caption: 'Clear Lake NASA' },
  ]

  return <div className="site-shell"><SiteHeader /><main className="page-main inner-page about-page agents-page home-buying-page" id="main-content">
    <section className="section intro-section about-intro">
      <div className="section-heading">
        <p className="eyebrow">1st Texas Realtors</p>
        <h1 className="display-section">Meet our agents.</h1>
        <LiveBlocks blocks={introBlocks} />
        <p className="intro-testimonials-cta"><Link className="text-link" href="/contact/">Contact a Realtor <span>↗</span></Link></p>
      </div>
    </section>

    <ContentSection className="about-photos">
      <div className="about-photo-strip">
        {photos.map(photo => (
          <figure key={photo.src}><img src={photo.src} alt={photo.caption} /><figcaption>{photo.caption}</figcaption></figure>
        ))}
      </div>
    </ContentSection>

    <ContentSection dark eyebrow="The bench" title="Local experts. One team.">
      <div className="buy-market-grid agents-promise-grid">
        <article className="buy-market-card">
          <span className="about-service-num">01</span>
          <h3>{agents.length} Realtors</h3>
          <p>When you hire one, you get the experience and knowledge of the whole Clear Lake NASA team.</p>
        </article>
        <article className="buy-market-card">
          <span className="about-service-num">02</span>
          <h3>100+ years</h3>
          <p>Combined local real estate experience across buying, selling, renting, and commercial.</p>
        </article>
      </div>
    </ContentSection>

    <ContentSection eyebrow="The team" title="Realtors ready to help.">
      <div className="agent-grid agent-grid-designed">
        {agents.map((agent, index) => (
          <Link className="agent-card agent-card-designed" key={agent.slug} href={`/agents/${agent.slug}/`}>
            <div className="agent-card-image">
              <img src={agent.image} alt={agent.name} />
              <span>{String(index + 1).padStart(2, '0')}</span>
            </div>
            <div className="agent-info">
              <h2>{agent.name}</h2>
              <p className="agent-role">{agent.role}</p>
              {(agent.phone || agent.email) && (
                <p className="agent-contact">
                  {agent.phone && <span>{agent.phone}</span>}
                  {agent.phone && agent.email && <span aria-hidden="true"> · </span>}
                  {agent.email && <span>{agent.email}</span>}
                </p>
              )}
              <span>View Bio ↗</span>
            </div>
          </Link>
        ))}
      </div>
    </ContentSection>

    <section className="section intro-section about-closing">
      <div className="section-heading">
        <p className="eyebrow">Next step</p>
        <h2 className="display-section">Find the right fit.</h2>
        <p>Not sure who to call? Start with our team — we will match you with the right local Realtor.</p>
        <p className="intro-testimonials-cta"><Link className="text-link" href="/contact/">Contact Us <span>↗</span></Link></p>
      </div>
    </section>

    <PageCta />
  </main><SiteFooter /></div>
}

function ContactDoc({ page }: { page: LivePage }) {
  const blocks = page.blocks[0]?.text === page.header ? page.blocks.slice(1) : page.blocks
  const paragraphs = blocks.filter(b => b.tag === 'p')
  const intro = paragraphs[0]?.text.replace(/Contact the 1st Texas Realtors\s*/i, '') || paragraphs[0]?.text
  const hours = paragraphs.find(p => p.text.startsWith('Hours:'))?.text.replace(/^Hours:\s*/i, '') ?? 'Monday through Saturday from 9am to 6pm.'
  const areasNote = paragraphs.find(p => p.text.includes('Baytown'))?.text
  const photos = [
    { src: '/assets/client/David-Simone-239.jpg', caption: 'David & Simone' },
    { src: '/assets/client/Clear-Lake-239.jpg', caption: 'Clear Lake NASA' },
    { src: '/assets/reference/leaguecityhomesforsale.jpg', caption: 'Local listings' },
  ]

  return <div className="site-shell"><SiteHeader /><main className="page-main inner-page about-page contact-page home-buying-page" id="main-content">
    <section className="contact-open">
      <div className="contact-open-copy">
        <p className="eyebrow">1st Texas Realtors</p>
        <h1 className="display-section">Contact us.</h1>
        {intro && <p>{intro}</p>}
        <p>Hours: {hours}</p>
        <p className="intro-testimonials-cta">
          <a className="text-link" href={`tel:${phone.replace(/\D/g, '')}`}>Call {phone} <span>↗</span></a>
          {' · '}
          <a className="text-link" href={`mailto:${email}`}>{email} <span>↗</span></a>
        </p>
        <div className="contact-open-photo">
          <img src="/assets/client/David-Simone-239.jpg" alt="David and Simone Karstedt" />
        </div>
      </div>
      <div className="contact-form-panel">
        <p className="eyebrow">Send a message</p>
        <h2>Tell us what you need.</h2>
        <ContactForm />
      </div>
    </section>

    <ContentSection className="about-photos">
      <div className="about-photo-strip">
        {photos.map(photo => (
          <figure key={photo.src}><img src={photo.src} alt={photo.caption} /><figcaption>{photo.caption}</figcaption></figure>
        ))}
      </div>
    </ContentSection>

    <ContentSection eyebrow="Reach us" title="Phone, email, and hours.">
      <div className="contact-reach-list">
        <article>
          <p className="eyebrow">01</p>
          <h3>Call</h3>
          <p>For immediate service, call the office. We are happy to talk through buying, selling, renting, or commercial.</p>
          <a className="button button-red" href={`tel:${phone.replace(/\D/g, '')}`}>{phone} <span className="btn-icon">↗</span></a>
        </article>
        <article>
          <p className="eyebrow">02</p>
          <h3>Email</h3>
          <p>Send a note and a local Realtor will follow up — usually the same day during office hours.</p>
          <a className="button button-red" href={`mailto:${email}`}>{email} <span className="btn-icon">↗</span></a>
        </article>
        <article>
          <p className="eyebrow">03</p>
          <h3>Hours</h3>
          <p>{hours}</p>
        </article>
      </div>
    </ContentSection>

    <ContentSection eyebrow="Our Realtors" title="To contact one of our Realtors, please click Meet Our Agents.">
      <div className="contact-agent-grid">
        {agents.map(agent => (
          <Link className="contact-agent-card" key={agent.slug} href={`/agents/${agent.slug}/`}>
            <img src={agent.image} alt={agent.name} />
            <div>
              <h3>{agent.name}</h3>
              <p>{agent.role}</p>
              {agent.phone && <span>{agent.phone}</span>}
              {agent.email && <span>{agent.email}</span>}
              <em>View Bio ↗</em>
            </div>
          </Link>
        ))}
      </div>
    </ContentSection>

    <section className="section intro-section about-closing">
      <div className="section-heading">
        <p className="eyebrow">Local coverage</p>
        <h2 className="display-section">Clear Lake NASA and beyond.</h2>
        {areasNote && <p className="about-areas-note">{areasNote}</p>}
        <p className="intro-testimonials-cta"><Link className="text-link" href="/agents/">Meet Our Agents <span>↗</span></Link></p>
      </div>
    </section>
  </main><SiteFooter /></div>
}

function HomeSearchDoc() {
  const photos = [
    { src: '/assets/reference/clearlaketxhomesforsale.jpg', caption: 'Clear Lake homes' },
    { src: '/assets/reference/leaguecityhomesforsale.jpg', caption: 'League City' },
    { src: '/assets/reference/NASAhomesforsale.jpg', caption: 'NASA area' },
  ]

  return <div className="site-shell"><SiteHeader /><main className="page-main inner-page about-page home-search-page hub-search" id="main-content">
    <section className="search-hero">
      <div className="search-hero-media" aria-hidden="true">
        <img src={photos[0].src} alt="" />
        <div className="search-hero-overlay" />
      </div>
      <div className="search-hero-copy">
        <p className="eyebrow">Available Listings</p>
        <h1 className="display-section">See homes available today.</h1>
        <p>Search current MLS listings for homes to buy or rent across Clear Lake NASA and the surrounding communities. Live search keeps prices, availability, photos, and status current.</p>
        <div className="search-hero-actions">
          <a className="button button-red" href={IDX_SEARCH_URL} target="_blank" rel="noopener noreferrer">
            Open live search <span className="btn-icon">↗</span>
          </a>
          <Link className="button button-glass" href="/contact/">
            Contact a Realtor <span className="btn-icon">↗</span>
          </Link>
        </div>
      </div>
    </section>

    <ContentSection dark className="search-idx-band" eyebrow="Live IDX" title="Search, save, and stay ahead.">
      <HomeSearch />
    </ContentSection>

    <ContentSection className="about-photos">
      <div className="about-photo-strip">
        {photos.map(photo => (
          <figure key={photo.src}><img src={photo.src} alt={photo.caption} /><figcaption>{photo.caption}</figcaption></figure>
        ))}
      </div>
    </ContentSection>

    <ContentSection className="search-area-guide" eyebrow="Browse by area" title="Homes for sale near you.">
      <div className="buy-area-chips">
        {serviceAreas.slice(0, 8).map(name => (
          <Link key={name} href={salePath(name)}>{name}<span>↗</span></Link>
        ))}
      </div>
      <details className="buy-area-more">
        <summary>More areas <span aria-hidden="true">↗</span></summary>
        <div className="buy-area-chips">
          {serviceAreas.slice(8).map(name => (
            <Link key={name} href={salePath(name)}>{name}<span>↗</span></Link>
          ))}
        </div>
      </details>
      <div className="search-guide-copy">
        <p className="eyebrow">Need a guide?</p>
        <h3 className="display-section">Listings are clearer with a local Realtor.</h3>
        <p>We help you read the market, schedule showings, and move fast when the right home appears.</p>
        <p className="intro-testimonials-cta"><Link className="text-link" href="/contact/">Contact a Realtor <span>↗</span></Link></p>
      </div>
    </ContentSection>

    <PageCta />
  </main><SiteFooter /></div>
}

function AboutDoc({ page }: { page: LivePage }) {
  const blocks = page.blocks[0]?.text === page.header ? page.blocks.slice(1) : page.blocks
  const storyBlocks = blocks.filter(b => b.tag === 'p').slice(0, 2)
  const serviceItems = blocks.filter(b => b.tag === 'li').map(b => b.text)
  const closingBlocks = blocks.filter(b => b.tag === 'p').slice(2)
  const areasNote = blocks.find(b => b.tag === 'h4')?.text

  return <div className="site-shell"><SiteHeader /><main className="page-main inner-page about-page hub-about" id="main-content">
    <section className="section intro-section about-intro">
      <div className="section-heading">
        <p className="eyebrow">1st Texas Realtors</p>
        <h1 className="display-section">Our story.</h1>
        <LiveBlocks blocks={storyBlocks} />
      </div>
    </section>

    <ContentSection className="about-photos">
      <div className="about-photo-strip">
        <figure><img src="/assets/client/Clear-Lake-239.jpg" alt="Clear Lake Texas" /><figcaption>Clear Lake NASA</figcaption></figure>
        <figure><img src="/assets/client/Karstedt-e1780697422281.jpg" alt="The Karstedt family" /><figcaption>Family owned since 2004</figcaption></figure>
        <figure><img src="/assets/client/Team-239.jpg" alt="1st Texas Realtors team" /><figcaption>Our team</figcaption></figure>
      </div>
    </ContentSection>

    <AboutServices data={serviceItems.map((item, i) => {
      const heading = item.replace(/\.$/, '')
      const match = aboutServicesData.find(entry => entry.heading.toLowerCase() === heading.toLowerCase())
        ?? aboutServicesData[i]
      return { heading, descp: match?.descp ?? '', image: match?.image ?? '/assets/client/Team-239.jpg' }
    })} />

    <section className="section intro-section about-closing">
      <div className="section-heading">
        <p className="eyebrow">Buying · Selling · Renting</p>
        <h2 className="display-section">Local experience. Real-time listings.</h2>
        <LiveBlocks blocks={closingBlocks} />
        <p className="intro-testimonials-cta"><Link className="text-link" href="/contact/">Contact a Realtor <span>↗</span></Link></p>
        {areasNote && <p className="about-areas-note">{areasNote}</p>}
      </div>
    </section>

    <PageCta />
  </main><SiteFooter /></div>
}
