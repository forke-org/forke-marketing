import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import PageShell from '@/components/shared/PageShell'
import BlogPost from '@/components/blog/BlogPost'
import BlogViewTracker from './BlogViewTracker'
import { getPublishedBlogBySlug } from '@/lib/blog-actions'
import { loadPost } from '@/lib/blog-content'

export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ slug: string }> }

/** Trim to a social-card friendly length, cutting on a word boundary. */
function truncate(text: string | null | undefined, max = 155) {
  if (!text) return undefined
  const clean = text.trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max)
  const space = cut.lastIndexOf(' ')
  return `${(space > 0 ? cut.slice(0, space) : cut).replace(/[.,;:!\-\s]+$/, '')}…`
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const post = await getPublishedBlogBySlug(slug)
  if (!post) return { title: 'Post not found' }
  const description = truncate(post.excerpt)
  return {
    title: post.title,
    description,
    alternates: { canonical: `/blogs/${post.slug}` },
    openGraph: {
      title: post.title,
      description,
      url: `https://www.forke.space/blogs/${post.slug}`,
      type: 'article',
      siteName: 'Forke',
      images: post.coverImage ? [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params
  const post = await loadPost(slug)
  if (!post) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: post.title,
    description: post.excerpt || post.title,
    image: post.coverImage ? [post.coverImage] : undefined,
    datePublished: post.publishedAt ?? undefined,
    dateModified: post.updatedAt.toISOString(),
    author: { '@type': 'Person', name: post.author },
    publisher: { '@type': 'Organization', name: 'Forke', url: 'https://www.forke.space' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://www.forke.space/blogs/${post.slug}` },
    interactionStatistic: { '@type': 'InteractionCounter', interactionType: 'https://schema.org/ReadAction', userInteractionCount: post.views },
  }

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogViewTracker slug={slug} />
      <BlogPost post={post} />
    </PageShell>
  )
}
