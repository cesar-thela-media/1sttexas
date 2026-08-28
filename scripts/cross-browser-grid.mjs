import { chromium, firefox, webkit } from 'playwright'

const engines = [
  ['chromium', chromium],
  ['firefox', firefox],
  ['webkit', webkit],
]

for (const [name, eng] of engines) {
  const browser = await eng.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForTimeout(2000)
  await page.evaluate(() => {
    document.documentElement.classList.remove('intro-locked')
    document.querySelectorAll('.intro-preloader').forEach((x) => x.remove())
    const pin = document.querySelector('.svc-section-pin')
    if (pin) {
      const top = pin.getBoundingClientRect().top + window.scrollY
      window.scrollTo(0, top + window.innerHeight * 0.55)
    }
  })
  await page.waitForTimeout(600)
  const m = await page.evaluate(() => {
    const section = document.querySelector('.svc-sticky-section')
    const scale = document.querySelector('.svc-sticky-scale')
    const media = document.querySelector('.svc-sticky-section-media')
    const body = document.querySelector('.svc-sticky-section-body')
    const box = (el) => {
      if (!el) return null
      const r = el.getBoundingClientRect()
      const cs = getComputedStyle(el)
      return {
        w: Math.round(r.width),
        h: Math.round(r.height),
        left: Math.round(r.left),
        right: Math.round(r.right),
        display: cs.display,
        grid: cs.gridTemplateColumns,
        pos: cs.position,
        transform: cs.transform,
        overflow: cs.overflow,
        bg: cs.backgroundColor,
      }
    }
    return {
      vw: window.innerWidth,
      section: box(section),
      scale: box(scale),
      media: box(media),
      body: box(body),
    }
  })
  console.log(name, JSON.stringify(m))
  await page.screenshot({ path: `scripts/cross-browser/${name}-v2-stack.png` })
  await browser.close()
}
