import { chromium, firefox, webkit } from 'playwright'
import { mkdirSync, writeFileSync } from 'node:fs'

const url = process.env.BASE_URL || 'http://localhost:3000/'
const out = 'scripts/cross-browser'
mkdirSync(out, { recursive: true })

const engines = [
  ['chromium', chromium],
  ['firefox', firefox],
  ['webkit', webkit],
]

const reports = {}

for (const [name, eng] of engines) {
  const browser = await eng.launch()
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`console:${m.text()}`)
  })

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForTimeout(1500)
  await page.evaluate(() => {
    document.documentElement.classList.remove('intro-locked')
    document.querySelectorAll('.intro-preloader').forEach((p) => p.remove())
  })
  await page.waitForTimeout(300)
  await page.screenshot({ path: `${out}/${name}-hero.png`, fullPage: false })

  await page.setViewportSize({ width: 390, height: 844 })
  await page.waitForTimeout(400)
  await page.screenshot({ path: `${out}/${name}-mobile.png`, fullPage: false })
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.waitForTimeout(200)

  const sample = await page.evaluate(() => {
    const pick = (sel) => {
      const el = document.querySelector(sel)
      if (!el) return null
      const cs = getComputedStyle(el)
      const r = el.getBoundingClientRect()
      return {
        font: cs.fontFamily.split(',')[0].replace(/"/g, ''),
        fontSize: cs.fontSize,
        color: cs.color,
        bg: cs.backgroundColor,
        display: cs.display,
        w: Math.round(r.width),
        h: Math.round(r.height),
        top: Math.round(r.top),
        left: Math.round(r.left),
        opacity: cs.opacity,
        filter: cs.filter,
        backdrop: cs.backdropFilter || cs.webkitBackdropFilter || '',
        webkitTextFill: cs.webkitTextFillColor || '',
      }
    }

    const buttons = [...document.querySelectorAll('a.button, button.button')].slice(0, 8).map((el) => {
      const cs = getComputedStyle(el)
      const r = el.getBoundingClientRect()
      return {
        text: (el.textContent || '').trim().slice(0, 40),
        className: el.className,
        color: cs.color,
        fill: cs.webkitTextFillColor || '',
        bg: cs.backgroundColor,
        w: Math.round(r.width),
        h: Math.round(r.height),
        visible: r.width > 0 && r.height > 0 && cs.opacity !== '0',
      }
    })

    const em = document.querySelector('.video-hero h1 em, .wr-word em, h1 em')
    let emStyle = null
    if (em) {
      const cs = getComputedStyle(em)
      emStyle = {
        color: cs.color,
        fill: cs.webkitTextFillColor || '',
        bgClip: cs.backgroundClip,
        bgImage: cs.backgroundImage.slice(0, 90),
      }
    }

    const videos = [...document.querySelectorAll('.hero-video')].slice(0, 3).map((v) => ({
      readyState: v.readyState,
      paused: v.paused,
      opacity: getComputedStyle(v).opacity,
      display: getComputedStyle(v).display,
    }))

    const posters = [...document.querySelectorAll('.hero-poster')].slice(0, 3).map((img) => ({
      opacity: getComputedStyle(img).opacity,
      naturalW: img.naturalWidth,
      complete: img.complete,
    }))

    return {
      body: pick('body'),
      header: pick('.site-header'),
      hero: pick('.video-hero'),
      h1: pick('.video-hero h1, .display-hero'),
      promo: pick('.promo-bar'),
      search: pick('.hero-search'),
      logo: pick('.header-logo img'),
      buttons,
      emStyle,
      videos,
      posters,
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
    }
  })

  reports[name] = { sample, errors: errors.slice(0, 10) }
  console.log(`=== ${name} ===`)
  console.log(JSON.stringify(reports[name], null, 2))
  await browser.close()
}

console.log('\n=== DIFFS ===')
for (const k of ['body', 'header', 'hero', 'h1', 'promo', 'search', 'logo']) {
  const rows = engines.map(([eng]) => {
    const s = reports[eng].sample[k]
    if (!s) return `${eng}: MISSING`
    return `${eng}: ${s.w}x${s.h} top=${s.top} font=${s.font} size=${s.fontSize} color=${s.color}`
  })
  console.log(`${k}\n  ${rows.join('\n  ')}`)
}

console.log('\n=== em gradient text ===')
for (const [eng] of engines) {
  console.log(eng, reports[eng].sample.emStyle)
}

writeFileSync(`${out}/report.json`, JSON.stringify(reports, null, 2))
console.log(`\nWrote ${out}/report.json and screenshots`)
