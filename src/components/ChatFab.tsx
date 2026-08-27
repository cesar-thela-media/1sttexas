'use client'
import Link from 'next/link'

export function ChatFab() {
  return <Link className="chat-fab" href="/contact/" aria-label="Chat with a Realtor"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-4 3v-3H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M7.5 9.5h9M7.5 12.5h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg></Link>
}
