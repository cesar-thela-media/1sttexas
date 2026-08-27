import Link from 'next/link'
import { IDX_SEARCH_URL, IDX_SIGNUP_URL } from '@/content/idx'

const externalLinkProps = { target: '_blank', rel: 'noreferrer' } as const

export function HomeSearch() {
  return (
    <div className="home-search-wrap">
      <div className="search-sell-card">
        <p className="eyebrow">Live IDX search</p>
        <h2>See homes available today</h2>
        <p>
          Search current MLS listings for homes to buy or rent across Clear Lake NASA
          and the surrounding communities. The live search keeps prices, availability,
          photos, and status current.
        </p>
        <div className="hero-actions">
          <a className="button button-red" href={IDX_SEARCH_URL} {...externalLinkProps}>
            Search homes <span>↗</span>
          </a>
          <a className="button button-dark" href={IDX_SIGNUP_URL} {...externalLinkProps}>
            Register for alerts <span>↗</span>
          </a>
        </div>
      </div>
      <div className="search-sell-card">
        <h2>Looking to sell?</h2>
        <p>
          We can prepare a no-obligation Market Analysis using comparable sales,
          current inventory, and the features that make your home valuable.
        </p>
        <Link className="button button-dark" href="/contact/">
          Get a free Market Analysis <span>↗</span>
        </Link>
      </div>
    </div>
  )
}
