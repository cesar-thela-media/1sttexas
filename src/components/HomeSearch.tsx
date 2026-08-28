import Link from 'next/link'
import { IDX_LOGIN_URL, IDX_SEARCH_URL, IDX_SIGNUP_URL } from '@/content/idx'

const externalLinkProps = { target: '_blank', rel: 'noopener noreferrer' } as const

const features = [
  {
    title: 'Search homes available today',
    body: 'Browse live MLS listings for homes to buy or rent across Clear Lake NASA and surrounding communities. Prices, photos, and status stay current.',
    href: IDX_SEARCH_URL,
    cta: 'Search homes',
    external: true,
  },
  {
    title: 'Register for email alerts',
    body: 'Save custom searches and get automatic alerts when new listings match what you want — before they get crowded.',
    href: IDX_SIGNUP_URL,
    cta: 'Register for alerts',
    external: true,
  },
  {
    title: 'Already a member?',
    body: 'Log in to manage saved searches, favorites, and listing alerts from your IDX account.',
    href: IDX_LOGIN_URL,
    cta: 'Member login',
    external: true,
  },
  {
    title: 'Looking to sell?',
    body: 'Get a no-obligation Market Analysis using comparable sales, current inventory, and the features that make your home valuable.',
    href: '/contact/',
    cta: 'Free Market Analysis',
    external: false,
  },
] as const

export function HomeSearch() {
  return (
    <div className="buy-market-grid listings-feature-grid">
      {features.map((card, i) => (
        <article className="buy-market-card rent-feature-card" key={card.title}>
          <span className="about-service-num">{String(i + 1).padStart(2, '0')}</span>
          <h3>{card.title}</h3>
          <p>{card.body}</p>
          {card.external ? (
            <a className="button button-navy svc-stack-cta" href={card.href} {...externalLinkProps}>
              {card.cta} <span className="btn-icon">↗</span>
            </a>
          ) : (
            <Link className="button button-navy svc-stack-cta" href={card.href}>
              {card.cta} <span className="btn-icon">↗</span>
            </Link>
          )}
        </article>
      ))}
    </div>
  )
}
