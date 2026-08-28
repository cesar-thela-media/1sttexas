import { readFileSync, readdirSync, writeFileSync } from 'node:fs'

const scraped = JSON.parse(readFileSync('sale-pages.json', 'utf8'))
const files = readdirSync('public/assets/areas')

function slugFor(area) {
  return area.toLowerCase().replaceAll(' ', '-')
}

function imagesFor(area) {
  const slug = slugFor(area)
  const prefixes = area === 'Clear Lake City' ? ['clear-lake-sale-', 'clear-lake-city-'] : [`${slug}-`]
  const found = files.filter(name => prefixes.some(p => name.startsWith(p))).map(name => `/assets/areas/${name}`)
  return found
}

function listingFrom(page) {
  const paras = []
  let intro = ''
  let heading = ''
  let listBuf = []

  const flushList = () => {
    if (!listBuf.length) return
    const body = listBuf.join(' ')
    paras.push(heading ? `${heading} ${body}` : body)
    listBuf = []
    heading = ''
  }

  for (const block of page.blocks) {
    if (block.tag === 'h2' || block.tag === 'h3') {
      flushList()
      heading = block.text
      continue
    }
    if (block.tag === 'li') {
      listBuf.push(block.text.replace(/^[•\s]+/, ''))
      continue
    }
    if (block.tag === 'p') {
      flushList()
      if (!intro) {
        intro = block.text
        heading = ''
        continue
      }
      paras.push(heading ? `${heading} ${block.text}` : block.text)
      heading = ''
    }
  }
  flushList()

  return {
    slug: slugFor(page.area),
    title: page.title,
    kind: 'sale',
    intro,
    paragraphs: paras,
    images: imagesFor(page.area),
  }
}

function tsString(value) {
  return `'${String(value).replaceAll('\\', '\\\\').replaceAll("'", "\\'").replaceAll('\n', ' ')}'`
}

const listings = scraped.map(listingFrom)
const body = listings.map(item => {
  const paras = item.paragraphs.map(p => tsString(p)).join(', ')
  const images = item.images.map(src => tsString(src)).join(', ')
  return `  {
    slug: ${tsString(item.slug)},
    title: ${tsString(item.title)},
    kind: 'sale',
    intro: ${tsString(item.intro)},
    paragraphs: [${paras}],
    images: [${images}],
  }`
}).join(',\n')

const file = `// Scraped from live 1sttexasrealtors.com city sale pages. 100% client copy.
import type { AreaListing } from './area-listings'

export const saleListings: AreaListing[] = [
${body},
]
`

writeFileSync('src/content/sale-listings.ts', file)
console.log('wrote', listings.length, 'sale listings')
for (const item of listings) {
  console.log(item.slug, 'intro', item.intro.slice(0, 70), 'paras', item.paragraphs.length, 'imgs', item.images.length)
}
