import Link from 'next/link'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { Section } from '@/components/landing/primitives'
import LegalToc from '@/components/legal/LegalToc'
import { ReadingProgress } from '@/app/(marketing)/blogs/[slug]/ReaderTools'
import { fmtDate, type FullPost } from '@/lib/blog-content'

const facts = (post: FullPost) => [
  ['Written by', post.author],
  ['Published', fmtDate(post.publishedAt, 'long')],
  ['Reading time', `${post.readingMinutes} minutes`],
  ['Readers', post.views.toLocaleString()],
]

/** Blog post: cover panel with the title over it, then contents and the article across the rest of the width. */
export default function BlogPost({ post }: { post: FullPost }) {
  const base = '/blogs'
  return (
    <>
      <ReadingProgress target="article-body" />
      {/* Phones: plain header — title, facts row, then the cover in the reading column. */}
      <Section className="sm:hidden">
        <header className="px-6 pb-10 pt-14">
          <Link href={base} className="inline-flex items-center gap-1.5 text-[13.5px] text-white/45 hover:text-white">
            <ArrowLeft className="h-3.5 w-3.5" /> All posts
          </Link>
          <h1 className="mt-8 text-[38px] font-medium leading-[1.04] tracking-[-0.04em] text-white">{post.title}</h1>
          <div className="mt-8 grid grid-cols-2 gap-6 border-t border-line pt-6 font-mono text-[12px]">
            {facts(post).map(([k, v]) => (
              <div key={k}>
                <p className="text-white/30">{k}</p>
                <p className="mt-1 text-[13px] text-white/80">{v}</p>
              </div>
            ))}
          </div>
        </header>
      </Section>

      {/*
        Wider screens: the title sits on a dark fade at the foot of the cover.
        The image and the text share one grid cell, so the panel takes the image's own
        aspect ratio (never cropped or stretched). Only if the text is taller than the
        image does the panel grow, and the fade's dark end fills the extra space.
      */}
      <Section className="hidden sm:block">
        <div className="p-4">
          <header className="relative isolate grid overflow-hidden rounded-[22px] border border-white/[0.08] bg-surface">
            {post.coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.coverImage} alt="" className="col-start-1 row-start-1 block h-auto w-full self-start" />
            )}
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,8,7,0.35)_0%,transparent_20%,transparent_45%,rgba(11,8,7,0.82)_74%,#0b0807_100%)]"
            />
            <Link
              href={base}
              className="absolute left-8 top-8 z-10 inline-flex h-8 items-center gap-1.5 rounded-full border border-white/15 bg-black/35 px-3 text-[13px] text-white/85 backdrop-blur-md transition-colors hover:bg-black/55"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> All posts
            </Link>
            <div className="relative col-start-1 row-start-1 self-end px-8 pb-8 pt-24 lg:px-12 lg:pb-10">
              <h1 className="max-w-[980px] text-[38px] font-medium leading-[1.05] tracking-[-0.04em] text-white lg:text-[54px] xl:text-[64px]">
                {post.title}
              </h1>
              <div className="mt-6 grid grid-cols-4 gap-6 border-t border-white/15 pt-5 font-mono text-[12px] lg:mt-8">
                {facts(post).map(([k, v]) => (
                  <div key={k}>
                    <p className="text-white/45">{k}</p>
                    <p className="mt-1 text-[13px] text-white/90">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </header>
        </div>
      </Section>

      <Section>
        <div className={`grid gap-12 px-6 py-16 sm:px-12 lg:gap-16 ${post.toc.length > 0 ? 'lg:grid-cols-[200px_minmax(0,1fr)]' : ''}`}>
          {post.toc.length > 0 && <LegalToc items={post.toc.map((t) => ({ id: t.id, title: t.text }))} />}
          <article id="article-body" className="min-w-0">
            {post.coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.coverImage} alt="" className="mb-10 w-full rounded-[14px] border border-white/[0.07] sm:hidden" />
            )}
            <div className="blog-prose" dangerouslySetInnerHTML={{ __html: post.html }} />
          </article>
        </div>
      </Section>

      <Section divider={false}>
        <div className="px-6 py-14 sm:px-12">
          <p className="text-sm text-white/40">Read next</p>
          <div className="mt-4">
            {post.related.map((p) => (
              <Link
                key={p.slug}
                href={`${base}/${p.slug}`}
                className="group flex items-center justify-between gap-6 border-b border-dashed border-line py-5"
              >
                <span className="text-[20px] font-medium tracking-[-0.015em] text-white/75 group-hover:text-white">{p.title}</span>
                <span className="flex shrink-0 items-center gap-3 font-mono text-[12px] text-white/35">
                  {p.readingMinutes} min <ArrowUpRight className="h-4 w-4 group-hover:text-accent" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </Section>
    </>
  )
}
