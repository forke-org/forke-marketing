import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export interface BlogCardData {
  slug: string
  title: string
  excerpt: string | null
  coverImage: string | null
  authorName: string | null
  readingMinutes: number
  publishedAt: string | null
  viewCount?: number
}

export function formatBlogDate(iso: string | null, month: 'short' | 'long' = 'short') {
  if (!iso) return null
  return new Date(iso).toLocaleDateString('en-US', { month, day: 'numeric', year: 'numeric' })
}

export function Cover({ post, className = '' }: { post: BlogCardData; className?: string }) {
  return (
    <div className={`overflow-hidden bg-surface ${className}`}>
      {post.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverImage}
          alt=""
          loading="lazy"
          className="block h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center font-mono text-[13px] text-white/20">forke*</div>
      )}
    </div>
  )
}

export function Meta({ post }: { post: BlogCardData }) {
  return (
    <p className="flex flex-wrap items-center gap-x-2 font-mono text-[11.5px] text-white/40">
      {post.publishedAt && <span>{formatBlogDate(post.publishedAt)}</span>}
      <span className="text-white/20">·</span>
      <span>{post.readingMinutes} min read</span>
    </p>
  )
}

const card =
  'group overflow-hidden rounded-[18px] border border-white/[0.07] bg-white/[0.015] transition-colors duration-300 hover:border-white/[0.16] hover:bg-white/[0.03]'

/** Grid card: cover on top, then date, title and a two-line excerpt inside one framed card. */
export default function BlogCard({ post }: { post: BlogCardData }) {
  return (
    <Link href={`/blogs/${post.slug}`} className={`${card} flex flex-col`}>
      <Cover post={post} className="aspect-[16/9] border-b border-white/[0.06]" />
      <div className="flex flex-1 flex-col p-5">
        <Meta post={post} />
        <h3 className="mt-2.5 text-[18px] font-medium leading-snug tracking-[-0.015em] text-ink">{post.title}</h3>
        {post.excerpt && <p className="mt-2 line-clamp-2 text-[14px] leading-6 text-white/50">{post.excerpt}</p>}
        <span className="mt-auto flex items-center justify-between pt-5 text-[13px] text-white/40">
          {post.authorName || 'The Forke Team'}
          <ArrowUpRight className="h-4 w-4 text-white/30 transition-[color,transform] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
        </span>
      </div>
    </Link>
  )
}

/** The newest post: one wide framed card, words on the left and the cover on the right. */
export function FeaturedBlogCard({ post }: { post: BlogCardData }) {
  return (
    <Link href={`/blogs/${post.slug}`} className={`${card} grid lg:grid-cols-[1fr_1.2fr]`}>
      <div className="order-2 flex flex-col p-6 sm:p-10 lg:order-1">
        <span className="inline-flex h-6 w-fit items-center rounded-full border border-accent/30 bg-accent/[0.08] px-2.5 font-mono text-[10.5px] uppercase tracking-[0.1em] text-accent-text">
          Latest
        </span>
        <h2 className="mt-5 text-[28px] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[38px]">{post.title}</h2>
        {post.excerpt && <p className="mt-4 line-clamp-3 text-[16px] leading-7 text-white/55">{post.excerpt}</p>}
        <div className="mt-auto flex items-center justify-between gap-4 pt-8">
          <Meta post={post} />
          <span className="inline-flex items-center gap-1 text-[14px] text-accent-text">
            Read
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
      <Cover post={post} className="order-1 aspect-[16/9] border-b border-white/[0.06] lg:order-2 lg:aspect-auto lg:min-h-[380px] lg:border-b-0 lg:border-l" />
    </Link>
  )
}
