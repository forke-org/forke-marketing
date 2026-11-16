'use client'

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BadgeCheck,
  Blocks,
  Bell,
  Check,
  ChevronRight,
  ChevronDown,
  CircleDashed,
  ClipboardList,
  Clock,
  Code2,
  Database,
  FileCheck,
  FileCode2,
  Files,
  GitBranch,
  GitMerge,
  GitPullRequest,
  Globe,
  ImageIcon,
  LayoutDashboard,
  Loader2,
  Lock,
  Mail,
  Paperclip,
  Play,
  Plus,
  RotateCw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  TerminalSquare,
  User,
  Wallet,
  X,
} from 'lucide-react'
import { RiGithubFill } from '@remixicon/react'
import { cn } from './primitives'

/*
 * Hero preview: a looping, code-driven "screen recording" of the developer side of Forke, built from the real
 * dashboard pages with dummy data. Browse tasks → open one (file rules + the owner's attachments) → claim it → code
 * it in the Forke IDE → open a PR → checks and the AI review run → the owner approves → the payout lands in Earnings
 * → back to the board, which is exactly the first frame, so the loop is seamless.
 *
 * The window keeps its fixed 1068 × 580 size everywhere (the hero crops it); where a screen is too narrow to show all
 * of it, the whole window slides sideways to keep each step's action in view. The loop pauses off screen and shows
 * the still first frame for reduced motion.
 */

const W = 1068
const H = 580
const SIDEBAR = 220
const TOP = 48
const EASE = 'cubic-bezier(0.65, 0, 0.35, 1)'
// the camera, per screen size
type Mode = 'desktop' | 'tablet' | 'phone'
const CAM = {
  // desktop: today's window at its full view, no camera moves
  desktop: { winH: H, visible: 0, max: 1 },
  // tablet and phone: the frame bleeds off the right edge; the window is taller (just more page below) so wide
  // areas still fit when zoomed out
  tablet: { winH: 700, visible: 0, max: 1.2 },
  phone: { winH: 700, visible: 0, max: 1.1 },
} as const
const PHOTO = 'https://i.pravatar.cc/120?img=12'

type View = 'tasks' | 'detail' | 'review' | 'earnings'

// ---------------------------------------------------------------- dummy data

const TASKS = [
  { title: 'Speed up the search endpoint with a trigram index', amount: '6,800', tags: ['Postgres', 'Node.js'], by: 'Rohan Mehta', ago: '7h ago' },
  { title: 'Retry webhooks with exponential backoff', amount: '5,200', tags: ['Go', 'Redis'], by: 'Paylink', ago: '9h ago' },
  { title: 'Dark mode toggle with system preference', amount: '1,800', tags: ['React', 'Tailwind'], by: 'Notely', ago: '11h ago' },
  { title: 'CSV export for monthly invoices', amount: '3,000', tags: ['TypeScript'], by: 'Acme', ago: '1d ago' },
  { title: 'Fix hydration mismatch on the pricing page', amount: '2,200', tags: ['Next.js', 'React'], by: 'Shopkit', ago: '1d ago' },
  { title: 'Rate limit the public search API', amount: '4,500', tags: ['Rust', 'Redis'], by: 'Ledgerly', ago: '2d ago' },
]

// VS Code "Dark Modern" colours
const K = 'text-[#569cd6]'
const C2 = 'text-[#c586c0]'
const F = 'text-[#dcdcaa]'
const S = 'text-[#ce9178]'
const N = 'text-[#9cdcfe]'
const P = 'text-[#cccccc]'
const CM = 'text-[#6a9955]'
const CODE: { t: string; c?: string }[][] = [
  [{ t: '-- trigram index so ILIKE / % searches stop seq-scanning', c: CM }],
  [{ t: 'CREATE EXTENSION ', c: K }, { t: 'IF NOT EXISTS ', c: K }, { t: 'pg_trgm;', c: P }],
  [],
  [{ t: 'CREATE INDEX CONCURRENTLY ', c: K }, { t: 'products_name_trgm', c: N }],
  [{ t: '  ON ', c: K }, { t: 'products ', c: N }, { t: 'USING ', c: K }, { t: 'gin ', c: F }, { t: '(name gin_trgm_ops);', c: P }],
  [],
  [{ t: '-- before: 2140 ms at p95 · after: 38 ms', c: CM }],
]
const CODE_CHARS = CODE.reduce((a, l) => a + l.reduce((b, x) => b + x.t.length, 0) + 1, 0)
const QUERY_TS: { t: string; c?: string }[][] = [
  [{ t: 'export async function ', c: C2 }, { t: 'searchProducts', c: F }, { t: '(', c: P }, { t: 'q', c: N }, { t: ': ', c: P }, { t: 'string', c: 'text-[#4ec9b0]' }, { t: ') {', c: P }],
  [{ t: '  return ', c: C2 }, { t: 'db', c: N }, { t: '.', c: P }, { t: 'query', c: F }, { t: '(sql`', c: P }],
  [{ t: '    SELECT id, name, similarity(name, ${q}) AS rank', c: S }],
  [{ t: '    FROM products WHERE name % ${q}', c: S }],
  [{ t: '    ORDER BY rank DESC LIMIT 20`)', c: S }],
  [{ t: '}', c: P }],
]
const COMMIT_MSG = 'Add trigram index for product search'

const CHECKS = ['Build', 'Lint', 'Tests · 24 passed', 'Scope · only allowed files', 'AI review']

const NOTIFS = [
  { key: 'notif-pay', icon: 'pay', title: 'Payout released · ₹6,800', sub: 'Sent to johndoe@okaxis via UPI', ago: 'now' },
  { key: 'notif-merge', icon: 'merge', title: 'Rohan Mehta approved your PR', sub: 'acme/search-api#412 merged into main', ago: 'now' },
  { key: 'notif-ai', icon: 'ai', title: 'AI review passed · 94 / 100', sub: 'Merge-ready, no blocking issues', ago: '1m' },
] as const

// ---------------------------------------------------------------- the script

type Pt = { x: number; y: number }
type State = {
  app: 'browser' | 'code'
  view: View
  cursor: Pt & { press: boolean }
  scroll: number // detail page scroll
  zoomShot: boolean // attachment preview open
  claimed: boolean
  typing: boolean
  tests: 0 | 1 | 2 // idle, running, passed
  scm: boolean // VS Code source control view
  commit: 0 | 1 | 2 | 3 // empty, typing message, pushing, pushed (PR prompt)
  checks: number
  scoring: boolean
  approved: boolean
  bell: 0 | 1 | 2 // quiet, ringing with unread, open
  paid: boolean
  toast: { icon: 'claim' | 'paid'; title: string; sub: string } | null
  shot: string[] // the camera: data-cam regions (and data-hero targets) to frame together; ['wide'] = full view
}

const START: State = {
  app: 'browser',
  view: 'tasks',
  cursor: { x: 1000, y: 24, press: false }, // replaced with the real "Find a task" spot on mount
  scroll: 0,
  zoomShot: false,
  claimed: false,
  typing: false,
  tests: 0,
  scm: false,
  commit: 0,
  checks: 0,
  scoring: false,
  approved: false,
  bell: 0,
  paid: false,
  toast: null,
  shot: ['wide'], // every loop opens (and ends) on the full view
}

/** Centre and horizontal extent of a `data-hero` target inside the window, at the moment a beat runs. */
type At = (key: string, s: State) => Pt & { x1: number; x2: number }
type Beat = [number, Partial<State> | ((s: State, at: At) => Partial<State>)]
const press = (s: State) => ({ cursor: { ...s.cursor, press: true } })
const release = (s: State) => ({ cursor: { ...s.cursor, press: false } })
/** move the cursor to a target */
const go = (key: string) => (s: State, at: At) => {
  const p = at(key, s)
  return { cursor: { ...s.cursor, x: p.x, y: p.y } }
}

/** the full view holds this long before the camera moves in, so each loop opens on the whole screen */
const INTRO = 1500

const SCRIPT: Beat[] = [
  // 1 · browse: open the first task
  [500, (s, at) => ({ ...go('card-0')(s, at), shot: ['card0'] })],
  [1600, press],
  [1750, (s) => ({ ...release(s), view: 'detail', shot: ['brief'] })],
  // 2 · the brief: scroll to the file rules and the owner's attachments, open one
  [2900, { scroll: 250, shot: ['rules', 'attach'] }],
  [3900, go('shot-0')],
  [4700, press],
  [4850, (s) => ({ ...release(s), zoomShot: true, shot: ['modal'] })],
  [6600, { zoomShot: false }],
  [7000, { scroll: 0, shot: ['budget'] }],
  // 3 · claim it, open it in VS Code
  [7900, go('claim')],
  [8800, press],
  [8950, (s) => ({ ...release(s), claimed: true, toast: { icon: 'claim', title: 'Task claimed', sub: 'Start within 20:00 or it goes back to the board' } })],
  [10300, go('open-ide')],
  [11100, press],
  [11250, (s) => ({ ...release(s), app: 'code', toast: null, typing: true, shot: ['wide'] })],
  [12300, { shot: ['vs-lines'] }],
  // 4 · code it, run the tests, commit, push, open the PR
  [15200, { tests: 1, shot: ['vs-term-lines'] }],
  [16500, { tests: 2 }],
  [17600, (s, at) => ({ ...go('vs-scm')(s, at), shot: ['vs-scm', 'vs-commit'] })],
  [18400, press],
  [18550, (s) => ({ ...release(s), scm: true, commit: 1 })],
  [20300, go('vs-commit')],
  [21100, press],
  [21250, (s) => ({ ...release(s), commit: 2 })],
  [22300, { commit: 3, shot: ['vs-pr'] }],
  [23000, go('vs-create-pr')],
  [23800, press],
  [23950, (s) => ({ ...release(s), app: 'browser', view: 'review', shot: ['wide'] })],
  [24500, { shot: ['checks'] }],
  // 5 · checks + AI review, then the owner approves: the bell rings
  [24700, { checks: 1 }],
  [25300, { checks: 2 }],
  [25900, { checks: 3 }],
  [26500, { checks: 4, scoring: true, shot: ['score'] }],
  [27600, { checks: 5 }],
  [28400, { approved: true, bell: 1, shot: ['bell', 'status'] }],
  [29600, go('bell')],
  [30400, press],
  [30550, (s) => ({ ...release(s), bell: 2, shot: ['notifs'] })],
  [31800, go('notif-pay')],
  [32600, press],
  // 6 · get paid
  [32750, (s) => ({ ...release(s), bell: 0, view: 'earnings', shot: ['total'] })],
  [33200, { paid: true }],
  [33900, { toast: { icon: 'paid', title: '₹6,800 paid to johndoe@okaxis', sub: '+360 XP · Level 9 Architect' } }],
  [34600, { shot: ['toast'] }],
  // 7 · back to the board for the next one (this frame is the first frame)
  [36200, (s, at) => ({ ...go('find')(s, at), shot: ['find', 'bell'] })],
  [37000, press],
  [37150, (s) => ({ ...START, cursor: { ...s.cursor, press: false } })],
]
const BEATS: Beat[] = SCRIPT.map(([t, patch]) => [t + INTRO, patch])
const LOOP_MS = 38000 + INTRO

const linear = (k: number) => k
/** 0 → 1 over `ms` once `on` turns true (eased), driven by elapsed time so it always lands on schedule. */
function useProgress(on: boolean, ms: number, ease: (k: number) => number = linear) {
  const [k, setK] = useState(0)
  useEffect(() => {
    if (!on) {
      setK(0)
      return
    }
    const t0 = performance.now()
    let raf = 0
    const tick = () => {
      const x = Math.min(1, (performance.now() - t0) / ms)
      setK(ease(x))
      if (x < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    const done = window.setTimeout(() => setK(1), ms + 50)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(done)
    }
  }, [on, ms, ease])
  return k
}
const easeOut = (k: number) => 1 - Math.pow(1 - k, 3)

// ---------------------------------------------------------------- shell (sidebar + top bar), as in the dashboard

function NavItem({ icon, label, active, badge, hero }: { icon: ReactNode; label: string; active?: boolean; badge?: string; hero?: string }) {
  return (
    <div data-hero={hero} className={cn('relative flex h-8 items-center gap-2.5 rounded-lg px-2.5 text-[12.5px]', active ? 'bg-white/[0.06] text-white' : 'text-white/55')}>
      {active && <span className="absolute -left-3 top-1.5 h-5 w-[3px] rounded-r bg-accent" />}
      <span className={cn('flex h-4 w-4 items-center justify-center', active ? 'text-accent' : 'text-white/40')}>{icon}</span>
      {label}
      {badge && <span className="ml-auto rounded-full bg-accent/15 px-1.5 font-mono text-[10px] text-accent-text">{badge}</span>}
    </div>
  )
}

function Sidebar({ view, xp }: { view: View; xp: number }) {
  const at = (v: View) => view === v || (v === 'tasks' && view === 'detail')
  return (
    <aside data-cam="sidebar" className="flex shrink-0 flex-col border-r border-[rgba(240,227,222,0.09)] bg-[#151414]" style={{ width: SIDEBAR }}>
      <div className="flex h-11 items-center justify-between px-4">
        <span className="text-[17px] font-semibold tracking-[-0.04em] text-white">
          forke<span className="text-accent">*</span>
        </span>
        <span className="rounded-full border border-[rgba(240,227,222,0.09)] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-white/40">dev</span>
      </div>
      <div className="px-3">
        <div className="rounded-xl border border-[rgba(240,227,222,0.09)] bg-white/[0.02] p-2.5">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PHOTO} alt="" className="h-8 w-8 rounded-full border border-accent/25 object-cover" />
            <div className="min-w-0">
              <p className="flex items-center gap-1 text-[12.5px] text-white">
                John Doe <BadgeCheck className="h-3 w-3 text-accent" />
              </p>
              <p className="font-mono text-[10px] text-white/40">@johndoe</p>
            </div>
          </div>
          <div className="mt-2.5 flex justify-between font-mono text-[9.5px] text-white/40">
            <span>Lvl 9 · Architect</span>
            <span>{xp}%</span>
          </div>
          <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/[0.08]">
            <div className="h-full rounded-full bg-[linear-gradient(90deg,#a03a02,#FF7A00,#FFA347)]" style={{ width: `${xp}%`, transition: `width 1.2s ${EASE}` }} />
          </div>
        </div>
      </div>
      <div className="mt-3 space-y-3 px-3">
        <div>
          <p className="px-2.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/30">Work</p>
          <div className="mt-1 space-y-0.5">
            <NavItem icon={<LayoutDashboard className="h-3.5 w-3.5" />} label="Overview" />
            <NavItem icon={<ClipboardList className="h-3.5 w-3.5" />} label="Tasks" active={at('tasks')} />
            <NavItem icon={<FileCheck className="h-3.5 w-3.5" />} label="Submissions" active={at('review')} />
            <NavItem icon={<Mail className="h-3.5 w-3.5" />} label="Messages" badge="2" />
          </div>
        </div>
        <div>
          <p className="px-2.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/30">You</p>
          <div className="mt-1 space-y-0.5">
            <NavItem icon={<User className="h-3.5 w-3.5" />} label="Profile" />
            <NavItem icon={<Wallet className="h-3.5 w-3.5" />} label="Earnings" active={at('earnings')} hero="nav-earnings" />
            <NavItem icon={<Settings className="h-3.5 w-3.5" />} label="Settings" />
          </div>
        </div>
      </div>
    </aside>
  )
}

function TopBar({ crumb, bell }: { crumb: string; bell: State['bell'] }) {
  return (
    <div className="flex shrink-0 items-center gap-3 border-b border-[rgba(240,227,222,0.09)] bg-[#151414]/85 px-5" style={{ height: TOP }}>
      <p className="font-mono text-[11px] text-white/40">
        dashboard <span className="text-white/20">/</span> <span className="text-white/80">{crumb}</span>
      </p>
      <span data-hero="bell" className={cn('relative ml-auto flex h-8 w-8 items-center justify-center rounded-lg transition-colors', bell === 2 ? 'bg-white/[0.08] text-white' : 'text-white/55')}>
        <Bell className={cn('h-4 w-4 origin-top', bell === 1 && 'animate-[bell-ring_1.1s_ease-in-out_infinite]')} />
        <span
          className="absolute right-1 top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-accent px-[3px] font-mono text-[8.5px] font-semibold text-[#1a0a00]"
          style={{ opacity: bell === 1 ? 1 : 0, transform: bell === 1 ? 'scale(1)' : 'scale(0.4)', transition: `opacity 250ms, transform 350ms ${EASE}` }}
        >
          3
        </span>
      </span>
      <span data-hero="find" className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-accent bg-accent px-3 text-[12px] font-medium text-[#1a0a00] shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_8px_24px_-8px_rgba(255,122,0,0.5)]">
        <Sparkles className="h-3.5 w-3.5" /> Find a task
      </span>
    </div>
  )
}

// ---------------------------------------------------------------- pages

function TasksPage() {
  return (
    <div className="p-5">
      <p className="text-[22px] font-medium tracking-[-0.02em] text-white">Browse tasks</p>
      <p className="mt-0.5 text-[12px] text-white/45">Find work that matches your skills, claim it, ship it, and get paid.</p>
      <div className="mt-3 flex h-9 items-center gap-2 rounded-lg border border-[rgba(240,227,222,0.09)] bg-white/[0.02] px-3 text-[12px] text-white/35">
        <Search className="h-3.5 w-3.5" /> Search missions by title, description...
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-[11px]">
        <span className="rounded-md border border-accent/40 bg-accent/10 px-2.5 py-1 text-accent-text">All tasks</span>
        <span className="rounded-md px-2.5 py-1 text-white/45">Unclaimed</span>
        <span className="rounded-md px-2.5 py-1 text-white/45">Claimed</span>
        <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.12em] text-white/30">Showing 6 tasks</span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2.5">
        {TASKS.map((t, i) => (
          <div key={t.title} data-cam={`card${i}`} className="flex flex-col rounded-xl border border-[rgba(240,227,222,0.09)] bg-white/[0.018] p-3.5">
            <div className="flex items-start justify-between gap-2">
              <p className="line-clamp-2 min-h-[34px] text-[12.5px] font-medium leading-[17px] text-white">{t.title}</p>
              <span className="shrink-0 rounded border border-accent/20 bg-accent/10 px-1.5 py-0.5 text-[11.5px] font-medium tabular-nums text-accent">₹{t.amount}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {t.tags.map((g) => (
                <span key={g} className="rounded border border-[rgba(240,227,222,0.09)] bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-[#8E8E93]">
                  {g}
                </span>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-[rgba(240,227,222,0.09)] pt-2.5 text-[10.5px] text-[#8E8E93]">
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" /> by <span className="text-white/70">{t.by}</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {t.ago}
              </span>
            </div>
            <span data-hero={`card-${i}`} className="mt-2.5 flex h-8 items-center justify-center gap-1 rounded-lg bg-accent text-[12px] font-medium text-[#1a0a00]">
              View details <ChevronRight className="h-3.5 w-3.5" />
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Owner attachments, drawn in code so they read as screenshots without loading images. */
function ShotExplain({ big }: { big?: boolean }) {
  return (
    <div className={cn('h-full w-full bg-[#0f0e0e] p-2.5 font-mono leading-[1.5] text-white/60', big ? 'text-[11px]' : 'text-[6.5px]')}>
      <p className="text-white/35">EXPLAIN ANALYZE SELECT … ILIKE &apos;%chair%&apos;</p>
      <p>
        Seq Scan on products <span className="text-red-300">(cost=0..48211)</span>
      </p>
      <p className="pl-2">Filter: (name ~~* &apos;%chair%&apos;)</p>
      <p className="pl-2">Rows Removed by Filter: 1,204,388</p>
      <p>
        Execution Time: <span className="text-red-300">2140.6 ms</span>
      </p>
    </div>
  )
}
function ShotChart({ big }: { big?: boolean }) {
  const bars = [72, 80, 76, 88, 84, 92, 86, 95, 90, 97]
  return (
    <div className="flex h-full w-full flex-col bg-[#0f0e0e] p-2.5">
      <p className={cn('font-mono text-white/40', big ? 'text-[11px]' : 'text-[6.5px]')}>/api/products?q= · p95 latency</p>
      <div className="mt-auto flex h-[70%] items-end gap-[3px]">
        {bars.map((b, i) => (
          <span key={i} className="flex-1 rounded-t-[2px] bg-gradient-to-t from-red-500/40 to-red-400/80" style={{ height: `${b}%` }} />
        ))}
      </div>
      <p className={cn('mt-1 font-mono text-red-300', big ? 'text-[11px]' : 'text-[6.5px]')}>2.1 s at p95, target &lt; 100 ms</p>
    </div>
  )
}
function ShotUi({ big }: { big?: boolean }) {
  return (
    <div className="relative h-full w-full bg-[#f4f1ef] p-2.5">
      <div className={cn('flex items-center gap-1 rounded-md border border-black/10 bg-white px-1.5 py-1 text-black/60', big ? 'text-[12px]' : 'text-[7px]')}>
        <Search className={big ? 'h-3.5 w-3.5' : 'h-2 w-2'} /> chair
      </div>
      <div className="mt-1.5 space-y-1">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-[9%] rounded bg-black/[0.07]" />
        ))}
      </div>
      <span className={cn('absolute bottom-2 right-2 rounded bg-[#FF7A00] px-1.5 py-0.5 font-medium text-black', big ? 'text-[11px]' : 'text-[6px]')}>
        spins for 2s here
      </span>
    </div>
  )
}
const SHOTS = [
  { name: 'explain-analyze.png', Shot: ShotExplain },
  { name: 'p95-latency.png', Shot: ShotChart },
  { name: 'search-ui.png', Shot: ShotUi },
]

function DetailPage({ s }: { s: State }) {
  return (
    <div className="relative h-full overflow-hidden">
      <div data-scroll={s.scroll} className="grid grid-cols-[minmax(0,1fr)_268px] gap-4 p-5" style={{ transform: `translateY(${-s.scroll}px)`, transition: `transform 700ms ${EASE}` }}>
        {/* the brief */}
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-[11.5px] text-white/45">
            <ArrowLeft className="h-3 w-3" /> Back to tasks
          </p>
          <div data-cam="brief" className="mt-3 rounded-xl border border-[rgba(240,227,222,0.09)] bg-[#1A1919] p-4">
            <span className="rounded border border-accent/30 bg-accent/10 px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-accent-text">Mission briefing</span>
            <p className="mt-2.5 text-[21px] font-medium leading-[1.15] tracking-[-0.02em] text-white">Speed up the search endpoint with a trigram index</p>
            <p className="mt-3 border-t border-[rgba(240,227,222,0.09)] pt-3 font-mono text-[9.5px] uppercase tracking-[0.12em] text-white/40">Objective &amp; description</p>
            <p className="mt-1.5 text-[12px] leading-[18px] text-white/65">
              Search on /api/products takes 2s at p95. Add a pg_trgm index and rewrite the query to use it. Include a migration and before/after timings.
            </p>
            <div className="mt-3 flex gap-1.5">
              {['Postgres', 'Node.js'].map((g) => (
                <span key={g} className="rounded border border-[rgba(240,227,222,0.09)] bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-[#8E8E93]">
                  {g}
                </span>
              ))}
            </div>
          </div>

          {/* file rules set by the owner */}
          <div data-cam="rules" className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-[rgba(240,227,222,0.09)] bg-[#1A1919] p-3.5">
              <p className="flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-emerald-300/80">
                <FileCode2 className="h-3 w-3" /> Files you can edit
              </p>
              <div className="mt-2 space-y-1 font-mono text-[11px] text-white/75">
                {['src/search/*', 'migrations/*', 'test/search.spec.ts'].map((f) => (
                  <p key={f} className="flex items-center gap-1.5">
                    <Check className="h-3 w-3 text-emerald-400" /> {f}
                  </p>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-[rgba(240,227,222,0.09)] bg-[#1A1919] p-3.5">
              <p className="flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-red-300/80">
                <Lock className="h-3 w-3" /> Off-limits
              </p>
              <div className="mt-2 space-y-1 font-mono text-[11px] text-white/45">
                {['src/auth/*', '.env*', 'infra/*'].map((f) => (
                  <p key={f} className="flex items-center gap-1.5">
                    <Lock className="h-3 w-3 text-white/30" /> {f}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* attachments from the owner */}
          <div data-cam="attach" className="mt-3 rounded-xl border border-[rgba(240,227,222,0.09)] bg-[#1A1919] p-3.5">
            <p className="flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-white/40">
              <Paperclip className="h-3 w-3" /> Attachments from Rohan
            </p>
            <div className="mt-2.5 grid grid-cols-3 gap-2.5">
              {SHOTS.map(({ name, Shot }, i) => (
                <div key={name} data-hero={`shot-${i}`}>
                  <div className="aspect-[16/10] overflow-hidden rounded-lg border border-white/10">
                    <Shot />
                  </div>
                  <p className="mt-1 flex items-center gap-1 truncate font-mono text-[9.5px] text-white/45">
                    <ImageIcon className="h-2.5 w-2.5 shrink-0" /> {name}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-2.5 rounded-lg bg-white/[0.03] px-2.5 py-2 text-[11px] leading-4 text-white/55">
              <span className="text-white/80">Rohan:</span> the slow plan and the spinner are attached. Keep the response shape the same, the mobile app reads it.
            </p>
          </div>
        </div>

        {/* budget + claim */}
        <div className="pt-[30px]">
          <div data-cam="budget" className="rounded-xl border border-[rgba(240,227,222,0.09)] bg-[#1A1919] p-4">
            <p className="text-[11px] text-[#8E8E93]">Budget</p>
            <p className="mt-0.5 text-[26px] font-medium tracking-[-0.03em] text-accent">₹6,800</p>
            <p className="flex items-center gap-1 text-[10.5px] text-emerald-300/80">
              <ShieldCheck className="h-3 w-3" /> held in escrow
            </p>
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center gap-2 rounded-lg border border-[rgba(240,227,222,0.09)] bg-white/[0.02] px-2.5 py-2">
                <User className="h-3.5 w-3.5 text-accent" />
                <div>
                  <p className="font-mono text-[8.5px] uppercase tracking-[0.12em] text-white/35">Client</p>
                  <p className="text-[11.5px] text-white">Rohan Mehta</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-[rgba(240,227,222,0.09)] bg-white/[0.02] px-2.5 py-2">
                <Clock className="h-3.5 w-3.5 text-accent" />
                <div>
                  <p className="text-[9.5px] text-white/40">Posted</p>
                  <p className="text-[11.5px] text-white">7 hours ago</p>
                </div>
              </div>
            </div>
            <div data-hero="claim" className="relative mt-3 h-9">
              <span
                className="absolute inset-0 flex items-center justify-center gap-1.5 rounded-lg bg-accent text-[12px] font-medium text-[#1a0a00]"
                style={{ opacity: s.claimed ? 0 : 1, transition: 'opacity 250ms' }}
              >
                <RiGithubFill className="h-3.5 w-3.5" /> Claim task
              </span>
              <span
                className="absolute inset-0 flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 text-[11.5px] text-emerald-300"
                style={{ opacity: s.claimed ? 1 : 0, transition: 'opacity 250ms' }}
              >
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Claimed by you
                </span>
                <span className="font-mono tabular-nums">{s.claimed ? <Countdown /> : '20:00'}</span>
              </span>
            </div>
            <span
              data-hero="open-ide"
              className="mt-2 flex h-9 items-center justify-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.04] text-[12px] text-white/85"
              style={{ opacity: s.claimed ? 1 : 0.35, transition: 'opacity 300ms' }}
            >
              <Code2 className="h-3.5 w-3.5" /> Open in VS Code
            </span>
          </div>
        </div>
      </div>

      {/* attachment preview */}
      <div
        className="absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-[2px]"
        style={{ opacity: s.zoomShot ? 1 : 0, transition: 'opacity 300ms' }}
      >
        <div
          data-cam="modal"
          className="w-[440px] overflow-hidden rounded-xl border border-white/15 bg-[#1A1919] shadow-[0_30px_80px_-10px_rgba(0,0,0,0.9)]"
          style={{ transform: s.zoomShot ? 'scale(1)' : 'scale(0.6)', transition: `transform 450ms ${EASE}` }}
        >
          <div className="aspect-[16/10]">
            <ShotExplain big />
          </div>
          <p className="flex items-center justify-between border-t border-white/10 px-3 py-2 font-mono text-[10.5px] text-white/50">
            explain-analyze.png <span className="text-white/30">from Rohan</span>
          </p>
        </div>
      </div>
    </div>
  )
}

function Countdown() {
  const [left, setLeft] = useState(20 * 60)
  useEffect(() => {
    const id = setInterval(() => setLeft((n) => Math.max(0, n - 1)), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <>
      {String(Math.floor(left / 60)).padStart(2, '0')}:{String(left % 60).padStart(2, '0')}
    </>
  )
}

/** The developer's own editor: a VS Code window ("Dark Modern"), where the task actually gets done. */
/** VS Code file-type icons: a TypeScript badge, and a database for SQL */
function TsIcon() {
  return <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[2px] bg-[#3178c6] text-[6.5px] font-bold leading-none text-white">TS</span>
}
function SqlIcon() {
  return <Database className="h-3.5 w-3.5 shrink-0 text-[#e2c08d]" strokeWidth={1.75} />
}

function VsCode({ s }: { s: State }) {
  const typed = Math.round(useProgress(s.typing, 3400) * CODE_CHARS)
  const msg = Math.round(useProgress(s.commit >= 1, 1300) * COMMIT_MSG.length)

  let left = typed
  const line = (segs: { t: string; c?: string }[], i: number, budget: boolean) => {
    const out: ReactNode[] = []
    for (const seg of segs) {
      if (budget && left <= 0) break
      const t = budget ? seg.t.slice(0, left) : seg.t
      if (budget) left -= seg.t.length
      out.push(
        <span key={out.length} className={seg.c}>
          {t}
        </span>,
      )
    }
    if (budget) left -= 1
    return out
  }
  const caretLine = (() => {
    let n = typed
    for (let i = 0; i < CODE.length; i++) {
      const len = CODE[i].reduce((a, x) => a + x.t.length, 0) + 1
      if (n < len) return i
      n -= len
    }
    return CODE.length - 1
  })()

  const ActivityIcon = ({ icon, active, badge, hero }: { icon: ReactNode; active?: boolean; badge?: string; hero?: string }) => (
    <span data-hero={hero} className={cn('relative flex h-11 w-12 items-center justify-center', active ? 'text-white' : 'text-[#858585]')}>
      {active && <span className="absolute left-0 top-2 h-7 w-[2px] bg-[#0078d4]" />}
      {icon}
      {badge && <span className="absolute bottom-2 right-2.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[#0078d4] px-[3px] text-[8.5px] font-semibold text-white">{badge}</span>}
    </span>
  )

  return (
    <div className="flex h-full flex-col bg-[#1f1f1f] text-[#cccccc]">
      {/* title bar */}
      <div className="relative flex h-[34px] shrink-0 items-center border-b border-[#2b2b2b] bg-[#181818] px-3">
        <span className="flex gap-2">
          <i className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <i className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <i className="h-3 w-3 rounded-full bg-[#28c840]" />
        </span>
        <span className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-md border border-[#2b2b2b] bg-[#1f1f1f] px-24 py-[3px] text-[11.5px] text-[#9d9d9d]">
          <Search className="h-3 w-3" /> search-api
        </span>
        <span className="ml-auto flex items-center gap-1.5 text-[11px] text-[#9d9d9d]">
          <GitBranch className="h-3 w-3" /> forke/trgm-search
        </span>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* activity bar */}
        <div className="flex w-12 shrink-0 flex-col border-r border-[#2b2b2b] bg-[#181818]">
          <ActivityIcon icon={<Files className="h-[22px] w-[22px]" strokeWidth={1.5} />} active={!s.scm} />
          <ActivityIcon icon={<Search className="h-[21px] w-[21px]" strokeWidth={1.5} />} />
          <ActivityIcon icon={<GitBranch className="h-[21px] w-[21px]" strokeWidth={1.5} />} active={s.scm} badge={s.commit >= 2 ? undefined : '2'} hero="vs-scm" />
          <ActivityIcon icon={<Play className="h-[21px] w-[21px]" strokeWidth={1.5} />} />
          <ActivityIcon icon={<Blocks className="h-[21px] w-[21px]" strokeWidth={1.5} />} />
        </div>

        {/* side bar: explorer or source control */}
        <div data-cam="vs-side" className="relative w-[230px] shrink-0 border-r border-[#2b2b2b] bg-[#181818] text-[12px]">
          <div className="absolute inset-0 p-2" style={{ opacity: s.scm ? 0 : 1, transition: 'opacity 250ms' }}>
            <p className="px-2 pb-2 pt-1 text-[10.5px] uppercase tracking-[0.06em] text-[#bbbbbb]">Explorer</p>
            <p className="flex items-center gap-1 px-1 text-[11px] font-semibold uppercase text-[#cccccc]">
              <ChevronDown className="h-3.5 w-3.5" /> search-api
            </p>
            <div className="mt-1 space-y-[2px] text-[12.5px]">
              <p className="flex items-center gap-1.5 pl-4 text-[#cccccc]">
                <ChevronDown className="h-3 w-3 text-[#858585]" /> migrations
              </p>
              <p className="flex items-center gap-1.5 bg-[#04395e] py-[1px] pl-9 text-white">
                <SqlIcon /> 0042_products_trgm.sql <span className="ml-auto pr-2 text-[#73c991]">U</span>
              </p>
              <p className="flex items-center gap-1.5 pl-4 text-[#cccccc]">
                <ChevronDown className="h-3 w-3 text-[#858585]" /> src
              </p>
              <p className="flex items-center gap-1.5 pl-7 text-[#cccccc]">
                <ChevronDown className="h-3 w-3 text-[#858585]" /> search
              </p>
              <p className="flex items-center gap-1.5 pl-11 text-[#e2c08d]">
                <TsIcon /> query.ts <span className="ml-auto pr-2">M</span>
              </p>
              <p className="flex items-center gap-1.5 pl-7 text-[#8b8b8b]">
                <ChevronRight className="h-3 w-3" /> auth <Lock className="ml-auto mr-2 h-3 w-3" />
              </p>
              <p className="flex items-center gap-1.5 pl-4 text-[#cccccc]">
                <ChevronRight className="h-3 w-3 text-[#858585]" /> test
              </p>
              <p className="flex items-center gap-1.5 pl-4 text-[#8b8b8b]">
                <ChevronRight className="h-3 w-3" /> infra <Lock className="ml-auto mr-2 h-3 w-3" />
              </p>
              <p className="pl-8 text-[#cccccc]">package.json</p>
            </div>
          </div>

          <div className="absolute inset-0 p-2" style={{ opacity: s.scm ? 1 : 0, transition: 'opacity 250ms' }}>
            <p className="px-2 pb-2 pt-1 text-[10.5px] uppercase tracking-[0.06em] text-[#bbbbbb]">Source control</p>
            {s.commit === 2 && <div className="absolute inset-x-0 top-[30px] h-[2px] overflow-hidden"><div className="h-full w-1/3 animate-[vs-progress_900ms_linear_infinite] bg-[#0078d4]" /></div>}
            <div className="mx-1 rounded-[3px] border border-[#0078d4] bg-[#313131] px-2 py-1.5 text-[12px] text-[#cccccc]">
              {msg > 0 ? COMMIT_MSG.slice(0, msg) : <span className="text-[#8b8b8b]">Message (⌘Enter to commit)</span>}
              {s.commit === 1 && <span className="ml-px inline-block h-3 w-px animate-pulse bg-white align-middle" />}
            </div>
            <span
              data-hero="vs-commit"
              className="mx-1 mt-2 flex h-[26px] items-center justify-center gap-1.5 rounded-[3px] bg-[#0078d4] text-[12px] text-white"
            >
              {s.commit >= 2 ? (
                <>
                  <ArrowUp className="h-3.5 w-3.5" /> {s.commit === 2 ? 'Pushing…' : 'Pushed'}
                </>
              ) : (
                <>
                  <Check className="h-3.5 w-3.5" /> Commit &amp; Push
                </>
              )}
            </span>
            <div className="mt-3" style={{ opacity: s.commit >= 2 ? 0.35 : 1, transition: 'opacity 300ms' }}>
              <p className="flex items-center gap-1 px-1 text-[11px] font-semibold uppercase text-[#cccccc]">
                <ChevronDown className="h-3.5 w-3.5" /> Changes <span className="ml-auto mr-1 rounded-full bg-[#616161] px-1.5 text-[10px]">2</span>
              </p>
              <p className="mt-1 flex items-center gap-1.5 pl-5 text-[12.5px] text-[#73c991]">
                <SqlIcon /> 0042_products_trgm.sql <span className="ml-auto pr-2">U</span>
              </p>
              <p className="flex items-center gap-1.5 pl-5 text-[12.5px] text-[#e2c08d]">
                <TsIcon /> query.ts <span className="ml-auto pr-2">M</span>
              </p>
            </div>
          </div>
        </div>

        {/* editor + panel */}
        <div className="relative flex min-w-0 flex-1 flex-col">
          <div className="flex h-[35px] shrink-0 bg-[#181818] text-[12.5px]">
            <span className="flex items-center gap-1.5 border-r border-t-2 border-r-[#2b2b2b] border-t-[#0078d4] bg-[#1f1f1f] px-3 text-white">
              <SqlIcon /> 0042_products_trgm.sql <span className="ml-1 h-2 w-2 rounded-full bg-white/70" />
            </span>
            <span className="flex items-center gap-1.5 border-r border-[#2b2b2b] px-3 text-[#9d9d9d]">
              <TsIcon /> query.ts
            </span>
          </div>
          <p className="flex h-[22px] shrink-0 items-center gap-1 px-4 text-[11.5px] text-[#9d9d9d]">
            migrations <ChevronRight className="h-3 w-3" /> 0042_products_trgm.sql
          </p>
          <div data-cam="vs-code" className="min-h-0 flex-1 overflow-hidden py-1 font-mono text-[12.5px] leading-[19px]">
            <div data-cam="vs-lines" className="w-fit min-w-[460px]">
            {CODE.map((segs, i) => (
              <div key={i} className={cn('flex', s.typing && i === caretLine && typed < CODE_CHARS && 'bg-white/[0.04]')}>
                <span className={cn('w-12 shrink-0 pr-4 text-right', i === caretLine ? 'text-[#cccccc]' : 'text-[#6e7681]')}>{i + 1}</span>
                <span className="whitespace-pre">
                  {line(segs, i, true)}
                  {s.typing && i === caretLine && <span className="ml-px inline-block h-[15px] w-[2px] animate-pulse bg-[#aeafad] align-middle" />}
                </span>
              </div>
            ))}
            </div>
            <div className="mt-3 border-t border-dashed border-[#2b2b2b] pt-2 opacity-60">
              <p className="pl-16 font-sans text-[10.5px] text-[#9d9d9d]">src/search/query.ts</p>
              {QUERY_TS.map((segs, i) => (
                <div key={i} className="flex">
                  <span className="w-12 shrink-0 pr-4 text-right text-[#6e7681]">{i + 12}</span>
                  <span className="whitespace-pre">{line(segs, i, false)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* integrated terminal */}
          <div data-cam="vs-term" className="h-[150px] shrink-0 border-t border-[#2b2b2b] bg-[#181818] font-mono text-[12px] leading-[18px]">
            <div className="flex h-[30px] items-center gap-5 px-4 font-sans text-[11px] uppercase tracking-[0.04em] text-[#9d9d9d]">
              <span>Problems</span>
              <span>Output</span>
              <span className="border-b border-[#e7e7e7] pb-[5px] pt-[6px] text-[#e7e7e7]">Terminal</span>
              <span className="ml-auto flex items-center gap-1 normal-case">
                <TerminalSquare className="h-3.5 w-3.5" /> zsh
              </span>
            </div>
            <div data-cam="vs-term-lines" className="w-fit px-4">
              <p>
                <span className="text-[#73c991]">john@mbp</span> <span className="text-[#3b8eea]">search-api</span>{' '}
                <span className="text-[#c586c0]">(forke/trgm-search)</span> $ {s.tests > 0 ? 'npm test' : ''}
                {s.tests === 0 && <span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-[#cccccc] align-middle" />}
              </p>
              {s.tests === 1 && (
                <p className="flex items-center gap-1.5 text-[#9d9d9d]">
                  <Loader2 className="h-3 w-3 animate-spin" /> running 24 tests…
                </p>
              )}
              {s.tests === 2 && (
                <>
                  <p className="text-[#73c991]"> ✓ search returns ranked results (38 ms)</p>
                  <p className="text-[#73c991]"> ✓ response shape unchanged</p>
                  <p>
                    Tests: <span className="text-[#73c991]">24 passed</span>, 24 total · p95 <span className="text-[#f48771] line-through">2140 ms</span>{' '}
                    → <span className="text-[#73c991]">38 ms</span>
                  </p>
                </>
              )}
            </div>
          </div>

          {/* VS Code notification after the push */}
          <div
            data-cam="vs-pr"
            className="absolute bottom-[160px] right-3 w-[330px] rounded-md border border-[#2b2b2b] bg-[#252526] p-3 text-[12px] shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
            style={{ opacity: s.commit === 3 ? 1 : 0, transform: s.commit === 3 ? 'translateY(0)' : 'translateY(10px)', transition: `opacity 300ms, transform 400ms ${EASE}` }}
          >
            <p className="flex items-start gap-2 text-[#cccccc]">
              <RiGithubFill className="mt-0.5 h-4 w-4 shrink-0 text-white" />
              Pushed forke/trgm-search. Create a pull request on forke-sandbox/search-api?
            </p>
            <div className="mt-2.5 flex justify-end gap-2">
              <span className="rounded-[3px] bg-[#313131] px-2.5 py-1 text-[#cccccc]">Not now</span>
              <span data-hero="vs-create-pr" className="rounded-[3px] bg-[#0078d4] px-2.5 py-1 text-white">
                Create Pull Request
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ReviewPage({ s }: { s: State }) {
  const score = Math.round(useProgress(s.scoring, 1000, easeOut) * 94)
  const C = 2 * Math.PI * 30
  return (
    <div className="p-4">
      <p className="text-[22px] font-medium tracking-[-0.02em] text-white">Submission history</p>
      <p className="mt-0.5 text-[12px] text-white/45">Track status, review cycles and completed payouts for all your claimed tasks.</p>
      <div className="mt-3 flex items-center gap-2">
        <span className={cn('flex h-7 w-7 items-center justify-center rounded-lg border', s.approved ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-amber-500/30 bg-amber-500/10 text-amber-400')}>
          {s.approved ? <Check className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
        </span>
        <p className="text-[13px] text-white">{s.approved ? 'Completed work' : 'Active reviews'}</p>
        <span className={cn('ml-auto rounded-full px-2 py-0.5 font-mono text-[10px]', s.approved ? 'bg-emerald-500/10 text-emerald-300' : 'bg-amber-500/10 text-amber-300')}>1 entry</span>
      </div>
      <div className="mt-2 rounded-xl border border-[rgba(240,227,222,0.09)] bg-[#1A1919] p-3.5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[14px] font-medium text-white">Speed up the search endpoint with a trigram index</p>
            <p className="mt-1 flex items-center gap-3 text-[11px] text-white/45">
              <span className="text-accent">₹6,800</span>
              <span className="flex items-center gap-1">
                <GitPullRequest className="h-3 w-3" /> acme/search-api#412
              </span>
              <span>+42 −9 · 2 files</span>
            </p>
          </div>
          <span
            data-cam="status"
            className={cn(
              'flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium',
              s.approved ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/10 text-amber-300',
            )}
          >
            {s.approved ? (
              <>
                <GitMerge className="h-3 w-3" /> Merged
              </>
            ) : (
              <>
                <CircleDashed className="h-3 w-3" /> In review
              </>
            )}
          </span>
        </div>
        <div className="mt-3 grid grid-cols-[minmax(0,1fr)_200px] gap-4 border-t border-[rgba(240,227,222,0.09)] pt-3">
          <div data-cam="checks" className="space-y-1.5">
            {CHECKS.map((c, i) => {
              const done = s.checks > i
              const running = s.checks === i
              return (
                <div key={c} className="flex items-center gap-2.5 text-[12px]">
                  <span
                    className={cn(
                      'flex h-5 w-5 items-center justify-center rounded-full border transition-colors duration-300',
                      done ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400' : 'border-white/10 text-white/30',
                    )}
                  >
                    {done ? <Check className="h-3 w-3" /> : running ? <Loader2 className="h-3 w-3 animate-spin" /> : <CircleDashed className="h-3 w-3" />}
                  </span>
                  <span className={done ? 'text-white/85' : 'text-white/45'}>{c}</span>
                  <span className="ml-auto font-mono text-[10px] text-white/30">{done ? `${[18, 6, 41, 3, 52][i]}s` : running ? 'running' : 'queued'}</span>
                </div>
              )
            })}
          </div>
          <div data-cam="score" className="flex flex-col items-center justify-center rounded-xl border border-[rgba(240,227,222,0.09)] bg-white/[0.02] p-3">
            <svg viewBox="0 0 72 72" className="h-[84px] w-[84px] -rotate-90">
              <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
              <circle cx="36" cy="36" r="30" fill="none" stroke="#FF7A00" strokeWidth="6" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - score / 100)} />
            </svg>
            <p className="-mt-[58px] mb-[30px] font-mono text-[20px] font-semibold tabular-nums text-white">{score}</p>
            <p className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-white/40">AI review score</p>
            <p className={cn('mt-1 text-[11px]', score >= 94 ? 'text-emerald-300' : 'text-white/35')}>{score >= 94 ? 'Merge-ready' : 'Reviewing…'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function EarningsPage({ s }: { s: State }) {
  const total = Math.round(24800 + useProgress(s.paid, 1100, easeOut) * 6800)
  const rows = [
    { t: 'Fix N+1 query on invoice list endpoint', d: '5 Nov 2026', a: '6,500' },
    { t: 'Add idempotency keys to checkout', d: '24 Oct 2026', a: '9,000' },
    { t: 'Index audit_log by tenant and created_at', d: '5 Oct 2026', a: '3,500' },
  ]
  return (
    <div className="p-5">
      <p className="text-[22px] font-medium tracking-[-0.02em] text-white">My earnings</p>
      <p className="mt-0.5 text-[12px] text-white/45">Track payouts from completed tasks and pending earnings awaiting client sign-off.</p>
      <div className="mt-4 grid grid-cols-3 gap-2.5">
        {[
          { k: 'Total earned', v: `₹${total.toLocaleString('en-IN')}`, sub: 'Lifetime payouts', hot: s.paid },
          { k: 'Pending payout', v: s.paid ? '₹0' : '₹6,800', sub: 'Awaiting client approval' },
          { k: 'Tasks settled', v: s.paid ? '5' : '4', sub: 'Verified completions' },
        ].map((c) => (
          <div key={c.k} data-cam={c.k === 'Total earned' ? 'total' : undefined} className={cn('rounded-xl border bg-[#1A1919] p-3.5 transition-colors duration-500', c.hot ? 'border-emerald-500/30' : 'border-[rgba(240,227,222,0.09)]')}>
            <p className="text-[11px] text-white/45">{c.k}</p>
            <p className="mt-1 text-[24px] font-medium tabular-nums tracking-[-0.03em] text-white">{c.v}</p>
            <p className="text-[10.5px] text-white/35">{c.sub}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 flex items-center gap-2 text-[13px] text-white">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
          <Wallet className="h-3.5 w-3.5" />
        </span>
        Settled payouts
      </p>
      <div className="mt-2.5 overflow-hidden rounded-xl border border-[rgba(240,227,222,0.09)]">
        <div className="grid grid-cols-[minmax(0,1fr)_120px_90px] bg-white/[0.02] px-4 py-2 text-[10.5px] text-white/40">
          <span>Task</span>
          <span>Settled date</span>
          <span className="text-right">Amount (₹)</span>
        </div>
        <div
          data-cam="payout"
          className="grid grid-cols-[minmax(0,1fr)_120px_90px] items-center overflow-hidden border-t border-[rgba(240,227,222,0.09)] bg-emerald-500/[0.06] px-4 text-[12px]"
          style={{ height: s.paid ? 38 : 0, opacity: s.paid ? 1 : 0, transition: `height 500ms ${EASE}, opacity 400ms` }}
        >
          <span className="flex items-center gap-1.5 truncate text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Speed up the search endpoint with a trigram index
          </span>
          <span className="text-white/50">Today · UPI</span>
          <span className="text-right font-medium text-emerald-300">₹6,800</span>
        </div>
        {rows.map((r) => (
          <div key={r.t} className="grid h-[38px] grid-cols-[minmax(0,1fr)_120px_90px] items-center border-t border-[rgba(240,227,222,0.09)] px-4 text-[12px]">
            <span className="truncate text-white/80">{r.t}</span>
            <span className="text-white/45">{r.d}</span>
            <span className="text-right font-medium text-emerald-300/90">₹{r.a}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Notifications({ open }: { open: boolean }) {
  return (
    <div
      data-cam="notifs"
      className="absolute right-[118px] top-[52px] z-20 w-[330px] overflow-hidden rounded-xl border border-white/10 bg-[#1f1d1c]/97 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.9)] backdrop-blur"
      style={{ opacity: open ? 1 : 0, transform: open ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.98)', transformOrigin: 'top right', transition: `opacity 250ms, transform 350ms ${EASE}` }}
    >
      <div className="flex items-center justify-between border-b border-white/[0.07] px-3.5 py-2.5">
        <p className="text-[12.5px] font-medium text-white">Notifications</p>
        <p className="font-mono text-[10px] text-accent-text">3 new</p>
      </div>
      {NOTIFS.map((n, i) => (
        <div
          key={n.key}
          data-hero={n.key}
          className={cn('flex items-start gap-2.5 px-3.5 py-2.5', i > 0 && 'border-t border-white/[0.05]', i === 0 && 'bg-white/[0.03]')}
          style={{ opacity: open ? 1 : 0, transform: open ? 'none' : 'translateY(-4px)', transition: `opacity 300ms ${120 + i * 90}ms, transform 400ms ${EASE} ${120 + i * 90}ms` }}
        >
          <span
            className={cn(
              'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
              n.icon === 'pay' ? 'bg-emerald-500/15 text-emerald-400' : n.icon === 'merge' ? 'bg-violet-500/15 text-violet-300' : 'bg-accent/15 text-accent',
            )}
          >
            {n.icon === 'pay' ? <Wallet className="h-3.5 w-3.5" /> : n.icon === 'merge' ? <GitMerge className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-medium text-white">{n.title}</p>
            <p className="truncate text-[10.5px] text-white/45">{n.sub}</p>
          </div>
          <span className="flex shrink-0 items-center gap-1 font-mono text-[9.5px] text-white/35">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> {n.ago}
          </span>
        </div>
      ))}
    </div>
  )
}

function Toast({ toast }: { toast: State['toast'] }) {
  const [last, setLast] = useState(toast)
  useEffect(() => {
    if (toast) setLast(toast)
  }, [toast])
  const t = toast ?? last
  const icon = t?.icon === 'paid' ? <Wallet className="h-4 w-4" /> : <Check className="h-4 w-4" />
  return (
    <div
      data-cam="toast"
      className="absolute right-4 top-[60px] z-20 flex w-[300px] items-center gap-3 rounded-xl border border-white/10 bg-[#1f1d1c]/95 p-3 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.85)] backdrop-blur"
      style={{ opacity: toast ? 1 : 0, transform: toast ? 'translateY(0)' : 'translateY(-10px)', transition: `opacity 300ms, transform 400ms ${EASE}` }}
    >
      <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', t?.icon === 'claim' ? 'bg-accent/15 text-accent' : 'bg-emerald-500/15 text-emerald-400')}>{icon}</span>
      <div className="min-w-0">
        <p className="truncate text-[12.5px] font-medium text-white">{t?.title}</p>
        <p className="truncate text-[11px] text-white/50">{t?.sub}</p>
      </div>
    </div>
  )
}

function Cursor({ c }: { c: State['cursor'] }) {
  return (
    <div className="pointer-events-none absolute left-0 top-0 z-30" style={{ transform: `translate(${c.x}px, ${c.y}px)`, transition: `transform 700ms ${EASE}` }}>
      {c.press && <span className="absolute left-0 top-0 h-8 w-8 animate-[hero-ping_450ms_ease-out_forwards] rounded-full bg-accent/45" />}
      <svg width="20" height="20" viewBox="0 0 24 24" className="-translate-x-[3px] -translate-y-[2px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" style={{ transform: c.press ? 'scale(0.85)' : 'scale(1)', transition: 'transform 120ms' }}>
        <path d="M4 3l16 7.5-6.8 1.9L10.6 19z" fill="white" stroke="#151414" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

// ---------------------------------------------------------------- the browser window around the dashboard

function YouTubeIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <rect x="1" y="4.5" width="22" height="15" rx="4.5" fill="#FF0000" />
      <path d="M10 8.8v6.4l5.6-3.2z" fill="#fff" />
    </svg>
  )
}
function StackOverflowIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M17.4 21.6V15.2h2.1v8.5H3.4v-8.5h2.1v6.4z" fill="#BCBBBB" />
      <path d="M7.3 14.6l9.9 2.1.4-2-9.9-2.1-.4 2zm1.3-4.9l9.2 4.3.9-1.9-9.2-4.3-.9 1.9zm2.6-4.5l7.8 6.5 1.3-1.6-7.8-6.5-1.3 1.6zM16.2.4l-1.7 1.2 6 8.1 1.7-1.2-6-8.1zM7.1 19.5h10.1v-2.1H7.1v2.1z" fill="#F48024" />
    </svg>
  )
}
function ForkeFavicon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/forke-assets/favicon.png" alt="" className={cn('rounded-[3px] object-cover', className)} />
}


const PAGES: Record<View, { path: string; title: string }> = {
  tasks: { path: '/tasks', title: 'Browse tasks · Forke' },
  detail: { path: '/tasks/speed-up-search-trgm', title: 'Speed up the search endpoint…' },
  review: { path: '/submissions', title: 'Submissions · Forke' },
  earnings: { path: '/earnings', title: 'My earnings · Forke' },
}

const BOOKMARKS: { icon: ReactNode; label: string }[] = [
  { icon: '🦆', label: 'Rubber duck' },
  { icon: '☕', label: 'Chai fund' },
  { icon: '🐛', label: "Bugs (don't open)" },
  { icon: '📚', label: "Docs I'll read someday" },
  { icon: <YouTubeIcon className="h-3 w-3" />, label: 'Lo-fi for focus' },
  { icon: <StackOverflowIcon className="h-3 w-3" />, label: 'Stack Overflow (again)' },
  { icon: <RiGithubFill className="h-3 w-3 text-white/80" />, label: 'My GitHub streak' },
]

function Tab({ title, icon, active, children }: { title: string; icon: ReactNode; active?: boolean; children?: ReactNode }) {
  return (
    <div
      className={cn(
        'relative flex h-[28px] min-w-0 items-center gap-2 rounded-t-[9px] px-3 text-[11.5px]',
        active ? 'w-[230px] bg-[#232120] text-white/90' : 'w-[170px] text-white/45',
      )}
    >
      <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center">{icon}</span>
      <span className="truncate">{title}</span>
      {children}
      <X className="ml-auto h-3 w-3 shrink-0 text-white/30" />
      {!active && <span className="absolute -right-px top-2 h-3.5 w-px bg-white/10" />}
    </div>
  )
}

function BrowserChrome({ view }: { view: View }) {
  const page = PAGES[view]
  return (
    <div className="shrink-0 bg-[#1a1918]">
      {/* tab strip */}
      <div className="flex h-[34px] items-end gap-0.5 px-3">
        <span className="mb-[9px] mr-3 flex gap-2">
          <i className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <i className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <i className="h-3 w-3 rounded-full bg-[#28c840]" />
        </span>
        <Tab title={page.title} icon={<ForkeFavicon />} active />
        <Tab title="postgres trigram index slow? - Stack Overflow" icon={<StackOverflowIcon />} />
        <Tab title="localhost:3000" icon={<Globe className="h-3.5 w-3.5 text-white/45" />} />
        <Tab title="lo-fi beats to ship to - YouTube" icon={<YouTubeIcon />}>
          <span className="flex h-3 items-end gap-[1.5px]">
            {[0, 1, 2].map((i) => (
              <i key={i} className="w-[2px] origin-bottom rounded-full bg-accent animate-[eq_900ms_ease-in-out_infinite]" style={{ height: 10, animationDelay: `${i * 150}ms` }} />
            ))}
          </span>
        </Tab>
        <span className="mb-[5px] ml-1 flex h-5 w-5 items-center justify-center rounded-md text-white/40">
          <Plus className="h-3.5 w-3.5" />
        </span>
      </div>
      {/* toolbar */}
      <div className="relative flex h-[32px] items-center gap-2.5 bg-[#232120] px-3">
        <ArrowLeft className="h-3.5 w-3.5 text-white/55" />
        <ArrowRight className="h-3.5 w-3.5 text-white/25" />
        <RotateCw className="h-3.5 w-3.5 text-white/55" />
        <div className="flex h-[24px] flex-1 items-center gap-2 rounded-full bg-[#151414] px-3 text-[12px]">
          <Lock className="h-3 w-3 text-white/40" />
          <span key={view} className="truncate animate-[url-in_350ms_ease_both]">
            <span className="text-white/85">dashboard.forke.space</span>
            <span className="text-white/45">{page.path}</span>
          </span>
          <Star className="ml-auto h-3.5 w-3.5 text-white/35" />
        </div>
        <span className="flex h-5 w-5 items-center justify-center rounded bg-[#4285f4]/20 text-[10px]">🧩</span>
        <span className="flex h-5 w-5 items-center justify-center rounded bg-emerald-500/20 text-[10px]">🛡️</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={PHOTO} alt="" className="h-5 w-5 rounded-full object-cover" />
        {/* page load bar, replays on every navigation */}
        <span key={`load-${view}`} className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-gradient-to-r from-accent to-[#FFB25C] animate-[page-load_700ms_ease-out_forwards]" />
      </div>
      {/* bookmarks */}
      <div className="flex h-[24px] items-center gap-1 border-b border-white/[0.07] bg-[#232120] px-3 text-[11px] text-white/60">
        {BOOKMARKS.map((b) => (
          <span key={b.label} className="flex shrink-0 items-center gap-1.5 rounded-md px-2 py-0.5">
            <span className="flex h-3 w-3 items-center justify-center text-[10.5px]">{b.icon}</span> {b.label}
          </span>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- the player

export default function AppMockup() {
  const frameRef = useRef<HTMLDivElement>(null) // what the visitor sees (fixed)
  const root = useRef<HTMLDivElement>(null) // the app's screen behind it, which the camera moves
  const [s, setS] = useState<State>(START)
  const [running, setRunning] = useState(false)
  const [loop, setLoop] = useState(0)

  // screen size → camera mode (matches the hero's sm / lg breakpoints)
  const [mode, setMode] = useState<Mode>('desktop')
  useLayoutEffect(() => {
    const lg = window.matchMedia('(min-width: 1024px)')
    const sm = window.matchMedia('(min-width: 640px)')
    const on = () => setMode(lg.matches ? 'desktop' : sm.matches ? 'tablet' : 'phone')
    on()
    lg.addEventListener('change', on)
    sm.addEventListener('change', on)
    return () => {
      lg.removeEventListener('change', on)
      sm.removeEventListener('change', on)
    }
  }, [])
  const cfg = CAM[mode]

  // run only while visible, never for reduced motion
  useEffect(() => {
    const el = frameRef.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver(([e]) => setRunning(e.isIntersecting), { threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  /** layout box of an element inside the screen (offsets ignore the camera), minus any page scroll it sits in */
  const box = (el: HTMLElement) => {
    let x = 0
    let y = 0
    let n: HTMLElement | null = el
    while (n && n !== root.current) {
      x += n.offsetLeft
      y += n.offsetTop
      n = n.offsetParent as HTMLElement | null
    }
    const scroller = el.closest<HTMLElement>('[data-scroll]')
    if (scroller) y -= Number(scroller.dataset.scroll) || 0
    return { x1: x, y1: y, x2: x + el.offsetWidth, y2: y + el.offsetHeight }
  }

  /** centre and extent of a click target in screen coordinates */
  const at: At = (key, cur) => {
    const el = root.current?.querySelector<HTMLElement>(`[data-hero="${key}"]`)
    if (!el) return { ...cur.cursor, x1: cur.cursor.x, x2: cur.cursor.x }
    const b = box(el)
    return { x: (b.x1 + b.x2) / 2, y: (b.y1 + b.y2) / 2, x1: b.x1, x2: b.x2 }
  }

  // the loop starts and ends with the cursor resting on "Find a task"
  useLayoutEffect(() => {
    const p = at('find', START)
    START.cursor = { x: p.x, y: p.y, press: false }
    setS((cur) => ({ ...cur, cursor: { x: p.x, y: p.y, press: false } }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  // play the beats, then start over (the last beat lands on the first frame)
  useEffect(() => {
    if (!running) return
    const timers = BEATS.map(([t, patch]) => window.setTimeout(() => setS((cur) => ({ ...cur, ...(typeof patch === 'function' ? patch(cur, at) : patch) })), t))
    timers.push(window.setTimeout(() => setLoop((n) => n + 1), LOOP_MS))
    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, loop])

  // The directed camera. Each beat names what matters (the checks, the score ring, the ringing bell…) and the camera
  // frames it: fitted with a margin, between the zoom where the window just fills the frame (never any gaps) and a
  // per-size close-up, never past the window's edges. Desktop keeps the full view throughout; tablet and phone frames
  // bleed off the right edge.
  const [cam, setCam] = useState({ x: 0, y: 0, z: 1 })
  const [frameSize, setFrameSize] = useState({ w: W, h: H })
  // desktop: the window keeps its proportions and scales up to match the 1200px inner rails band,
  // shrinking to fit narrower laptops (the frame's 1px side borders count toward the width)
  const deskScale = Math.min(1200 / W, (frameSize.w + 2) / W)
  useLayoutEffect(() => {
    const el = frameRef.current
    if (!el) return
    const measure = () => setFrameSize({ w: el.clientWidth, h: el.clientHeight })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [mode])
  useEffect(() => {
    const vw = frameSize.w
    const fh = frameSize.h
    const vh = cfg.visible || fh // how much of the frame the hero shows
    const zMin = Math.max(vw / W, fh / cfg.winH)
    const zMax = Math.max(zMin, cfg.max)
    // desktop shows the whole window, as it always has: the camera only directs tablet and phone
    if (mode === 'desktop') {
      setCam({ x: 0, y: 0, z: deskScale }) // the whole window, scaled to fit (exactly 1 on wide screens: pixel-sharp)
      return
    }
    if (s.shot[0] === 'wide') {
      setCam({ x: 0, y: 0, z: zMin })
      return
    }
    const rects = s.shot
      .map((k) => root.current?.querySelector<HTMLElement>(`[data-cam="${k}"], [data-hero="${k}"]`))
      .filter((el): el is HTMLElement => !!el)
      .map(box)
    if (!rects.length) return
    const PAD = 18
    const r = {
      x1: Math.max(0, Math.min(...rects.map((q) => q.x1)) - PAD),
      y1: Math.max(0, Math.min(...rects.map((q) => q.y1)) - PAD),
      x2: Math.min(W, Math.max(...rects.map((q) => q.x2)) + PAD),
      y2: Math.min(cfg.winH, Math.max(...rects.map((q) => q.y2)) + PAD),
    }
    const z = Math.min(zMax, Math.max(zMin, Math.min(vw / (r.x2 - r.x1), vh / (r.y2 - r.y1))))
    const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
    setCam({
      z,
      x: clamp(vw / 2 - ((r.x1 + r.x2) / 2) * z, vw - W * z, 0),
      y: clamp(vh / 2 - ((r.y1 + r.y2) / 2) * z, fh - cfg.winH * z, 0),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.shot, frameSize, mode])

  const code = s.app === 'code'
  const crumbs: Record<View, string> = { tasks: 'tasks', detail: 'task', review: 'submissions', earnings: 'earnings' }
  const glow = 'shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9),0_0_0_1px_rgba(0,0,0,0.5),0_0_80px_-10px_rgba(255,122,0,0.25)]'

  return (
    <div
      ref={frameRef}
      className={cn(
        'relative overflow-hidden border border-white/10 bg-[#151414]',
        glow,
        mode === 'desktop' ? 'w-full max-w-[1200px] rounded-t-2xl border-b-0 lg:mx-auto' : 'w-full rounded-l-2xl border-r-0',
      )}
      style={{ height: mode === 'desktop' ? Math.round(H * deskScale) : mode === 'tablet' ? 480 : 420 }}
    >
      <style>{`
        @keyframes hero-ping { from { transform: translate(-50%,-50%) scale(0.4); opacity: .7 } to { transform: translate(-50%,-50%) scale(1.9); opacity: 0 } }
        @keyframes bell-ring { 0%,50%,100% { transform: rotate(0) } 8% { transform: rotate(16deg) } 16% { transform: rotate(-14deg) } 24% { transform: rotate(10deg) } 32% { transform: rotate(-8deg) } 40% { transform: rotate(4deg) } }
        @keyframes vs-progress { from { transform: translateX(-100%) } to { transform: translateX(300%) } }
        @keyframes eq { 0%,100% { transform: scaleY(0.3) } 50% { transform: scaleY(1) } }
        @keyframes url-in { from { opacity: 0; transform: translateY(3px) } to { opacity: 1; transform: none } }
        @keyframes page-load { 0% { transform: scaleX(0); opacity: 1 } 80% { transform: scaleX(1); opacity: 1 } 100% { transform: scaleX(1); opacity: 0 } }
      `}</style>

      <div
        ref={root}
        className="absolute left-0 top-0 origin-top-left overflow-hidden"
        style={{ width: W, height: cfg.winH, transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.z})`, transition: `transform 1400ms ${EASE}` }}
      >
        {/* the browser with the Forke dashboard; switching apps slides it aside like a macOS app switch */}
        <div
          className="absolute inset-0 flex flex-col"
          style={{ opacity: code ? 0 : 1, transform: code ? 'translateX(-4%) scale(0.94)' : 'none', transition: `opacity 500ms, transform 700ms ${EASE}` }}
        >
          <BrowserChrome view={s.view} />
          <div className="relative flex min-h-0 flex-1">
          <Sidebar view={s.view} xp={s.paid ? 64 : 41} />
          <div className="relative flex min-w-0 flex-1 flex-col">
            <TopBar crumb={crumbs[s.view]} bell={s.bell} />
            <div className="relative min-h-0 flex-1">
              {(['tasks', 'detail', 'review', 'earnings'] as View[]).map((v) => (
                <div
                  key={v}
                  className="absolute inset-0"
                  style={{ opacity: s.view === v ? 1 : 0, transform: s.view === v ? 'none' : 'translateY(8px)', transition: `opacity 350ms, transform 450ms ${EASE}` }}
                >
                  {v === 'tasks' && <TasksPage />}
                  {v === 'detail' && <DetailPage s={s} />}
                  {v === 'review' && <ReviewPage s={s} />}
                  {v === 'earnings' && <EarningsPage s={s} />}
                </div>
              ))}
            </div>
            <Notifications open={s.bell === 2} />
            <Toast toast={s.toast} />
          </div>
          </div>
        </div>

        {/* VS Code, the developer's own editor */}
        <div
          className="absolute inset-0"
          style={{ opacity: code ? 1 : 0, transform: code ? 'none' : 'translateX(4%) scale(0.94)', transition: `opacity 500ms, transform 700ms ${EASE}` }}
        >
          <VsCode s={s} key={`code-${loop}`} />
        </div>

        <Cursor c={s.cursor} />
      </div>
    </div>
  )
}
