import { db } from '@/lib/db'
import { changelogs } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export interface ChangelogItem {
  id: string
  title: string
  slug: string
  tag: string
  description: string
  improvements: string[]
  fixes: string[]
  mediaType: 'none' | 'image' | 'video'
  mediaUrl: string | null
  isPublished: boolean
  publishedAt: string
  createdAt: string
  updatedAt: string
}

/**
 * Older changelog rows stored improvements/fixes as a JSON *string* inside the jsonb
 * column ('["a","b"]') instead of a real array. Accept both so no entry loses its lists.
 */
function toList(value: unknown): string[] {
  let v = value
  if (typeof value === 'string') {
    try {
      v = JSON.parse(value)
    } catch {
      return value.trim() ? [value.trim()] : []
    }
  }
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && x.trim() !== '').map((x) => x.trim()) : []
}

export async function getPublishedChangelogs(): Promise<ChangelogItem[]> {
  try {
    const rows = await db
      .select()
      .from(changelogs)
      .where(eq(changelogs.isPublished, true))
      .orderBy(desc(changelogs.publishedAt))

    return rows.map((r) => ({
      ...r,
      improvements: toList(r.improvements),
      fixes: toList(r.fixes),
      mediaType: (r.mediaType as 'none' | 'image' | 'video') || 'none',
      publishedAt: r.publishedAt.toISOString(),
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }))
  } catch (error) {
    console.error('Failed to fetch published changelogs:', error)
    return []
  }
}

export async function getChangelogBySlug(slug: string): Promise<ChangelogItem | null> {
  try {
    const row = await db.query.changelogs.findFirst({
      where: eq(changelogs.slug, slug),
    })

    if (!row || !row.isPublished) return null

    return {
      ...row,
      improvements: toList(row.improvements),
      fixes: toList(row.fixes),
      mediaType: (row.mediaType as 'none' | 'image' | 'video') || 'none',
      publishedAt: row.publishedAt.toISOString(),
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    }
  } catch (error) {
    console.error('Failed to fetch changelog by slug:', error)
    return null
  }
}

export async function getPublishedChangelogSlugs(): Promise<string[]> {
  try {
    const rows = await db
      .select({ slug: changelogs.slug })
      .from(changelogs)
      .where(eq(changelogs.isPublished, true))

    return rows.map((r) => r.slug)
  } catch {
    return []
  }
}
