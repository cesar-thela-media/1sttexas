import assert from 'node:assert/strict'
import { test } from 'node:test'
import { GET } from '../src/app/api/health/route'
import { POST } from '../src/app/api/submit/route'
import {
  CLIENT_NAV_PATHS,
  LIVE_SERVICE_PATHS,
  LIVE_SITEMAP_PATHS,
  agentCanonicalSlugs,
  canonicalPublicPaths,
  permanentRedirects,
  redirectMap,
  rentCanonical,
  saleCanonical,
} from '../src/content/paths'
import { areaListings } from '../src/content/area-listings'
import { areaSlug } from '../src/content/site'
import { livePages, liveText } from '../src/content/live-pages'

const catalog = new Set(canonicalPublicPaths)

test('path catalog includes every client-nav page', () => {
  for (const path of CLIENT_NAV_PATHS) {
    assert.ok(catalog.has(path), `missing client-nav path ${path}`)
  }
})

test('path catalog includes live service pages and agent profiles', () => {
  for (const path of LIVE_SERVICE_PATHS) {
    assert.ok(catalog.has(path), `missing service path ${path}`)
  }
  for (const slug of agentCanonicalSlugs) {
    assert.ok(catalog.has(`/${slug}/`), `missing agent path /${slug}/`)
  }
})

test('path catalog includes live page-sitemap URLs', () => {
  const unique = [...new Set(LIVE_SITEMAP_PATHS)]
  for (const path of unique) {
    assert.ok(catalog.has(path), `missing live sitemap path ${path}`)
  }
})

test('legacy aliases map to 301 targets, not a second 200 page', () => {
  assert.equal(redirectMap['/realtors-in-friendswood/'], '/realtors-in-friendswood-2/')
  assert.equal(redirectMap['/galveston-tx-homes-for-rent/'], '/galveston-homes-for-rent/')
  assert.ok(!catalog.has('/realtors-in-friendswood/'))
  assert.ok(!catalog.has('/galveston-tx-homes-for-rent/'))
  assert.ok(catalog.has('/realtors-in-friendswood-2/'))
  assert.ok(catalog.has('/galveston-homes-for-rent/'))

  for (const { source, destination, statusCode } of permanentRedirects) {
    assert.equal(statusCode, 301, `${source} must be HTTP 301`)
    const dest = destination.endsWith('/') || destination === '/' ? destination : `${destination}/`
    const srcSlash = source.endsWith('/') ? source : `${source}/`
    assert.notEqual(srcSlash, dest, `${source} must not 301 to itself`)
    if (dest !== '/') {
      assert.ok(catalog.has(dest), `${source} 301 target ${dest} is not a canonical 200 page`)
    }
    assert.ok(!catalog.has(srcSlash), `${source} must not also be a 200 page`)
  }
})

test('health handler returns live JSON with a truthy status', async () => {
  const response = GET()
  assert.equal(response.status, 200)
  const body = await response.json() as { status?: string }
  assert.ok(body.status, 'health JSON must include a truthy status field')
})

test('every live sale city page has shipped client listing copy, not the invented fallback', () => {
  const invented = /Work with 1st Texas Realtors for homes for sale and expert local service/
  for (const area of Object.keys(saleCanonical)) {
    const listing = areaListings.find(item => item.kind === 'sale' && item.slug === areaSlug(area))
    assert.ok(listing, `missing sale listing for ${area}`)
    assert.ok(listing!.intro.length > 40, `${area} sale intro too short`)
    assert.equal(invented.test(listing!.intro), false, `${area} still has invented sale fallback`)
    assert.match(listing!.intro, /homes for sale/i)
    assert.ok(listing!.paragraphs.length > 0, `${area} sale missing body copy`)
  }
})

test('every live rent city page has shipped client listing copy', () => {
  for (const area of Object.keys(rentCanonical)) {
    const listing = areaListings.find(item => item.kind === 'rent' && item.slug === areaSlug(area))
    assert.ok(listing, `missing rent listing for ${area}`)
    assert.match(listing!.intro, /homes for rent/i)
    const blob = `${listing!.intro} ${listing!.paragraphs.join(' ')}`
    assert.equal(blob.includes('please see our .'), false, `${area} rent still has stripped-link hole`)
    assert.match(blob, /Testimonials/)
  }
})

test('shipped live copy includes every live sitemap and agent page body', () => {
  const required = [...new Set(LIVE_SITEMAP_PATHS), ...agentCanonicalSlugs.map(slug => `/${slug}/`)]
  for (const path of required) {
    const page = livePages[path]
    assert.ok(page, `missing live copy for ${path}`)
    assert.ok(page.blocks.length > 0, `${path} has no body copy`)
    assert.ok(liveText(path).length > 40, `${path} live text too short`)
  }
  assert.match(liveText('/about/'), /When you hire one, you get the experience and knowledge of all/)
  assert.match(liveText('/privacy-policy/'), /1st Texas Realtors Privacy Policy/)
  assert.match(liveText('/baytown-tx-homes-for-rent/'), /please read our Testimonials/)
  assert.match(liveText('/realtors-in-league-city/'), /League City Tx Realtors/)
})

test('submit handler accepts a well-formed contact POST and does not throw', async () => {
  const response = await POST(new Request('http://127.0.0.1/api/submit', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      type: 'contact',
      name: 'Test Neighbor',
      email: 'test@example.com',
      message: 'Please contact me about Clear Lake homes.',
    }),
  }))
  const body = await response.json() as { ok?: boolean }
  assert.equal(response.status, 200)
  assert.equal(body.ok, true)
})
