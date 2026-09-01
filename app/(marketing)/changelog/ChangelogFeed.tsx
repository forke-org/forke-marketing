'use client'

import React, { useState, useMemo } from 'react'
import { Sparkles, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react'
import ImageLightbox from '@/components/changelog/ImageLightbox'
import CustomVideoPlayer from '@/components/changelog/CustomVideoPlayer'
import { Crosses } from '@/components/landing/primitives'
import type { ChangelogItem } from '@/lib/actions/changelog-actions'

const PAGE_SIZE = 10

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

function formatDateLong(iso: string): string {
  try {
    const d = parseDate(iso)
    if (!d) return iso
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d)
  } catch {
    return iso
  }
}

function toDateKey(d: Date): string {
  return d.toISOString().split('T')[0]
}

interface DateGroup {
  dateKey: string
  displayDate: string
  items: ChangelogItem[]
}

export default function ChangelogFeed({ items }: { items: ChangelogItem[] }) {
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)

  // Slice exactly 10 changelogs for the current page
  const pageItems = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE
    return items.slice(start, start + PAGE_SIZE)
  }, [items, safePage])

  // Group current page items by date
  const dateGroups = useMemo(() => {
    const groupsMap = new Map<string, ChangelogItem[]>()

    pageItems.forEach((item) => {
      const d = parseDate(item.publishedAt)
      if (!d) return
      const key = toDateKey(d)
      if (!groupsMap.has(key)) groupsMap.set(key, [])
      groupsMap.get(key)!.push(item)
    })

    const groups: DateGroup[] = []
    groupsMap.forEach((dayItems, key) => {
      const firstDate = parseDate(dayItems[0].publishedAt)
      groups.push({
        dateKey: key,
        displayDate: firstDate ? formatDateLong(dayItems[0].publishedAt) : key,
        items: dayItems,
      })
    })

    return groups
  }, [pageItems])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    const topEl = document.getElementById('changelog-feed-top')
    if (topEl) {
      topEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const renderTagPill = (tag: string) => {
    const upper = (tag || 'FEATURE').toUpperCase()
    if (upper === 'FEATURE') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#ff4d24] text-white font-mono text-[10px] font-bold tracking-wider uppercase">
          Feature
        </span>
      )
    }
    if (upper === 'UPDATE') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded border border-blue-500/40 text-blue-400 bg-blue-500/10 font-mono text-[10px] font-bold tracking-wider uppercase">
          Update
        </span>
      )
    }
    if (upper === 'IMPROVEMENT') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded border border-emerald-500/40 text-emerald-400 bg-emerald-500/10 font-mono text-[10px] font-bold tracking-wider uppercase">
          Improvement
        </span>
      )
    }
    if (upper === 'FIX') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded border border-amber-500/40 text-amber-400 bg-amber-500/10 font-mono text-[10px] font-bold tracking-wider uppercase">
          Fix
        </span>
      )
    }
    if (upper === 'POLISH') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded border border-white/20 text-white/70 bg-white/5 font-mono text-[10px] font-bold tracking-wider uppercase">
          Polish
        </span>
      )
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded border border-accent/40 text-accent bg-accent/10 font-mono text-[10px] font-bold tracking-wider uppercase">
        {upper}
      </span>
    )
  }

  return (
    <div id="changelog-feed-top" className="relative scroll-mt-24">
      {/* ─────────────────────────────────────────────────────────────
          HERO HEADER: Everything we've actually shipped.
      ───────────────────────────────────────────────────────────── */}
      <div className="relative px-6 sm:px-10 lg:px-14 pt-10 sm:pt-14 pb-14 sm:pb-16 border-b border-white/[0.07]">
        <Crosses />
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.18em] uppercase text-white/40 font-semibold mb-6">
            <span>Changelog</span>
            <span className="h-px w-10 bg-white/20" />
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-[4.25rem] font-medium tracking-[-0.04em] leading-[1.05] text-white">
            Everything we&apos;ve{' '}
            <span className="relative inline-block text-white">
              actually shipped.
              <svg
                aria-hidden
                className="absolute left-0 -bottom-2 w-full text-accent h-2.5 sm:h-3 pointer-events-none"
                viewBox="0 0 260 12"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 9C40 3 100 2 160 7C200 10 235 6 258 4"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="mt-8 text-white/60 text-base sm:text-lg font-light leading-relaxed max-w-2xl">
            Hand-curated, not auto-generated from commits &mdash; an auto-derived log fills up with
            dependency bumps and tells you nothing. One entry here is one user-visible shipping
            moment, often spanning several repos.
          </p>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          CHANGELOG STREAM (10 per page, grouped by date)
      ───────────────────────────────────────────────────────────── */}
      <div className="relative px-6 sm:px-10 lg:px-14 py-12 sm:py-16">
        <Crosses />

        <div className="divide-y divide-white/[0.07]">
          {dateGroups.map((group) => (
            <div
              key={group.dateKey}
              id={`date-group-${group.dateKey}`}
              className="py-12 sm:py-16 first:pt-4 last:pb-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] xl:grid-cols-[260px_1fr] gap-8 lg:gap-14 items-start">
                {/* Left Column: Sticky Date */}
                <div className="lg:sticky lg:top-28 z-10 pt-1">
                  <h3 className="text-base sm:text-lg font-medium text-white tracking-tight select-text">
                    {group.displayDate}
                  </h3>
                  <span className="font-mono text-[11px] text-white/40 tracking-wider uppercase block mt-1 select-none">
                    {group.items.length} {group.items.length === 1 ? 'change' : 'changes'}
                  </span>
                </div>

                {/* Right Column: Change Items */}
                <div className="space-y-12 min-w-0">
                  {group.items.map((item) => (
                    <article key={item.id} id={item.slug} className="space-y-4">
                      {/* Tag Pill + Non-clickable Title Row */}
                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-2.5 sm:gap-3.5">
                        <div className="shrink-0">{renderTagPill(item.tag)}</div>
                        <h4 className="text-lg sm:text-xl font-medium text-white tracking-[-0.02em] leading-snug select-text">
                          {item.title}
                        </h4>
                      </div>

                      {/* Main Narrative Description */}
                      <div className="text-white/70 text-[15px] sm:text-base leading-relaxed font-light whitespace-pre-line space-y-3 pl-0 sm:pl-1 select-text">
                        {item.description}
                      </div>

                      {/* Optional Media (Image / Video) */}
                      {item.mediaType === 'image' && item.mediaUrl && (
                        <div className="pt-2 sm:pl-1">
                          <ImageLightbox src={item.mediaUrl} alt={item.title} />
                        </div>
                      )}

                      {item.mediaType === 'video' && item.mediaUrl && (
                        <div className="pt-2 sm:pl-1">
                          <CustomVideoPlayer src={item.mediaUrl} />
                        </div>
                      )}

                      {/* Optional Improvements */}
                      {item.improvements && item.improvements.length > 0 && (
                        <div className="pt-2 sm:pl-1 space-y-2.5">
                          <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent flex items-center gap-1.5 select-none">
                            <Sparkles className="h-3.5 w-3.5 text-accent" />
                            <span>Improvements</span>
                          </div>
                          <ul className="space-y-2 pl-1">
                            {item.improvements.map((imp, i) => (
                              <li
                                key={i}
                                className="text-sm sm:text-[14.5px] text-white/80 leading-relaxed flex items-start gap-2.5 select-text"
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-accent mt-2 shrink-0" />
                                <span>{imp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Optional Fixes */}
                      {item.fixes && item.fixes.length > 0 && (
                        <div className="pt-2 sm:pl-1 space-y-2.5">
                          <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-400 flex items-center gap-1.5 select-none">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                            <span>Fixes</span>
                          </div>
                          <ul className="space-y-2 pl-1">
                            {item.fixes.map((fix, i) => (
                              <li
                                key={i}
                                className="text-sm sm:text-[14.5px] text-white/70 leading-relaxed flex items-start gap-2.5 select-text"
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                                <span>{fix}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Blog-Style Pagination ─────────────────────────────────── */}
        {totalPages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-4 border-t border-white/[0.07] pt-12">
            <button
              onClick={() => handlePageChange(Math.max(1, safePage - 1))}
              disabled={safePage === 1}
              aria-label="Previous page"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-white/40 transition-colors hover:border-white/20 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-mono text-xs text-white/70 select-none">
              {String(safePage).padStart(2, '0')}{' '}
              <span className="text-white/25">/ {String(totalPages).padStart(2, '0')}</span>
            </span>
            <button
              onClick={() => handlePageChange(Math.min(totalPages, safePage + 1))}
              disabled={safePage === totalPages}
              aria-label="Next page"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-white/40 transition-colors hover:border-white/20 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}



