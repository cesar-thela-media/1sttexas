'use client'
import { FormEvent, useEffect, useRef, useState } from 'react'

export function LeadModal() {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (sessionStorage.getItem('lead-modal-dismissed')) return

    let shown = false
    const show = () => {
      if (shown) return
      shown = true
      sessionStorage.setItem('lead-modal-shown', '1')
      setOpen(true)
      cleanup()
    }
    const onScroll = () => {
      const doc = document.documentElement
      const pct = (window.scrollY + window.innerHeight) / doc.scrollHeight
      if (pct > 0.3) show()
    }
    const timer = setTimeout(show, 8000)
    const cleanup = () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return cleanup
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    const prev = document.activeElement as HTMLElement | null
    dialogRef.current?.querySelector<HTMLInputElement>('input')?.focus()
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      prev?.focus()
    }
  }, [open])

  const close = () => {
    setOpen(false)
    sessionStorage.setItem('lead-modal-dismissed', '1')
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('sending')
    const form = new FormData(event.currentTarget)
    const payload = Object.fromEntries(form.entries())
    try {
      const response = await fetch('/api/submit', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...payload, type: 'valuation' }) })
      if (!response.ok) throw new Error('Request failed')
      event.currentTarget.reset()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (!open) return null

  return <div className="lead-modal-backdrop" onClick={close}>
    <div className="lead-modal" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="lead-modal-title" onClick={e => e.stopPropagation()}>
      <button className="lead-modal-close" onClick={close} aria-label="Close">✕</button>
      <div className="lead-modal-image" aria-hidden="true" />
      <div className="lead-modal-content">
        <div className="avatar-stack"><img src="/assets/reference/agents/David-Karstedt.jpg" alt="David Karstedt" /><img src="/assets/reference/agents/Mark-Bocado.jpg" alt="Mark Bocado" /><img src="/assets/reference/agents/Nancy-Estes.jpg" alt="Nancy Estes" /><img src="/assets/reference/agents/Matt-Bradley.jpg" alt="Matt Bradley" /></div>
        <p className="lead-modal-kicker">Trusted by families across Clear Lake NASA</p>
        <h3 id="lead-modal-title">Get a free home valuation</h3>
        <p className="lead-modal-copy">No obligation — a local Realtor will prepare a no-cost market analysis and reply within 24 hours.</p>
        {status === 'success' ? <p className="lead-modal-success">Thanks — a Realtor will be in touch within 24 hours.</p> : <form className="lead-modal-form" onSubmit={submit}>
          <input required name="name" placeholder="Your name" autoComplete="name" aria-label="Your name" />
          <input required type="email" name="email" placeholder="Email address" autoComplete="email" aria-label="Email address" />
          <button className="button button-primary" disabled={status === 'sending'} type="submit">{status === 'sending' ? 'Sending…' : 'Get my free valuation'} <span>↗</span></button>
          {status === 'error' && <p className="lead-modal-error">Something went wrong — please call (281) 241-3121.</p>}
        </form>}
        <p className="lead-modal-fineprint">No spam. Reply within 24h.</p>
      </div>
    </div>
  </div>
}
