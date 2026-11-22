/**
 * @fileoverview Forke Platform
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

import { NextResponse } from 'next/server'
import { getRecentBlogs } from '@/lib/blog-actions'

export const dynamic = 'force-dynamic'

/** The three newest posts, for the navbar's Resources menu. Cached at the edge for five minutes. */
export async function GET() {
  try {
    const rows = await getRecentBlogs(3)
    const posts = rows.map((r) => ({
      slug: r.slug,
      title: r.title,
      coverImage: r.coverImage,
      readingMinutes: r.readingMinutes,
      publishedAt: r.publishedAt ? r.publishedAt.toISOString() : null,
    }))
    return NextResponse.json({ posts }, { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } })
  } catch {
    return NextResponse.json({ posts: [] })
  }
}
