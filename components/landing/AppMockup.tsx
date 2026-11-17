'use client'

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import {
  ArrowLeft,
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
  ImageIcon,
  LayoutDashboard,
  Loader2,
  Lock,
  Mail,
  Paperclip,
  Play,
  Search,
  Settings,
  ShieldCheck,
  Bot,
  TerminalSquare,
  User,
  Wallet,
} from 'lucide-react'
import { RiGithubFill } from '@remixicon/react'
import { cn } from './primitives'
import { Badge, C, Eyebrow, Primary, Secondary, StatStrip, TONE } from './dashUi'

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

// ---------------------------------------------------------------- shell (sidebar + top bar), in the Forke Mail style

const ring = { background: C.surface, boxShadow: `0 0 0 1px ${C.line}` }

function NavItem({ icon, label, active, badge, hero }: { icon: ReactNode; label: string; active?: boolean; badge?: string; hero?: string }) {
  return (
    <div
      data-hero={hero}
      className="relative flex h-[26px] items-center gap-2 rounded-[6px] px-2 text-[12px]"
      style={{ background: active ? C.surface3 : undefined, color: active ? C.ink : C.ink2, fontWeight: active ? 500 : 400 }}
    >
      {active && <span className="absolute -left-2.5 bottom-1.5 top-1.5 w-[2px] rounded-r-[2px] bg-[#ff7a00]" />}
      <span className="flex h-3.5 w-3.5 items-center justify-center" style={{ color: active ? '#ff7a00' : C.muted }}>
        {icon}
      </span>
      {label}
      {badge && (
        <span className="ml-auto rounded-[3px] px-1 font-mono text-[9.5px]" style={{ background: C.surface, color: C.ink2 }}>
          {badge}
        </span>
      )}
    </div>
  )
}

function NavGroup({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div className="mb-3">
      {label && (
        <p className="px-2 pb-1 font-mono text-[9.5px] uppercase tracking-[0.08em]" style={{ color: C.faint }}>
          {label}
        </p>
      )}
      {children}
    </div>
  )
}

function Sidebar({ view, xp }: { view: View; xp: number }) {
  const at = (v: View) => view === v || (v === 'tasks' && view === 'detail')
  return (
    <aside data-cam="sidebar" className="relative flex shrink-0 flex-col border-r" style={{ width: SIDEBAR, background: C.bg, borderColor: C.line }}>
      <div className="flex h-11 items-center border-b px-4" style={{ borderColor: C.line }}>
        <span className="flex items-baseline gap-1 text-[15px] tracking-[-0.04em]">
          <span className="font-semibold text-[#f4f4f5]">
            forke<span className="text-[#ff7a00]">*</span>
          </span>
          <span style={{ color: C.muted }}>developer</span>
        </span>
      </div>
      <div className="px-2.5 pt-2.5">
        <div className="flex h-7 items-center gap-2 rounded-[6px] px-2 text-[11.5px]" style={{ background: C.surface, boxShadow: `inset 0 0 0 1px ${C.line}`, color: C.muted }}>
          <Search className="h-3 w-3" />
          <span className="flex-1">Search</span>
          <span className="rounded-[3px] px-1 font-mono text-[9.5px]" style={{ background: C.surface3 }}>
            ⌘K
          </span>
        </div>
      </div>
      <nav className="px-2.5 py-2.5">
        <NavGroup>
          <NavItem icon={<LayoutDashboard className="h-3.5 w-3.5" />} label="Overview" />
        </NavGroup>
        <NavGroup label="Work">
          <NavItem icon={<ClipboardList className="h-3.5 w-3.5" />} label="Tasks" active={at('tasks')} />
          <NavItem icon={<FileCheck className="h-3.5 w-3.5" />} label="Submissions" active={at('review')} />
          <NavItem icon={<Mail className="h-3.5 w-3.5" />} label="Messages" badge="2" />
        </NavGroup>
        <NavGroup label="You">
          <NavItem icon={<User className="h-3.5 w-3.5" />} label="Profile" />
          <NavItem icon={<Wallet className="h-3.5 w-3.5" />} label="Earnings" active={at('earnings')} hero="nav-earnings" />
          <NavItem icon={<Settings className="h-3.5 w-3.5" />} label="Settings" />
        </NavGroup>
      </nav>
      {/* who, and the level bar */}
      <div className="mt-auto border-t p-3" style={{ borderColor: C.line }}>
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={PHOTO} alt="" className="h-7 w-7 rounded-full object-cover" />
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1 text-[12px] font-medium text-[#f4f4f5]">
              John Doe <BadgeCheck className="h-3 w-3 text-[#ff7a00]" />
            </p>
            <p className="font-mono text-[10px]" style={{ color: C.muted }}>
              Lvl 9 · Architect
            </p>
          </div>
          <span className="font-mono text-[10px] tabular-nums" style={{ color: C.ink2 }}>
            {xp}%
          </span>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full" style={{ background: C.surface3 }}>
          <div className="h-full rounded-full bg-[#ff7a00]" style={{ width: `${xp}%`, transition: `width 1.2s ${EASE}` }} />
        </div>
      </div>
    </aside>
  )
}

function TopBar({ crumb, bell }: { crumb: string; bell: State['bell'] }) {
  const [group, page] = crumb === 'earnings' ? ['You', 'Earnings'] : crumb === 'submissions' ? ['Work', 'Submissions'] : crumb === 'tasks' ? ['Work', 'Tasks'] : ['Tasks', 'Trigram search index']
  return (
    <div className="flex shrink-0 items-center gap-2 border-b px-5 text-[12px]" style={{ height: TOP, borderColor: C.line, background: C.bg }}>
      <span style={{ color: C.muted }}>{group}</span>
      <span style={{ color: C.faint }}>/</span>
      <span className="truncate font-medium text-[#f4f4f5]">{page}</span>
      <span
        data-hero="bell"
        className="relative ml-auto flex h-8 w-8 items-center justify-center rounded-[6px] transition-colors"
        style={{ background: bell === 2 ? C.surface3 : undefined, color: bell === 2 ? C.ink : C.ink2 }}
      >
        <Bell className={cn('h-4 w-4 origin-top', bell === 1 && 'animate-[bell-ring_1.1s_ease-in-out_infinite]')} />
        <span
          className="absolute right-1 top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-[4px] bg-[#ff7a00] px-[3px] font-mono text-[8.5px] font-semibold text-[#1a0a00]"
          style={{ opacity: bell === 1 ? 1 : 0, transform: bell === 1 ? 'scale(1)' : 'scale(0.4)', transition: `opacity 250ms, transform 350ms ${EASE}` }}
        >
          3
        </span>
      </span>
      <span data-hero="find">
        <Primary icon={Search}>Find a task</Primary>
      </span>
    </div>
  )
}

/** The page title block, as on every Forke Mail page. */
function PageHead({ group, title, description, back }: { group?: string; title: string; description?: string; back?: string }) {
  return (
    <header className="mb-4">
      {back ? (
        <p className="mb-2 flex items-center gap-1.5 text-[11.5px]" style={{ color: C.muted }}>
          <ArrowLeft className="h-3 w-3" /> {back}
        </p>
      ) : (
        <div className="mb-2">
          <Eyebrow>{group}</Eyebrow>
        </div>
      )}
      <h1 className="text-[22px] font-medium leading-tight tracking-[-0.03em] text-[#f4f4f5]">{title}</h1>
      {description && (
        <p className="mt-1 text-[12px]" style={{ color: C.muted }}>
          {description}
        </p>
      )}
    </header>
  )
}

function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-[18px] items-center rounded-[4px] px-1.5 text-[10.5px]" style={{ background: C.surface3, color: C.muted }}>
      {children}
    </span>
  )
}

function CardHead({ title, actions }: { title: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex h-9 items-center justify-between border-b px-3.5" style={{ background: C.surface2, borderColor: C.line }}>
      <h2 className="flex items-center gap-1.5 text-[12px] font-semibold text-[#f4f4f5]">{title}</h2>
      {actions}
    </div>
  )
}

// ---------------------------------------------------------------- pages

function TasksPage() {
  return (
    <div className="px-6 py-5">
      <PageHead group="Work" title="Browse tasks" description="Scoped work with the bounty already in escrow. Claim one, ship it, get paid on merge." />
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 flex-1 items-center gap-2 rounded-[6px] px-2.5 text-[12px]" style={{ background: C.surface, boxShadow: `inset 0 0 0 1px ${C.lineStrong}`, color: C.muted }}>
          <Search className="h-3.5 w-3.5" /> Search tasks
        </div>
        <div className="flex h-8 items-center rounded-[6px] p-0.5 text-[11.5px]" style={{ background: C.surface, boxShadow: `inset 0 0 0 1px ${C.line}` }}>
          {['All', 'Unclaimed', 'Claimed'].map((f, i) => (
            <span key={f} className="flex h-full items-center rounded-[4px] px-2.5" style={{ background: i === 0 ? C.surface3 : undefined, color: i === 0 ? C.ink : C.muted }}>
              {f}
            </span>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {TASKS.map((t, i) => (
          <div key={t.title} data-cam={`card${i}`} className="flex flex-col overflow-hidden rounded-[8px] p-3.5" style={ring}>
            <div className="flex items-start justify-between gap-2">
              <p className="line-clamp-2 min-h-[34px] text-[12.5px] font-medium leading-[17px] text-[#f4f4f5]">{t.title}</p>
              <Badge tone="accent">₹{t.amount}</Badge>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {t.tags.map((g) => (
                <Tag key={g}>{g}</Tag>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between border-t pt-2.5 text-[10.5px]" style={{ borderColor: C.line, color: C.muted }}>
              <span>
                by <span style={{ color: C.ink2 }}>{t.by}</span>
              </span>
              <span>{t.ago}</span>
            </div>
            <span data-hero={`card-${i}`} className="mt-2.5 flex">
              <Secondary className="w-full">
                View details <ChevronRight className="h-3.5 w-3.5" />
              </Secondary>
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
      <div data-scroll={s.scroll} className="grid grid-cols-[minmax(0,1fr)_260px] gap-4 px-6 py-5" style={{ transform: `translateY(${-s.scroll}px)`, transition: `transform 700ms ${EASE}` }}>
        {/* the brief */}
        <div className="min-w-0">
          <PageHead back="Tasks" title="Speed up the search endpoint with a trigram index" />
          <section data-cam="brief" className="overflow-hidden rounded-[8px]" style={ring}>
            <CardHead
              title="Brief"
              actions={
                <span className="flex gap-1">
                  <Tag>Postgres</Tag>
                  <Tag>Node.js</Tag>
                </span>
              }
            />
            <p className="px-3.5 py-3 text-[12px] leading-[18px]" style={{ color: C.ink2 }}>
              Search on /api/products takes 2s at p95. Add a pg_trgm index and rewrite the query to use it. Include a migration and before/after timings.
            </p>
          </section>

          {/* file rules set by the owner */}
          <div data-cam="rules" className="mt-3 grid grid-cols-2 gap-3">
            {(
              [
                ['Files you can edit', ['src/search/*', 'migrations/*', 'test/search.spec.ts'], 'green'],
                ['Off-limits', ['src/auth/*', '.env*', 'infra/*'], 'neutral'],
              ] as const
            ).map(([title, files, tone]) => (
              <section key={title} className="overflow-hidden rounded-[8px]" style={ring}>
                <CardHead title={title} actions={<Badge tone={tone}>{tone === 'green' ? 'allowed' : 'locked'}</Badge>} />
                {files.map((f) => (
                  <p key={f} className="flex h-[28px] items-center gap-2 border-b px-3.5 font-mono text-[11px] last:border-0" style={{ borderColor: C.line, color: tone === 'green' ? C.ink2 : C.muted }}>
                    {tone === 'green' ? <Check className="h-3 w-3 text-[#4ade80]" /> : <Lock className="h-3 w-3" />} {f}
                  </p>
                ))}
              </section>
            ))}
          </div>

          {/* attachments from the owner */}
          <section data-cam="attach" className="mt-3 overflow-hidden rounded-[8px]" style={ring}>
            <CardHead
              title={
                <>
                  <Paperclip className="h-3.5 w-3.5" style={{ color: C.muted }} /> Attachments from Rohan
                </>
              }
              actions={<span className="font-mono text-[10.5px]" style={{ color: C.muted }}>3 files</span>}
            />
            <div className="grid grid-cols-3 gap-2.5 p-3.5">
              {SHOTS.map(({ name, Shot }, i) => (
                <div key={name} data-hero={`shot-${i}`}>
                  <div className="aspect-[16/10] overflow-hidden rounded-[6px]" style={{ boxShadow: `0 0 0 1px ${C.lineStrong}` }}>
                    <Shot />
                  </div>
                  <p className="mt-1 flex items-center gap-1 truncate font-mono text-[9.5px]" style={{ color: C.muted }}>
                    <ImageIcon className="h-2.5 w-2.5 shrink-0" /> {name}
                  </p>
                </div>
              ))}
            </div>
            <p className="border-t px-3.5 py-2.5 text-[11px] leading-4" style={{ borderColor: C.line, color: C.muted }}>
              <span style={{ color: C.ink }}>Rohan:</span> the slow plan and the spinner are attached. Keep the response shape the same, the mobile app reads it.
            </p>
          </section>
        </div>

        {/* budget + claim */}
        <div className="pt-[52px]">
          <section data-cam="budget" className="overflow-hidden rounded-[8px]" style={ring}>
            <CardHead title="Bounty" actions={<Badge tone="green">in escrow</Badge>} />
            <div className="px-3.5 pb-3.5 pt-3">
              <p className="text-[26px] font-medium tabular-nums tracking-[-0.03em] text-[#f4f4f5]">₹6,800</p>
              <div className="mt-2.5 overflow-hidden rounded-[6px]" style={{ boxShadow: `0 0 0 1px ${C.line}` }}>
                {[
                  ['Owner', 'Rohan Mehta'],
                  ['Posted', '7 hours ago'],
                  ['Level', '6+'],
                ].map(([k, v]) => (
                  <p key={k} className="flex h-[28px] items-center justify-between border-b px-2.5 text-[11.5px] last:border-0" style={{ borderColor: C.line }}>
                    <span style={{ color: C.muted }}>{k}</span>
                    <span style={{ color: C.ink }}>{v}</span>
                  </p>
                ))}
              </div>
              <div data-hero="claim" className="relative mt-3 h-8">
                <span className="absolute inset-0 flex" style={{ opacity: s.claimed ? 0 : 1, transition: 'opacity 250ms' }}>
                  <Primary className="w-full">
                    <RiGithubFill className="h-3.5 w-3.5" /> Claim task
                  </Primary>
                </span>
                <span
                  className={cn('absolute inset-0 flex items-center justify-between rounded-[6px] px-2.5 text-[11.5px] font-medium', TONE.green)}
                  style={{ opacity: s.claimed ? 1 : 0, transition: 'opacity 250ms' }}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-[1.5px] bg-current" /> Claimed by you
                  </span>
                  <span className="font-mono tabular-nums">{s.claimed ? <Countdown /> : '20:00'}</span>
                </span>
              </div>
              <span data-hero="open-ide" className="mt-2 flex" style={{ opacity: s.claimed ? 1 : 0.35, transition: 'opacity 300ms' }}>
                <Secondary icon={Code2} className="w-full">
                  Open in VS Code
                </Secondary>
              </span>
            </div>
          </section>
        </div>
      </div>

      {/* attachment preview */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.55)', opacity: s.zoomShot ? 1 : 0, transition: 'opacity 300ms' }}>
        <div
          data-cam="modal"
          className="w-[440px] overflow-hidden rounded-[10px]"
          style={{
            background: C.surface,
            boxShadow: `0 24px 64px -16px rgba(0,0,0,0.7), 0 0 0 1px ${C.lineStrong}`,
            transform: s.zoomShot ? 'scale(1)' : 'scale(0.6)',
            transition: `transform 450ms ${EASE}`,
          }}
        >
          <div className="aspect-[16/10]">
            <ShotExplain big />
          </div>
          <p className="flex items-center justify-between border-t px-3 py-2 font-mono text-[10.5px]" style={{ borderColor: C.line, color: C.ink2 }}>
            explain-analyze.png <span style={{ color: C.muted }}>from Rohan</span>
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
  const CIRC = 2 * Math.PI * 30
  return (
    <div className="px-6 py-5">
      <PageHead group="Work" title="Submissions" description="Status, review cycles and payouts for every task you have claimed." />
      <section className="overflow-hidden rounded-[8px]" style={ring}>
        <div className="flex items-center justify-between gap-4 border-b px-4 py-3" style={{ background: C.surface2, borderColor: C.line }}>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-[#f4f4f5]">Speed up the search endpoint with a trigram index</p>
            <p className="mt-0.5 flex items-center gap-3 text-[11px]" style={{ color: C.muted }}>
              <span className="flex items-center gap-1">
                <GitPullRequest className="h-3 w-3" /> acme/search-api#412
              </span>
              <span className="font-mono">+42 −9 · 2 files</span>
              <span>₹6,800</span>
            </p>
          </div>
          <span data-cam="status" className="shrink-0">
            <Badge tone={s.approved ? 'green' : 'amber'}>{s.approved ? 'merged' : 'in review'}</Badge>
          </span>
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)_200px]">
          <div data-cam="checks" className="border-r" style={{ borderColor: C.line }}>
            {CHECKS.map((c, i) => {
              const done = s.checks > i
              const running = s.checks === i
              return (
                <div key={c} className="flex h-[34px] items-center gap-3 border-b px-4 last:border-0" style={{ borderColor: C.line }}>
                  <span className="flex-1 text-[12px]" style={{ color: done || running ? C.ink : C.muted }}>
                    {c}
                  </span>
                  <span className="font-mono text-[10.5px] tabular-nums" style={{ color: C.muted }}>
                    {done ? `${[18, 6, 41, 3, 52][i]}s` : ''}
                  </span>
                  <span className="w-[78px] text-right">
                    {done ? (
                      <Badge tone="green">passed</Badge>
                    ) : running ? (
                      <span className={cn('inline-flex h-[20px] items-center gap-1.5 rounded-[4px] px-1.5 text-[11px] font-medium', TONE.blue)}>
                        <Loader2 className="h-3 w-3 animate-spin" /> running
                      </span>
                    ) : (
                      <Badge tone="neutral">queued</Badge>
                    )}
                  </span>
                </div>
              )
            })}
          </div>
          <div data-cam="score" className="flex flex-col items-center justify-center p-3">
            <svg viewBox="0 0 72 72" className="h-[84px] w-[84px] -rotate-90">
              <circle cx="36" cy="36" r="30" fill="none" stroke={C.surface3} strokeWidth="5" />
              <circle cx="36" cy="36" r="30" fill="none" stroke="#ff7a00" strokeWidth="5" strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - score / 100)} />
            </svg>
            <p className="-mt-[58px] mb-[30px] text-[20px] font-medium tabular-nums tracking-[-0.03em] text-[#f4f4f5]">{score}</p>
            <p className="font-mono text-[9.5px] uppercase tracking-[0.08em]" style={{ color: C.muted }}>
              AI review
            </p>
            <span className="mt-1.5">{score >= 94 ? <Badge tone="green">merge-ready</Badge> : <Badge tone="neutral">reviewing</Badge>}</span>
          </div>
        </div>
      </section>
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
  const cols = 'grid grid-cols-[minmax(0,1fr)_120px_90px]'
  return (
    <div className="px-6 py-5">
      <PageHead group="You" title="Earnings" description="Payouts from merged tasks, straight to your UPI." />
      <StatStrip cols={3} className="mb-4">
        {[
          { k: 'Total earned', v: `₹${total.toLocaleString('en-IN')}`, sub: 'Lifetime payouts' },
          { k: 'Pending payout', v: s.paid ? '₹0' : '₹6,800', sub: 'Waiting on the owner' },
          { k: 'Tasks settled', v: s.paid ? '5' : '4', sub: 'Merged and paid' },
        ].map((c) => (
          <div key={c.k} data-cam={c.k === 'Total earned' ? 'total' : undefined} className="relative flex flex-col gap-0.5 p-3.5" style={{ background: C.surface }}>
            <span className="text-[11.5px]" style={{ color: C.muted }}>
              {c.k}
            </span>
            <span className="mt-0.5 text-[22px] font-medium tabular-nums tracking-[-0.03em] text-[#f4f4f5]">{c.v}</span>
            <span className="text-[10.5px]" style={{ color: C.muted }}>
              {c.sub}
            </span>
            {c.k === 'Total earned' && (
              <span className="pointer-events-none absolute inset-0 transition-opacity duration-500" style={{ boxShadow: 'inset 0 0 0 1px rgba(74,222,128,0.35)', opacity: s.paid ? 1 : 0 }} />
            )}
          </div>
        ))}
      </StatStrip>
      <section className="overflow-hidden rounded-[8px]" style={ring}>
        <CardHead title="Settled payouts" />
        <div className={cn(cols, 'border-b px-4 py-2 font-mono text-[9.5px] uppercase tracking-[0.08em]')} style={{ borderColor: C.line, color: C.faint }}>
          <span>Task</span>
          <span>Settled</span>
          <span className="text-right">Amount</span>
        </div>
        <div
          data-cam="payout"
          className={cn(cols, 'items-center overflow-hidden border-b px-4 text-[12px]')}
          style={{ borderColor: C.line, background: 'rgba(74,222,128,0.05)', height: s.paid ? 38 : 0, opacity: s.paid ? 1 : 0, transition: `height 500ms ${EASE}, opacity 400ms` }}
        >
          <span className="flex items-center gap-2 truncate font-medium text-[#f4f4f5]">Speed up the search endpoint with a trigram index</span>
          <span>
            <Badge tone="green">today · UPI</Badge>
          </span>
          <span className="text-right font-mono tabular-nums text-[#4ade80]">₹6,800</span>
        </div>
        {rows.map((r) => (
          <div key={r.t} className={cn(cols, 'h-[38px] items-center border-b px-4 text-[12px] last:border-0')} style={{ borderColor: C.line }}>
            <span className="truncate" style={{ color: C.ink2 }}>
              {r.t}
            </span>
            <span style={{ color: C.muted }}>{r.d}</span>
            <span className="text-right font-mono tabular-nums" style={{ color: C.ink2 }}>
              ₹{r.a}
            </span>
          </div>
        ))}
      </section>
    </div>
  )
}

function Notifications({ open }: { open: boolean }) {
  return (
    <div
      data-cam="notifs"
      className="absolute right-[118px] top-[52px] z-20 w-[330px] overflow-hidden rounded-[10px]"
      style={{
        background: C.surface,
        boxShadow: `0 24px 64px -16px rgba(0,0,0,0.7), 0 0 0 1px ${C.lineStrong}`,
        opacity: open ? 1 : 0,
        transform: open ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.98)',
        transformOrigin: 'top right',
        transition: `opacity 250ms, transform 350ms ${EASE}`,
      }}
    >
      <CardHead title="Notifications" actions={<Badge tone="accent">3 new</Badge>} />
      {NOTIFS.map((n, i) => (
        <div
          key={n.key}
          data-hero={n.key}
          className="flex items-start gap-2.5 border-b px-3.5 py-2.5 last:border-0"
          style={{
            borderColor: C.line,
            background: i === 0 ? C.surface2 : undefined,
            opacity: open ? 1 : 0,
            transform: open ? 'none' : 'translateY(-4px)',
            transition: `opacity 300ms ${120 + i * 90}ms, transform 400ms ${EASE} ${120 + i * 90}ms`,
          }}
        >
          <span className={cn('mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-[5px]', n.icon === 'pay' ? TONE.green : n.icon === 'merge' ? TONE.blue : TONE.accent)}>
            {n.icon === 'pay' ? <Wallet className="h-3 w-3" /> : n.icon === 'merge' ? <GitMerge className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-medium text-[#f4f4f5]">{n.title}</p>
            <p className="truncate text-[10.5px]" style={{ color: C.muted }}>
              {n.sub}
            </p>
          </div>
          <span className="shrink-0 font-mono text-[9.5px]" style={{ color: C.muted }}>
            {n.ago}
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
  const icon = t?.icon === 'paid' ? <Wallet className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />
  return (
    <div
      data-cam="toast"
      className="absolute right-4 top-[60px] z-20 flex w-[300px] items-center gap-2.5 rounded-[8px] px-3 py-2.5"
      style={{
        background: C.surface,
        boxShadow: `0 24px 64px -16px rgba(0,0,0,0.7), 0 0 0 1px ${C.lineStrong}`,
        opacity: toast ? 1 : 0,
        transform: toast ? 'translateY(0)' : 'translateY(-10px)',
        transition: `opacity 300ms, transform 400ms ${EASE}`,
      }}
    >
      <span className={cn('grid h-7 w-7 shrink-0 place-items-center rounded-[6px]', t?.icon === 'claim' ? TONE.accent : TONE.green)}>{icon}</span>
      <div className="min-w-0">
        <p className="truncate text-[12.5px] font-medium text-[#f4f4f5]">{t?.title}</p>
        <p className="truncate text-[11px]" style={{ color: C.muted }}>
          {t?.sub}
        </p>
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
      `}</style>

      <div
        ref={root}
        className="absolute left-0 top-0 origin-top-left overflow-hidden"
        style={{ width: W, height: cfg.winH, transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.z})`, transition: `transform 1400ms ${EASE}` }}
      >
        {/* the Forke dashboard; switching apps slides it aside like a macOS app switch */}
        <div
          className="absolute inset-0 flex flex-col"
          style={{ opacity: code ? 0 : 1, transform: code ? 'translateX(-4%) scale(0.94)' : 'none', transition: `opacity 500ms, transform 700ms ${EASE}` }}
        >
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
