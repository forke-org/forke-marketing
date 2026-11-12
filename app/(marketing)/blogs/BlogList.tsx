'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import BlogCard, { FeaturedBlogCard, type BlogCardData } from '@/components/blog/BlogCard'
import { Section } from '@/components/landing/primitives'

const PER_PAGE = 9

/** Newest post as a wide feature on page one, then a paged three-column grid. */
export default function BlogList({ posts, initialPage = 1 }: { posts: BlogCardData[]; initialPage?: number }) {
  const [featured, ...rest] = posts
  const totalPages = Math.max(1, Math.ceil(rest.length / PER_PAGE))
  const [page, setPage] = useState(Math.min(initialPage, totalPages))

  useEffect(() => {
    const onPop = () => setPage(Math.max(1, parseInt(new URL(window.location.href).searchParams.get('page') || '1', 10) || 1))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const go = (n: number) => {
    const target = Math.min(Math.max(1, n), totalPages)
    setPage(target)
    const url = new URL(window.location.href)
    if (target > 1) url.searchParams.set('page', String(target))
    else url.searchParams.delete('page')
    window.history.pushState({}, '', url.pathname + url.search)
    document.getElementById('posts')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (!featured) {
    return (
      <Section divider={false}>
        <p className="px-6 py-24 text-center text-white/45 sm:px-12">No posts yet. Check back soon.</p>
      </Section>
    )
  }

  const visible = rest.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <>
      {page === 1 && (
        <Section>
          <div className="px-6 py-14 sm:px-12 sm:py-16">
            <FeaturedBlogCard post={featured} />
          </div>
        </Section>
      )}

      <Section divider={totalPages > 1}>
        <div id="posts" className="scroll-mt-14 px-6 py-14 sm:px-12 sm:py-16">
          <p className="mb-8 text-sm text-white/40">{page === 1 ? 'More from the team' : `Page ${page}`}</p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((p) => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </div>
        </div>
      </Section>

      {totalPages > 1 && (
        <Section divider={false}>
          <div className="flex items-center justify-center gap-4 px-6 py-12">
            <button
              type="button"
              onClick={() => go(page - 1)}
              disabled={page === 1}
              aria-label="Newer posts"
              className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-white/10 text-white/50 transition-colors hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-mono text-[12.5px] text-white/70">
              {String(page).padStart(2, '0')} <span className="text-white/30">/ {String(totalPages).padStart(2, '0')}</span>
            </span>
            <button
              type="button"
              onClick={() => go(page + 1)}
              disabled={page === totalPages}
              aria-label="Older posts"
              className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-white/10 text-white/50 transition-colors hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </Section>
      )}
    </>
  )
}
