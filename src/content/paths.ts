/** Live 1sttexasrealtors.com path catalog. Tests import this file — do not reimplement. */

export const saleCanonical: Record<string, string> = {
  'Baytown': 'realtors-in-baytown',
  'Clear Lake City': 'clear-lake-tx-homes-for-sale',
  'Clear Lake Shores': 'realtors-in-clear-lake-shores-2',
  'Deer Park': 'realtors-in-deer-park-2',
  'Dickinson': 'realtors-in-dickinson',
  'El Lago': 'realtors-in-el-lago',
  'Friendswood': 'realtors-in-friendswood-2',
  'Galveston': 'realtors-in-galveston',
  'Kemah': 'realtors-in-kemah',
  'La Porte': 'realtors-in-la-porte-2',
  'League City': 'realtors-in-league-city',
  'Nassau Bay': 'realtors-in-nassau-bay',
  'Pasadena': 'realtors-in-pasadena',
  'Pearland': 'realtors-in-pearland-2',
  'San Leon': 'realtors-in-san-leon-2',
  'Seabrook': 'realtors-in-seabrook',
  'Shoreacres': 'realtors-in-shoreacres-2',
  'Taylor Lake Village': 'realtors-in-taylor-lake-village',
  'Texas City': 'realtors-in-texas-city-2',
  'Tiki Island': 'realtors-in-tiki-island',
  'Webster': 'realtors-in-webster-2',
}

export const rentCanonical: Record<string, string> = {
  'Baytown': 'baytown-tx-homes-for-rent',
  'Clear Lake City': 'clear-lake-city-tx-homes-for-rent',
  'Clear Lake Shores': 'clear-lake-shores-tx-homes-for-rent',
  'Deer Park': 'deer-park-tx-homes-for-rent',
  'Dickinson': 'dickinson-tx-homes-for-rent',
  'El Lago': 'el-lago-tx-homes-for-rent',
  'Friendswood': 'friendswood-tx-homes-for-rent',
  'Galveston': 'galveston-homes-for-rent',
  'Kemah': 'kemah-tx-homes-for-rent',
  'La Porte': 'la-porte-tx-homes-for-rent',
  'League City': 'league-city-homes-for-rent',
  'Nassau Bay': 'nassau-bay-tx-homes-for-rent',
  'Pasadena': 'pasadena-tx-homes-for-rent',
  'Pearland': 'pearland-tx-homes-for-rent',
  'San Leon': 'san-leon-tx-homes-for-rent',
  'Seabrook': 'seabrook-tx-homes-for-rent',
  'Shoreacres': 'shoreacres-tx-homes-for-rent',
  'Taylor Lake Village': 'taylor-lake-village-tx-homes-for-rent',
  'Texas City': 'texas-city-tx-homes-for-rent',
  'Tiki Island': 'tiki-island-tx-homes-for-rent',
  'Webster': 'webster-tx-homes-for-rent',
}

export const agentCanonicalSlugs = [
  'agents/mark-bocado',
  'agents/matt-bradley',
  'agents/nancy-van-estes',
  'agents/jay-herder',
  'agents/david-karstedt',
  'agents/simone-karstedt',
  'agents/william-machupa-jr',
  'agents/rhan-pruitt',
  'agents/daniel-rickert',
]

/** Client header/nav pages that must 200 locally at the live public path. */
export const CLIENT_NAV_PATHS = [
  '/about/',
  '/home-buyers/',
  '/seller-services/',
  '/homes-for-rent/',
  '/commercial-property-realtors/',
  '/contact/',
  '/realtor-reviews/',
  '/agents/',
  '/privacy-policy/',
] as const

/** Live service + agent profile paths (not all are top-nav). */
export const LIVE_SERVICE_PATHS = [
  '/new-home-construction/',
  '/home-staging/',
  '/relocation-service/',
] as const

/** Live page-sitemap URLs minus WordPress-only /draft-literature/. */
export const LIVE_SITEMAP_PATHS = [
  '/',
  '/about/',
  '/agents/',
  '/new-home-construction/',
  '/home-staging/',
  '/relocation-service/',
  '/commercial-property-realtors/',
  '/seller-services/',
  '/contact/',
  '/home-buyers/',
  '/privacy-policy/',
  '/realtor-reviews/',
  '/homes-for-rent/',
  ...Object.values(saleCanonical).map(slug => `/${slug}/`),
  ...Object.values(rentCanonical).map(slug => `/${slug}/`),
]

export const extraLocalSlugs = ['home-search']

const coreSlugs = [
  'about',
  'home-buyers',
  'seller-services',
  'homes-for-rent',
  'commercial-property-realtors',
  'contact',
  'realtor-reviews',
  'agents',
  'privacy-policy',
  'new-home-construction',
  'home-staging',
  'relocation-service',
  ...extraLocalSlugs,
  ...agentCanonicalSlugs,
  ...Object.values(saleCanonical),
  ...Object.values(rentCanonical),
]

export const canonicalSlugs = [...new Set(coreSlugs)]

export const canonicalPublicPaths = ['/', ...canonicalSlugs.map(slug => `/${slug}/`)]

/**
 * Live duplicate/legacy aliases → live canonical. statusCode 301 (not Next's 308).
 * Sources include both slash variants so trailingSlash does not 200 a twin page.
 */
export const redirectMap: Record<string, string> = {
  '/realtors-in-clear-lake-shores': '/realtors-in-clear-lake-shores-2/',
  '/realtors-in-clear-lake-shores/': '/realtors-in-clear-lake-shores-2/',
  '/realtors-in-deer-park': '/realtors-in-deer-park-2/',
  '/realtors-in-deer-park/': '/realtors-in-deer-park-2/',
  '/realtors-in-friendswood': '/realtors-in-friendswood-2/',
  '/realtors-in-friendswood/': '/realtors-in-friendswood-2/',
  '/realtors-in-la-porte': '/realtors-in-la-porte-2/',
  '/realtors-in-la-porte/': '/realtors-in-la-porte-2/',
  '/realtors-in-pearland': '/realtors-in-pearland-2/',
  '/realtors-in-pearland/': '/realtors-in-pearland-2/',
  '/realtors-in-san-leon': '/realtors-in-san-leon-2/',
  '/realtors-in-san-leon/': '/realtors-in-san-leon-2/',
  '/realtors-in-shoreacres': '/realtors-in-shoreacres-2/',
  '/realtors-in-shoreacres/': '/realtors-in-shoreacres-2/',
  '/realtors-in-texas-city': '/realtors-in-texas-city-2/',
  '/realtors-in-texas-city/': '/realtors-in-texas-city-2/',
  '/realtors-in-webster': '/realtors-in-webster-2/',
  '/realtors-in-webster/': '/realtors-in-webster-2/',
  '/galveston-tx-homes-for-rent': '/galveston-homes-for-rent/',
  '/galveston-tx-homes-for-rent/': '/galveston-homes-for-rent/',
  '/league-city-tx-homes-for-rent': '/league-city-homes-for-rent/',
  '/league-city-tx-homes-for-rent/': '/league-city-homes-for-rent/',
  '/realtors-in-clear-lake-city': '/clear-lake-tx-homes-for-sale/',
  '/realtors-in-clear-lake-city/': '/clear-lake-tx-homes-for-sale/',
  '/agents/nancy-estes': '/agents/nancy-van-estes/',
  '/agents/nancy-estes/': '/agents/nancy-van-estes/',
  '/faqs': '/',
  '/faqs/': '/',
}

export const permanentRedirects = Object.entries(redirectMap).map(([source, destination]) => ({
  source,
  destination,
  statusCode: 301 as const,
}))

export function salePath(area: string) {
  const slug = saleCanonical[area]
  if (!slug) throw new Error(`No live sale path for ${area}`)
  return `/${slug}/`
}

export function rentPath(area: string) {
  const slug = rentCanonical[area]
  if (!slug) throw new Error(`No live rent path for ${area}`)
  return `/${slug}/`
}

export function areaFromSaleSlug(slug: string) {
  return Object.entries(saleCanonical).find(([, value]) => value === slug)?.[0]
}

export function areaFromRentSlug(slug: string) {
  return Object.entries(rentCanonical).find(([, value]) => value === slug)?.[0]
}

export const pageMeta: Record<string, { title: string; description: string }> = {
  about: {
    title: 'About 1st Texas Realtors in Clear Lake',
    description: 'Full-service brokerage operated by David & Simone Karstedt, with expert Realtors totaling over 100-years combined experience.',
  },
  'home-buyers': {
    title: 'Home Buying | 1st Texas Realtors',
    description: 'The first step to buying a home is getting pre-approved. Expert Realtors in Clear Lake NASA for homes, town homes, and condominiums.',
  },
  'seller-services': {
    title: 'Home Selling | 1st Texas Realtors',
    description: 'Free Market Analysis, home staging, MLS marketing, and comprehensive Realtor services when selling your home in Clear Lake.',
  },
  'homes-for-rent': {
    title: 'Homes for Rent | 1st Texas Realtors',
    description: 'View homes for rent in Clear Lake NASA. Tenant interviews, background checks, leases, deposits, and property management.',
  },
  'commercial-property-realtors': {
    title: 'Commercial Property Realtors | 1st Texas Realtors',
    description: 'Commercial real estate, land, and multi-family for sale and lease in the Clear Lake NASA area.',
  },
  contact: {
    title: 'Contact | 1st Texas Realtors',
    description: 'Contact the 1st Texas Realtors for expert and local real estate service. Monday through Saturday from 9am to 6pm. (281) 241-3121.',
  },
  'realtor-reviews': {
    title: 'Testimonials | 1st Texas Realtors',
    description: 'Reviews and testimonials for 1st Texas Realtors in Clear Lake, League City, Friendswood, Seabrook, and surrounding communities.',
  },
  agents: {
    title: 'Meet Our Agents | 1st Texas Realtors',
    description: 'David Karstedt, Broker/Owner, and the 1st Texas Realtors team — local experience, dedicated customer service, and real-time property listings.',
  },
  'privacy-policy': {
    title: 'Privacy Policy | 1st Texas Realtors',
    description: '1st Texas Realtors Privacy Policy. Information is collected only as required for membership registration used for custom Home Searches.',
  },
  'new-home-construction': {
    title: 'New Home Construction | 1st Texas Realtors',
    description: 'New home construction in the Clear Lake area with Trendmaker Homes, Taylor Morrison, DR Horton, and Gehan Homes.',
  },
  'home-staging': {
    title: 'Home Staging | 1st Texas Realtors',
    description: 'Home staging guidelines to add significant value to the sale of your home at little to no cost.',
  },
  'relocation-service': {
    title: 'Relocation Service | 1st Texas Realtors',
    description: 'Expert Clear Lake relocation service. Our Realtors total over 100-years combined real estate experience.',
  },
  'home-search': {
    title: 'Home Search | 1st Texas Realtors',
    description: 'Use our real-time MLS Home Search to browse homes for sale and rent in Clear Lake NASA.',
  },
}
