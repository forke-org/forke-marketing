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

export async function getPublishedChangelogs(): Promise<ChangelogItem[]> {
  try {
    const rows = await db
      .select()
      .from(changelogs)
      .where(eq(changelogs.isPublished, true))
      .orderBy(desc(changelogs.publishedAt))

    return rows.map((r) => ({
      ...r,
      improvements: (Array.isArray(r.improvements) ? r.improvements : []) as string[],
      fixes: (Array.isArray(r.fixes) ? r.fixes : []) as string[],
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
      improvements: (Array.isArray(row.improvements) ? row.improvements : []) as string[],
      fixes: (Array.isArray(row.fixes) ? row.fixes : []) as string[],
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
