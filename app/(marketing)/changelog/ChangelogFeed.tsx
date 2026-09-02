'use client'

import React, { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
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
        <span className="inline-flex items-center px-2 py-0.5 rounded border border-white/20 bg-white/10 text-white font-mono text-[10px] font-medium tracking-wider uppercase select-none">
          Feature
        </span>
      )
    }
    if (upper === 'UPDATE') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded border border-sky-400/25 text-sky-300/90 bg-sky-400/[0.07] font-mono text-[10px] font-medium tracking-wider uppercase select-none">
          Update
        </span>
      )
    }
    if (upper === 'IMPROVEMENT') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded border border-white/15 text-white/80 bg-white/[0.05] font-mono text-[10px] font-medium tracking-wider uppercase select-none">
          Improvement
        </span>
      )
    }
    if (upper === 'FIX') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded border border-white/15 text-white/70 bg-white/[0.04] font-mono text-[10px] font-medium tracking-wider uppercase select-none">
          Fix
        </span>
      )
    }
    if (upper === 'POLISH') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded border border-white/10 text-white/60 bg-white/[0.03] font-mono text-[10px] font-medium tracking-wider uppercase select-none">
          Polish
        </span>
      )
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded border border-white/15 text-white/80 bg-white/[0.05] font-mono text-[10px] font-medium tracking-wider uppercase select-none">
        {upper}
      </span>
    )
  }

  return (
    <div id="changelog-feed-top" className="relative scroll-mt-24">
      {/* ─────────────────────────────────────────────────────────────
          HERO HEADER: Everything we've actually shipped.
      ───────────────────────────────────────────────────────────── */}
      <div className="relative px-4 sm:px-8 lg:px-14 pt-6 sm:pt-14 pb-10 sm:pb-16 border-b border-white/[0.07]">
        <Crosses />
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.18em] uppercase text-white/40 font-semibold mb-4 sm:mb-6">
            <span>Changelog</span>
            <span className="h-px w-10 bg-white/20" />
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-[4.25rem] font-medium tracking-[-0.04em] leading-[1.08] text-white">
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

          <p className="mt-5 sm:mt-8 text-white/60 text-sm sm:text-lg font-light leading-relaxed max-w-2xl">
            Hand-curated, not auto-generated from commits &mdash; an auto-derived log fills up with
            dependency bumps and tells you nothing. One entry here is one user-visible shipping
            moment, often spanning several repos.
          </p>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          CHANGELOG STREAM (10 per page, grouped by date)
      ───────────────────────────────────────────────────────────── */}
      <div className="relative px-4 sm:px-8 lg:px-14 py-8 sm:py-16">
        <Crosses />

        <div className="divide-y divide-white/[0.07]">
          {dateGroups.map((group) => (
            <div
              key={group.dateKey}
              id={`date-group-${group.dateKey}`}
              className="py-10 sm:py-16 first:pt-2 sm:first:pt-4 last:pb-8"
            >
              {/* Mobile Date Header (Visible on small screens) */}
              <div className="lg:hidden mb-6 flex items-center justify-between pb-3.5 border-b border-white/[0.07]">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                  <h3 className="text-sm sm:text-base font-medium text-white tracking-tight select-text">
                    {group.displayDate}
                  </h3>
                </div>
                <span className="font-mono text-[10px] text-white/50 tracking-wider uppercase px-2 py-0.5 rounded border border-white/[0.08] bg-white/[0.02] select-none">
                  {group.items.length} {group.items.length === 1 ? 'change' : 'changes'}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] xl:grid-cols-[260px_1fr] gap-6 lg:gap-14 items-start">
                {/* Desktop Left Column: Sticky Date */}
                <div className="hidden lg:block lg:sticky lg:top-28 z-10 pt-1">
                  <h3 className="text-base sm:text-lg font-medium text-white tracking-tight select-text">
                    {group.displayDate}
                  </h3>
                  <span className="font-mono text-[11px] text-white/40 tracking-wider uppercase block mt-1 select-none">
                    {group.items.length} {group.items.length === 1 ? 'change' : 'changes'}
                  </span>
                </div>

                {/* Right Column: Change Items with Mobile Timeline Connector */}
                <div className="relative pl-3.5 sm:pl-5 lg:pl-0 border-l border-white/[0.07] lg:border-l-0 ml-1.5 sm:ml-2 lg:ml-0 space-y-10 sm:space-y-12 min-w-0">
                  {group.items.map((item, itemIdx) => {
                    const hasImprovements = Boolean(item.improvements && item.improvements.length > 0)
                    const hasFixes = Boolean(item.fixes && item.fixes.length > 0)

                    return (
                      <article
                        key={item.id}
                        id={item.slug}
                        className={`space-y-4 ${itemIdx > 0 ? 'pt-8 lg:pt-0 border-t border-white/[0.05] lg:border-t-0' : ''}`}
                      >
                        {/* Tag Pill + Title Row */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          <div className="shrink-0">{renderTagPill(item.tag)}</div>
                          <h4 className="text-base sm:text-lg lg:text-xl font-medium text-white tracking-[-0.02em] leading-snug select-text">
                            {item.title}
                          </h4>
                        </div>

                        {/* Main Narrative Description */}
                        <div className="text-white/70 text-[14.5px] sm:text-base leading-relaxed font-light whitespace-pre-line space-y-3 select-text">
                          {item.description}
                        </div>

                        {/* Optional Media (Image / Video) */}
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

                        {/* Architectural Sub-Panel for Improvements & Fixes */}
                        {(hasImprovements || hasFixes) && (
                          <div className="pt-2">
                            <div className="rounded-xl border border-white/[0.07] bg-white/[0.015] p-4 sm:p-5">
                              <div
                                className={`grid grid-cols-1 ${
                                  hasImprovements && hasFixes
                                    ? 'sm:grid-cols-2 gap-6 sm:gap-8'
                                    : 'gap-5'
                                }`}
                              >
                                {hasImprovements && (
                                  <div className="space-y-2.5">
                                    <h5 className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50 select-none">
                                      Improvements
                                    </h5>
                                    <ul className="space-y-2">
                                      {item.improvements.map((imp, i) => (
                                        <li
                                          key={i}
                                          className="text-[13.5px] sm:text-[14px] text-white/75 leading-relaxed font-light flex items-start select-text"
                                        >
                                          <span className="text-white/30 mr-2.5 font-mono text-xs select-none mt-0.5 leading-none shrink-0">
                                            –
                                          </span>
                                          <span>{imp}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {hasFixes && (
                                  <div className="space-y-2.5">
                                    <h5 className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50 select-none">
                                      Fixes
                                    </h5>
                                    <ul className="space-y-2">
                                      {item.fixes.map((fix, i) => (
                                        <li
                                          key={i}
                                          className="text-[13.5px] sm:text-[14px] text-white/75 leading-relaxed font-light flex items-start select-text"
                                        >
                                          <span className="text-white/30 mr-2.5 font-mono text-xs select-none mt-0.5 leading-none shrink-0">
                                            –
                                          </span>
                                          <span>{fix}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </article>
                    )
                  })}
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



