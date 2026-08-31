/**
 * @fileoverview Forke Platform
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import ImageLightbox from '@/components/changelog/ImageLightbox'
import CustomVideoPlayer from '@/components/changelog/CustomVideoPlayer'
import { getChangelogBySlug, getPublishedChangelogSlugs } from '@/lib/actions/changelog-actions'
import { buildOpenGraph, buildTwitter } from '@/lib/utils/og'

interface PageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await getPublishedChangelogSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const item = await getChangelogBySlug(slug)
  if (!item) return { title: 'Changelog Not Found' }

  const desc = item.description.slice(0, 160)
  return {
    title: `${item.title} — Changelog`,
    description: desc,
    alternates: { canonical: `/changelog/${item.slug}` },
    openGraph: buildOpenGraph({
      title: `${item.title} | Forke Changelog`,
      description: desc,
      url: `https://www.forke.space/changelog/${item.slug}`,
    }),
    twitter: buildTwitter({
      title: `${item.title} | Forke Changelog`,
      description: desc,
    }),
  }
}

function parseDate(iso: string | Date | null | undefined): Date | null {
  if (!iso) return null
  if (iso instanceof Date) return isNaN(iso.getTime()) ? null : iso
  let str = String(iso).trim()
  if (/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}(\.\d+)?$/.test(str)) {
    str = str.replace(' ', 'T') + 'Z'
  }
  const d = new Date(str)
  return isNaN(d.getTime()) ? null : d
}

function formatDate(iso: string): string {
  try {
    const d = parseDate(iso)
    if (!d) return iso
    return new Intl.DateTimeFormat(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(d)
  } catch {
    return iso
  }
}

export default async function SingleChangelogPage({ params }: PageProps) {
  const { slug } = await params
  const item = await getChangelogBySlug(slug)

  if (!item) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#060608] text-white flex flex-col antialiased">
      <Navbar />

      <main className="flex-grow w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40 pb-24">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/changelog"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-white/50 hover:text-white transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Changelogs</span>
          </Link>
        </div>

        <article className="space-y-8">
          {/* Metadata Header: Tag & Date */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded border border-white/15 bg-white/[0.04] text-[11px] font-mono font-bold tracking-widest text-white/70 uppercase">
              {item.tag || 'CORE'}
            </span>
            <time className="text-xs font-mono text-white/40 tracking-wider">
              {formatDate(item.publishedAt)}
            </time>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.15]">
            {item.title}
          </h1>

          {/* Description */}
          <div className="text-white/75 text-base md:text-lg leading-relaxed font-light whitespace-pre-line space-y-4 pt-2">
            {item.description}
          </div>

          {/* Optional Media */}
          {item.mediaType === 'image' && item.mediaUrl && (
            <div className="pt-4">
              <ImageLightbox src={item.mediaUrl} alt={item.title} />
            </div>
          )}

          {item.mediaType === 'video' && item.mediaUrl && (
            <div className="pt-4">
              <CustomVideoPlayer src={item.mediaUrl} />
            </div>
          )}

          {/* Improvements */}
          {item.improvements && item.improvements.length > 0 && (
            <div className="pt-6 space-y-3">
              <h2 className="text-base font-mono font-bold tracking-wider text-white uppercase flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#ff8a00]" />
                <span>Improvements</span>
              </h2>
              <ul className="space-y-2.5 pl-2">
                {item.improvements.map((imp, i) => (
                  <li key={i} className="text-sm md:text-base text-white/70 leading-relaxed flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff8a00] mt-2.5 shrink-0 opacity-80" />
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Fixes */}
          {item.fixes && item.fixes.length > 0 && (
            <div className="pt-6 space-y-3">
              <h2 className="text-base font-mono font-bold tracking-wider text-white uppercase flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Fixes</span>
              </h2>
              <ul className="space-y-2.5 pl-2">
                {item.fixes.map((fix, i) => (
                  <li key={i} className="text-sm md:text-base text-white/70 leading-relaxed flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2.5 shrink-0 opacity-80" />
                    <span>{fix}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </article>
      </main>

      <Footer />
    </div>
  )
}
