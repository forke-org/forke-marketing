/**
 * @fileoverview Forke Platform - Dynamic RSS 2.0 Feed
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 */

import { NextResponse } from 'next/server'
import { getPublishedBlogs } from '@/lib/blog-actions'

export const dynamic = 'force-dynamic'

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '&': return '&amp;'
      case '\'': return '&apos;'
      case '"': return '&quot;'
      default: return c
    }
  })
}

export async function GET() {
  const baseUrl = 'https://www.forke.space'
  const blogs = await getPublishedBlogs().catch(() => [])

  const itemsXml = blogs
    .map((b) => {
      const link = `${baseUrl}/blogs/${b.slug}`
      const pubDate = b.publishedAt ? new Date(b.publishedAt).toUTCString() : new Date().toUTCString()
      const title = escapeXml(b.title)
      const description = escapeXml(b.excerpt || '')
      const author = escapeXml(b.authorName || 'Forke Engineering Team')

      return `    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>${author}</author>
      <description>${description}</description>
    </item>`
    })
    .join('\n')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>The Forke Blogs</title>
    <link>${baseUrl}/blogs</link>
    <description>Stories, updates, and architectural ideas from the Forke engineering team.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>`

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
