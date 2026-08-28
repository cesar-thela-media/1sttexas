import Link from 'next/link'
import type { ReactNode } from 'react'
import type { LiveBlock } from '@/content/live-pages'
import { LiveBlocks } from '@/components/LiveBlocks'
import { LoopVideo } from '@/components/HubMedia'

export function InnerHero({
  eyebrow = '1st Texas Realtors',
  title,
  lead,
  media,
  mediaAlt,
  badge,
  variant = 'light',
}: {
  eyebrow?: string
  title: string
  lead?: ReactNode
  media?: string
  mediaAlt?: string
  badge?: string
  variant?: 'light' | 'navy'
}) {
  const hasMedia = Boolean(media)
  return (
    <section className={`inner-hero inner-hero-${variant}${hasMedia ? ' has-media' : ''}`}>
      <div className="inner-hero-copy">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="display-section">{title}</h1>
        {lead}
      </div>
      {media && (
        <div className="inner-hero-media">
          <img src={media} alt={mediaAlt || title} />
          {badge && <span>{badge}</span>}
        </div>
      )}
    </section>
  )
}

export function ContentSection({
  children,
  dark = false,
  className = '',
  eyebrow,
  title,
}: {
  children: ReactNode
  dark?: boolean
  className?: string
  eyebrow?: string
  title?: string
}) {
  return (
    <section className={`section${dark ? ' section-dark' : ''}${className ? ` ${className}` : ''}`}>
      {(eyebrow || title) && (
        <div className="section-heading">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          {title && <h2 className="display-section">{title}</h2>}
        </div>
      )}
      {children}
    </section>
  )
}

export function ProsePanel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`prose-panel${className ? ` ${className}` : ''}`}>{children}</div>
}

export function MediaSplit({
  media,
  video,
  poster,
  mediaAlt,
  children,
  flip = false,
  className = '',
}: {
  media?: string
  video?: string
  poster?: string
  mediaAlt?: string
  children: ReactNode
  flip?: boolean
  className?: string
}) {
  if (!media && !video) return <ProsePanel className={className}>{children}</ProsePanel>
  return (
    <div className={`media-split${flip ? ' is-flipped' : ''}${className ? ` ${className}` : ''}`}>
      <div className="media-split-media">
        {video
          ? <LoopVideo src={video} poster={poster || media} className="media-split-video" />
          : <img src={media} alt={mediaAlt || ''} />}
      </div>
      <div className="media-split-body"><ProsePanel>{children}</ProsePanel></div>
    </div>
  )
}

export function PageCta() {
  return (
    <section className="section">
      <div className="cta-showcase">
        <p className="eyebrow">Ready when you are</p>
        <h2>For immediate service, please<br />call (281) 241-3121.</h2>
        <p>Local Realtors and real-time listings across Clear Lake NASA and surrounding communities.</p>
        <Link className="button button-red" href="/contact/">Contact Us <span className="btn-icon">↗</span></Link>
      </div>
    </section>
  )
}

/** Split live blocks into sections keyed by h1/h2 headings. */
export function groupBlocksByHeading(blocks: LiveBlock[]): { title?: string; blocks: LiveBlock[] }[] {
  const sections: { title?: string; blocks: LiveBlock[] }[] = []
  let current: { title?: string; blocks: LiveBlock[] } = { blocks: [] }

  for (const block of blocks) {
    if (block.tag === 'h1' || block.tag === 'h2') {
      if (current.title || current.blocks.length) sections.push(current)
      current = { title: block.text, blocks: [] }
      continue
    }
    current.blocks.push(block)
  }
  if (current.title || current.blocks.length) sections.push(current)
  return sections
}

export function SectionedLiveCopy({
  blocks,
  images = [],
  imageAlt = '',
}: {
  blocks: LiveBlock[]
  images?: string[]
  imageAlt?: string
}) {
  const sections = groupBlocksByHeading(blocks)
  if (!sections.length) return null

  // No h2s — one prose panel (optionally with first image).
  if (sections.length === 1 && !sections[0].title) {
    return (
      <ContentSection className="inner-prose-section">
        <MediaSplit media={images[0]} mediaAlt={imageAlt}>
          <LiveBlocks blocks={sections[0].blocks} />
        </MediaSplit>
      </ContentSection>
    )
  }

  return (
    <>
      {sections.map((section, i) => {
        const media = images[i] ?? (i === 0 ? images[0] : undefined)
        const dark = i % 2 === 1
        return (
          <ContentSection key={`${section.title ?? 'sec'}-${i}`} dark={dark} className="inner-prose-section">
            {section.title && (
              <div className="section-heading">
                <p className="eyebrow">{String(i + 1).padStart(2, '0')}</p>
                <h2 className="display-section">{section.title}</h2>
              </div>
            )}
            <MediaSplit media={media} mediaAlt={imageAlt || section.title} flip={i % 2 === 1}>
              <LiveBlocks blocks={section.blocks} />
            </MediaSplit>
          </ContentSection>
        )
      })}
    </>
  )
}
