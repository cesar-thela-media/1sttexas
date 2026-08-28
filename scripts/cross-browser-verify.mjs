import { chromium, firefox, webkit } from 'playwright'
import { mkdirSync, writeFileSync } from 'node:fs'

mkdirSync('scripts/cross-browser', { recursive: true })
const engines = [
  ['chromium', chromium],
  ['firefox', firefox],
  ['webkit', webkit],
]
const report = {}

for (const [name, eng] of engines) {
  const browser = await eng.launch()
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'no-preference',
  })
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForTimeout(2000)
  await page.evaluate(() => {
    document.documentElement.classList.remove('intro-locked')
    document.querySelectorAll('.intro-preloader').forEach((p) => p.remove())
  })
  await page.waitForTimeout(500)
  await page.screenshot({ path: `scripts/cross-browser/${name}-v-hero.png` })

  // Scroll into services sticky stack and sample sticky/transform separation
  const stack = page.locator('.svc-section-stack')
  await stack.scrollIntoViewIfNeeded()
  await page.waitForTimeout(300)
  // scroll partway through first pin
  await page.evaluate(() => {
    const pin = document.querySelector('.svc-section-pin')
    if (pin) {
      const top = pin.getBoundingClientRect().top + window.scrollY
      window.scrollTo(0, top + window.innerHeight * 0.55)
    }
  })
  await page.waitForTimeout(500)
  await page.screenshot({ path: `scripts/cross-browser/${name}-v-stack.png` })

  const sample = await page.evaluate(() => {
    const section = document.querySelector('.svc-sticky-section')
    const scale = document.querySelector('.svc-sticky-scale')
    const ss = section ? getComputedStyle(section) : null
    const sc = scale ? getComputedStyle(scale) : null
    const input = document.querySelector('.hero-search input')
    let ph = null
    if (input) {
      const pcs = getComputedStyle(input, '::placeholder')
      ph = { color: pcs.color, opacity: pcs.opacity }
    }
    const menu = document.querySelector('.menu-btn')
    const ms = menu ? getComputedStyle(menu) : null
    return {
      stickyPos: ss?.position,
      stickyTransform: ss?.transform,
      scaleTransform: sc?.transform,
      scaleDisplay: sc?.display,
      placeholder: ph,
      menuBorder: ms?.border,
      menuBg: ms?.backgroundColor,
      menuAppearance: ms?.appearance || ms?.webkitAppearance,
      bodyH: document.body.scrollHeight,
    }
  })
  report[name] = sample

  // mobile (same document — avoid second navigation races)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(500)
  await page.screenshot({ path: `scripts/cross-browser/${name}-v-mobile.png` })

  await browser.close()
}

console.log(JSON.stringify(report, null, 2))
writeFileSync('scripts/cross-browser/verify.json', JSON.stringify(report, null, 2))
