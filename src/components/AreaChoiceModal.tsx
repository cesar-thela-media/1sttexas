'use client'
import Link from 'next/link'
import { useEffect } from 'react'
import { salePath, rentPath } from '@/content/site'

// Buy / Rent / Sell choice dialog — shown when clicking an area card
export function AreaChoiceModal({ area, image, onClose }: { area: string; image: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])

  return <div className="area-choice-overlay" role="dialog" aria-modal="true" aria-label={`Buy, rent, or sell in ${area}`} onClick={onClose}>
    <div className="area-choice-card" onClick={e => e.stopPropagation()}>
      <button className="area-choice-close" aria-label="Close" onClick={onClose}>✕</button>
      <div className="area-choice-media"><img src={image} alt={`Homes in ${area}`} /><span className="nws-area-tag">Service area</span></div>
      <div className="area-choice-body">
        <p className="eyebrow">1st Texas Realtors</p>
        <h2>Do you want to <em>buy</em>, <em>rent</em>, or <em>sell</em> in {area}?</h2>
        <p className="area-choice-sub">Choose what you are looking for — we will take you straight to the homes in {area}.</p>
        <div className="area-choice-options">
          <Link className="area-choice-option" href={salePath(area)} onClick={onClose}>
            <span className="area-choice-icon" aria-hidden="true">🏠</span>
            <span className="area-choice-text"><b>Buy a home</b><small>Browse homes for sale in {area}</small></span>
            <span className="area-choice-go" aria-hidden="true">→</span>
          </Link>
          <Link className="area-choice-option" href={rentPath(area)} onClick={onClose}>
            <span className="area-choice-icon" aria-hidden="true">🔑</span>
            <span className="area-choice-text"><b>Rent a home</b><small>Browse homes for rent in {area}</small></span>
            <span className="area-choice-go" aria-hidden="true">→</span>
          </Link>
          <Link className="area-choice-option" href="/seller-services/" onClick={onClose}>
            <span className="area-choice-icon" aria-hidden="true">📤</span>
            <span className="area-choice-text"><b>Sell a home</b><small>Free Market Analysis in {area}</small></span>
            <span className="area-choice-go" aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="area-choice-foot"><span>Family owned since 2004</span><Link href="/contact/" onClick={onClose}>Talk to a Realtor <span>→</span></Link></div>
      </div>
    </div>
  </div>
}
