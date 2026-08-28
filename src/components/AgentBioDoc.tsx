import Link from 'next/link'
import { LiveBlocks } from '@/components/LiveBlocks'
import { ContentSection, PageCta } from '@/components/InnerPage'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import type { LiveBlock, LivePage } from '@/content/live-pages'
import type { Agent } from '@/content/site'
import { agents } from '@/content/site'

/** Pass 4 — branded agent bio. Keeps every live block. */
export function AgentBioDoc({
  page,
  agent,
}: {
  page: LivePage
  agent: Agent
}) {
  const raw = page.blocks.filter(b => !(b.tag === 'h2' && (b.text === page.header || b.text === agent.name || b.text === page.title)))
  const used = new Set<LiveBlock>()
  const use = (b: LiveBlock | undefined) => {
    if (!b) return undefined
    used.add(b)
    return b
  }

  const roleBlock = use(raw.find(b => b.tag === 'h4' || (b.tag === 'p' && /^(Broker|Realtor)/i.test(b.text) && b.text.length < 60)))
  const iabs = use(raw.find(b => /Information About Brokerage Services|IABS/i.test(b.text)))
  const paragraphs = raw.filter(b => b.tag === 'p')
  const quotes = raw.filter(b => b.tag === 'blockquote')

  // Bio = paragraphs that aren't IABS, quote dupes, or author lines
  const bioParas: LiveBlock[] = []
  for (const p of paragraphs) {
    if (used.has(p)) continue
    if (/^[—–-]/.test(p.text.trim())) continue
    if (quotes.some(q => q.text.slice(0, 48) === p.text.slice(0, 48))) {
      used.add(p) // mark duplicate quote prose as used
      continue
    }
    if (/Information About Brokerage Services|IABS/i.test(p.text)) continue
    bioParas.push(p)
    used.add(p)
  }

  const testimonials = quotes.map(q => {
    use(q)
    const author = paragraphs.find(p =>
      !used.has(p) && /^[—–-]/.test(p.text.trim()) &&
      // author usually follows this quote in source order
      raw.indexOf(p) > raw.indexOf(q)
    )
    if (author) use(author)
    // fallback: nearest following author line
    const idx = raw.indexOf(q)
    const nearby = raw.slice(idx + 1, idx + 4).find(b => b.tag === 'p' && /^[—–-]/.test(b.text.trim()))
    if (nearby && !used.has(nearby)) use(nearby)
    return {
      quote: q.text,
      author: (author || nearby)?.text.replace(/^—\s*|^–\s*/, '') ?? '',
    }
  })

  const leftovers = raw.filter(b => !used.has(b))
  const role = roleBlock?.text || agent.role
  const others = agents.filter(a => a.slug !== agent.slug)

  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="page-main inner-page agent-bio-page" id="main-content">
        <section className="agent-bio-hero">
          <div className="agent-bio-portrait">
            <img src={agent.image} alt={agent.name} />
          </div>
          <div className="agent-bio-intro">
            <p className="eyebrow">1st Texas Realtors</p>
            <h1 className="display-section">{agent.name}</h1>
            <p className="agent-bio-role">{role}</p>
            {(agent.phone || agent.email) && (
              <div className="agent-bio-contacts">
                {agent.phone && (
                  <a className="button button-red" href={`tel:+1${agent.phone.replace(/\D/g, '')}`}>
                    Call {agent.phone} <span className="btn-icon">↗</span>
                  </a>
                )}
                {agent.email && (
                  <a className="button button-navy" href={`mailto:${agent.email}`}>
                    Email <span className="btn-icon">↗</span>
                  </a>
                )}
                <Link className="button button-outline agent-bio-outline" href="/contact/">
                  Contact office <span className="btn-icon">↗</span>
                </Link>
              </div>
            )}
            {iabs && <p className="agent-bio-iabs">{iabs.text}</p>}
          </div>
        </section>

        {bioParas.length > 0 && (
          <section className="section intro-section about-intro agent-bio-story">
            <div className="section-heading">
              <p className="eyebrow">About {agent.name.split(' ')[0]}</p>
              <h2 className="display-section">Local expertise. Personal service.</h2>
              {bioParas.map(p => (
                <p key={p.text.slice(0, 48)}>{p.text}</p>
              ))}
            </div>
          </section>
        )}

        {testimonials.length > 0 && (
          <ContentSection dark eyebrow="Client voice" title="What clients say.">
            <div className="agent-bio-quotes">
              {testimonials.map(t => (
                <blockquote className="agent-bio-quote" key={t.quote.slice(0, 40)}>
                  <p>{t.quote.replace(/^[“”"'`\s]+/, '').replace(/[”"'`\s]+$/, '')}</p>
                  {t.author && <cite>{t.author}</cite>}
                </blockquote>
              ))}
            </div>
          </ContentSection>
        )}

        <ContentSection eyebrow="Our team" title="Meet more agents.">
          <div className="buy-area-chips agent-bio-team">
            {others.map(a => (
              <Link key={a.slug} href={`/agents/${a.slug}/`}>{a.name}<span>↗</span></Link>
            ))}
          </div>
          <p className="intro-testimonials-cta" style={{ textAlign: 'center', marginTop: 20 }}>
            <Link className="text-link" href="/agents/">All agents <span>↗</span></Link>
          </p>
        </ContentSection>

        {leftovers.length > 0 && (
          <ContentSection className="area-leftover-copy" eyebrow="More" title={agent.name}>
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
