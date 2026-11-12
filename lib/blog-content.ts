import { getPublishedBlogBySlug, getPublishedBlogs } from './blog-actions'

export type TocItem = { id: string; text: string }

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&[a-z]+;/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)

/**
 * Gives every section heading in stored post HTML an id and returns them as a
 * contents list. Some posts were written with <h1> section headings; the page
 * already has its own <h1> (the title), so those are turned into <h2> here.
 */
export function withHeadingIds(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = []
  const seen = new Set<string>()
  const out = html.replace(/<h([12])([^>]*)>([\s\S]*?)<\/h\1>/g, (_m, _level: string, attrs: string, inner: string) => {
    const text = inner
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&#39;|&apos;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, ' ')
      .trim()
    if (!text) return `<h2${attrs}>${inner}</h2>`
    let id = slugify(text) || `section-${toc.length + 1}`
    while (seen.has(id)) id += '-x'
    seen.add(id)
    toc.push({ id, text })
    return `<h2${attrs.replace(/\sid="[^"]*"/, '')} id="${id}">${inner}</h2>`
  })
  return { html: out, toc }
}

/** Short git-style hash for a slug, used by the terminal idea. */
export function shortHash(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return (h >>> 0).toString(16).padStart(8, '0').slice(0, 7)
}

export type ListPost = {
  slug: string
  title: string
  excerpt: string | null
  coverImage: string | null
  authorName: string | null
  readingMinutes: number
  publishedAt: string | null
}

export async function listPosts(): Promise<ListPost[]> {
  const rows = await getPublishedBlogs()
  return rows.map((r) => ({ ...r, publishedAt: r.publishedAt ? r.publishedAt.toISOString() : null }))
}

export async function loadPost(slug: string) {
  const post = await getPublishedBlogBySlug(slug)
  if (!post) return null
  const { html, toc } = withHeadingIds(post.contentHtml || '')
  const all = await listPosts()
  return {
    ...post,
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
    html,
    toc,
    author: post.authorName || 'The Forke Team',
    related: all.filter((p) => p.slug !== slug).slice(0, 3),
    index: all.findIndex((p) => p.slug === slug),
    total: all.length,
  }
}

export type FullPost = NonNullable<Awaited<ReturnType<typeof loadPost>>>

export const fmtDate = (iso: string | null, month: 'short' | 'long' = 'short') =>
  iso ? new Date(iso).toLocaleDateString('en-US', { month, day: 'numeric', year: 'numeric' }) : ''
