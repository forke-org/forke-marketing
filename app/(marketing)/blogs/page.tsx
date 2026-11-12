import type { Metadata } from 'next'
import PageShell, { PageHeader } from '@/components/shared/PageShell'
import type { BlogCardData } from '@/components/blog/BlogCard'
import { getPublishedBlogs, getPublishedBlogViewCounts } from '@/lib/blog-actions'
import BlogList from './BlogList'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'The Forke Blogs — Engineering Notes & Product Deep Dives',
  description:
    'Stories, architectural updates, and technical ideas from the Forke engineering team. Deep-dives on systems, Git, micro-tasks, and developer culture.',
  alternates: {
    canonical: '/blogs',
    types: { 'application/rss+xml': [{ url: 'https://www.forke.space/feed.xml', title: 'The Forke Blogs RSS Feed' }] },
  },
}

export default async function BlogsIndexPage(props: { searchParams?: Promise<{ page?: string }> }) {
  const searchParams = await props.searchParams
  const initialPage = Math.max(1, parseInt(searchParams?.page || '1', 10) || 1)
  const [rows, views] = await Promise.all([getPublishedBlogs(), getPublishedBlogViewCounts()])
  const posts: BlogCardData[] = rows.map((r) => ({
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    coverImage: r.coverImage,
    authorName: r.authorName,
    readingMinutes: r.readingMinutes,
    publishedAt: r.publishedAt ? r.publishedAt.toISOString() : null,
    viewCount: views[r.slug] ?? 0,
  }))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'The Forke Blogs',
    url: 'https://www.forke.space/blogs',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `https://www.forke.space/blogs/${p.slug}`,
        name: p.title,
      })),
    },
  }

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHeader
        eyebrow="From the team"
        title="The Forke"
        muted="blogs."
      >
        Product deep-dives, engineering notes and what we&rsquo;re building next.
      </PageHeader>
      <BlogList posts={posts} initialPage={initialPage} />
    </PageShell>
  )
}
