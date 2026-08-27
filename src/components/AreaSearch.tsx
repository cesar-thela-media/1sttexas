import Link from 'next/link'
import { IDX_SEARCH_URL } from '@/content/idx'

const externalLinkProps = { target: '_blank', rel: 'noreferrer' } as const

export function AreaSearch({ area, rent }: { area: string; rent: boolean }) {
  const listingType = rent ? 'rental homes' : 'homes for sale'

  return (
    <div className="area-search">
      <div className="search-sell-card">
        <p className="eyebrow">Live IDX search</p>
        <h2>Current {listingType} in {area}</h2>
        <p>
          Browse the latest MLS inventory, photos, pricing, and availability
          through the live 1st Texas Realtors search.
        </p>
        <div className="hero-actions">
          <a className="button button-red" href={IDX_SEARCH_URL} {...externalLinkProps}>
            Open live listings <span>↗</span>
          </a>
          <Link className="button button-dark" href="/contact/">
            Contact a Realtor <span>↗</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
