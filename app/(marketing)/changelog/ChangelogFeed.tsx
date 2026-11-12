'use client'

import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Link2 } from 'lucide-react'
import ImageLightbox from '@/components/changelog/ImageLightbox'
import CustomVideoPlayer from '@/components/changelog/CustomVideoPlayer'
import { Section, cn } from '@/components/landing/primitives'
import type { ChangelogItem } from '@/lib/actions/changelog-actions'

const PAGE_SIZE = 10

/** Tag → pill colours. Muted tints so the orange accent stays reserved for Forke itself. */
const TAGS: Record<string, { label: string; dot: string; pill: string }> = {
  FEATURE: { label: 'Feature', dot: 'bg-accent', pill: 'border-accent/30 bg-accent/[0.08] text-accent-text' },
  UPDATE: { label: 'Update', dot: 'bg-sky-400', pill: 'border-sky-400/25 bg-sky-400/[0.07] text-sky-300' },
  IMPROVEMENT: { label: 'Improvement', dot: 'bg-emerald-400', pill: 'border-emerald-400/25 bg-emerald-400/[0.07] text-emerald-300' },
  FIX: { label: 'Fix', dot: 'bg-rose-400', pill: 'border-rose-400/25 bg-rose-400/[0.07] text-rose-300' },
  POLISH: { label: 'Polish', dot: 'bg-violet-400', pill: 'border-violet-400/25 bg-violet-400/[0.07] text-violet-300' },
}
const tagOf = (t: string) => TAGS[(t || 'FEATURE').toUpperCase()] ?? { label: t, dot: 'bg-white/50', pill: 'border-white/15 bg-white/[0.05] text-white/75' }

function parseDate(iso: string): Date | null {
  let str = String(iso).trim()
  if (/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}(\.\d+)?$/.test(str)) str = str.replace(' ', 'T') + 'Z'
  const d = new Date(str)
  return isNaN(d.getTime()) ? null : d
}

const longDate = (d: Date) => new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'long', year: 'numeric' }).format(d)

function TagPill({ tag }: { tag: string }) {
  const t = tagOf(tag)
  return (
    <span className={cn('inline-flex h-6 items-center gap-1.5 rounded-full border px-2.5 font-mono text-[10.5px] uppercase tracking-[0.1em]', t.pill)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', t.dot)} />
      {t.label}
    </span>
  )
}

function Entry({ item }: { item: ChangelogItem }) {
  const lists = [
    { title: 'Improvements', items: item.improvements },
    { title: 'Fixes', items: item.fixes },
  ].filter((l) => l.items.length > 0)

  return (
    <article id={item.slug} className="group/entry scroll-mt-24">
      <div className="flex flex-wrap items-center gap-3">
        <TagPill tag={item.tag} />
        <a
          href={`#${item.slug}`}
          aria-label="Link to this update"
          className="text-white/0 transition-colors group-hover/entry:text-white/35 hover:!text-white/80"
        >
          <Link2 className="h-3.5 w-3.5" />
        </a>
      </div>
      <h3 className="mt-3.5 text-[22px] font-medium leading-snug tracking-[-0.02em] text-ink">{item.title}</h3>
      <p className="mt-3 whitespace-pre-line text-[15.5px] leading-7 text-white/55">{item.description}</p>

      {item.mediaType === 'image' && item.mediaUrl && (
        <div className="mt-6">
          <ImageLightbox src={item.mediaUrl} alt={item.title} />
        </div>
      )}
      {item.mediaType === 'video' && item.mediaUrl && (
        <div className="mt-6">
          <CustomVideoPlayer src={item.mediaUrl} />
        </div>
      )}

      {lists.length > 0 && (
        <div className={cn('mt-6 grid gap-6 rounded-[14px] border border-line bg-white/[0.015] p-5', lists.length === 2 && 'sm:grid-cols-2 sm:gap-8')}>
          {lists.map((l) => (
            <div key={l.title}>
              <p className="text-sm text-white/40">{l.title}</p>
              <ul className="mt-3 space-y-2">
                {l.items.map((x, i) => (
                  <li key={i} className="flex gap-3 text-[14px] leading-6 text-white/65">
                    <span className="mt-[10px] h-1 w-1 shrink-0 rounded-full bg-white/30" />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </article>
  )
}

export default function ChangelogFeed({ items, initialPage = 1 }: { items: ChangelogItem[]; initialPage?: number }) {
  const [tag, setTag] = useState<string>('ALL')
  const [page, setPage] = useState(initialPage)

  const tags = useMemo(() => {
    const counts = new Map<string, number>()
    for (const i of items) counts.set(i.tag.toUpperCase(), (counts.get(i.tag.toUpperCase()) ?? 0) + 1)
    return Object.keys(TAGS).filter((t) => counts.has(t)).map((t) => ({ t, n: counts.get(t)! }))
  }, [items])

  const filtered = useMemo(() => (tag === 'ALL' ? items : items.filter((i) => i.tag.toUpperCase() === tag)), [items, tag])
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(Math.max(1, page), totalPages)

  // back/forward between ?page= states
  useEffect(() => {
    const onPop = () => setPage(Math.max(1, parseInt(new URL(window.location.href).searchParams.get('page') || '1', 10) || 1))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const groups = useMemo(() => {
    const map = new Map<string, { date: Date; items: ChangelogItem[] }>()
    for (const item of filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)) {
      const d = parseDate(item.publishedAt)
      if (!d) continue
      const key = d.toISOString().slice(0, 10)
      if (!map.has(key)) map.set(key, { date: d, items: [] })
      map.get(key)!.items.push(item)
    }
    return [...map.entries()].map(([key, g]) => ({ key, ...g }))
  }, [filtered, safePage])

  const go = (n: number) => {
    const target = Math.min(Math.max(1, n), totalPages)
    setPage(target)
    const url = new URL(window.location.href)
    if (target > 1) url.searchParams.set('page', String(target))
    else url.searchParams.delete('page')
    window.history.pushState({}, '', url.pathname + url.search)
    document.getElementById('feed')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const pickTag = (t: string) => {
    setTag(t)
    setPage(1)
  }

  return (
    <>
      {/* filter bar */}
      <Section>
        <div id="feed" className="flex scroll-mt-14 gap-2 overflow-x-auto px-6 py-4 no-scrollbar sm:px-12">
          {[{ t: 'ALL', n: items.length }, ...tags].map(({ t, n }) => (
            <button
              key={t}
              type="button"
              onClick={() => pickTag(t)}
              className={cn(
                'inline-flex h-8 shrink-0 items-center gap-2 rounded-full border px-3.5 text-[13px] transition-colors',
                tag === t ? 'border-white/20 bg-white/[0.08] text-white' : 'border-white/[0.08] text-white/50 hover:border-white/15 hover:text-white/80',
              )}
            >
              {t !== 'ALL' && <span className={cn('h-1.5 w-1.5 rounded-full', tagOf(t).dot)} />}
              {t === 'ALL' ? 'All updates' : tagOf(t).label}
              <span className="font-mono text-[11px] text-white/35">{n}</span>
            </button>
          ))}
        </div>
      </Section>

      {groups.map((g) => (
        <Section key={g.key}>
          <div className="grid gap-6 px-6 py-14 sm:px-12 sm:py-16 lg:grid-cols-[220px_1fr] lg:gap-16">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <p className="text-[15px] font-medium text-ink">{longDate(g.date)}</p>
              <p className="mt-1 font-mono text-[11.5px] text-white/35">
                {g.items.length} {g.items.length === 1 ? 'change' : 'changes'}
              </p>
            </div>
            <div className="min-w-0 max-w-[760px] space-y-14">
              {g.items.map((item, i) => (
                <div key={item.id} className={cn(i > 0 && 'border-t border-dashed border-line pt-14')}>
                  <Entry item={item} />
                </div>
              ))}
            </div>
          </div>
        </Section>
      ))}

      {totalPages > 1 && (
        <Section divider={false}>
          <div className="flex items-center justify-center gap-4 px-6 py-12">
            <button
              type="button"
              onClick={() => go(safePage - 1)}
              disabled={safePage === 1}
              aria-label="Newer updates"
              className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-white/10 text-white/50 transition-colors hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-mono text-[12.5px] text-white/70">
              {String(safePage).padStart(2, '0')} <span className="text-white/30">/ {String(totalPages).padStart(2, '0')}</span>
            </span>
            <button
              type="button"
              onClick={() => go(safePage + 1)}
              disabled={safePage === totalPages}
              aria-label="Older updates"
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
