'use client'

/**
 * @fileoverview Forke Platform
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

import Link from 'next/link'
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowUpRight, Check, Copy } from 'lucide-react'
import MailVideo from './MailVideo'
import { dither } from './dither'
import { cn } from './primitives'
import { formatBlogDate } from '@/components/blog/BlogCard'
import type { SiteLink } from './siteMenus'

/**
 * The right-hand side of each navbar menu: small coded UIs, no screenshots. Every bento fills the panel's fixed
 * height so the bar never changes size between menus.
 */

const tile = 'relative overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.03]'
const eyebrow = 'font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/45'
const FOCUS = 'outline-none focus-visible:ring-2 focus-visible:ring-accent/60'

/** The shiny "Soon" tag: a soft orange pill with a light sweep passing over it every few seconds. */
export function SoonBadge() {
  return (
    <span className="relative inline-flex h-[18px] shrink-0 items-center overflow-hidden rounded-full border border-accent/40 bg-accent/[0.12] px-1.5 text-[9.5px] font-semibold uppercase tracking-[0.1em] text-accent-text">
      Soon
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-1/2 -translate-x-full animate-[badge-shine_3.2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/55 to-transparent"
      />
    </span>
  )
}

// ---------------------------------------------------------------- Company: Forke Mail

/** The Forke Mail promo: the pitch on the left, a short directed loop of the real dashboard on the right. */
export function ForkeMailPromo({ active }: { active: boolean }) {
  return (
    <div className="grid h-full grid-cols-12 gap-2">
      <div className={cn(tile, 'col-span-4 flex flex-col p-4')}>
        <div
          aria-hidden
          className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full"
          style={{ background: 'radial-gradient(closest-side, rgba(255,122,0,0.14), transparent)' }}
        />
        <div className="flex items-center gap-2">
          <span className="flex items-baseline gap-1 text-[16px] tracking-[-0.04em]">
            <span className="font-semibold text-white">
              forke<span className="text-accent">*</span>
            </span>
            <span className="text-white/50">mail</span>
          </span>
          <SoonBadge />
        </div>
        <p className="mt-3 text-[16px] font-medium leading-snug tracking-[-0.02em] text-white">
          Email for developers.
          <span className="block text-white/45">Transactional and broadcasts, one API.</span>
        </p>
        <ul className="mb-4 mt-3 space-y-1.5 text-[12px] text-white/60">
          {['Codes and receipts skip the queue', 'One-click unsubscribe on broadcasts', 'DKIM, SPF and DMARC, guided', 'Bounces suppressed for you'].map((f) => (
            <li key={f} className="flex items-center gap-2">
              <Check className="h-3 w-3 shrink-0 text-accent-text" /> {f}
            </li>
          ))}
        </ul>
        <span className="mt-auto inline-flex h-8 items-center gap-2 self-start rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 text-[12px] text-white/60">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" /> Launching soon
        </span>
      </div>
      <div className={cn(tile, 'col-span-8')}>
        <MailVideo active={active} />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- Built for: dithered slideshow

/*
 * One full-bleed slide per audience, switching every couple of seconds (and holding on the one you point at). Each picture is
 * ordered-dithered in a canvas into the site's palette, so any source image, generated or drawn, comes out in the
 * same chunky ember look. Each slide reads /public/built-for/<name>.webp; while that file is missing it draws its own
 * scene and dithers that instead.
 */
const CELL = 3 // css px per dither dot
const SLIDE_MS = 2200 // time on each slide

type Scene = (g: CanvasRenderingContext2D, w: number, h: number) => void
type Slide = { title: string; line: string; brief: string; image?: string; scene: Scene }

const sky = (g: CanvasRenderingContext2D, w: number, h: number, top: number, bottom: number) => {
  const grad = g.createLinearGradient(0, 0, 0, h)
  grad.addColorStop(0, `rgb(${top},${top},${top})`)
  grad.addColorStop(1, `rgb(${bottom},${bottom},${bottom})`)
  g.fillStyle = grad
  g.fillRect(0, 0, w, h)
}
const glow = (g: CanvasRenderingContext2D, x: number, y: number, r: number, v: number) => {
  const grad = g.createRadialGradient(x, y, 0, x, y, r)
  grad.addColorStop(0, `rgba(${v},${v},${v},1)`)
  grad.addColorStop(1, `rgba(${v},${v},${v},0)`)
  g.fillStyle = grad
  g.fillRect(x - r, y - r, r * 2, r * 2)
}

const SLIDES: Slide[] = [
  {
    title: 'Contributors',
    image: '/built-for/contributors.webp',
    line: 'Ship scoped tasks. Get paid on merge.',
    brief: 'Claim a task that fits your level, open a real pull request, and the escrowed bounty lands the day it is approved.',
    scene: (g, w, h) => {
      sky(g, w, h, 30, 120)
      glow(g, w * 0.72, h * 0.78, h * 0.9, 255)
      g.fillStyle = 'rgb(18,18,18)'
      for (let i = 0; i < 7; i++) g.fillRect(0, h * 0.8 + i * i * 1.4, w, 1 + i * 0.6)
      g.fillRect(0, h * 0.9, w, h)
    },
  },
  {
    title: 'Repo owners',
    image: '/built-for/repo-owners.webp',
    line: 'Post the work. Review the diff. Pay on approval.',
    brief: 'Fund a task once. Build, tests, scope checks and an AI review run before you look, and you only pay for merged code.',
    scene: (g, w, h) => {
      sky(g, w, h, 20, 40)
      const cx = w * 0.72
      const cy = h * 0.5
      for (let r = h * 0.95; r > 4; r -= h * 0.11) {
        g.strokeStyle = `rgb(${Math.round(255 - r * 0.9)},${Math.round(255 - r * 0.9)},${Math.round(255 - r * 0.9)})`
        g.lineWidth = h * 0.035
        g.beginPath()
        g.arc(cx, cy, r, 0, Math.PI * 2)
        g.stroke()
      }
      glow(g, cx, cy, h * 0.35, 250)
    },
  },
  {
    title: 'Students',
    image: '/built-for/students.webp',
    line: 'Real merged work on your profile.',
    brief: 'Start as an Apprentice, earn XP with every merge, and leave with a portfolio of shipped pull requests.',
    scene: (g, w, h) => {
      sky(g, w, h, 24, 70)
      const steps = 7
      for (let i = 0; i < steps; i++) {
        const v = 60 + i * 28
        g.fillStyle = `rgb(${v},${v},${v})`
        const bw = (w * 0.55) / steps
        const bh = h * (0.15 + i * 0.11)
        g.fillRect(w * 0.42 + i * bw, h - bh, bw - 3, bh)
      }
      glow(g, w * 0.92, h * 0.12, h * 0.45, 255)
    },
  },
  {
    title: 'Open source',
    image: '/built-for/open-source.webp',
    line: 'Fund the issues that matter.',
    brief: 'Put a bounty on any issue in your repo and let contributors pick it up, with payment held in escrow until merge.',
    scene: (g, w, h) => {
      sky(g, w, h, 18, 36)
      const nodes: [number, number][] = []
      for (let i = 0; i < 9; i++) nodes.push([w * (0.42 + ((i * 0.618) % 1) * 0.56), h * (0.12 + ((i * 0.381) % 1) * 0.78)])
      g.lineWidth = 2
      nodes.forEach(([x, y], i) => {
        const [nx, ny] = nodes[(i + 3) % nodes.length]
        g.strokeStyle = 'rgb(150,150,150)'
        g.beginPath()
        g.moveTo(x, y)
        g.bezierCurveTo(x, (y + ny) / 2, nx, (y + ny) / 2, nx, ny)
        g.stroke()
      })
      nodes.forEach(([x, y], i) => glow(g, x, y, h * (i % 3 === 0 ? 0.22 : 0.12), 255))
    },
  },
]

function DitheredSlide({ slide, w, h, shown }: { slide: Slide; w: number; h: number; shown: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const out = ref.current
    if (!out || !w || !h) return
    const cw = Math.ceil(w / CELL)
    const ch = Math.ceil(h / CELL)
    const work = document.createElement('canvas')
    work.width = cw
    work.height = ch
    const g = work.getContext('2d', { willReadFrequently: true })
    if (!g) return
    const drawScene = () => {
      slide.scene(g, cw, ch)
      dither(g, out, cw, ch)
    }
    if (!slide.image) return drawScene()
    const img = new window.Image()
    img.onload = () => {
      const s = Math.max(cw / img.width, ch / img.height)
      g.drawImage(img, (cw - img.width * s) / 2, (ch - img.height * s) / 2, img.width * s, img.height * s)
      dither(g, out, cw, ch)
    }
    img.onerror = drawScene
    img.src = slide.image
  }, [slide, w, h])
  return (
    <canvas
      ref={ref}
      className="absolute inset-0 h-full w-full transition-opacity duration-150"
      style={{ imageRendering: 'pixelated', opacity: shown ? 1 : 0 }}
    />
  )
}

/** Built for: one dithered slide per audience, switching every couple of seconds; pointing at a link (or the slide) holds it. */
export function BuiltForBento({ links, focus }: { links: SiteLink[]; focus: number | null }) {
  const [i, setI] = useState(0)
  const [hover, setHover] = useState(false)
  const held = focus !== null || hover
  useEffect(() => {
    if (held || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setI((n) => (n + 1) % SLIDES.length), SLIDE_MS)
    return () => window.clearInterval(id)
  }, [held])
  const cur = focus ?? i

  const box = useRef<HTMLAnchorElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  useLayoutEffect(() => {
    const el = box.current
    if (!el) return
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const slide = SLIDES[cur]
  return (
    <Link
      ref={box}
      href={links[cur]?.href ?? '/'}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      className={cn(tile, 'group block h-full bg-[#151414]', FOCUS)}
    >
      {SLIDES.map((s, k) => (
        <DitheredSlide key={s.title} slide={s} w={size.w} h={size.h} shown={k === cur} />
      ))}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#151414_0%,rgba(21,20,20,0.85)_30%,rgba(21,20,20,0.35)_55%,transparent_75%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#151414]/70 via-transparent to-transparent" />

      <div className="absolute inset-y-0 left-0 flex w-[56%] flex-col p-5">
        <p className={eyebrow}>Built for</p>
        <div key={cur} className="mt-auto animate-[menu-in_220ms_cubic-bezier(0.22,1,0.36,1)_both]">
          <p className="text-[30px] font-medium leading-none tracking-[-0.035em] text-white">{slide.title}</p>
          <p className="mt-2 text-[15px] font-medium tracking-[-0.015em] text-white/80">{slide.line}</p>
          <p className="mt-1.5 max-w-[360px] text-[12.5px] leading-5 text-white/50">{slide.brief}</p>
        </div>
        <div className="mt-4 flex gap-1.5">
          {SLIDES.map((s, k) => (
            <span key={s.title} className="h-[3px] w-8 overflow-hidden rounded-full bg-white/15">
              {/* mounts fresh on each slide, so every bar (the first one too) fills from empty; full while held */}
              {k === cur && (
                <span
                  className="block h-full rounded-full bg-accent"
                  style={held ? { width: '100%' } : { animation: `slide-fill ${SLIDE_MS}ms linear both` }}
                />
              )}
            </span>
          ))}
        </div>
      </div>
      <ArrowUpRight className="absolute right-3.5 top-3.5 h-4 w-4 text-white/40 transition-[color,transform] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
    </Link>
  )
}

// ---------------------------------------------------------------- Resources: recent blogs

export type RecentPost = { slug: string; title: string; coverImage: string | null; readingMinutes: number; publishedAt: string | null }

/** A blank tile: faint lines where a post will sit, and an optional note. */
function BlankTile({ className, note, sub, pulse }: { className: string; note?: string; sub?: string; pulse?: boolean }) {
  return (
    <div className={cn(tile, 'flex flex-col justify-end p-4', className, pulse && 'animate-pulse')}>
      {note ? (
        <>
          <p className="text-[16px] font-medium tracking-[-0.015em] text-white/85">{note}</p>
          {sub && <p className="mt-1 text-[12.5px] text-white/40">{sub}</p>}
        </>
      ) : (
        <div className="space-y-1.5">
          <div className="h-2 w-16 rounded-full bg-white/[0.06]" />
          <div className="h-2.5 w-3/4 rounded-full bg-white/[0.08]" />
        </div>
      )}
    </div>
  )
}

/** The newest three posts as a bento (one large, two stacked), or blank tiles while there are none. */
export function BlogBento({ posts, onPick }: { posts: RecentPost[] | null; onPick: () => void }) {
  const spans = ['col-span-2 row-span-2', 'col-span-2', 'col-span-2']
  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-center justify-between pl-1 pr-0.5">
        <p className={eyebrow}>Our recent blogs</p>
        {!!posts?.length && (
          <Link href="/blogs" onClick={onPick} className={cn('group inline-flex items-center gap-1 rounded-md text-[12px] text-white/50 transition-colors hover:text-white', FOCUS)}>
            View all
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-4 grid-rows-2 gap-2">
        {spans.map((span, i) => {
          const post = posts?.[i]
          if (!post) {
            if (posts === null) return <BlankTile key={i} className={span} pulse />
            if (i === 0 && posts.length === 0)
              return <BlankTile key={i} className={span} note="Blogs are on the way." sub="Engineering notes and product deep-dives, soon." />
            return <BlankTile key={i} className={span} note={i === posts.length ? 'More on the way' : undefined} />
          }
          const date = formatBlogDate(post.publishedAt)
          return (
            <Link key={post.slug} href={`/blogs/${post.slug}`} onClick={onPick} className={cn(tile, 'group', span, FOCUS)}>
              {post.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
              ) : (
                <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_100%_0%,rgba(255,122,0,0.16),transparent_60%)]" />
              )}
              {/* a vignette that deepens toward the bottom, so the date and title read over any cover */}
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,9,9,0.96)_0%,rgba(10,9,9,0.82)_28%,rgba(10,9,9,0.35)_58%,transparent_80%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,transparent_55%,rgba(10,9,9,0.45)_100%)]" />
              <span className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-black/30 backdrop-blur-md">
                <ArrowUpRight className="h-3.5 w-3.5 text-white/75 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
              <div className="absolute inset-x-0 bottom-0 p-3.5">
                <p className="font-mono text-[10.5px] text-white/70 [text-shadow:0_1px_8px_rgba(0,0,0,0.8)]">
                  {date && <>{date} · </>}
                  {post.readingMinutes} min read
                </p>
                <p className={cn('mt-1 font-medium leading-snug tracking-[-0.01em] text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.8)]', i === 0 ? 'line-clamp-3 text-[18px]' : 'line-clamp-2 text-[14px]')}>{post.title}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
