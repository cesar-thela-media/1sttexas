'use client'

import { FormEvent, useState } from 'react'

export function ContactForm({ type = 'contact' }: { type?: string }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('sending')
    const form = new FormData(event.currentTarget)
    const payload = Object.fromEntries(form.entries())
    try {
      const response = await fetch('/api/submit', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...payload, type }) })
      if (!response.ok) throw new Error('Request failed')
      event.currentTarget.reset()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return <form className="contact-form" onSubmit={submit} aria-label="Contact form">
    <div className="form-row">
      <label>Your name <span className="sr-only">(required)</span><input required name="name" autoComplete="name" placeholder="e.g. Jane Smith" /></label>
      <label>Your email <span className="sr-only">(required)</span><input required type="email" name="email" autoComplete="email" placeholder="e.g. jane@email.com" /></label>
    </div>
    <label>How can we help?<select name="interest" defaultValue="general"><option value="general">General question</option><option value="buying">Buying a home</option><option value="selling">Selling a home</option><option value="renting">Renting or property management</option><option value="commercial">Commercial property</option></select></label>
    <label>Your message <span className="sr-only">(required)</span><textarea required name="message" rows={5} placeholder="Tell us what you are looking for — a realtor will reply soon." /></label>
    <p className="field-hint">Need help right now? Call us at (281) 241-3121 — we are happy to talk.</p>
    <button className="button button-dark" disabled={status === 'sending'} type="submit">{status === 'sending' ? 'Sending…' : 'Send inquiry'} <span>↗</span></button>
    {status === 'success' && <p className="form-status success" role="status">Thanks! Your message is on its way to the 1st Texas Realtors team. We usually reply the same day.</p>}
    {status === 'error' && <p className="form-status error" role="alert">We could not send your message. Please try again, or call (281) 241-3121.</p>}
  </form>
}
