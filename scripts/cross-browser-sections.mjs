import { chromium, firefox, webkit } from 'playwright'
import { mkdirSync, writeFileSync } from 'node:fs'

mkdirSync('scripts/cross-browser', { recursive: true })
const engines = [
  ['chromium', chromium],
  ['firefox', firefox],
  ['webkit', webkit],
]
const reports = {}

for (const [name, eng] of engines) {
  const browser = await eng.launch()
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'no-preference',
  })
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForTimeout(3500)
  await page.evaluate(() => {
    document.documentElement.classList.remove('intro-locked')
    document.querySelectorAll('.intro-preloader').forEach((p) => p.remove())
  })
  await page.waitForTimeout(800)
  await page.screenshot({ path: `scripts/cross-browser/${name}-motion-hero.png` })

  const sections = await page.evaluate(() => {
    const input = document.querySelector('.hero-search input')
    let placeholder = null
    if (input) {
      try {
        const pcs = getComputedStyle(input, '::placeholder')
        placeholder = { color: pcs.color, opacity: pcs.opacity, inputColor: getComputedStyle(input).color }
      } catch (e) {
        placeholder = { err: String(e) }
      }
    }

    const blocks = [...document.querySelectorAll('main > *, section, .section, footer, .footer, .svc-stack, .marquee, .video-hero, .video-band')].map((el) => ({
      cls: (el.className || '').toString().slice(0, 70),
      tag: el.tagName,
      h: Math.round(el.scrollHeight),
      w: Math.round(el.getBoundingClientRect().width),
    })).filter((x) => x.h > 60)

    const videos = [...document.querySelectorAll('.hero-video')].slice(0, 4).map((v) => ({
      readyState: v.readyState,
      paused: v.paused,
      opacity: getComputedStyle(v).opacity,
      currentTime: v.currentTime,
      error: v.error ? v.error.message || String(v.error.code) : null,
    }))
    const posters = [...document.querySelectorAll('.hero-poster')].slice(0, 4).map((img) => ({
      opacity: getComputedStyle(img).opacity,
      naturalW: img.naturalWidth,
    }))
    const playing = document.querySelector('.video-hero-slide.is-playing')
    const active = document.querySelector('.video-hero-slide.is-active')

    return {
      placeholder,
      blocks,
      videos,
      posters,
      playingClass: playing?.className || null,
      activeClass: active?.className || null,
      bodyH: document.body.scrollHeight,
      htmlH: document.documentElement.scrollHeight,
    }
  })
  reports[name] = sections

  await page.evaluate(() => window.scrollTo(0, 2200))
  await page.waitForTimeout(400)
  await page.screenshot({ path: `scripts/cross-browser/${name}-mid.png` })
  await page.evaluate(() => window.scrollTo(0, 4500))
  await page.waitForTimeout(400)
  await page.screenshot({ path: `scripts/cross-browser/${name}-lower.png` })
  await browser.close()
}

const names = engines.map((e) => e[0])
console.log('body heights', Object.fromEntries(names.map((n) => [n, reports[n].bodyH])))
console.log('placeholder', Object.fromEntries(names.map((n) => [n, reports[n].placeholder])))
console.log('videos', Object.fromEntries(names.map((n) => [n, reports[n].videos])))
console.log('playing', Object.fromEntries(names.map((n) => [n, reports[n].playingClass])))

const base = reports.chromium.blocks
for (let i = 0; i < base.length; i++) {
  const hs = names.map((n) => reports[n].blocks[i]?.h || 0)
  const max = Math.max(...hs)
  const min = Math.min(...hs)
  if (max - min > 8) {
    const rows = names.map((n) => {
      const b = reports[n].blocks[i]
      return b ? `${n}=${b.h}` : `${n}=MISS`
    })
    console.log('DIFF', base[i].cls || base[i].tag, rows.join(' '), `delta=${max - min}`)
  }
}

writeFileSync('scripts/cross-browser/sections.json', JSON.stringify(reports, null, 2))
