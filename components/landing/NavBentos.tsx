'use client'

import Link from 'next/link'
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowUpRight, Check, Copy } from 'lucide-react'
import { RiGithubFill, RiInstagramLine, RiLinkedinBoxFill, RiTwitterXFill } from '@remixicon/react'
import MailVideo from './MailVideo'
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

/** The shiny "New" tag: a soft orange pill with a light sweep passing over it every few seconds. */
export function NewBadge() {
  return (
    <span className="relative inline-flex h-[18px] shrink-0 items-center overflow-hidden rounded-full border border-accent/40 bg-accent/[0.12] px-1.5 text-[9.5px] font-semibold uppercase tracking-[0.1em] text-accent-text">
      New
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-1/2 -translate-x-full animate-[badge-shine_3.2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/55 to-transparent"
      />
    </span>
  )
}

// ---------------------------------------------------------------- Company: Forke Mail

/** The Forke Mail promo: the pitch on the left, a short directed loop of the real dashboard on the right. */
export function ForkeMailPromo({ active, href }: { active: boolean; href: string }) {
  return (
    <div className="grid h-full grid-cols-12 gap-2">
      <a href={href} target="_blank" rel="noopener noreferrer" className={cn(tile, 'group col-span-4 flex flex-col p-4', FOCUS)}>
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
          <NewBadge />
        </div>
        <p className="mt-3 text-[16px] font-medium leading-snug tracking-[-0.02em] text-white">
          Email for developers.
          <span className="block text-white/45">Transactional and broadcasts, one API.</span>
        </p>
        <ul className="mt-3.5 space-y-1.5 text-[12px] text-white/60">
          {['Sign-in codes and receipts skip the queue', 'Broadcasts with one-click unsubscribe', 'DKIM, SPF and DMARC records shown for you', 'Bounces and complaints suppressed'].map((f) => (
            <li key={f} className="flex items-center gap-2">
              <Check className="h-3 w-3 shrink-0 text-accent-text" /> {f}
            </li>
          ))}
        </ul>
        <span className="mt-auto inline-flex items-center gap-1.5 self-start rounded-lg bg-white/[0.08] px-3 py-1.5 text-[12.5px] text-white/90 transition-colors group-hover:bg-white/[0.12]">
          Try Forke Mail
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </a>
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
const DITHER_PALETTE: [number, number, number][] = [
  [21, 20, 20], // #151414
  [74, 32, 10], // ember
  [255, 122, 0], // #ff7a00
  [240, 227, 222], // cream
]
const BAYER = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
]
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

/**
 * Ordered-dither whatever is drawn into `src` (w × h) onto `out`, in the site's palette. Levels are stretched per
 * image first (its own 2nd–99th percentile of brightness), so dark paintings still use the whole palette.
 */
function dither(src: CanvasRenderingContext2D, out: HTMLCanvasElement, w: number, h: number) {
  const data = src.getImageData(0, 0, w, h)
  const px = data.data
  const n = DITHER_PALETTE.length - 1
  const lum = new Float32Array(w * h)
  const hist = new Uint32Array(256)
  for (let k = 0; k < w * h; k++) {
    const l = (0.2126 * px[k * 4] + 0.7152 * px[k * 4 + 1] + 0.0722 * px[k * 4 + 2]) / 255
    lum[k] = l
    hist[Math.min(255, Math.round(l * 255))]++
  }
  const pct = (q: number) => {
    let acc = 0
    for (let v = 0; v < 256; v++) if ((acc += hist[v]) >= q * w * h) return v / 255
    return 1
  }
  const lo = pct(0.02)
  const hi = Math.max(lo + 0.05, pct(0.99))
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const k = y * w + x
      const v = Math.pow(Math.min(1, Math.max(0, (lum[k] - lo) / (hi - lo))), 0.8) * n
      const base = Math.floor(v)
      const level = Math.min(n, base + (v - base > (BAYER[y % 8][x % 8] + 0.5) / 64 ? 1 : 0))
      const [r, g, b] = DITHER_PALETTE[level]
      px[k * 4] = r
      px[k * 4 + 1] = g
      px[k * 4 + 2] = b
      px[k * 4 + 3] = 255
    }
  }
  out.width = w
  out.height = h
  out.getContext('2d')?.putImageData(data, 0, 0)
}

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
              <span
                className="block h-full rounded-full bg-accent"
                style={{ width: k === cur ? '100%' : '0%', transition: k === cur && !held ? `width ${SLIDE_MS}ms linear` : 'none' }}
              />
            </span>
          ))}
        </div>
      </div>
      <ArrowUpRight className="absolute right-3.5 top-3.5 h-4 w-4 text-white/40 transition-[color,transform] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
    </Link>
  )
}

// ---------------------------------------------------------------- Contact

const SOCIALS = [
  { label: 'X', handle: '@forkespace', href: 'https://x.com/forkespace', icon: RiTwitterXFill },
  { label: 'LinkedIn', handle: 'Forke', href: 'https://www.linkedin.com/company/forke/', icon: RiLinkedinBoxFill },
  { label: 'GitHub', handle: 'forke-org', href: 'https://github.com/forke-org', icon: RiGithubFill },
  { label: 'Instagram', handle: '@forke.space', href: 'https://www.instagram.com/forke.space/', icon: RiInstagramLine },
]
const SUPPORT = 'support@forke.space'

/** A compose window that opens the contact page, a copyable support address, and the socials as icon tiles. */
export function ContactBento({ onPick }: { onPick: () => void }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SUPPORT)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard blocked: the address stays visible to copy by hand */
    }
  }

  return (
    <div className="grid h-full grid-cols-12 grid-rows-2 gap-2">
      <Link href="/contact" onClick={onPick} className={cn(tile, 'group col-span-7 row-span-2 flex flex-col p-4 transition-colors duration-200 hover:border-white/[0.14]', FOCUS)}>
        <div className="flex items-center justify-between">
          <p className={eyebrow}>Write to us</p>
          <ArrowUpRight className="h-4 w-4 text-white/30 transition-[color,transform] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/80" />
        </div>
        <div className="mt-3 flex-1 rounded-lg border border-white/[0.07] bg-black/25 text-[12px]">
          <div className="flex items-center gap-1.5 border-b border-white/[0.06] px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="ml-2 text-[11px] text-white/35">New message</span>
          </div>
          <div className="space-y-1.5 px-3 py-2.5">
            <p className="text-white/40">
              To <span className="ml-1.5 rounded bg-white/[0.06] px-1.5 py-px text-white/80">The Forke team</span>
            </p>
            <p className="border-b border-white/[0.06] pb-1.5 text-white/40">
              Subject <span className="ml-1.5 text-white/80">Hi Forke</span>
            </p>
            <p className="pt-0.5 leading-5 text-white/55">
              We&rsquo;d love to hear what you&rsquo;re building
              <span className="ml-0.5 inline-block h-3.5 w-px translate-y-0.5 animate-[caret_1s_steps(1)_infinite] bg-white/70" />
            </p>
          </div>
        </div>
        <span className="mt-3 inline-flex items-center gap-1.5 self-start rounded-lg bg-white/[0.08] px-3 py-1.5 text-[12.5px] text-white/90 transition-colors group-hover:bg-white/[0.12]">
          Open the contact form
        </span>
      </Link>

      <div className={cn(tile, 'col-span-5 flex flex-col justify-between p-3.5')}>
        <p className={eyebrow}>Email</p>
        <div className="flex items-center justify-between gap-2">
          <a href={`mailto:${SUPPORT}`} className={cn('truncate text-[13.5px] text-white/90 hover:text-white', FOCUS)}>
            {SUPPORT}
          </a>
          <button
            type="button"
            onClick={copy}
            aria-label="Copy email address"
            className={cn('flex h-7 shrink-0 items-center gap-1 rounded-md border border-white/10 bg-white/[0.05] px-2 text-[11px] text-white/70 transition-colors hover:text-white', FOCUS)}
          >
            {copied ? <Check className="h-3 w-3 text-emerald-300" /> : <Copy className="h-3 w-3" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="col-span-5 grid grid-cols-4 gap-2">
        {SOCIALS.map(({ label, href, icon: Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={cn(tile, 'group flex items-center justify-center transition-colors duration-200 hover:border-white/[0.16] hover:bg-white/[0.07]', FOCUS)}
          >
            <Icon className="h-5 w-5 text-white/55 transition-colors group-hover:text-white" />
          </a>
        ))}
      </div>
    </div>
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <span className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-black/30 backdrop-blur-md">
                <ArrowUpRight className="h-3.5 w-3.5 text-white/75 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
              <div className="absolute inset-x-0 bottom-0 p-3.5">
                <p className="font-mono text-[10.5px] text-white/55">
                  {date && <>{date} · </>}
                  {post.readingMinutes} min read
                </p>
                <p className={cn('mt-1 font-medium leading-snug tracking-[-0.01em] text-white', i === 0 ? 'line-clamp-3 text-[18px]' : 'line-clamp-2 text-[14px]')}>{post.title}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
