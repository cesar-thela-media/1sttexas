import { NextResponse } from 'next/server'

const webhookFor = (type: string) => process.env[`WEBHOOK_URL_${type.toUpperCase()}`] || process.env.WEBHOOK_URL

export const runtime = 'nodejs'
export const maxDuration = 10

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    if (!payload || typeof payload !== 'object') return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
    const type = String(payload.type || 'contact')
    if (!/^[a-z0-9_-]+$/i.test(type)) return NextResponse.json({ ok: false, error: 'Invalid submission type.' }, { status: 400 })
    const webhook = webhookFor(type)
    if (!webhook) return NextResponse.json({ ok: true, queued: false, message: 'Webhook is not configured yet.' })
    const response = await fetch(webhook, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...payload, receivedAt: new Date().toISOString() }), signal: AbortSignal.timeout(8000) })
    if (!response.ok) return NextResponse.json({ ok: false, error: 'Webhook rejected the submission.' }, { status: 502 })
    return NextResponse.json({ ok: true, queued: true })
  } catch { return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 }) }
}
