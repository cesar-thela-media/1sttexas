import type { ReactNode } from 'react'
import type { LiveBlock } from '@/content/live-pages'

export function LiveBlocks({ blocks }: { blocks: LiveBlock[] }) {
  const nodes: ReactNode[] = []
  let list: string[] = []

  const flushList = (key: string) => {
    if (!list.length) return
    nodes.push(<ul key={key} className="live-list">{list.map((item, i) => <li key={i}>{item}</li>)}</ul>)
    list = []
  }

  blocks.forEach((block, index) => {
    if (block.tag === 'li') {
      list.push(block.text)
      return
    }
    flushList(`list-${index}`)
    const key = `${block.tag}-${index}`
    if (block.tag === 'h1' || block.tag === 'h2') nodes.push(<h2 key={key}>{block.text}</h2>)
    else if (block.tag === 'h3') nodes.push(<h3 key={key}>{block.text}</h3>)
    else if (block.tag === 'h4') nodes.push(<h4 key={key} className="subheading">{block.text}</h4>)
    else if (block.tag === 'blockquote') nodes.push(<blockquote key={key}>{block.text}</blockquote>)
    else nodes.push(<p key={key}>{block.text}</p>)
  })
  flushList('list-end')

  return <div className="live-copy">{nodes}</div>
}
