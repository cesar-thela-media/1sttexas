import raw from './live-copy.json'

export type LiveBlock = { tag: string; text: string }

export type LivePage = {
  path: string
  status: number
  title: string
  header: string
  blocks: LiveBlock[]
}

const emailBySlug: Record<string, string> = {
  'mark-bocado': 'mark@1txrealtors.com',
  'matt-bradley': 'matt@1txrealtors.com',
  'nancy-van-estes': 'nancy@1txrealtors.com',
  'jay-herder': 'jay@1txrealtors.com',
  'david-karstedt': 'david@1txrealtors.com',
  'simone-karstedt': 'simone@1txrealtors.com',
  'william-machupa-jr': 'william@1txrealtors.com',
  'rhan-pruitt': 'rhan@1txrealtors.com',
  'daniel-rickert': 'daniel@1txrealtors.com',
}

function restoreCloudflareEmail(path: string, text: string) {
  if (!text.includes('[email protected]')) return text
  const slug = path.match(/\/agents\/([^/]+)/)?.[1]
  if (slug && emailBySlug[slug]) return text.replaceAll('[email protected]', emailBySlug[slug])
  let next = text.replace('Email: [email protected]', 'Email: info@1sttexasrealtors.com')
  next = next
    .replaceAll('Mark Bocado 281-836-0074 , [email protected]', 'Mark Bocado 281-836-0074, mark@1txrealtors.com')
    .replaceAll('Matt Bradley 832-654-9820 , [email protected]', 'Matt Bradley 832-654-9820, matt@1txrealtors.com')
    .replaceAll('Nancy Estes 832-493-9398 , [email protected]', 'Nancy Estes 832-493-9398, nancy@1txrealtors.com')
    .replaceAll('Jay Herder 832-790-7195 , [email protected]', 'Jay Herder 832-790-7195, jay@1txrealtors.com')
    .replaceAll('David Karstedt 713-885-2228 , [email protected]', 'David Karstedt 713-885-2228, david@1txrealtors.com')
    .replaceAll('[email protected]', 'info@1sttexasrealtors.com')
  return next
}

export const livePageList = (raw as LivePage[]).map(page => ({
  ...page,
  blocks: page.blocks.map(block => ({ ...block, text: restoreCloudflareEmail(page.path, block.text) })),
}))

export const livePages: Record<string, LivePage> = Object.fromEntries(
  livePageList.map(page => [page.path, page]),
)

export function livePathForSlug(slug: string) {
  return slug ? `/${slug}/` : '/'
}

export function liveText(path: string) {
  const page = livePages[path]
  if (!page) return ''
  return page.blocks.map(block => block.text).join('\n')
}
