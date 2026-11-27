/**
 * @fileoverview Forke Platform
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

import { memo, useLayoutEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import {
  Activity,
  ArrowLeft,
  Ban,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronsUpDown,
  Copy,
  FileText,
  Globe,
  Hash,
  Info,
  KeyRound,
  Layers,
  LayoutDashboard,
  Link2,
  Loader2,
  MailCheck,
  MailSearch,
  Megaphone,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings,
  Timer,
  Trash2,
  Users,
  Webhook,
  Workflow,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react'

/**
 * The Forke Mail dashboard film: a directed loop of the real dashboard (forke-mail/frontend: same shell, sidebar,
 * pages, sizes and copy), filmed with a camera that frames each beat and a cursor that clicks through it.
 * Transactional → Send test → the message's timeline fills in → Domains → Verify now → verified.
 *
 * Everything is a pure function of `now` (ms into the loop), so the site can drive it with a clock and Remotion
 * can render it frame by frame from the same code (forke-videos/mail-film).
 */

export const W = 1440
export const H = 900
const TICK = 100
const LOOP = 125
export const LOOP_MS = LOOP * TICK
const CAMERA_MS = 1400
const CURSOR_MS = 700
const MAX_ZOOM = 2.4

const bezier = (x1: number, y1: number, x2: number, y2: number) => {
  const cx = 3 * x1
  const bx = 3 * (x2 - x1) - cx
  const ax = 1 - cx - bx
  const cy = 3 * y1
  const by = 3 * (y2 - y1) - cy
  const ay = 1 - cy - by
  const sx = (t: number) => ((ax * t + bx) * t + cx) * t
  const sy = (t: number) => ((ay * t + by) * t + cy) * t
  const dx = (t: number) => (3 * ax * t + 2 * bx) * t + cx
  return (x: number) => {
    if (x <= 0) return 0
    if (x >= 1) return 1
    let t = x
    for (let i = 0; i < 8; i++) {
      const e = sx(t) - x
      const d = dx(t)
      if (Math.abs(e) < 1e-6 || d === 0) break
      t -= e / d
    }
    return sy(Math.min(1, Math.max(0, t)))
  }
}
const EASE = bezier(0.65, 0, 0.35, 1)
const POP = bezier(0.22, 1, 0.36, 1)
const CSS_EASE = bezier(0.25, 0.1, 0.25, 1)

const C = {
  bg: '#151414',
  surface: '#1a1919',
  surface2: '#1e1d1c',
  surface3: '#262423',
  control: '#201f1f',
  secondary: '#232222',
  line: 'rgba(240,227,222,0.09)',
  lineStrong: 'rgba(240,227,222,0.16)',
  rail: 'rgba(240,227,222,0.125)',
  ink: '#f4f4f5',
  ink2: '#c9c7c5',
  muted: '#8e8e93',
  faint: '#5f5c5a',
  accent: '#ff7a00',
  pop: '0 24px 64px -16px rgba(0,0,0,0.7), 0 0 0 1px rgba(240,227,222,0.16)',
  glow: 'inset 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.2), 0 2px 10px -4px rgba(255,122,0,0.45)',
}
const railX: CSSProperties = { backgroundImage: `linear-gradient(90deg, ${C.rail} 50%, transparent 50%)`, backgroundSize: '32px 1px', backgroundRepeat: 'repeat-x' }
const railY: CSSProperties = { backgroundImage: `linear-gradient(${C.rail} 50%, transparent 50%)`, backgroundSize: '1px 32px', backgroundRepeat: 'repeat-y' }

// ---------------------------------------------------------------- the script

type Key = string
type Screen = 'list' | 'message' | 'domains'

const SHOTS: [number, Key[] | null][] = [
  [0, null],
  [6, ['header']],
  [15, ['modal']],
  [31, ['msg-head', 'timeline']],
  [53, null],
  [63, ['records']],
  [98, null],
]
const CURSOR: [number, Key | [number, number]][] = [
  [0, [1060, 640]],
  [6, 'send-test'],
  [22, 'send'],
  [53, 'nav-domains'],
  [72, 'verify'],
  [98, [1060, 640]],
]
const PRESSES = [14, 30, 62, 80]
const SCREEN_START: Record<Screen, number> = { list: 0, message: 31, domains: 63 }

function stateAt(t: number) {
  return {
    screen: (t < 31 ? 'list' : t < 63 ? 'message' : 'domains') as Screen,
    modal: t >= 15 && t < 31,
    events: t >= 45 ? 3 : t >= 37 ? 2 : t >= 31 ? 1 : 0,
    verify: (t >= 88 ? 2 : t >= 81 ? 1 : 0) as 0 | 1 | 2,
    toast: t >= 31 && t < 71 ? 'queued' : t >= 88 ? 'verified' : null,
    press: PRESSES.includes(t),
  }
}

const at = <K extends [number, ...unknown[]]>(list: K[], t: number): K => [...list].reverse().find((k) => t >= k[0]) ?? list[0]
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
const tickAt = (ms: number) => Math.floor((((ms % LOOP_MS) + LOOP_MS) % LOOP_MS) / TICK)

/**
 * A CSS transition, replayed: `target(ms)` is what the property is set to at each tick; when it changes, the value
 * glides from wherever it is to the new target over `dur`, retargeting mid-flight the way CSS does.
 */
function glide(now: number, target: (ms: number) => number[], dur: number, ease: (x: number) => number) {
  const first = Math.floor((now - LOOP_MS) / TICK) * TICK
  let a = target(first)
  let b = a
  let start = -Infinity
  const value = (ms: number) => {
    const p = start === -Infinity ? 1 : ease(clamp((ms - start) / dur, 0, 1))
    return a.map((v, i) => v + (b[i] - v) * p)
  }
  for (let ms = first + TICK; ms <= now; ms += TICK) {
    const next = target(ms)
    if (next.some((v, i) => v !== b[i])) {
      a = value(ms)
      b = next
      start = ms
    }
  }
  return value(now)
}

export type Boxes = Record<string, [number, number, number, number]>

function frameAt(now: number, w: number, h: number, boxes: Boxes) {
  const t = tickAt(now)
  const s = stateAt(t)
  const loopStart = Math.floor(now / LOOP_MS) * LOOP_MS
  const since = (tick: number) => now - (loopStart + tick * TICK)
  const zFit = Math.max(w / W, h / H)

  const camera = (ms: number) => {
    const keys = at(SHOTS, tickAt(ms))[1]
    const rects = (keys ?? []).map((k) => boxes[k]).filter(Boolean)
    const PAD = 24
    const r = rects.length
      ? [
          Math.max(0, Math.min(...rects.map((q) => q[0])) - PAD),
          Math.max(0, Math.min(...rects.map((q) => q[1])) - PAD),
          Math.min(W, Math.max(...rects.map((q) => q[2])) + PAD),
          Math.min(H, Math.max(...rects.map((q) => q[3])) + PAD),
        ]
      : [0, 0, W, H]
    const z = Math.max(zFit, Math.min(zFit * MAX_ZOOM, Math.min(w / (r[2] - r[0]), h / (r[3] - r[1]))))
    return [clamp(w / 2 - ((r[0] + r[2]) / 2) * z, w - W * z, 0), clamp(h / 2 - ((r[1] + r[3]) / 2) * z, h - H * z, 0), z]
  }
  const cursor = (ms: number) => {
    const c = at(CURSOR, tickAt(ms))[1]
    if (typeof c !== 'string') return c
    const b = boxes[c]
    return b ? [(b[0] + b[2]) / 2, (b[1] + b[3]) / 2] : [W / 2, H / 2]
  }
  const [cx, cy, cz] = glide(now, camera, CAMERA_MS, EASE)
  const [px, py] = glide(now, cursor, CURSOR_MS, EASE)
  const [press] = glide(now, (ms) => [stateAt(tickAt(ms)).press ? 0.85 : 1], 120, CSS_EASE)

  const toastStart = s.toast === 'queued' ? 31 : 88
  return {
    t,
    s,
    camera: { x: cx, y: cy, z: cz },
    cursor: { x: px, y: py, scale: press, ping: s.press ? POP(clamp(since(t) / 700, 0, 1)) : -1 },
    enter: POP(clamp(since(SCREEN_START[s.screen]) / 350, 0, 1)),
    modal: s.modal ? POP(clamp(since(15) / 180, 0, 1)) : 0,
    toast: s.toast ? POP(clamp(since(toastStart) / 180, 0, 1)) : 0,
    events: [31, 37, 45].map((k) => (t >= k ? POP(clamp(since(k) / 300, 0, 1)) : 0)),
    spin: s.verify === 1 ? (since(81) / 1000) * 360 : 0,
  }
}

// ---------------------------------------------------------------- the dashboard's pieces (as in forke-mail/frontend)

type Tone = 'green' | 'blue' | 'amber' | 'accent' | 'neutral' | 'info'
const TONE: Record<Tone, CSSProperties> = {
  green: { background: 'rgba(74,222,128,0.1)', color: '#4ade80' },
  blue: { background: 'rgba(96,165,250,0.1)', color: '#60a5fa' },
  info: { background: 'rgba(96,165,250,0.1)', color: '#60a5fa' },
  amber: { background: 'rgba(251,191,36,0.1)', color: '#fbbf24' },
  accent: { background: 'rgba(255,122,0,0.12)', color: '#ffa347' },
  neutral: { background: C.surface3, color: C.muted },
}
const BADGE: Record<string, Tone> = { sent: 'green', delivered: 'green', verified: 'green', queued: 'blue', pending: 'amber', opened: 'accent' }

function Badge({ value }: { value: string }) {
  return (
    <span className="inline-flex h-[22px] items-center gap-1.5 whitespace-nowrap rounded-[4px] px-1.5 text-xs font-medium capitalize" style={TONE[BADGE[value] ?? 'neutral']}>
      <span className="h-1.5 w-1.5 rounded-[1.5px] bg-current" />
      {value}
    </span>
  )
}

type Variant = 'primary' | 'secondary' | 'ghost'
const VARIANT: Record<Variant, CSSProperties> = {
  primary: { background: C.accent, color: '#1a0a00', boxShadow: C.glow },
  secondary: { background: C.secondary, color: C.ink, boxShadow: `inset 0 0 0 1px ${C.lineStrong}` },
  ghost: { color: C.ink2 },
}
const SIZE = { xs: 'h-7 gap-1.5 rounded-[5px] px-2.5 text-xs', sm: 'h-8 gap-1.5 rounded-[6px] px-3 text-[13px]', md: 'h-9 gap-2 rounded-[6px] px-3.5 text-sm' }

function Button({ variant = 'secondary', size = 'md', icon: Icon, loading, spin = 0, k, children }: {
  variant?: Variant
  size?: keyof typeof SIZE
  icon?: LucideIcon
  loading?: boolean
  spin?: number
  k?: string
  children?: ReactNode
}) {
  return (
    <span data-mv={k} className={`inline-flex shrink-0 items-center justify-center whitespace-nowrap font-medium ${SIZE[size]}`} style={{ ...VARIANT[variant], opacity: loading ? 0.5 : 1 }}>
      {loading ? <Loader2 className="h-4 w-4 shrink-0" style={{ transform: `rotate(${spin}deg)` }} /> : Icon ? <Icon className="h-4 w-4 shrink-0" /> : null}
      {children}
    </span>
  )
}

function Card({ title, description, actions, children, k }: { title?: ReactNode; description?: ReactNode; actions?: ReactNode; children: ReactNode; k?: string }) {
  return (
    <section data-mv={k} className="overflow-hidden rounded-[8px]" style={{ background: C.surface, boxShadow: `0 0 0 1px ${C.line}` }}>
      {title && (
        <div className="flex items-center justify-between gap-3 border-b px-5 py-3" style={{ background: C.surface2, borderColor: C.line }}>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold" style={{ color: C.ink }}>
              {title}
            </h2>
            {description && (
              <p className="mt-0.5 text-xs" style={{ color: C.muted }}>
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  )
}

function PageHeader({ group, back, title, meta, description, actions, k }: {
  group?: string
  back?: string
  title: string
  meta?: ReactNode
  description: string
  actions?: ReactNode
  k?: string
}) {
  return (
    <header data-mv={k} className="mb-7 flex items-end justify-between gap-4">
      <div className="min-w-0">
        {back ? (
          <span className="mb-3 inline-flex items-center gap-1.5 text-[13px]" style={{ color: C.muted }}>
            <ArrowLeft className="h-3.5 w-3.5" />
            {back}
          </span>
        ) : (
          <div className="mb-2.5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em]" style={{ color: C.muted }}>
            <span className="h-1.5 w-1.5 rounded-[1.5px]" style={{ background: C.accent }} />
            {group}
          </div>
        )}
        <div className="flex items-center gap-x-3">
          <h1 className="text-[28px] font-medium leading-tight tracking-[-0.03em]" style={{ color: C.ink }}>
            {title}
          </h1>
          {meta}
        </div>
        <p className="mt-2 max-w-[672px] text-sm leading-relaxed" style={{ color: C.muted }}>
          {description}
        </p>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  )
}

function Stat({ label, value, hint, icon: Icon, tone = 'neutral' }: { label: string; value: string; hint?: string; icon?: LucideIcon; tone?: Tone }) {
  return (
    <div className="flex flex-col gap-1 p-5" style={{ background: C.surface }}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px]" style={{ color: C.muted }}>
          {label}
        </span>
        {Icon && (
          <span className="grid h-7 w-7 place-items-center rounded-[5px]" style={TONE[tone]}>
            <Icon className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
      <span className="mt-1 text-[28px] font-medium tabular-nums tracking-[-0.03em]" style={{ color: C.ink }}>
        {value}
      </span>
      {hint && (
        <span className="text-xs" style={{ color: C.muted }}>
          {hint}
        </span>
      )}
    </div>
  )
}

function Stats({ children }: { children: ReactNode }) {
  return (
    <div className="mb-5 grid grid-cols-4 gap-px overflow-hidden rounded-[8px]" style={{ background: C.line, boxShadow: `0 0 0 1px ${C.line}` }}>
      {children}
    </div>
  )
}

function Strong({ children, sub }: { children: ReactNode; sub?: ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="max-w-[448px] truncate font-medium" style={{ color: C.ink }}>
        {children}
      </div>
      {sub && (
        <div className="mt-0.5 max-w-[448px] truncate text-xs" style={{ color: C.muted }}>
          {sub}
        </div>
      )}
    </div>
  )
}

function Table({ head, rows, footer, right = [] }: { head: string[]; rows: ReactNode[][]; footer: string; right?: number[] }) {
  return (
    <>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b" style={{ background: C.surface2, borderColor: C.line }}>
            {head.map((h, i) => (
              <th key={i} className={`h-10 whitespace-nowrap px-4 font-mono text-[11px] font-normal uppercase tracking-[0.06em] first:pl-5 last:pr-5 ${right.includes(i) ? 'text-right' : 'text-left'}`} style={{ color: C.muted }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r} className="border-b last:border-0" style={{ borderColor: C.line }}>
              {row.map((cell, i) => (
                <td key={i} className={`h-12 whitespace-nowrap px-4 align-middle first:pl-5 last:pr-5 ${right.includes(i) ? 'text-right' : ''}`} style={{ color: C.ink2 }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between gap-3 border-t px-5 py-2.5" style={{ borderColor: C.line }}>
        <span className="text-xs tabular-nums" style={{ color: C.muted }}>
          {footer}
        </span>
      </div>
    </>
  )
}

// ---------------------------------------------------------------- the shell

const NAV: { label: string | null; items: [string, LucideIcon][] }[] = [
  { label: null, items: [['Overview', LayoutDashboard]] },
  { label: 'Sending', items: [['Broadcasts', Megaphone], ['Transactional', Zap], ['Analytics', BarChart3], ['Deliveries', MailSearch], ['Activity', Activity]] },
  { label: 'Audience', items: [['Contacts', Users], ['Segments', Layers], ['Topics', Hash], ['Suppressions', Ban]] },
  { label: 'Automation', items: [['Templates', FileText], ['Workflows', Workflow]] },
  { label: 'Configuration', items: [['Domains', Globe], ['Webhooks', Webhook], ['Connectors', Link2], ['API keys', KeyRound], ['Settings', Settings]] },
]

const Sidebar = memo(function Sidebar({ active }: { active: string }) {
  return (
    <aside className="absolute bottom-0 left-0 top-0 flex w-[240px] flex-col" style={{ background: C.bg }}>
      <span className="pointer-events-none absolute inset-y-0 right-0 w-px" style={railY} />
      <div className="relative flex h-14 shrink-0 items-center px-5">
        <span className="flex items-baseline gap-1.5 text-[18px] tracking-[-0.04em]">
          <span className="font-semibold" style={{ color: C.ink }}>
            forke<span style={{ color: C.accent }}>*</span>
          </span>
          <span style={{ color: C.muted }}>mail</span>
        </span>
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px" style={railX} />
      </div>
      <div className="px-3 pt-3">
        <div className="flex h-10 items-center gap-2.5 rounded-[6px] px-2" style={{ background: C.surface, boxShadow: `inset 0 0 0 1px ${C.line}` }}>
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-[4px] text-[11px] font-semibold" style={{ background: C.surface3, color: C.ink }}>
            A
          </span>
          <span className="min-w-0 flex-1 truncate text-[13px] font-medium" style={{ color: C.ink }}>
            Acme
          </span>
          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0" style={{ color: C.muted }} />
        </div>
      </div>
      <div className="px-3 pt-2">
        <div className="flex h-8 items-center gap-2 rounded-[6px] px-2.5 text-[13px]" style={{ background: C.surface, boxShadow: `inset 0 0 0 1px ${C.line}`, color: C.muted }}>
          <Search className="h-3.5 w-3.5" />
          <span className="flex-1">Search</span>
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 font-sans text-[11px] font-medium" style={{ borderColor: C.lineStrong, background: C.surface2, color: C.muted }}>
            ⌘K
          </span>
        </div>
      </div>
      <nav className="min-h-0 flex-1 overflow-hidden px-3 py-3">
        {NAV.map((g) => (
          <div key={g.label ?? 'root'} className="mb-4 last:mb-0">
            {g.label && (
              <div className="px-2.5 pb-1.5 font-mono text-[10.5px] uppercase tracking-[0.08em]" style={{ color: C.faint }}>
                {g.label}
              </div>
            )}
            <div className="flex flex-col gap-px">
              {g.items.map(([label, Icon]) => {
                const on = label === active
                return (
                  <div
                    key={label}
                    data-mv={`nav-${label.toLowerCase()}`}
                    className="relative flex h-8 items-center gap-2.5 rounded-[6px] px-2.5 text-[13.5px]"
                    style={{ background: on ? C.surface3 : undefined, color: on ? C.ink : C.ink2, fontWeight: on ? 500 : 400 }}
                  >
                    {on && <span className="absolute -left-3 bottom-2 top-2 w-[2px] rounded-r-[2px]" style={{ background: C.accent }} />}
                    <Icon className="h-4 w-4" style={{ color: on ? C.accent : C.muted }} />
                    {label}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="relative flex flex-col gap-4 px-3 pb-3 pt-4">
        <span className="pointer-events-none absolute inset-x-0 top-0 h-px" style={railX} />
        <div className="px-1">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.08em]" style={{ color: C.faint }}>
              This month
            </span>
            <span className="tabular-nums" style={{ color: C.muted }}>
              2.9K / 20K
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-[2px]" style={{ background: C.surface3 }}>
            <div className="h-full rounded-[2px]" style={{ width: '14.5%', background: C.accent }} />
          </div>
        </div>
        <div className="flex items-center gap-2.5 rounded-[6px] p-1.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[6px] bg-gradient-to-br from-[#ffb25c] to-[#ff7a00] text-[11px] font-semibold text-[#1a0a00]">JC</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-medium" style={{ color: C.ink }}>
              John Carter
            </span>
            <span className="block truncate text-[11.5px]" style={{ color: C.muted }}>
              Acme · Paid
            </span>
          </span>
          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0" style={{ color: C.muted }} />
        </div>
      </div>
    </aside>
  )
})

function Topbar({ group, label }: { group: string; label: string }) {
  return (
    <div className="absolute left-[240px] right-0 top-0 flex h-14 items-center gap-2 px-8" style={{ background: C.bg }}>
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px" style={railX} />
      <span className="flex items-center gap-2 text-[13px]">
        <span style={{ color: C.muted }}>{group}</span>
        <span style={{ color: C.faint }}>/</span>
        <span className="font-medium" style={{ color: C.ink }}>
          {label}
        </span>
      </span>
    </div>
  )
}

// ---------------------------------------------------------------- screens

const ROWS = [
  ['ana@northwind.io', 'Your sign-in code', 'delivered', '148 ms', '28 Nov, 11:40'],
  ['dev@lumen.app', 'Receipt #20418', 'delivered', '171 ms', '28 Nov, 11:36'],
  ['ops@kite.so', 'Your password reset code', 'opened', '139 ms', '28 Nov, 11:31'],
  ['mira@orbit.dev', 'Verify your email', 'delivered', '156 ms', '28 Nov, 11:22'],
  ['sam@fieldnote.co', 'Your invoice is ready', 'delivered', '162 ms', '28 Nov, 11:15'],
]

const ListScreen = memo(function ListScreen() {
  return (
    <>
      <PageHeader
        k="header"
        group="Sending"
        title="Transactional"
        description="One-to-one messages like sign-in codes, password resets and receipts. They always skip ahead of broadcasts."
        actions={
          <Button k="send-test" variant="primary" icon={Zap}>
            Send test
          </Button>
        }
      />
      <Stats>
        <Stat icon={Timer} tone="accent" label="Dispatch p50" value="152 ms" hint="Accepted → handed off, last 24 h" />
        <Stat icon={Timer} tone="blue" label="Dispatch p95" value="388 ms" hint="p99 612 ms" />
        <Stat icon={Send} tone="neutral" label="Sent, last 24 h" value="2,318" hint="0 failed · 1 in flight" />
        <Stat icon={MailCheck} tone="green" label="Delivered" value="99.4%" hint="3 bounced · 0 complaints" />
      </Stats>
      <Card>
        <div className="flex items-center gap-2 border-b px-4 py-3" style={{ borderColor: C.line }}>
          <span className="flex h-9 w-44 items-center gap-2 rounded-[6px] border pl-3 pr-2.5 text-sm" style={{ borderColor: C.lineStrong, background: C.control, color: C.ink }}>
            <span className="flex-1">All statuses</span>
            <ChevronDown className="h-4 w-4" style={{ color: C.muted }} />
          </span>
          <span className="ml-auto">
            <Button icon={RefreshCw}>Refresh</Button>
          </span>
        </div>
        <Table
          head={['Message', 'Status', 'Outcome', 'Dispatch', 'Created']}
          right={[3]}
          footer="2,318 messages"
          rows={ROWS.map(([to, subject, outcome, ms, created]) => [
            <Strong key="m" sub={subject}>
              {to}
            </Strong>,
            <Badge key="s" value="sent" />,
            <Badge key="o" value={outcome} />,
            <span key="d" className="font-mono text-xs tabular-nums">
              {ms}
            </span>,
            <span key="c" style={{ color: C.muted }}>
              {created}
            </span>,
          ])}
        />
      </Card>
    </>
  )
})

function Field({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium" style={{ color: C.ink2 }}>
        {label}
      </span>
      <span className="flex h-9 items-center truncate rounded-[6px] border px-3 text-sm" style={{ borderColor: C.lineStrong, background: C.control, color: C.ink }}>
        {value}
      </span>
      {hint && (
        <span className="text-xs leading-relaxed" style={{ color: C.muted }}>
          {hint}
        </span>
      )}
    </div>
  )
}

function Checkbox({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm" style={{ color: C.ink2 }}>
      <span className="h-4 w-4 rounded-[3px] border" style={{ borderColor: '#767676', background: '#fff' }} />
      {label}
    </span>
  )
}

const HTML = `<p>Hi,</p>
<p>Someone asked to reset the password for your account. Use this code within 15 minutes:</p>
<p style="font-size:24px;font-weight:600;letter-spacing:4px">482913</p>
<p>If this wasn't you, ignore this email.</p>`

const SendTest = memo(function SendTest() {
  return (
    <div data-mv="modal" className="w-[768px] overflow-hidden rounded-2xl" style={{ background: C.surface, boxShadow: C.pop }}>
      <div className="flex items-start justify-between gap-4 border-b px-5 py-4" style={{ borderColor: C.line }}>
        <div>
          <h2 className="text-base font-semibold" style={{ color: C.ink }}>
            Send a test message
          </h2>
          <p className="mt-1 text-[13px] leading-relaxed" style={{ color: C.muted }}>
            Goes through the same priority path as API sends.
          </p>
        </div>
        <span className="-mr-1.5 -mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-md" style={{ color: C.muted }}>
          <X className="h-4 w-4" />
        </span>
      </div>
      <div className="flex flex-col gap-4 px-5 py-5">
        <div className="grid grid-cols-2 gap-4">
          <Field label="To" value="john@acme.dev" />
          <Field label="From address" value="no-reply@acme.dev" hint="Must use a verified domain or address." />
          <Field label="From name" value="Acme" />
          <Field label="Subject" value="Your password reset code" />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[13px] font-medium" style={{ color: C.ink2 }}>
            HTML
          </span>
          <pre className="h-[164px] overflow-hidden whitespace-pre-wrap rounded-[6px] border px-3 py-2 font-mono text-[12.5px] leading-relaxed" style={{ borderColor: C.lineStrong, background: C.control, color: C.ink }}>
            {HTML}
          </pre>
        </div>
        <div className="flex gap-5">
          <Checkbox label="Track opens" />
          <Checkbox label="Track clicks" />
        </div>
        <p className="text-xs leading-relaxed" style={{ color: C.muted }}>
          Leave tracking off for one-time codes and security alerts. Opens are estimates: some mail apps load images automatically or block them.
        </p>
        <div className="-mx-5 -mb-5 mt-1 flex items-center justify-end gap-2 border-t px-5 py-3" style={{ borderColor: C.line, background: C.surface2 }}>
          <Button>Cancel</Button>
          <Button k="send" variant="primary" icon={Send}>
            Send
          </Button>
        </div>
      </div>
    </div>
  )
})

const TIMELINE = [
  { type: 'Queued', note: '', dot: C.faint },
  { type: 'Sent', note: 'Handed off for delivery in 162 ms (API call 98 ms, attempt 1)', dot: '#4ade80' },
  { type: 'Delivered', note: '250 Ok 0100019a6c2f4e1b-7d1e9c3a-5b8f-4c2d-a1e6-3f9b2c8d7e41-000000', dot: '#4ade80' },
]

function MessageScreen({ events, shown }: { events: number; shown: number[] }) {
  const sent = events >= 2
  return (
    <>
      <PageHeader
        k="msg-head"
        back="Transactional"
        title="Your password reset code"
        meta={
          <>
            <Badge value={sent ? 'sent' : 'queued'} />
            {events >= 3 && <Badge value="delivered" />}
          </>
        }
        description="To john@acme.dev · From Acme <no-reply@acme.dev> · 28 Nov, 11:42"
      />
      <Stats>
        <Stat label="Dispatch latency" value={sent ? '162 ms' : '-'} hint="Accepted → handed off for delivery" />
        <Stat label="Attempts" value={sent ? '1' : '0'} />
        <Stat label="Opens" value="Off" hint="Tracking disabled" />
        <Stat label="Clicks" value="Off" hint="Tracking disabled" />
      </Stats>
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] items-start gap-5">
        <Card k="timeline" title="Timeline">
          <div className="p-5">
            <ol className="relative flex flex-col gap-4">
              <span className="absolute bottom-2 left-[5px] top-2 w-px" style={{ background: C.lineStrong, opacity: shown[1] }} />
              {TIMELINE.map((e, i) => (
                <li key={e.type} className="relative flex gap-3 pl-6" style={{ opacity: shown[i], transform: `translateY(${4 * (1 - shown[i])}px)` }}>
                  <span className="absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full" style={{ background: e.dot, boxShadow: `0 0 0 4px ${C.surface}` }} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium" style={{ color: C.ink }}>
                        {e.type}
                      </span>
                      <span className="text-xs" style={{ color: C.muted }}>
                        28 Nov, 11:42
                      </span>
                    </div>
                    {e.note && (
                      <div className="mt-0.5 truncate text-xs" style={{ color: C.muted }}>
                        {e.note}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Card>
        <Card title="Content">
          <div className="p-4" style={{ background: C.surface2, backgroundImage: 'radial-gradient(rgba(240,227,222,0.08) 1px, transparent 1px)', backgroundSize: '14px 14px' }}>
            <div className="h-[560px] overflow-hidden rounded-lg bg-white p-2 text-[16px] leading-normal text-black" style={{ boxShadow: `0 0 0 1px ${C.line}`, fontFamily: '"Times New Roman", Times, serif' }}>
              <p className="my-4">Hi,</p>
              <p className="my-4">Someone asked to reset the password for your account. Use this code within 15 minutes:</p>
              <p className="my-4 text-[24px] font-semibold tracking-[4px]">482913</p>
              <p className="my-4">If this wasn&rsquo;t you, ignore this email.</p>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}

const RECORDS = [
  ['CNAME', 'k7q2._domainkey.acme.dev', 'k7q2.dkim.amazonses.com'],
  ['CNAME', 'm4xa._domainkey.acme.dev', 'm4xa.dkim.amazonses.com'],
  ['CNAME', 'p9vd._domainkey.acme.dev', 'p9vd.dkim.amazonses.com'],
  ['TXT', 'acme.dev', 'v=spf1 include:amazonses.com ~all'],
  ['TXT', '_dmarc.acme.dev', 'v=DMARC1; p=none;'],
]

function Value({ value }: { value: string }) {
  return (
    <span className="flex min-w-0 max-w-[420px] items-center gap-1">
      <code className="truncate font-mono text-xs" style={{ color: C.ink }}>
        {value}
      </code>
      <span className="inline-grid h-7 w-7 shrink-0 place-items-center rounded-[5px]" style={{ color: C.muted }}>
        <Copy className="h-3.5 w-3.5" />
      </span>
    </span>
  )
}

function DomainsScreen({ verify, spin }: { verify: 0 | 1 | 2; spin: number }) {
  const ok = verify === 2
  const busy = verify === 1
  return (
    <>
      <PageHeader
        group="Configuration"
        title="Domains"
        description="Verified domains and addresses you can send from. Pending identities are rechecked every minute."
        actions={
          <Button variant="primary" icon={Plus}>
            Add identity
          </Button>
        }
      />
      <div className="flex flex-col gap-5">
        <Card>
          <Table
            head={['Identity', 'Status', 'Last checked', 'Added', '']}
            right={[4]}
            footer="1 identities"
            rows={[
              [
                <div key="i" className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-lg" style={TONE[ok ? 'green' : 'amber']}>
                    <Globe className="h-4 w-4" />
                  </span>
                  <Strong sub="Domain">acme.dev</Strong>
                </div>,
                <Badge key="s" value={ok ? 'verified' : 'pending'} />,
                <span key="l" style={{ color: C.muted }}>
                  {ok ? 'Just now' : '1 min ago'}
                </span>,
                <span key="a" style={{ color: C.muted }}>
                  28 Nov, 11:20
                </span>,
                <div key="x" className="flex justify-end gap-1">
                  {!ok && (
                    <Button size="xs" variant="ghost" icon={RefreshCw} loading={busy} spin={spin}>
                      Verify
                    </Button>
                  )}
                  <span className="inline-flex h-7 items-center rounded-[5px] px-2.5" style={{ color: C.muted }}>
                    <Trash2 className="h-4 w-4" />
                  </span>
                </div>,
              ],
            ]}
          />
        </Card>
        <Card
          k="records"
          title="DNS records · acme.dev"
          description={`Provider status: ${ok ? 'success' : 'pending'}`}
          actions={
            ok ? (
              <Badge value="verified" />
            ) : (
              <Button k="verify" size="sm" icon={RefreshCw} loading={busy} spin={spin}>
                Verify now
              </Button>
            )
          }
        >
          <div className="px-5 pt-4">
            <div className="flex items-start gap-2.5 rounded-[6px] px-4 py-3 text-[13px] leading-relaxed" style={{ ...TONE.info, boxShadow: 'inset 0 0 0 1px rgba(96,165,250,0.18)' }}>
              <Info className="mt-px h-4 w-4 shrink-0" />
              <span>
                Add these records at your DNS provider. If you use Cloudflare, set the CNAME records to <strong>DNS only</strong> (grey cloud). The three CNAME records are required for DKIM; SPF and DMARC are recommended.
              </span>
            </div>
          </div>
          <div className="mt-4 border-t" style={{ borderColor: C.line }}>
            <Table
              head={['Type', 'Name', 'Content']}
              footer="5 records"
              rows={RECORDS.map(([type, name, value]) => [
                <span key="t" className="inline-flex h-6 items-center rounded-md px-2 font-mono text-[11px] font-semibold" style={TONE.info}>
                  {type}
                </span>,
                <Value key="n" value={name} />,
                <Value key="v" value={value} />,
              ])}
            />
          </div>
        </Card>
      </div>
    </>
  )
}

function Toast({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg px-3.5 py-3 text-sm" style={{ background: C.surface, boxShadow: C.pop, color: C.ink }}>
      <CheckCircle2 className="mt-px h-4 w-4 shrink-0 text-[#4ade80]" />
      <span className="leading-snug">{text}</span>
    </div>
  )
}

// ---------------------------------------------------------------- the window

const CRUMB: Record<Screen, [string, string]> = { list: ['Sending', 'Transactional'], message: ['Sending', 'Transactional'], domains: ['Configuration', 'Domains'] }

function Window({ screen, events, shown, verify, spin, modal, toast, toastIn, enter }: {
  screen: Screen
  events: number
  shown: number[]
  verify: 0 | 1 | 2
  spin: number
  modal: number
  toast: string | null
  toastIn: number
  enter: number
}) {
  const [group, label] = CRUMB[screen]
  return (
    <>
      <Sidebar active={label} />
      <Topbar group={group} label={label} />
      <main className="absolute bottom-0 left-[240px] right-0 top-14 overflow-hidden">
        <div className="mx-auto w-full max-w-[1200px] px-8 py-10" style={{ opacity: enter, transform: `translateY(${6 * (1 - enter)}px)` }}>
          {screen === 'list' && <ListScreen />}
          {screen === 'message' && <MessageScreen events={events} shown={shown} />}
          {screen === 'domains' && <DomainsScreen verify={verify} spin={spin} />}
        </div>
      </main>
      <div className="absolute inset-0 z-10 flex items-start justify-center pt-[90px]" style={{ background: 'rgba(0,0,0,0.5)', opacity: modal, visibility: modal > 0 ? 'visible' : 'hidden' }}>
        <div style={{ transform: `translateY(${4 * (1 - modal)}px) scale(${0.98 + 0.02 * modal})` }}>
          <SendTest />
        </div>
      </div>
      {toast && (
        <div className="absolute bottom-4 right-4 z-20" style={{ opacity: toastIn, transform: `translateY(${4 * (1 - toastIn)}px) scale(${0.98 + 0.02 * toastIn})` }}>
          <Toast text={toast === 'queued' ? 'Message queued.' : 'acme.dev is verified.'} />
        </div>
      )}
    </>
  )
}

/** One frame of the film, `now` ms into the loop, filling a `width` × `height` frame. */
export function MailFilmFrame({ now, width, height, boxes }: { now: number; width: number; height: number; boxes: Boxes }) {
  const f = frameAt(now, width, height, boxes)
  const { s } = f
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden" style={{ background: C.bg }}>
      <div
        className="absolute left-0 top-0 origin-top-left overflow-hidden font-sans"
        style={{ width: W, height: H, background: C.bg, color: C.ink, transform: `translate(${f.camera.x}px, ${f.camera.y}px) scale(${f.camera.z})` }}
      >
        <Window screen={s.screen} events={s.events} shown={f.events} verify={s.verify} spin={f.spin} modal={f.modal} toast={s.toast} toastIn={f.toast} enter={f.enter} />
        <div className="pointer-events-none absolute left-0 top-0 z-30" style={{ transform: `translate(${f.cursor.x}px, ${f.cursor.y}px)` }}>
          <svg width="22" height="22" viewBox="0 0 24 24" className="-translate-x-[3px] -translate-y-[2px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" style={{ transform: `scale(${f.cursor.scale})` }}>
            <path d="M3 2 L3 19 L7.5 14.8 L10.6 21.6 L13.4 20.4 L10.4 13.8 L16.6 13.8 Z" fill="white" stroke="black" strokeWidth="1.2" strokeLinejoin="round" />
          </svg>
          {f.cursor.ping >= 0 && (
            <span
              className="absolute left-0 top-0 h-8 w-8 rounded-full bg-white/30"
              style={{ transform: `translate(-50%, -50%) scale(${1 + f.cursor.ping})`, opacity: 1 - f.cursor.ping }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

const MEASURE_KEYS = ['header', 'send-test', 'modal', 'send', 'msg-head', 'timeline', 'records', 'verify', 'nav-domains']

function box(el: HTMLElement, root: HTMLElement): [number, number, number, number] {
  let x = 0
  let y = 0
  let n: HTMLElement | null = el
  while (n && n !== root) {
    x += n.offsetLeft
    y += n.offsetTop
    n = n.offsetParent as HTMLElement | null
  }
  return [x, y, x + el.offsetWidth, y + el.offsetHeight]
}

/**
 * Lays out each screen once, out of sight, and reports where the camera and cursor targets sit (layout boxes inside
 * the W × H window), so the film itself never has to measure while it plays. Re-measures once fonts are in.
 */
export function MailFilmMeasure({ onMeasure }: { onMeasure: (boxes: Boxes) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const cb = useRef(onMeasure)
  cb.current = onMeasure
  useLayoutEffect(() => {
    const measure = () => {
      const out: Boxes = {}
      ref.current?.querySelectorAll<HTMLElement>('[data-window]').forEach((root) => {
        root.querySelectorAll<HTMLElement>('[data-mv]').forEach((el) => {
          const k = el.dataset.mv!
          if (MEASURE_KEYS.includes(k) && !out[k]) out[k] = box(el, root)
        })
      })
      cb.current(out)
    }
    measure()
    let live = true
    document.fonts?.ready.then(() => live && measure())
    return () => {
      live = false
    }
  }, [])
  const states: Parameters<typeof Window>[0][] = [
    { screen: 'list', events: 0, shown: [0, 0, 0], verify: 0, spin: 0, modal: 1, toast: null, toastIn: 0, enter: 1 },
    { screen: 'message', events: 3, shown: [1, 1, 1], verify: 0, spin: 0, modal: 0, toast: null, toastIn: 0, enter: 1 },
    { screen: 'domains', events: 0, shown: [0, 0, 0], verify: 0, spin: 0, modal: 0, toast: null, toastIn: 0, enter: 1 },
  ]
  return (
    <div ref={ref} aria-hidden className="pointer-events-none fixed left-[-99999px] top-0" style={{ visibility: 'hidden' }}>
      {states.map((p) => (
        <div key={p.screen} data-window className="absolute left-0 top-0 overflow-hidden font-sans" style={{ width: W, height: H }}>
          <Window {...p} />
        </div>
      ))}
    </div>
  )
}
