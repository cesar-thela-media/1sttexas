import { readFileSync, writeFileSync, readdirSync } from 'node:fs'

const live = JSON.parse(readFileSync('src/content/live-copy.json', 'utf8'))
const files = readdirSync('public/assets/areas')
const existing = readFileSync('src/content/area-listings.ts', 'utf8')

const rentPaths = {
  'baytown': '/baytown-tx-homes-for-rent/',
  'clear-lake-city': '/clear-lake-city-tx-homes-for-rent/',
  'clear-lake-shores': '/clear-lake-shores-tx-homes-for-rent/',
  'deer-park': '/deer-park-tx-homes-for-rent/',
  'dickinson': '/dickinson-tx-homes-for-rent/',
  'el-lago': '/el-lago-tx-homes-for-rent/',
  'friendswood': '/friendswood-tx-homes-for-rent/',
  'galveston': '/galveston-homes-for-rent/',
  'kemah': '/kemah-tx-homes-for-rent/',
  'la-porte': '/la-porte-tx-homes-for-rent/',
  'league-city': '/league-city-homes-for-rent/',
  'nassau-bay': '/nassau-bay-tx-homes-for-rent/',
  'pasadena': '/pasadena-tx-homes-for-rent/',
  'pearland': '/pearland-tx-homes-for-rent/',
  'san-leon': '/san-leon-tx-homes-for-rent/',
  'seabrook': '/seabrook-tx-homes-for-rent/',
  'shoreacres': '/shoreacres-tx-homes-for-rent/',
  'taylor-lake-village': '/taylor-lake-village-tx-homes-for-rent/',
  'texas-city': '/texas-city-tx-homes-for-rent/',
  'tiki-island': '/tiki-island-tx-homes-for-rent/',
  'webster': '/webster-tx-homes-for-rent/',
}

function tsString(value) {
  return `'${String(value).replaceAll('\\', '\\\\').replaceAll("'", "\\'").replaceAll('\n', ' ')}'`
}

function imagesFor(slug) {
  return files.filter(name => name.startsWith(`${slug}-`)).map(name => `/assets/areas/${name}`)
}

const listings = Object.entries(rentPaths).map(([slug, path]) => {
  const page = live.find(item => item.path === path)
  if (!page) throw new Error(`missing live ${path}`)
  const paras = page.blocks.filter(b => b.tag === 'p').map(b => b.text)
  const header = page.header || page.blocks.find(b => b.tag === 'h2')?.text || `${slug} Homes for Rent`
  return {
    slug,
    title: header,
    kind: 'rent',
    intro: paras[0] || header,
    paragraphs: paras.slice(1),
    images: imagesFor(slug),
  }
})

const body = listings.map(item => `  {
    slug: ${tsString(item.slug)},
    title: ${tsString(item.title)},
    kind: 'rent',
    intro: ${tsString(item.intro)},
    paragraphs: [${item.paragraphs.map(tsString).join(', ')}],
    images: [${item.images.map(tsString).join(', ')}],
  }`).join(',\n')

const file = `// Scraped from 1sttexasrealtors.com — homes for rent (all areas). 100% client content.
import { saleListings } from './sale-listings'

export type AreaListing = {
  slug: string
  title: string
  kind: 'rent' | 'sale'
  intro: string
  paragraphs: string[]
  images: string[]
}

const rentListings: AreaListing[] = [
${body},
]

export const areaListings: AreaListing[] = [...rentListings, ...saleListings]
`

writeFileSync('src/content/area-listings.ts', file)
console.log('wrote', listings.length, 'rent listings')
const hole = listings.filter(l => l.paragraphs.join(' ').includes('please see our .'))
console.log('stripped-link holes', hole.length)
const testi = listings.filter(l => /Testimonials/.test(l.intro + l.paragraphs.join(' ')))
console.log('mentions Testimonials', testi.length)
