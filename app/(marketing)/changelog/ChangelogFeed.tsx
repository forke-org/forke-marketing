'use client'

import React from 'react'
import Link from 'next/link'
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react'
import ImageLightbox from '@/components/changelog/ImageLightbox'
import CustomVideoPlayer from '@/components/changelog/CustomVideoPlayer'
import type { ChangelogItem } from '@/lib/actions/changelog-actions'

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

export default function ChangelogFeed({ items }: { items: ChangelogItem[] }) {
  if (!items || items.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-white/40 font-mono text-sm">No changelog entries published yet.</p>
      </div>
    )
  }

  return (
    <div className="relative space-y-24 md:space-y-32">
      {items.map((item, idx) => (
        <article key={item.id} id={item.slug} className="group relative">
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr] gap-8 md:gap-14 items-start">
            
            {/* Left Column: Sticky Tag + Date */}
            <div className="md:sticky md:top-36 flex flex-row md:flex-col items-start gap-2.5 md:gap-2 pt-1.5 select-none">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded border border-white/15 bg-white/[0.04] text-[11px] font-mono font-bold tracking-widest text-white/70 uppercase">
                {item.tag || 'CORE'}
              </span>
              <time className="text-xs font-mono text-white/40 tracking-wider">
                {formatDate(item.publishedAt)}
              </time>
            </div>

            {/* Right Column: Content Body */}
            <div className="space-y-6 min-w-0">
              {/* Title */}
              <h2 className="text-2xl sm:text-3xl md:text-[34px] font-bold text-white tracking-[-0.02em] leading-tight group-hover:text-[#ff8a00] transition-colors">
                <Link href={`/changelog/${item.slug}`} className="hover:underline underline-offset-4">
                  {item.title}
                </Link>
              </h2>

              {/* Main Narrative Description */}
              <div className="text-white/70 text-base md:text-[17px] leading-relaxed font-light whitespace-pre-line space-y-4">
                {item.description}
              </div>

              {/* Optional Media Container */}
              {item.mediaType === 'image' && item.mediaUrl && (
                <div className="pt-2">
                  <ImageLightbox src={item.mediaUrl} alt={item.title} />
                </div>
              )}

              {item.mediaType === 'video' && item.mediaUrl && (
                <div className="pt-2">
                  <CustomVideoPlayer src={item.mediaUrl} />
                </div>
              )}

              {/* Optional Improvements Section */}
              {item.improvements && item.improvements.length > 0 && (
                <div className="pt-4 space-y-3">
                  <h3 className="text-sm font-mono font-bold tracking-wider text-white uppercase flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#ff8a00]" />
                    <span>Improvements</span>
                  </h3>
                  <ul className="space-y-2 pl-2">
                    {item.improvements.map((imp, i) => (
                      <li key={i} className="text-sm md:text-[15px] text-white/65 leading-relaxed flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff8a00] mt-2 shrink-0 opacity-80" />
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Optional Fixes Section */}
              {item.fixes && item.fixes.length > 0 && (
                <div className="pt-4 space-y-3">
                  <h3 className="text-sm font-mono font-bold tracking-wider text-white uppercase flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Fixes</span>
                  </h3>
                  <ul className="space-y-2 pl-2">
                    {item.fixes.map((fix, i) => (
                      <li key={i} className="text-sm md:text-[15px] text-white/65 leading-relaxed flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0 opacity-80" />
                        <span>{fix}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Read More / Direct Post Link */}
              <div className="pt-2">
                <Link
                  href={`/changelog/${item.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-white/40 hover:text-white transition-colors"
                >
                  <span>Permalink</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

          </div>

          {/* Subtle separator line between posts */}
          {idx < items.length - 1 && (
            <div className="h-px bg-white/[0.06] mt-20 md:mt-28" />
          )}
        </article>
      ))}
    </div>
  )
}
