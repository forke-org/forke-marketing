/**
 * @fileoverview Forke Platform
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

// TEMPORARY: profile page redesign ideas. Not for commit.
'use client'

import { useId, useState, type ComponentType, type ReactNode } from 'react'
import Link from 'next/link'
import { RiGithubFill, RiLinkedinFill } from '@remixicon/react'
import { BadgeCheck, Calendar, Flame, GitMerge, GraduationCap, Lock, MapPin, Pin, Search, Share2, Star, Trophy } from 'lucide-react'
import { Painting, Section, cn } from '@/components/landing/primitives'
import { ACHIEVEMENTS, ACHIEVEMENT_TRACK, DEMO, REVIEWS, WORK, inr, type Work } from './demo'
import Heatmap from './Heatmap'
import CardStage from './CardStage'
import { BlueprintFront, HoloFront, PassFront } from './Cards'

const mono = 'font-mono'

/* ───────────────────────────── shared bits ───────────────────────────── */

/** Static stand-in for the 3D lanyard: strap, clip and the card front, slightly swung. */
export function HangingCard({ Front = PassFront, scale = 0.66, swing = -4 }: { Front?: ComponentType; scale?: number; swing?: number }) {
  const w = 380 * scale
  const h = 536 * scale
  const pid = `strap${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <div className="relative mx-auto" style={{ width: w + 40, height: h + 150 }}>
      <svg className="absolute left-1/2 top-0 -translate-x-1/2" width="120" height="140" viewBox="0 0 120 140" aria-hidden>
        <defs>
          <pattern id={pid} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="10" height="10" fill="#1d1715" />
            <rect width="4" height="10" fill="#FF7A00" opacity="0.85" />
          </pattern>
        </defs>
        <path d="M14 0 L52 118 L68 118 L30 0 Z" fill={`url(#${pid})`} />
        <path d="M106 0 L68 118 L52 118 L90 0 Z" fill={`url(#${pid})`} opacity="0.9" />
        <rect x="46" y="112" width="28" height="18" rx="4" fill="#bdb6b2" />
        <rect x="55" y="126" width="10" height="16" rx="3" fill="#8f8884" />
      </svg>
      <div className="absolute left-1/2 top-[132px] origin-top" style={{ width: w, height: h, transform: `translateX(-50%) rotate(${swing}deg)` }}>
        <div className="origin-top-left" style={{ transform: `scale(${scale})` }}>
          <Front />
        </div>
      </div>
      <p className="absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[11px] text-white/30">drag it · tap to flip</p>
    </div>
  )
}

function Buttons({ className = '' }: { className?: string }) {
  return (
    <div className={cn('flex flex-wrap gap-2.5', className)}>
      <button className="inline-flex h-10 items-center gap-2 rounded-full border border-accent bg-accent px-4 text-[14px] font-medium text-[#1a0a00]">
        Invite to a task
      </button>
      <button className="inline-flex h-10 items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 text-[14px] text-white/85">
        <Share2 className="h-4 w-4" /> Share
      </button>
      {[RiGithubFill, RiLinkedinFill].map((I, i) => (
        <span key={i} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/75">
          <I className="h-[18px] w-[18px]" />
        </span>
      ))}
    </div>
  )
}

function Stars({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-[13px] text-white/80">
      <Star className="h-3.5 w-3.5 fill-[#FFA347] text-[#FFA347]" /> {n.toFixed(1)}
    </span>
  )
}

function Diff({ add, del }: { add: number; del: number }) {
  const total = add + del
  const blocks = 5
  const a = Math.round((add / total) * blocks)
  return (
    <span className={`${mono} inline-flex items-center gap-1.5 text-[12px]`}>
      <span className="text-emerald-400">+{add}</span>
      <span className="text-rose-400">−{del}</span>
      <span className="flex gap-[2px]">
        {Array.from({ length: blocks }, (_, i) => (
          <span key={i} className={cn('h-2 w-2 rounded-[1px]', i < a ? 'bg-emerald-400/80' : 'bg-rose-400/80')} />
        ))}
      </span>
    </span>
  )
}

function Tag({ children }: { children: ReactNode }) {
  return <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[11.5px] text-white/60">{children}</span>
}

function H2({ title, muted, right }: { title: string; muted?: string; right?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <h2 className="text-[30px] font-medium leading-[1.08] tracking-[-0.03em] sm:text-[38px]">
        <span className="text-ink">{title}</span> {muted && <span className="text-white/40">{muted}</span>}
      </h2>
      {right}
    </div>
  )
}

function ProofOfWork() {
  return (
    <div>
      <div className={`${mono} mb-5 grid grid-cols-3 gap-4 text-[12px] sm:max-w-[560px]`}>
        {[
          ['Contributions', '847'],
          ['Current streak', `${DEMO.streak} days`],
          ['Longest streak', `${DEMO.longest} days`],
        ].map(([k, v]) => (
          <div key={k}>
            <p className="text-white/35">{k}</p>
            <p className="mt-1 text-[15px] text-white/90">{v}</p>
          </div>
        ))}
      </div>
      <Heatmap />
    </div>
  )
}

function MergedRow({ w }: { w: Work }) {
  return (
    <div className="group grid gap-4 border-b border-dashed border-line py-5 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
      <span className="hidden h-9 w-9 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-accent sm:flex">
        <GitMerge className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className={`${mono} text-[12px] text-white/40`}>
          {w.repo} <span className="text-white/25">#{w.pr}</span> · merged {w.date}
        </p>
        <p className="mt-1 text-[17px] font-medium tracking-[-0.01em] text-white/90">{w.title}</p>
        <p className="mt-1.5 text-[13.5px] italic text-white/45">&ldquo;{w.note}&rdquo; <span className="not-italic text-white/30">· @{w.reviewer}</span></p>
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          {w.tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
          <Diff add={w.add} del={w.del} />
        </div>
      </div>
      <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-1.5">
        <span className="text-[20px] font-medium tracking-[-0.02em] text-white">{inr(w.bounty)}</span>
        <Stars n={w.rating} />
      </div>
    </div>
  )
}

function Achievements({ cols = 'sm:grid-cols-4' }: { cols?: string }) {
  return (
    <div className={cn('grid grid-cols-2 gap-3', cols)}>
      {ACHIEVEMENTS.map((a) => (
        <div
          key={a.label}
          className={cn(
            'flex items-center gap-3 rounded-2xl border p-3.5',
            a.unlocked ? 'border-white/[0.08] bg-white/[0.03]' : 'border-dashed border-white/10 opacity-50',
          )}
        >
          <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', a.unlocked ? 'bg-accent/15 text-accent' : 'bg-white/5 text-white/40')}>
            {a.unlocked ? <Trophy className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
          </span>
          <div className="min-w-0">
            <p className="text-[14px] text-white/90">{a.label}</p>
            <p className="truncate text-[12px] text-white/40">{a.desc}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─────────────────────────── A · Dossier ─────────────────────────── */

export function ProfileDossier() {
  const pct = Math.round((DEMO.xp / DEMO.nextXp) * 100)
  return (
    <>
      <Section>
        <div className="grid items-center gap-10 px-6 py-14 sm:px-12 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-14 lg:py-16">
          <HangingCard />
          <div>
            <p className={`${mono} text-[12px] uppercase tracking-[0.16em] text-accent-text`}>
              @{DEMO.username} · Level {DEMO.level} {DEMO.levelTitle}
            </p>
            <h1 className="mt-5 text-[44px] font-medium leading-[1.02] tracking-[-0.045em] sm:text-[56px]">
              <span className="block text-white">Riya Sharma.</span>
              <span className="block text-white/40">Fixes the queries nobody touches.</span>
            </h1>
            <p className="mt-6 max-w-[560px] text-[16.5px] leading-7 text-white/60">{DEMO.bio}</p>
            <div className={`${mono} mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[12.5px] text-white/45`}>
              <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {DEMO.location}</span>
              <span className="flex items-center gap-1.5"><GraduationCap className="h-3.5 w-3.5" /> {DEMO.college}</span>
              <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Joined {DEMO.joined}</span>
            </div>
            <Buttons className="mt-7" />
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {[
            ['Shipped', String(DEMO.shipped), 'bounties merged'],
            ['Earned', inr(DEMO.earned), 'paid out via UPI'],
            ['Rating', `${DEMO.rating}`, 'from 18 owners'],
            ['On time', `${DEMO.completion}%`, 'completion rate'],
          ].map(([k, v, s], i) => (
            <div key={k} className={cn('px-6 py-8 sm:px-12', i > 0 && 'border-l border-line', i > 1 && 'border-t border-line lg:border-t-0', i === 2 && 'border-l-0 lg:border-l')}>
              <p className={`${mono} text-[12px] text-white/35`}>{k}</p>
              <p className="mt-2 text-[40px] font-medium leading-none tracking-[-0.04em] text-white">{v}</p>
              <p className="mt-2 text-[13px] text-white/40">{s}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-line px-6 py-5 sm:px-12">
          <div className={`${mono} flex justify-between text-[12px] text-white/45`}>
            <span>Level {DEMO.level} · {DEMO.levelTitle}</span>
            <span>{DEMO.xp.toLocaleString('en-IN')} / {DEMO.nextXp.toLocaleString('en-IN')} XP · {DEMO.nextXp - DEMO.xp} to level {DEMO.level + 1}</span>
          </div>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
            <div className="h-full rounded-full bg-[linear-gradient(90deg,#a03a02,#FF7A00,#FFA347)]" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </Section>

      <Section>
        <div className="px-6 py-14 sm:px-12">
          <H2 title="Proof of work." muted="Every square is real, reviewed work." />
          <div className="mt-8">
            <ProofOfWork />
          </div>
        </div>
      </Section>

      <Section>
        <div className="px-6 py-14 sm:px-12">
          <H2 title="Shipped work." muted="Merged, reviewed, paid." right={<span className={`${mono} text-[12px] text-white/40`}>{DEMO.shipped} total · showing 6</span>} />
          <div className="mt-6">
            {WORK.map((w) => (
              <MergedRow key={w.id} w={w} />
            ))}
          </div>
        </div>
      </Section>

      <Section divider={false}>
        <div className="px-6 py-14 sm:px-12">
          <H2 title="Achievements." muted="6 of 8 unlocked." />
          <div className="mt-8">
            <Achievements />
          </div>
        </div>
      </Section>
    </>
  )
}

/* ─────────────────────────── B · README ─────────────────────────── */

const xpOf = (w: Work) => Math.round(w.bounty / 50)

function Meta() {
  return (
    <>
      <li className="flex shrink-0 items-center gap-2"><MapPin className="h-3.5 w-3.5" /> {DEMO.location}</li>
      <li className="flex shrink-0 items-center gap-2"><GraduationCap className="h-3.5 w-3.5" /> {DEMO.college}</li>
      <li className="flex shrink-0 items-center gap-2"><Calendar className="h-3.5 w-3.5" /> Joined {DEMO.joined}</li>
      <li className="flex shrink-0 items-center gap-2"><RiGithubFill className="h-3.5 w-3.5" /> {DEMO.github}</li>
    </>
  )
}

export type ProfileTab = 'overview' | 'shipped' | 'reviews' | 'achievements'
const TABS: { key: ProfileTab; label: string; count: number | null }[] = [
  { key: 'overview', label: 'Overview', count: null },
  { key: 'shipped', label: 'Shipped', count: DEMO.shipped },
  { key: 'reviews', label: 'Reviews', count: REVIEWS.length },
  { key: 'achievements', label: 'Achievements', count: ACHIEVEMENT_TRACK.filter((a) => a.have >= a.need).length },
]

export function ProfileReadme({ tab = 'overview', base = '' }: { tab?: ProfileTab; base?: string }) {
  return (
    <Section divider={false}>
      <div className="grid gap-8 px-5 py-8 sm:px-12 sm:py-12 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-12">
        {/* sidebar (stacks on top on phones) */}
        <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <CardStage editable={false} />
          <div className="text-center lg:text-left">
            <h1 className="mt-4 text-[32px] font-medium leading-tight tracking-[-0.03em] text-white lg:text-[30px]">{DEMO.name}</h1>
            <p className={`${mono} text-[14px] text-white/45`}>@{DEMO.username} · Level {DEMO.level} {DEMO.levelTitle}</p>
            <p className="mx-auto mt-3 max-w-[340px] text-[15px] leading-6 text-white/70 lg:mx-0">{DEMO.headline}</p>
          </div>
          {/* phone: two equal buttons, then icon row. laptop: the usual row */}
          <div className="mt-5 grid grid-cols-2 gap-2.5 lg:hidden">
            <button className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-accent bg-accent px-4 text-[14px] font-medium text-[#1a0a00]">
              Invite to a task
            </button>
            <button className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 text-[14px] text-white/85">
              <Share2 className="h-4 w-4" /> Share
            </button>
          </div>
          <Buttons className="mt-5 hidden lg:flex" />

          {/* phone: three quick numbers */}
          <div className="mt-5 grid grid-cols-3 rounded-2xl border border-white/[0.08] lg:hidden">
            {[
              ['Shipped', String(DEMO.shipped)],
              ['Rating', String(DEMO.rating)],
              ['Streak', `${DEMO.streak}d`],
            ].map(([k, v], i) => (
              <div key={k} className={cn('py-3.5 text-center', i > 0 && 'border-l border-white/[0.08]')}>
                <p className="text-[22px] font-medium leading-none tracking-[-0.03em] text-white">{v}</p>
                <p className={`${mono} mt-1.5 text-[10.5px] uppercase tracking-[0.12em] text-white/35`}>{k}</p>
              </div>
            ))}
          </div>

          {/* phone: one swipeable line of details. laptop: a list */}
          <ul className={`${mono} -mx-5 mt-5 flex gap-5 overflow-x-auto px-5 text-[12.5px] text-white/50 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:mt-6 lg:block lg:space-y-2 lg:overflow-visible lg:px-0`}>
            <Meta />
          </ul>
          <div className="mt-6 hidden border-t border-line pt-5 lg:block">
            <p className="text-[13px] text-white/40">Stack</p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {DEMO.stack.map((s) => (
                <Tag key={s}>{s}</Tag>
              ))}
            </div>
          </div>
        </aside>

        {/* main */}
        <div className="min-w-0">
          <nav className="sticky top-14 z-20 -mx-5 flex gap-6 overflow-x-auto border-b border-line bg-[#151414]/90 px-5 pt-3 text-[14px] backdrop-blur-md [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:static lg:mx-0 lg:bg-transparent lg:px-0 lg:pt-0 lg:backdrop-blur-none">
            {TABS.map((t) => (
              <Link
                key={t.key}
                href={t.key === 'overview' ? base || '?' : `${base}?tab=${t.key}`}
                scroll={false}
                aria-current={tab === t.key ? 'page' : undefined}
                className={cn('-mb-px flex items-center gap-2 whitespace-nowrap border-b-2 pb-3 transition-colors', tab === t.key ? 'border-accent text-white' : 'border-transparent text-white/45 hover:text-white/80')}
              >
                {t.label}
                {t.count !== null && <span className={`${mono} rounded-full bg-white/[0.06] px-1.5 text-[11px] text-white/60`}>{t.count}</span>}
              </Link>
            ))}
          </nav>

          {tab === 'overview' && (
            <>
          {/* README */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-white/[0.08]">
            <div className={`${mono} flex items-center justify-between gap-3 border-b border-white/[0.08] bg-white/[0.02] px-4 py-3 text-[12px] text-white/50 sm:px-5 sm:text-[12.5px]`}>
              <span className="truncate">{DEMO.username} / README.md</span>
              <span className="flex shrink-0 items-center gap-1.5 text-accent-text"><BadgeCheck className="h-3.5 w-3.5" /> verified</span>
            </div>
            <div className="space-y-4 px-4 py-5 text-[15px] leading-7 text-white/65 sm:px-6 sm:py-6 sm:text-[15.5px]">
              <p className="text-[22px] font-medium tracking-[-0.02em] text-white">Hi, I&rsquo;m Riya.</p>
              <p>{DEMO.bio}</p>
              <div className="flex flex-wrap gap-1.5 lg:hidden">
                {DEMO.stack.map((s) => (
                  <Tag key={s}>{s}</Tag>
                ))}
              </div>
            </div>
          </div>

          {/* pinned: swipe on phones, grid on larger screens */}
          <div className="mt-10 flex items-center justify-between">
            <p className="text-[15px] text-white/70">Pinned work</p>
            <span className={`${mono} text-[12px] text-white/35 sm:hidden`}>swipe →</span>
          </div>
          <div className="-mx-5 mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0">
            {WORK.slice(0, 4).map((w) => (
              <div key={w.id} className="flex w-[78%] shrink-0 snap-start flex-col rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 sm:w-auto">
                <p className={`${mono} flex items-center gap-1.5 text-[12.5px] text-accent-text`}>
                  <Pin className="h-3.5 w-3.5" /> {w.repo}
                </p>
                <p className="mt-2 text-[15px] leading-snug text-white/85">{w.title}</p>
                <div className="mt-auto flex items-center gap-4 pt-4 text-[12.5px] text-white/50">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#FF7A00]" /> {w.tags[0]}
                  </span>
                  <Stars n={w.rating} />
                  <span className={`${mono} ml-auto text-accent-text`}>+{xpOf(w)} XP</span>
                </div>
              </div>
            ))}
          </div>

          {/* contributions: full year on laptops; on phones it opens at this week and scrolls back */}
          <div className="mt-10">
            <p className="text-[15px] text-white/70">847 contributions in the last year</p>
            <div className="mt-3 rounded-2xl border border-white/[0.08] p-4 sm:p-5">
              <div className="overflow-x-auto [direction:rtl] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="min-w-[640px] [direction:ltr]">
                  <Heatmap />
                </div>
              </div>
            </div>
          </div>

          {/* merge log */}
          <div className="mt-10">
            <p className="text-[15px] text-white/70">Merge log</p>
            <ol className="relative mt-4 space-y-6 border-l border-line pl-6">
              {WORK.map((w) => (
                <li key={w.id} className="relative">
                  <span className="absolute -left-[31px] top-1 flex h-[13px] w-[13px] items-center justify-center rounded-full border-2 border-[#151414] bg-accent" />
                  <p className={`${mono} text-[12px] text-white/35`}>{w.date} · merged {w.repo}#{w.pr}</p>
                  <p className="mt-1 text-[15.5px] text-white/85">{w.title}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-3 text-[13px]">
                    <span className={`${mono} text-accent-text`}>+{xpOf(w)} XP</span>
                    <Stars n={w.rating} />
                    <Diff add={w.add} del={w.del} />
                  </p>
                </li>
              ))}
            </ol>
          </div>
            </>
          )}
          {tab === 'shipped' && <ShippedTab />}
          {tab === 'reviews' && <ReviewsTab />}
          {tab === 'achievements' && <AchievementsTab />}
        </div>
      </div>
    </Section>
  )
}

/* ── Shipped: every merged task, searchable and filterable ── */
function ShippedTab() {
  const [q, setQ] = useState('')
  const [tag, setTag] = useState('All')
  const [sort, setSort] = useState<'recent' | 'xp' | 'rating'>('recent')
  const tags = ['All', ...Array.from(new Set(WORK.flatMap((w) => w.tags)))]
  const list = WORK.filter((w) => (tag === 'All' || w.tags.includes(tag)) && `${w.title} ${w.repo}`.toLowerCase().includes(q.toLowerCase())).sort((x, y) =>
    sort === 'xp' ? xpOf(y) - xpOf(x) : sort === 'rating' ? y.rating - x.rating : 0,
  )
  return (
    <div className="mt-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="flex h-10 flex-1 items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-4 text-[14px] text-white/80 focus-within:border-white/30">
          <Search className="h-4 w-4 text-white/40" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search shipped work" className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-white/35" />
        </label>
        <div className="flex gap-1.5">
          {(['recent', 'xp', 'rating'] as const).map((k) => (
            <button key={k} type="button" onClick={() => setSort(k)} className={cn('inline-flex h-10 items-center rounded-full border px-3.5 text-[13px] capitalize transition-colors', sort === k ? 'border-accent bg-accent/15 text-white' : 'border-white/12 text-white/55 hover:text-white')}>
              {k === 'xp' ? 'Most XP' : k === 'rating' ? 'Top rated' : 'Recent'}
            </button>
          ))}
        </div>
      </div>
      <div className="-mx-5 mt-3 flex gap-1.5 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:flex-wrap sm:px-0">
        {tags.map((t) => (
          <button key={t} type="button" onClick={() => setTag(t)} className={cn('shrink-0 rounded-full border px-3 py-1 text-[12.5px] transition-colors', tag === t ? 'border-white/40 bg-white/10 text-white' : 'border-white/10 text-white/50 hover:text-white')}>
            {t}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {list.length === 0 ? (
          <p className="py-16 text-center text-[14px] text-white/40">Nothing matches that yet.</p>
        ) : (
          list.map((w) => <ShippedRow key={w.id} w={w} />)
        )}
      </div>
      <p className={`${mono} mt-4 text-center text-[12px] text-white/30`}>Showing {list.length} of {DEMO.shipped}</p>
    </div>
  )
}

function ShippedRow({ w }: { w: Work }) {
  return (
    <div className="grid gap-3 border-b border-dashed border-line py-5 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:gap-4">
      <span className="hidden h-9 w-9 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-accent sm:flex">
        <GitMerge className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className={`${mono} text-[12px] text-white/40`}>
          {w.repo} <span className="text-white/25">#{w.pr}</span> · merged {w.date}
        </p>
        <p className="mt-1 text-[16px] font-medium tracking-[-0.01em] text-white/90">{w.title}</p>
        <p className="mt-1.5 text-[13.5px] italic text-white/45">&ldquo;{w.note}&rdquo; <span className="not-italic text-white/30">· @{w.reviewer}</span></p>
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          {w.tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
          <Diff add={w.add} del={w.del} />
        </div>
      </div>
      <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-1.5">
        <span className={`${mono} text-[15px] text-accent-text`}>+{xpOf(w)} XP</span>
        <Stars n={w.rating} />
      </div>
    </div>
  )
}

/* ── Reviews: what repo owners said ── */
function ReviewsTab() {
  const [min, setMin] = useState(0)
  const avg = REVIEWS.reduce((a, r) => a + r.rating, 0) / REVIEWS.length
  const bands = [5, 4, 3, 2, 1].map((s) => ({ s, n: REVIEWS.filter((r) => Math.round(r.rating) === s).length }))
  const list = REVIEWS.filter((r) => r.rating >= min)
  return (
    <div className="mt-6">
      <div className="grid gap-6 rounded-2xl border border-white/[0.08] p-5 sm:grid-cols-[180px_minmax(0,1fr)] sm:p-6">
        <div>
          <p className="text-[48px] font-medium leading-none tracking-[-0.04em] text-white">{avg.toFixed(1)}</p>
          <p className="mt-2 flex gap-0.5">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} className={cn('h-4 w-4', i < Math.round(avg) ? 'fill-[#FFA347] text-[#FFA347]' : 'text-white/20')} />
            ))}
          </p>
          <p className="mt-2 text-[13px] text-white/45">{REVIEWS.length} reviews from repo owners</p>
        </div>
        <div className="space-y-1.5">
          {bands.map((b) => (
            <button key={b.s} type="button" onClick={() => setMin(min === b.s ? 0 : b.s)} className="flex w-full items-center gap-3 text-left text-[12.5px] text-white/55 hover:text-white">
              <span className={`${mono} flex w-9 items-center gap-1 text-[13px]`}>
                {b.s}
                <Star className="h-3.5 w-3.5 fill-current" />
              </span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                <span className="block h-full rounded-full bg-accent" style={{ width: `${(b.n / REVIEWS.length) * 100}%` }} />
              </span>
              <span className={`${mono} w-6 text-right`}>{b.n}</span>
            </button>
          ))}
          {min > 0 && <p className="pt-1 text-[12px] text-accent-text">Showing {min}<Star className="mx-0.5 inline h-3 w-3 -translate-y-px fill-current" /> and up · tap again to clear</p>}
        </div>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {list.map((r) => (
          <figure key={r.id} className="flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
            <div className="flex items-center justify-between">
              <Stars n={r.rating} />
              <span className="rounded-full bg-white/[0.05] px-2 py-0.5 text-[11.5px] text-white/50">{r.tag}</span>
            </div>
            <blockquote className="mt-3 text-[15px] leading-6 text-white/80">&ldquo;{r.text}&rdquo;</blockquote>
            <figcaption className="mt-auto pt-4 text-[12.5px] text-white/40">
              <span className="text-white/70">@{r.who}</span> · {r.company} · {r.date}
              <span className="mt-1 block truncate text-white/35">on {r.task}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}

/* ── Achievements: everything, with progress toward the locked ones ── */
function AchievementsTab() {
  const groups = Array.from(new Set(ACHIEVEMENT_TRACK.map((a) => a.group)))
  const done = ACHIEVEMENT_TRACK.filter((a) => a.have >= a.need).length
  return (
    <div className="mt-6">
      <div className="flex items-end justify-between gap-4">
        <p className="text-[15px] text-white/70">
          <span className="text-[28px] font-medium tracking-[-0.03em] text-white">{done}</span> of {ACHIEVEMENT_TRACK.length} unlocked
        </p>
        <div className="h-1.5 w-40 overflow-hidden rounded-full bg-white/[0.06]">
          <div className="h-full rounded-full bg-accent" style={{ width: `${(done / ACHIEVEMENT_TRACK.length) * 100}%` }} />
        </div>
      </div>
      {groups.map((g) => (
        <div key={g} className="mt-8">
          <p className={`${mono} text-[12px] uppercase tracking-[0.14em] text-white/35`}>{g}</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {ACHIEVEMENT_TRACK.filter((a) => a.group === g).map((a) => {
              const ok = a.have >= a.need
              return (
                <div key={a.label} className={cn('rounded-2xl border p-4', ok ? 'border-white/[0.08] bg-white/[0.03]' : 'border-dashed border-white/12')}>
                  <div className="flex items-center gap-3">
                    <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', ok ? 'bg-accent/15 text-accent' : 'bg-white/5 text-white/35')}>
                      {ok ? <Trophy className="h-[18px] w-[18px]" /> : <Lock className="h-[18px] w-[18px]" />}
                    </span>
                    <div className="min-w-0">
                      <p className={cn('text-[14.5px]', ok ? 'text-white/90' : 'text-white/60')}>{a.label}</p>
                      <p className="truncate text-[12.5px] text-white/40">{a.desc}</p>
                    </div>
                  </div>
                  <div className="mt-3.5 flex items-center gap-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                      <div className={cn('h-full rounded-full', ok ? 'bg-accent' : 'bg-white/30')} style={{ width: `${Math.min(100, (a.have / a.need) * 100)}%` }} />
                    </div>
                    <span className={`${mono} text-[11.5px] text-white/40`}>{ok ? a.when : `${a.have}/${a.need}`}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─────────────────────────── C · Cover + bento ─────────────────────────── */

function DiffThumb({ seed }: { seed: number }) {
  const lines = Array.from({ length: 9 }, (_, i) => {
    const k = (seed * 7 + i * 13) % 10
    return { kind: k < 2 ? 'del' : k < 5 ? 'add' : 'ctx', w: 30 + ((seed * 11 + i * 17) % 60), indent: (i * seed) % 3 }
  })
  return (
    <div className="relative aspect-video overflow-hidden rounded-xl border border-white/[0.07] bg-[#0f0e0e] p-3">
      {lines.map((l, i) => (
        <div key={i} className={cn('flex h-[14px] items-center gap-2', l.kind === 'add' && 'bg-emerald-400/[0.07]', l.kind === 'del' && 'bg-rose-400/[0.07]')}>
          <span className={cn('w-3 text-center font-mono text-[10px]', l.kind === 'add' ? 'text-emerald-400' : l.kind === 'del' ? 'text-rose-400' : 'text-white/20')}>
            {l.kind === 'add' ? '+' : l.kind === 'del' ? '−' : ''}
          </span>
          <span className="h-[5px] rounded-full bg-white/15" style={{ width: `${l.w}%`, marginLeft: l.indent * 12 }} />
        </div>
      ))}
      <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 font-mono text-[10px] text-white/70">
        <GitMerge className="h-3 w-3 text-accent" /> merged
      </span>
    </div>
  )
}

function Tile({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={cn('rounded-[20px] border border-white/[0.08] bg-white/[0.02] p-5', className)}>{children}</div>
}

export function ProfileCover() {
  const pct = DEMO.xp / DEMO.nextXp
  const R = 34
  const C = 2 * Math.PI * R
  const months = [2, 3, 1, 4, 3, 5, 7, 6, 9]
  return (
    <>
      <Section>
        <div className="p-4">
          <header className="relative isolate grid overflow-hidden rounded-[22px] border border-white/[0.08]">
            <Painting src="/paintings/ember-shore.webp" className="col-start-1 row-start-1 h-[460px]" shade={0.2} />
            <div aria-hidden className="pointer-events-none col-start-1 row-start-1 bg-[linear-gradient(180deg,rgba(11,8,7,0.3)_0%,transparent_25%,rgba(11,8,7,0.85)_75%,#0b0807_100%)]" />
            <div className="absolute right-8 top-0 hidden lg:block">
              <HangingCard Front={HoloFront} scale={0.5} swing={-6} />
            </div>
            <div className="relative col-start-1 row-start-1 flex items-end gap-6 self-end px-8 pb-8 lg:px-12 lg:pb-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={DEMO.avatarUrl} alt="" className="hidden h-[112px] w-[112px] rounded-full border-2 border-accent/70 object-cover sm:block" />
              <div className="min-w-0 lg:max-w-[640px]">
                <p className={`${mono} flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] text-accent-text`}>
                  <BadgeCheck className="h-4 w-4" /> Level {DEMO.level} {DEMO.levelTitle} · @{DEMO.username}
                </p>
                <h1 className="mt-3 text-[44px] font-medium leading-[1] tracking-[-0.045em] text-white lg:text-[60px]">{DEMO.name}</h1>
                <p className="mt-3 text-[16px] text-white/65">{DEMO.headline}</p>
                <Buttons className="mt-5" />
              </div>
            </div>
          </header>
        </div>
      </Section>

      <Section>
        <div className="grid gap-3 px-6 py-10 sm:grid-cols-2 sm:px-12 lg:grid-cols-4">
          <Tile className="flex items-center gap-4">
            <svg width="84" height="84" viewBox="0 0 84 84" className="shrink-0 -rotate-90">
              <circle cx="42" cy="42" r={R} stroke="rgba(255,255,255,0.08)" strokeWidth="7" fill="none" />
              <circle cx="42" cy="42" r={R} stroke="#FF7A00" strokeWidth="7" fill="none" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - pct)} />
            </svg>
            <div>
              <p className={`${mono} text-[12px] text-white/40`}>Level</p>
              <p className="text-[32px] font-medium leading-none tracking-[-0.04em] text-white">{DEMO.level}</p>
              <p className="mt-1 text-[12.5px] text-white/45">{DEMO.nextXp - DEMO.xp} XP to {DEMO.level + 1}</p>
            </div>
          </Tile>
          <Tile>
            <p className={`${mono} text-[12px] text-white/40`}>Earned</p>
            <p className="mt-1 text-[32px] font-medium leading-none tracking-[-0.04em] text-white">{inr(DEMO.earned)}</p>
            <div className="mt-3 flex h-9 items-end gap-1">
              {months.map((m, i) => (
                <span key={i} className="flex-1 rounded-t-[3px] bg-accent/70" style={{ height: `${(m / 9) * 100}%`, opacity: 0.35 + (i / months.length) * 0.65 }} />
              ))}
            </div>
          </Tile>
          <Tile>
            <p className={`${mono} flex items-center gap-1.5 text-[12px] text-white/40`}><Flame className="h-3.5 w-3.5 text-accent" /> Streak</p>
            <p className="mt-1 text-[32px] font-medium leading-none tracking-[-0.04em] text-white">{DEMO.streak} days</p>
            <div className="mt-4 flex gap-1.5">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                <span key={i} className={cn('flex h-7 flex-1 items-center justify-center rounded-md font-mono text-[10px]', i < 6 ? 'bg-accent/80 text-black' : 'border border-dashed border-white/20 text-white/40')}>
                  {d}
                </span>
              ))}
            </div>
          </Tile>
          <Tile>
            <p className={`${mono} text-[12px] text-white/40`}>Rating</p>
            <p className="mt-1 text-[32px] font-medium leading-none tracking-[-0.04em] text-white">{DEMO.rating}<span className="text-white/35"> / 5</span></p>
            <p className="mt-3 flex gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className="h-4 w-4 fill-[#FFA347] text-[#FFA347]" />
              ))}
            </p>
            <p className="mt-1.5 text-[12.5px] text-white/45">18 owner reviews · {DEMO.completion}% on time</p>
          </Tile>
          <Tile className="sm:col-span-2 lg:col-span-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <p className="text-[15px] text-white/80">847 contributions in the last year</p>
              <span className={`${mono} text-[12px] text-white/35`}>longest streak {DEMO.longest} days</span>
            </div>
            <Heatmap />
          </Tile>
        </div>
      </Section>

      <Section>
        <div className="px-6 py-14 sm:px-12">
          <H2 title="Shipped work." muted="Real repos. Real reviewers." />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {WORK.map((w, i) => (
              <article key={w.id} className="group">
                <DiffThumb seed={i + 2} />
                <p className={`${mono} mt-4 text-[12px] text-white/40`}>{w.owner} · {w.repo}</p>
                <h3 className="mt-1 text-[17px] font-medium leading-snug tracking-[-0.01em] text-white/90">{w.title}</h3>
                <p className="mt-2 text-[13.5px] italic text-white/45">&ldquo;{w.note}&rdquo;</p>
                <div className="mt-3 flex items-center gap-3 border-t border-line pt-3">
                  <span className="text-[16px] font-medium text-white">{inr(w.bounty)}</span>
                  <Stars n={w.rating} />
                  <span className="ml-auto"><Diff add={w.add} del={w.del} /></span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Section>

      <Section divider={false}>
        <div className="grid gap-10 px-6 py-14 sm:px-12 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <H2 title="Achievements." muted="6 of 8." />
            <div className="mt-8">
              <Achievements cols="sm:grid-cols-2 xl:grid-cols-4" />
            </div>
          </div>
          <div>
            <p className="text-[15px] text-white/70">About</p>
            <p className="mt-3 text-[15px] leading-7 text-white/55">{DEMO.bio}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {DEMO.stack.map((s) => (
                <Tag key={s}>{s}</Tag>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
