'use client'

/**
 * Landing page tour of the public profile (forke.space/username).
 *
 * The real ProfileView renders at a fixed desktop size (STAGE_W × STAGE_H) inside a browser window. The window is
 * scaled so that only its left VIS_X and top VIS_Y show: it bleeds off the right and bottom edges like the other
 * screenshots on the site, in the same proportions on every screen. A scripted camera glides and zooms between parts
 * of the page, framing each shot inside the visible part, with a cursor that clicks the tabs. All DOM and CSS transforms, so text stays sharp at any zoom.
 * The loop pauses off screen, and reduced motion gets the still wide shot.
 */

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { BadgeCheck, MousePointer2 } from 'lucide-react'
import ProfileView, { type ProfileTab } from '@/components/profile/b/ProfileView'
import type { Achievement, DevProfile, ShippedWork } from '@/components/profile/b/types'
import type { CardData } from '@/components/idcard/paint'
import type { CardStyle } from '@/components/idcard/style'
import { Painting } from './primitives'
import FitScale from './FitScale'

const STAGE_W = 1200
const STAGE_H = 750
const VIS_X = 1 // the window's full width is laid out in view; only its overhang runs past the painting's right edge
const VIS_Y = 0.86 // share of its height left visible (the rest bleeds off the bottom)
const VIS_W = STAGE_W * VIS_X
const VIS_H = STAGE_H * VIS_Y
const CHROME_H = 38
const NAV_H = 52
const VIEW_H = STAGE_H - CHROME_H - NAV_H
const EASE = 'cubic-bezier(0.65, 0, 0.35, 1)'
const MOVE_MS = 1000 // camera glide
const CURSOR_MS = 550 // cursor move
const OVERHANG_X = 48 // px the window runs past the painting's right edge: more than the parallax drift, so it never shows the painting
const OVERHANG_Y = 80 // and past its bottom edge: generous, so the painting's scroll parallax never shows a strip below it
const FRAME_W = 1152 // the section's width on a laptop; smaller screens get this whole card scaled down

// ---------- dummy profile: fully filled, stable between server and client ----------

const TODAY = new Date('2026-11-14T00:00:00')
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const daysAgo = (n: number) => {
  const d = new Date(TODAY)
  d.setDate(d.getDate() - n)
  return d
}
const rand = (i: number) => {
  const v = Math.sin(i * 12.9898 + 78.233) * 43758.5453
  return v - Math.floor(v)
}

const HEATMAP = Array.from({ length: 371 }, (_, k) => {
  const ago = 370 - k
  const busy = 0.25 + (1 - ago / 371) * 0.6 // busier lately
  const r = rand(k)
  const count = ago < 26 ? 10 + Math.round(r * 60) : r < busy ? Math.round(r * 90) : 0
  return { date: iso(daysAgo(ago)), count }
})

const WORK: ShippedWork[] = (
  [
    ['Rate limiter for the public /v1 routes', 'ledgerly/core', '412', 'Ledgerly', ['Go', 'Redis'], 5, 420, 2],
    ['Cursor pagination for invoice lists', 'acme/billing-api', '1288', 'Acme', ['TypeScript', 'Postgres'], 5, 360, 5],
    ['Fix N+1 queries on the orders page', 'kart/storefront', '903', 'Kart', ['Postgres', 'Go'], 4, 310, 9],
    ['Offline sync for the field notes app', 'notely/mobile', '221', 'Notely', ['React Native'], 5, 480, 14],
    ['Webhook retries with exponential backoff', 'paylink/gateway', '77', 'Paylink', ['Go'], 5, 390, 19],
    ['Dark mode for the settings screens', 'notely/app', '640', 'Notely', ['React', 'Tailwind'], 4, 180, 25],
    ['Search index rebuild without downtime', 'docsy/search', '58', 'Docsy', ['Go', 'Postgres'], 5, 450, 33],
    ['Accessible date picker component', 'kart/ui', '1402', 'Kart', ['React', 'TypeScript'], 4, 220, 41],
    ['CSV export for monthly reports', 'acme/billing-api', '1244', 'Acme', ['TypeScript'], 5, 160, 52],
    ['Image uploads straight to object storage', 'snapfolio/web', '315', 'Snapfolio', ['Next.js', 'TypeScript'], 5, 280, 60],
    ['Retry-safe payout job', 'paylink/gateway', '64', 'Paylink', ['Go', 'Postgres'], 5, 400, 71],
    ['Faster cold starts for the API', 'ledgerly/core', '377', 'Ledgerly', ['Go'], 4, 300, 83],
  ] as const
).map(([title, repo, pr, company, tags, rating, xp, ago], i) => ({
  id: `tour-${i}`,
  title,
  repo,
  pr,
  prUrl: null,
  company,
  tags: [...tags],
  rating,
  xp,
  date: daysAgo(ago).toISOString(),
}))

const ACHIEVEMENTS: Achievement[] = [
  { label: 'First merge', desc: 'Ship your first task', group: 'Shipping', have: 38, need: 1 },
  { label: 'Ten down', desc: 'Ship 10 tasks', group: 'Shipping', have: 38, need: 10 },
  { label: 'Fifty club', desc: 'Ship 50 tasks', group: 'Shipping', have: 38, need: 50 },
  { label: 'On fire', desc: 'Keep a 7 day streak', group: 'Consistency', have: 26, need: 7 },
  { label: 'Monthly', desc: 'Keep a 30 day streak', group: 'Consistency', have: 26, need: 30 },
  { label: 'Five stars', desc: 'Get a 5 star rating', group: 'Quality', have: 8, need: 1 },
  { label: 'Untouchable', desc: '10 five star ratings', group: 'Quality', have: 8, need: 10 },
  { label: 'Getting there', desc: 'Reach level 5', group: 'Levels', have: 9, need: 5 },
  { label: 'Legend', desc: 'Reach level 10', group: 'Levels', have: 9, need: 10 },
  { label: 'Polyglot', desc: 'Ship across 5 stacks', group: 'Range', have: 8, need: 5 },
  { label: 'Repo hopper', desc: 'Ship for 10 different owners', group: 'Range', have: 7, need: 10 },
]

const PHOTO = 'https://i.pravatar.cc/400?img=12'

const PROFILE: DevProfile = {
  username: 'johndoe',
  name: 'John Doe',
  headline: 'Backend engineer. Go, Postgres and payments.',
  bio: 'I build the boring parts that keep products up: rate limiters, payout jobs, sync engines and the queries behind them.\nMost of my Forke work is in Go and Postgres, with some React when a feature needs a face.',
  location: 'Bengaluru, India',
  college: 'RV College of Engineering',
  avatarUrl: PHOTO,
  level: 9,
  levelTitle: 'Architect',
  currentStreak: 26,
  joinedAt: '2026-03-02T00:00:00.000Z',
  githubUrl: 'https://github.com/johndoe',
  linkedinUrl: 'https://linkedin.com/in/johndoe',
  websiteUrl: 'https://johndoe.dev',
  shipped: 38,
  avgRating: 4.7,
  stack: ['Go', 'Postgres', 'TypeScript', 'React', 'Redis', 'Next.js', 'Tailwind', 'React Native'],
  work: WORK,
  achievements: ACHIEVEMENTS,
  heatmap: HEATMAP,
}

const CARD: Omit<CardData, 'quote'> = {
  first: 'John',
  full: 'John Doe',
  username: 'johndoe',
  level: 9,
  title: 'Architect',
  shipped: 38,
  rating: 4.7,
  id: 'FK-7Q2K',
  issued: 'Mar 2026',
  avatarUrl: PHOTO,
}
const CARD_STYLE: CardStyle = { color: 'black', filter: 'orange', line: 'Logs never lie.' }

// ---------- the real 3D lanyard, driven by the script ----------

const CardLive = dynamic(() => import('@/components/idcard/CardLive'), { ssr: false, loading: () => <div className="h-[400px]" /> })

/** The same card visitors see on a profile. `card-face` marks where the card hangs inside the 400px canvas,
 *  so the close-up frames the whole card and crops the strap. */
function TourCard({ flipped, pixelRatio }: { flipped: boolean; pixelRatio: number }) {
  return (
    <div className="relative">
      <CardLive data={CARD} style={CARD_STYLE} height={400} flipped={flipped} pixelRatio={pixelRatio} interactive={false} />
      <div data-tour="card-face" aria-hidden className="pointer-events-none absolute left-[11%] top-[78px] h-[290px] w-[66%]" />
    </div>
  )
}

// ---------- the script ----------

type Focus = string[] | null // data-tour anchors to frame; null = wide shot of the top of the page
type Scene = { tab: ProfileTab; focus: Focus; zoom?: number; hold: number; click?: ProfileTab; flip?: boolean }

const SCENES: Scene[] = [
  { tab: 'overview', focus: null, hold: 1400 },
  { tab: 'overview', focus: ['card-face'], zoom: 1.8, hold: 800 },
  { tab: 'overview', focus: ['card-face'], zoom: 1.8, hold: 1100, flip: true },
  { tab: 'overview', focus: ['readme'], zoom: 1.5, hold: 1400 },
  { tab: 'overview', focus: ['pinned'], zoom: 1.5, hold: 1500 },
  { tab: 'overview', focus: ['heatmap'], zoom: 1.45, hold: 1350 },
  { tab: 'overview', focus: ['tabs'], zoom: 1.6, hold: 700, click: 'shipped' },
  { tab: 'shipped', focus: ['shipped'], zoom: 1.4, hold: 1400 },
  { tab: 'shipped', focus: ['tabs'], zoom: 1.6, hold: 700, click: 'reviews' },
  { tab: 'reviews', focus: ['reviews'], zoom: 1.55, hold: 1400 },
  { tab: 'reviews', focus: ['tabs'], zoom: 1.6, hold: 700, click: 'achievements' },
  { tab: 'achievements', focus: ['achievements'], zoom: 1.4, hold: 1500 },
  { tab: 'achievements', focus: ['tabs'], zoom: 1.6, hold: 700, click: 'overview' },
]
const CLICK_EXTRA = CURSOR_MS + 330 // time for the cursor to land and click before the hold counts down
const sceneMs = (s: Scene) => MOVE_MS + s.hold + (s.click ? CLICK_EXTRA : 0)

type Rect = { x: number; y: number; w: number; h: number }
type Shot = { scroll: number; tx: number; ty: number; s: number }
const WIDE: Shot = { scroll: 0, tx: 0, ty: 0, s: 1 }

/** Position of `el` inside `root`, ignoring transforms (offsets are layout-only). */
function offsetIn(el: HTMLElement, root: HTMLElement): Rect {
  let x = 0
  let y = 0
  let n: HTMLElement | null = el
  while (n && n !== root) {
    x += n.offsetLeft
    y += n.offsetTop
    n = n.offsetParent as HTMLElement | null
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight }
}

export default function ProfileTour() {
  const outer = useRef<HTMLDivElement>(null)
  const page = useRef<HTMLDivElement>(null)
  const [fit, setFit] = useState(0)
  const [step, setStep] = useState(0)
  const [tab, setTab] = useState<ProfileTab>('overview')
  const [shot, setShot] = useState<Shot>(WIDE)
  const [flipped, setFlipped] = useState(false)
  const [cursor, setCursor] = useState({ x: VIS_W * 0.7, y: VIS_H * 0.8, press: false, show: false })
  const [running, setRunning] = useState(false)
  // the card is drawn in WebGL: render it at the resolution it is shown at (stage scale × closest zoom × screen)
  const [cardRatio, setCardRatio] = useState(2)
  useEffect(() => {
    if (fit > 0) setCardRatio(Math.min(4, (window.devicePixelRatio || 1) * Math.max(1, fit * 1.8)))
  }, [fit])

  // scale the stage so its visible share fills the box
  useLayoutEffect(() => {
    const el = outer.current
    if (!el) return
    const measure = () => setFit(el.clientWidth / VIS_W)
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    measure()
    return () => ro.disconnect()
  }, [])

  // run only while visible, and never for reduced motion
  useEffect(() => {
    const el = outer.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver(([e]) => setRunning(e.isIntersecting), { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  /** Camera shot that frames the anchors inside the visible part of the window. */
  const frame = useCallback(
    (focus: Focus, zoom = 1.4): Shot => {
      const root = page.current
      if (!focus || !root) return WIDE
      const rects = focus
        .map((k) => root.querySelector<HTMLElement>(`[data-tour="${k}"]`))
        .filter((el): el is HTMLElement => !!el)
        .map((el) => offsetIn(el, root))
      if (!rects.length) return WIDE
      const x1 = Math.min(...rects.map((r) => r.x))
      const y1 = Math.min(...rects.map((r) => r.y))
      const box = { x: x1, y: y1, w: Math.max(...rects.map((r) => r.x + r.w)) - x1, h: Math.max(...rects.map((r) => r.y + r.h)) - y1 }
      // stage px hidden past the painting's right and bottom edges
      const areaW = VIS_W - (fit > 0 ? OVERHANG_X / fit : 0)
      const areaH = VIS_H - (fit > 0 ? OVERHANG_Y / fit : 0)
      const pageH = Math.max(120, areaH - CHROME_H - NAV_H) // page area that is actually visible at 1×
      const maxScroll = Math.max(0, root.offsetHeight - VIEW_H)
      const tall = box.h > pageH * 0.8
      const scroll = Math.min(maxScroll, Math.max(0, tall ? box.y - 24 : box.y + box.h / 2 - pageH / 2))
      const wy = CHROME_H + NAV_H + box.y - scroll // box top in window coordinates
      const s = Math.max(1, Math.min(zoom, (areaW * 0.92) / box.w, tall ? Infinity : (areaH * 0.86) / box.h))
      const cx = box.x + box.w / 2
      const cy = tall ? wy - 20 + areaH / 2 / s : wy + box.h / 2
      const tx = Math.min(0, Math.max(VIS_W - STAGE_W * s, areaW / 2 - cx * s))
      const ty = Math.min(0, Math.max(VIS_H - STAGE_H * s, areaH / 2 - cy * s))
      return { scroll, tx, ty, s }
    },
    [fit],
  )

  /** Where a tab button sits on the window, for the cursor. */
  const tabPoint = useCallback((t: ProfileTab) => {
    const root = page.current
    const btn = root?.querySelector('[data-tour="tabs"]')?.querySelectorAll<HTMLElement>('button')[(['overview', 'shipped', 'reviews', 'achievements'] as const).indexOf(t)]
    if (!root || !btn) return null
    const r = offsetIn(btn, root)
    return { x: r.x + r.w / 2, y: CHROME_H + NAV_H + r.y + r.h / 2 }
  }, [])

  // play the current scene, then advance
  useEffect(() => {
    if (!running) return
    const scene = SCENES[step]
    const timers: number[] = []
    const later = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms))

    if (scene.tab !== tab) setTab(scene.tab)
    const raf = requestAnimationFrame(() => setShot(frame(scene.focus, scene.zoom)))
    setFlipped(!!scene.flip)

    if (scene.click) {
      const target = scene.click
      later(80, () => {
        const pt = tabPoint(target)
        if (pt) setCursor((c) => ({ ...c, x: pt.x - 60, y: pt.y + 46, show: true }))
      })
      later(MOVE_MS - 50, () => {
        const pt = tabPoint(target)
        if (pt) setCursor((c) => ({ ...c, x: pt.x, y: pt.y }))
      })
      // the cursor lands, rests a beat, then presses for 150ms
      later(MOVE_MS - 50 + CURSOR_MS + 180, () => setCursor((c) => ({ ...c, press: true })))
      later(MOVE_MS - 50 + CURSOR_MS + 330, () => {
        setCursor((c) => ({ ...c, press: false }))
        setTab(target)
      })
      later(sceneMs(scene) - 150, () => setCursor((c) => ({ ...c, show: false })))
    }
    later(sceneMs(scene), () => {
      setStep((n) => (n + 1) % SCENES.length)
    })
    return () => {
      cancelAnimationFrame(raf)
      timers.forEach(clearTimeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, running])

  const move = `${MOVE_MS}ms ${EASE}`

  return (
    <div className="relative">
      <style>{`
        @keyframes tour-ping { from { transform: translate(-50%,-50%) scale(0.4); opacity: 0.7 } to { transform: translate(-50%,-50%) scale(1.9); opacity: 0 } }
      `}</style>

      {/* like the other screenshots on the page: laid out at the laptop width and scaled down on smaller screens
          (FitScale), with the window bleeding off the painting's right and bottom edges */}
      <FitScale width={FRAME_W} grow>
      <Painting src="/paintings/golden-path.webp" position="center 70%" className="rounded-[22px] border border-white/[0.06] pl-[5%] pt-14">
      <div className="float-layer shadow-[0_30px_80px_-10px_rgba(0,0,0,0.7)]" style={{ marginRight: -OVERHANG_X, marginBottom: -OVERHANG_Y }}>
      <div ref={outer} className="relative w-full overflow-hidden rounded-tl-xl pointer-events-none select-none" style={{ aspectRatio: `${VIS_W} / ${VIS_H}` }} role="img" aria-label="A tour of a Forke profile page">
        {fit > 0 && (
          <div
            className="absolute left-0 top-0 origin-top-left overflow-hidden rounded-xl border border-white/15 bg-[#151414]"
            style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${fit})` }}
          >
            {/* camera */}
            <div className="absolute inset-0 origin-top-left" style={{ transform: `translate(${shot.tx}px, ${shot.ty}px) scale(${shot.s})`, transition: `transform ${move}` }}>
              {/* browser chrome */}
              <div className="flex items-center gap-3 border-b border-white/[0.07] bg-[#1a1918] px-4" style={{ height: CHROME_H }}>
                <span className="flex gap-1.5">
                  <i className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <i className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <i className="h-2.5 w-2.5 rounded-full bg-white/15" />
                </span>
                <span className="ml-[280px] flex w-[300px] items-center justify-center gap-1.5 rounded-md bg-white/[0.05] py-1 font-mono text-[11.5px] text-white/55">
                  <BadgeCheck className="h-3 w-3 text-accent" /> forke.space/{PROFILE.username}
                </span>
              </div>
              {/* site nav */}
              <div className="flex items-center gap-10 border-b border-white/[0.06] px-8" style={{ height: NAV_H }}>
                <span className="text-[19px] font-semibold tracking-[-0.03em] text-white">
                  forke<span className="text-accent">*</span>
                </span>
                <span className="flex gap-7 text-[13px] text-white/55">
                  <span>What&rsquo;s Forke</span>
                  <span>Levels</span>
                  <span>Blogs</span>
                  <span>Contact us</span>
                </span>
              </div>
              {/* page viewport */}
              <div className="relative overflow-hidden" style={{ height: VIEW_H }}>
                <div ref={page} className="relative pb-16 pl-8 pt-8" style={{ paddingRight: 32 + (fit > 0 ? OVERHANG_X / fit : 0), transform: `translateY(${-shot.scroll}px)`, transition: `transform ${move}` }}>
                  <ProfileView p={PROFILE} card={CARD} cardStyle={CARD_STYLE} tab={tab} onTabChange={setTab} cardSlot={<TourCard flipped={flipped} pixelRatio={cardRatio} />} />
                </div>
              </div>
              {/* cursor */}
              <div
                className="pointer-events-none absolute left-0 top-0 z-10"
                style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)`, opacity: cursor.show ? 1 : 0, transition: `transform ${CURSOR_MS}ms ${EASE}, opacity 250ms ease` }}
              >
                {cursor.press && <span className="absolute left-0 top-0 h-9 w-9 rounded-full bg-accent/45 animate-[tour-ping_450ms_ease-out_forwards]" />}
                <MousePointer2
                  className="h-6 w-6 -translate-x-[3px] -translate-y-[2px] fill-white text-[#151414] drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
                  style={{ transform: cursor.press ? 'scale(0.85)' : 'scale(1)', transition: 'transform 120ms' }}
                />
              </div>
            </div>
          </div>
        )}

      </div>
      </div>
      </Painting>
      </FitScale>
    </div>
  )
}
