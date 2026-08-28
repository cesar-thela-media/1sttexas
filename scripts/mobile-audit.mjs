/**
 * Mobile layout audit — run with:
 *   npx playwright test is not needed; uses playwright chromium if installed,
 *   else prints paths only. Prefer: node scripts/mobile-audit.mjs
 */
import { chromium } from 'playwright'
import { readFileSync, writeFileSync } from 'node:fs'

const BASE = process.env.BASE_URL || 'http://localhost:4000'

// Build the full public path list from paths.ts source (no TS loader needed).
function loadPaths() {
  const src = readFileSync(new URL('../src/content/paths.ts', import.meta.url), 'utf8')
  const rentBlock = src.slice(src.indexOf('rentCanonical'), src.indexOf('agentCanonicalSlugs'))
  const saleBlock = src.slice(src.indexOf('saleCanonical'), src.indexOf('rentCanonical'))
  const saleSlugs = [...saleBlock.matchAll(/:\s*'([^']+)'/g)].map(m => m[1])
  const rentSlugs = [...rentBlock.matchAll(/:\s*'([^']+)'/g)].map(m => m[1])
  const agentBlock = src.slice(src.indexOf('agentCanonicalSlugs'), src.indexOf('CLIENT_NAV_PATHS'))
  const agents = [...agentBlock.matchAll(/'([^']+)'/g)].map(m => m[1])
  const core = [
    '/',
    '/about/',
    '/home-buyers/',
    '/seller-services/',
    '/homes-for-rent/',
    '/commercial-property-realtors/',
    '/new-home-construction/',
    '/home-staging/',
    '/relocation-service/',
    '/agents/',
    '/contact/',
    '/realtor-reviews/',
    '/home-search/',
    '/register/',
    '/login/',
    '/privacy-policy/',
  ]
  return [...new Set([
    ...core,
    ...agents.map(s => `/${s}/`),
    ...saleSlugs.map(s => `/${s}/`),
    ...rentSlugs.map(s => `/${s}/`),
  ])]
}

const paths = loadPaths()
console.error(`Auditing ${paths.length} paths at 390x844…`)

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
const results = []

for (const path of paths) {
  const url = BASE + path
  try {
    const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
    await page.waitForTimeout(400)
    await page.locator('.lead-modal-backdrop button, .lead-modal-close').first().click({ timeout: 800 }).catch(() => {})
    await page.waitForTimeout(150)

    const metrics = await page.evaluate(() => {
      const doc = document.documentElement
      const body = document.body
      const overflowX = doc.scrollWidth > doc.clientWidth + 2
      const offenders = []
      for (const el of document.querySelectorAll('body *')) {
        if (!(el instanceof HTMLElement)) continue
        // Intentional marquees/carousels are clipped by overflow:hidden parents.
        if (el.closest('.svc-coverflow-viewport, .areas-slide-row, .nws-rev-scroll, .marquee')) continue
        const r = el.getBoundingClientRect()
        if (r.width < 1 || r.height < 1) continue
        if (r.right > doc.clientWidth + 2 || r.left < -2) {
          const tag = el.tagName.toLowerCase()
          const cls = typeof el.className === 'string' ? el.className.slice(0, 80) : ''
          offenders.push(`${tag}.${cls}`.trim())
          if (offenders.length >= 8) break
        }
      }
      const h1 = document.querySelector('h1, .display-hero, .display-section')
      const h1Size = h1 ? parseFloat(getComputedStyle(h1).fontSize) : null
      const multiCol = []
      for (const sel of ['.service-hero', '.agents-hero', '.about-story', '.split-section', '.contact-main', '.listing-gallery', '.agent-grid-designed', '.nws-reviews-grid']) {
        const el = document.querySelector(sel)
        if (!el) continue
        const cols = getComputedStyle(el).gridTemplateColumns
        const parts = cols.split(' ').filter(Boolean)
        if (parts.length > 1 && !parts.every(p => p === parts[0] && p.endsWith('px') && parseFloat(p) > doc.clientWidth * 0.8)) {
          // more than one track and not a single full-width column
          if (parts.length >= 2 && parts.some(p => p.includes('fr') || (p.endsWith('px') && parseFloat(p) < doc.clientWidth * 0.7))) {
            multiCol.push({ sel, cols: parts.length })
          }
        }
      }
      return {
        overflowX,
        scrollWidth: doc.scrollWidth,
        clientWidth: doc.clientWidth,
        bodyOverflow: getComputedStyle(body).overflowX,
        h1Size,
        multiCol,
        offenders,
      }
    })

    results.push({ path, status: res?.status() ?? 0, ok: !metrics.overflowX && metrics.offenders.length === 0, ...metrics })
  } catch (err) {
    results.push({ path, status: 0, ok: false, error: String(err) })
  }
}

await browser.close()

const failed = results.filter(r => !r.ok)
writeFileSync('mobile-audit-results.json', JSON.stringify({ at: new Date().toISOString(), results, failed }, null, 2))
console.log(JSON.stringify({ total: results.length, failed: failed.length, failedPaths: failed.map(f => f.path), results }, null, 2))
process.exit(failed.length ? 1 : 0)
