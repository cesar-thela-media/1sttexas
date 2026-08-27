import { NextResponse } from 'next/server'

export function GET() { return NextResponse.json({ status: 'ok', service: 'first-texas-realtors', timestamp: new Date().toISOString() }) }
