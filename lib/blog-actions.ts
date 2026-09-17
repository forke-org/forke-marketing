'use server'

/**
 * @fileoverview Forke Platform - Public Blog Actions
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

import { db } from './db'
import { blogs } from './db/schema'
import { eq, desc, and, sql } from 'drizzle-orm'

// ── public reads ────────────────────────────────────────────────────────────

/** All published posts, newest first — for the public /blog list. */
export async function getPublishedBlogs() {
  return db
    .select({
      id: blogs.id,
      title: blogs.title,
      slug: blogs.slug,
      excerpt: blogs.excerpt,
      coverImage: blogs.coverImage,
      authorName: blogs.authorName,
      readingMinutes: blogs.readingMinutes,
      publishedAt: blogs.publishedAt,
    })
    .from(blogs)
    .where(eq(blogs.status, 'published'))
    .orderBy(desc(blogs.createdAt))
}

/** A single published post by slug — for /blog/[slug]. Drafts return null. */
export async function getPublishedBlogBySlug(slug: string) {
  const row = await db
    .select()
    .from(blogs)
    .where(and(eq(blogs.slug, slug), eq(blogs.status, 'published')))
    .limit(1)
  return row[0] ?? null
}

/** Slugs + timestamps of published posts — for the sitemap. */
export async function getPublishedBlogSlugs() {
  return db
    .select({ slug: blogs.slug, updatedAt: blogs.updatedAt, publishedAt: blogs.publishedAt })
    .from(blogs)
    .where(eq(blogs.status, 'published'))
}

// ── blog view tracking ────────────────────────────────────────────────────────

/** Increment the views counter for a post by slug. Public API route. */
export async function incrementBlogView(slug: string) {
  try {
    await db
      .update(blogs)
      .set({ views: sql`${blogs.views} + 1` })
      .where(and(eq(blogs.slug, slug), eq(blogs.status, 'published')))
    return { success: true as const }
  } catch {
    return { success: false as const }
  }
}

/** Views for a single post by id (public — no auth gate). */
export async function getBlogViewCount(blogId: string): Promise<number> {
  try {
    const [row] = await db
      .select({ views: blogs.views })
      .from(blogs)
      .where(eq(blogs.id, blogId))
    return row?.views ?? 0
  } catch {
    return 0
  }
}

/**
 * Map of slug → view count for ALL published posts.
 * Used by the public blog list to show counts without N+1 queries.
 */
export async function getPublishedBlogViewCounts(): Promise<Record<string, number>> {
  try {
    const rows = await db
      .select({ slug: blogs.slug, views: blogs.views })
      .from(blogs)
      .where(eq(blogs.status, 'published'))
    return Object.fromEntries(rows.map((r) => [r.slug, r.views]))
  } catch {
    return {}
  }
}
