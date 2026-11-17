'use client'

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import {
  Activity,
  ArrowLeft,
  Ban,
  Check,
  Globe,
  Hash,
  KeyRound,
  LayoutDashboard,
  Loader2,
  MailCheck,
  Megaphone,
  RefreshCw,
  Search,
  Send,
  Settings,
  Timer,
  Users,
  Webhook,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { cn } from './primitives'

/**
 * A short directed loop of the real Forke Mail dashboard (same sidebar, tokens, pages and copy as forke-mail/frontend),
 * filmed like the hero's workflow loop: the window sits on fixed pixels, a camera frames each beat and a cursor clicks
 * through it. Transactional → Send test → the message's timeline fills in → Domains → Verify now → verified.
 */

const W = 960
const H = 520
const LOOP = 125 // ticks of 100ms
const EASE = 'cubic-bezier(0.65, 0, 0.35, 1)' // the hero loop's easing
const CAMERA_MS = 1400 // and its camera glide
const CURSOR_MS = 700 // and its cursor move

// Forke Mail's dark theme tokens
const C = {
  bg: '#151414',
  surface: '#1a1919',
  surface2: '#1e1d1c',
  surface3: '#262423',
  line: 'rgba(240,227,222,0.09)',
  lineStrong: 'rgba(240,227,222,0.16)',
  ink2: '#c9c7c5',
  muted: '#8e8e93',
  faint: '#5f5c5a',
}

type Key = string
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
  [0, [720, 440]],
  [6, 'send-test'],
  [22, 'send'],
  [53, 'nav-domains'],
  [72, 'verify'],
  [98, [720, 440]],
]
const PRESSES = [14, 30, 62, 80]

function stateAt(t: number) {
  return {
    screen: (t < 31 ? 'list' : t < 63 ? 'message' : 'domains') as 'list' | 'message' | 'domains',
    modal: t >= 15 && t < 31,
    events: t >= 45 ? 3 : t >= 37 ? 2 : t >= 31 ? 1 : 0,
    verify: (t >= 88 ? 2 : t >= 81 ? 1 : 0) as 0 | 1 | 2,
    toast: t >= 88 && t < 116,
    press: PRESSES.includes(t),
  }
}

const at = <K extends [number, ...unknown[]]>(list: K[], t: number): K => [...list].reverse().find((k) => t >= k[0]) ?? list[0]

/** Layout box of `el` inside `root`, ignoring transforms. */
function box(el: HTMLElement, root: HTMLElement) {
  let x = 0
  let y = 0
  let n: HTMLElement | null = el
  while (n && n !== root) {
    x += n.offsetLeft
    y += n.offsetTop
    n = n.offsetParent as HTMLElement | null
  }
  return { x1: x, y1: y, x2: x + el.offsetWidth, y2: y + el.offsetHeight }
}

// ---------------------------------------------------------------- the dashboard's pieces (as in forke-mail/frontend)

type Tone = 'green' | 'blue' | 'amber' | 'accent' | 'neutral'
const TONE: Record<Tone, string> = {
  green: 'bg-[rgba(74,222,128,0.1)] text-[#4ade80]',
  blue: 'bg-[rgba(96,165,250,0.1)] text-[#60a5fa]',
  amber: 'bg-[rgba(251,191,36,0.1)] text-[#fbbf24]',
  accent: 'bg-[rgba(255,122,0,0.12)] text-[#ffa347]',
  neutral: 'bg-[#262423] text-[#8e8e93]',
}

function Badge({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span className={cn('inline-flex h-[20px] items-center gap-1.5 whitespace-nowrap rounded-[4px] px-1.5 text-[11px] font-medium', TONE[tone])}>
      <span className="h-1.5 w-1.5 rounded-[1.5px] bg-current" />
      {children}
    </span>
  )
}

function Primary({ children, icon: Icon, k, busy }: { children: ReactNode; icon?: LucideIcon; k?: string; busy?: boolean }) {
  return (
    <span
      data-mv={k}
      className="inline-flex h-8 items-center gap-1.5 rounded-[6px] bg-[#ff7a00] px-3 text-[12.5px] font-medium text-[#1a0a00] shadow-[0_0_24px_-6px_rgba(255,122,0,0.6)]"
    >
      {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : Icon ? <Icon className="h-3.5 w-3.5" /> : null}
      {children}
    </span>
  )
}

function Secondary({ children, icon: Icon }: { children: ReactNode; icon?: LucideIcon }) {
  return (
    <span className="inline-flex h-8 items-center gap-1.5 rounded-[6px] px-3 text-[12.5px] text-[#f4f4f5]" style={{ background: C.surface, boxShadow: `inset 0 0 0 1px ${C.lineStrong}` }}>
      {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
      {children}
    </span>
  )
}

function Card({ title, actions, children, k, className }: { title?: ReactNode; actions?: ReactNode; children: ReactNode; k?: string; className?: string }) {
  return (
    <section data-mv={k} className={cn('overflow-hidden rounded-[8px]', className)} style={{ background: C.surface, boxShadow: `0 0 0 1px ${C.line}` }}>
      {title && (
        <div className="flex items-center justify-between border-b px-4 py-2.5" style={{ background: C.surface2, borderColor: C.line }}>
          <h2 className="text-[12.5px] font-semibold text-[#f4f4f5]">{title}</h2>
          {actions}
        </div>
      )}
      {children}
    </section>
  )
}

function Stat({ label, value, hint, icon: Icon, tone }: { label: string; value: string; hint?: string; icon?: LucideIcon; tone?: Tone }) {
  return (
    <div className="flex flex-col gap-0.5 p-3.5" style={{ background: C.surface }}>
      <div className="flex items-center justify-between">
        <span className="text-[11.5px]" style={{ color: C.muted }}>
          {label}
        </span>
        {Icon && tone && (
          <span className={cn('grid h-6 w-6 place-items-center rounded-[5px]', TONE[tone])}>
            <Icon className="h-3 w-3" />
          </span>
        )}
      </div>
      <span className="mt-0.5 text-[22px] font-medium tabular-nums tracking-[-0.03em] text-[#f4f4f5]">{value}</span>
      {hint && (
        <span className="truncate text-[10.5px]" style={{ color: C.muted }}>
          {hint}
        </span>
      )}
    </div>
  )
}

function PageHeader({ group, title, description, actions, back, meta, k }: {
  group?: string
  title: string
  description: string
  actions?: ReactNode
  back?: string
  meta?: ReactNode
  k?: string
}) {
  return (
    <header data-mv={k} className="mb-5 flex items-end justify-between gap-4">
      <div className="min-w-0">
        {back ? (
          <p className="mb-2 flex items-center gap-1.5 text-[11.5px]" style={{ color: C.muted }}>
            <ArrowLeft className="h-3 w-3" /> {back}
          </p>
        ) : (
          <p className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.08em]" style={{ color: C.muted }}>
            <span className="h-1.5 w-1.5 rounded-[1.5px] bg-[#ff7a00]" />
            {group}
          </p>
        )}
        <div className="flex items-center gap-2.5">
          <h1 className="text-[22px] font-medium leading-tight tracking-[-0.03em] text-[#f4f4f5]">{title}</h1>
          {meta}
        </div>
        <p className="mt-1.5 max-w-[520px] text-[12px] leading-relaxed" style={{ color: C.muted }}>
          {description}
        </p>
      </div>
      {actions}
    </header>
  )
}

const NAV: { label: string | null; items: [string, LucideIcon][] }[] = [
  { label: null, items: [['Overview', LayoutDashboard]] },
  { label: 'Sending', items: [['Broadcasts', Megaphone], ['Transactional', Zap], ['Activity', Activity]] },
  { label: 'Audience', items: [['Contacts', Users], ['Topics', Hash], ['Suppressions', Ban]] },
  { label: 'Configuration', items: [['Domains', Globe], ['Webhooks', Webhook], ['API keys', KeyRound], ['Settings', Settings]] },
]

function Sidebar({ active }: { active: string }) {
  return (
    <aside className="absolute bottom-0 left-0 top-0 w-[200px] border-r" style={{ background: C.bg, borderColor: C.line }}>
      <div className="flex h-11 items-center border-b px-4" style={{ borderColor: C.line }}>
        <span className="flex items-baseline gap-1 text-[15px] tracking-[-0.04em]">
          <span className="font-semibold text-[#f4f4f5]">
            forke<span className="text-[#ff7a00]">*</span>
          </span>
          <span style={{ color: C.muted }}>mail</span>
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
        {NAV.map((g) => (
          <div key={g.label ?? 'root'} className="mb-3">
            {g.label && (
              <p className="px-2 pb-1 font-mono text-[9.5px] uppercase tracking-[0.08em]" style={{ color: C.faint }}>
                {g.label}
              </p>
            )}
            {g.items.map(([label, Icon]) => {
              const on = label === active
              return (
                <div
                  key={label}
                  data-mv={`nav-${label.toLowerCase()}`}
                  className="relative flex h-[26px] items-center gap-2 rounded-[6px] px-2 text-[12px]"
                  style={{ background: on ? C.surface3 : undefined, color: on ? '#f4f4f5' : C.ink2, fontWeight: on ? 500 : 400 }}
                >
                  {on && <span className="absolute -left-2.5 bottom-1.5 top-1.5 w-[2px] rounded-r-[2px] bg-[#ff7a00]" />}
                  <Icon className="h-3.5 w-3.5" style={{ color: on ? '#ff7a00' : C.muted }} />
                  {label}
                </div>
              )
            })}
          </div>
        ))}
      </nav>
    </aside>
  )
}

// ---------------------------------------------------------------- screens

const ROWS = [
  ['ana@northwind.io', 'Your sign-in code', 'sent', 'delivered', '148 ms', '2 min ago'],
  ['dev@lumen.app', 'Receipt #20418', 'sent', 'delivered', '171 ms', '6 min ago'],
  ['ops@kite.so', 'Your password reset code', 'sent', 'opened', '139 ms', '11 min ago'],
] as const

function ListScreen() {
  return (
    <>
      <PageHeader
        k="header"
        group="Sending"
        title="Transactional"
        description="One-to-one messages like sign-in codes, password resets and receipts. They always skip ahead of broadcasts."
        actions={
          <Primary k="send-test" icon={Zap}>
            Send test
          </Primary>
        }
      />
      <div className="mb-4 grid grid-cols-4 gap-px overflow-hidden rounded-[8px]" style={{ background: C.line, boxShadow: `0 0 0 1px ${C.line}` }}>
        <Stat label="Dispatch p50" value="152 ms" hint="Accepted → handed off, last 24 h" icon={Timer} tone="accent" />
        <Stat label="Dispatch p95" value="388 ms" hint="p99 612 ms" icon={Timer} tone="blue" />
        <Stat label="Sent, last 24 h" value="2,318" hint="0 failed · 1 in flight" icon={Send} tone="neutral" />
        <Stat label="Delivered" value="99.4%" hint="3 bounced · 0 complaints" icon={MailCheck} tone="green" />
      </div>
      <Card>
        <div className="grid grid-cols-[1.6fr_0.7fr_0.8fr_0.6fr_0.7fr] border-b px-4 py-2 font-mono text-[9.5px] uppercase tracking-[0.08em]" style={{ borderColor: C.line, color: C.faint }}>
          <span>Message</span>
          <span>Status</span>
          <span>Outcome</span>
          <span className="text-right">Dispatch</span>
          <span className="text-right">Created</span>
        </div>
        {ROWS.map(([to, subject, status, outcome, ms, ago]) => (
          <div key={to} className="grid grid-cols-[1.6fr_0.7fr_0.8fr_0.6fr_0.7fr] items-center border-b px-4 py-2 last:border-0" style={{ borderColor: C.line }}>
            <span className="min-w-0">
              <span className="block truncate text-[12px] font-medium text-[#f4f4f5]">{to}</span>
              <span className="block truncate text-[10.5px]" style={{ color: C.muted }}>
                {subject}
              </span>
            </span>
            <span>
              <Badge tone="green">{status}</Badge>
            </span>
            <span>
              <Badge tone={outcome === 'opened' ? 'accent' : 'green'}>{outcome}</Badge>
            </span>
            <span className="text-right font-mono text-[11px] tabular-nums text-[#c9c7c5]">{ms}</span>
            <span className="text-right text-[11px]" style={{ color: C.muted }}>
              {ago}
            </span>
          </div>
        ))}
      </Card>
    </>
  )
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-medium text-[#c9c7c5]">{label}</span>
      <span className={cn('flex h-8 items-center truncate rounded-[6px] border px-2.5 text-[12px] text-[#f4f4f5]', mono && 'font-mono')} style={{ borderColor: C.lineStrong, background: C.surface }}>
        {value}
      </span>
    </label>
  )
}

function SendTestModal({ open }: { open: boolean }) {
  return (
    <div className={cn('absolute inset-0 z-10 grid place-items-center transition-opacity duration-300', open ? 'opacity-100' : 'pointer-events-none opacity-0')} style={{ background: 'rgba(0,0,0,0.55)' }}>
      <div
        data-mv="modal"
        className="w-[520px] rounded-[10px] p-5 transition-transform duration-300"
        style={{ background: C.surface, boxShadow: `0 24px 64px -16px rgba(0,0,0,0.7), 0 0 0 1px ${C.lineStrong}`, transform: open ? 'none' : 'translateY(8px) scale(0.98)' }}
      >
        <h3 className="text-[15px] font-medium tracking-[-0.02em] text-[#f4f4f5]">Send a test message</h3>
        <p className="mt-0.5 text-[11.5px]" style={{ color: C.muted }}>
          Goes through the same priority path as API sends.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Field label="To" value="john@acme.dev" />
          <Field label="From address" value="no-reply@acme.dev" />
          <Field label="From name" value="Acme" />
          <Field label="Subject" value="Your password reset code" />
        </div>
        <div className="mt-3">
          <span className="text-[11px] font-medium text-[#c9c7c5]">HTML</span>
          <pre className="mt-1 h-[54px] overflow-hidden rounded-[6px] border px-2.5 py-1.5 font-mono text-[10.5px] leading-[15px] text-[#c9c7c5]" style={{ borderColor: C.lineStrong, background: C.surface }}>
            {'<p>Hi,</p>\n<p>Someone asked to reset the password for your account…</p>\n<p style="font-size:24px">482913</p>'}
          </pre>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Secondary>Cancel</Secondary>
          <Primary k="send" icon={Send}>
            Send
          </Primary>
        </div>
      </div>
    </div>
  )
}

const TIMELINE = [
  { type: 'Queued', at: '11:42:08', note: 'Accepted over the API', dot: 'bg-[#60a5fa]' },
  { type: 'Sent', at: '11:42:08', note: 'Dispatch 162 ms', dot: 'bg-[#4ade80]' },
  { type: 'Delivered', at: '11:42:10', note: 'Accepted by the recipient’s server', dot: 'bg-[#4ade80]' },
]

function MessageScreen({ events }: { events: number }) {
  const sent = events >= 2
  return (
    <>
      <PageHeader
        k="msg-head"
        back="Transactional"
        title="Your password reset code"
        meta={
          <>
            <Badge tone={sent ? 'green' : 'blue'}>{sent ? 'sent' : 'queued'}</Badge>
            {events >= 3 && <Badge tone="green">delivered</Badge>}
          </>
        }
        description="To john@acme.dev · From Acme <no-reply@acme.dev> · just now"
      />
      <div className="mb-4 grid grid-cols-4 gap-px overflow-hidden rounded-[8px]" style={{ background: C.line, boxShadow: `0 0 0 1px ${C.line}` }}>
        <Stat label="Dispatch latency" value={sent ? '162 ms' : '-'} hint="Accepted → handed off for delivery" />
        <Stat label="Attempts" value={sent ? '1' : '0'} />
        <Stat label="Opens" value="Off" hint="Tracking disabled" />
        <Stat label="Clicks" value="Off" hint="Tracking disabled" />
      </div>
      <div className="grid grid-cols-[1fr_1.3fr] gap-4">
        <Card k="timeline" title="Timeline">
          <ol className="relative flex flex-col gap-3.5 p-4 before:absolute before:bottom-6 before:left-[21px] before:top-6 before:w-px before:bg-[rgba(240,227,222,0.16)]">
            {TIMELINE.map((e, i) => (
              <li key={e.type} className={cn('relative flex gap-3 pl-6 transition-all duration-500', i < events ? 'opacity-100' : 'translate-y-1 opacity-0')}>
                <span className={cn('absolute left-0 top-1 h-[11px] w-[11px] rounded-full ring-4 ring-[#1a1919]', e.dot)} />
                <div className="min-w-0">
                  <p className="flex items-center gap-2">
                    <span className="text-[12.5px] font-medium text-[#f4f4f5]">{e.type}</span>
                    <span className="text-[10.5px]" style={{ color: C.muted }}>
                      {e.at}
                    </span>
                  </p>
                  <p className="mt-0.5 text-[10.5px]" style={{ color: C.muted }}>
                    {e.note}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Card>
        <Card title="Content">
          <div className="p-3" style={{ background: C.surface2, backgroundImage: 'radial-gradient(rgba(240,227,222,0.08) 1px, transparent 1px)', backgroundSize: '12px 12px' }}>
            <div className="rounded-[6px] bg-white p-3.5 text-[11px] leading-relaxed text-[#111114]">
              <p>Hi,</p>
              <p className="mt-1.5">Someone asked to reset the password for your account. Use this code within 15 minutes:</p>
              <p className="mt-1.5 text-[18px] font-semibold tracking-[4px]">482913</p>
              <p className="mt-1.5 text-[#6b6b74]">If this wasn&rsquo;t you, ignore this email.</p>
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

function DomainsScreen({ verify }: { verify: 0 | 1 | 2 }) {
  const ok = verify === 2
  return (
    <>
      <PageHeader group="Configuration" title="Domains" description="Verified domains and addresses you can send from. Pending identities are rechecked every minute." />
      <Card className="mb-4">
        <div className="flex items-center gap-3 px-4 py-2.5">
          <span className={cn('grid h-7 w-7 place-items-center rounded-lg', ok ? TONE.green : TONE.amber)}>
            <Globe className="h-3.5 w-3.5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[12.5px] font-medium text-[#f4f4f5]">acme.dev</span>
            <span className="block text-[10.5px]" style={{ color: C.muted }}>
              Domain
            </span>
          </span>
          <Badge tone={ok ? 'green' : 'amber'}>{ok ? 'verified' : 'pending'}</Badge>
          <span className="w-24 text-right text-[11px]" style={{ color: C.muted }}>
            {ok ? 'just now' : '1 min ago'}
          </span>
        </div>
      </Card>
      <Card
        k="records"
        title="DNS records · acme.dev"
        actions={
          ok ? (
            <Badge tone="green">verified</Badge>
          ) : (
            <Primary k="verify" icon={RefreshCw} busy={verify === 1}>
              Verify now
            </Primary>
          )
        }
      >
        {RECORDS.map(([type, name, value]) => (
          <div key={name} className="grid grid-cols-[64px_1fr_1.2fr] items-center gap-3 border-b px-4 py-2 last:border-0" style={{ borderColor: C.line }}>
            <span className="inline-flex h-5 w-fit items-center rounded-md bg-[rgba(96,165,250,0.1)] px-1.5 font-mono text-[10px] font-semibold text-[#60a5fa]">{type}</span>
            <span className="truncate font-mono text-[11px] text-[#c9c7c5]">{name}</span>
            <span className="truncate font-mono text-[11px] text-[#c9c7c5]">{value}</span>
          </div>
        ))}
      </Card>
    </>
  )
}

// ---------------------------------------------------------------- the film

/** The Forke Mail loop, filling its parent. Plays while `active`; otherwise holds its last frame. */
export default function MailVideo({ active }: { active: boolean }) {
  const [t, setT] = useState(LOOP - 1)
  useEffect(() => {
    if (!active || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setT(LOOP - 1)
      return
    }
    setT(0)
    const id = window.setInterval(() => setT((n) => (n + 1) % LOOP), 100)
    return () => window.clearInterval(id)
  }, [active])
  const s = stateAt(t)

  const frame = useRef<HTMLDivElement>(null)
  const win = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 548, h: 288 })
  useLayoutEffect(() => {
    const el = frame.current
    if (!el) return
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // frame the current beat, and find where the cursor should be
  const zFit = Math.max(size.w / W, size.h / H)
  const [cam, setCam] = useState({ x: 0, y: 0, z: zFit })
  const [cur, setCur] = useState({ x: 720, y: 440 })
  const shotKey = at(SHOTS, t)[0]
  const cursorKey = at(CURSOR, t)[0]
  useLayoutEffect(() => {
    const root = win.current
    if (!root) return
    const keys = at(SHOTS, t)[1]
    const rects = (keys ?? [])
      .map((k) => root.querySelector<HTMLElement>(`[data-mv="${k}"]`))
      .filter((el): el is HTMLElement => !!el)
      .map((el) => box(el, root))
    const PAD = 18
    const r = rects.length
      ? {
          x1: Math.max(0, Math.min(...rects.map((q) => q.x1)) - PAD),
          y1: Math.max(0, Math.min(...rects.map((q) => q.y1)) - PAD),
          x2: Math.min(W, Math.max(...rects.map((q) => q.x2)) + PAD),
          y2: Math.min(H, Math.max(...rects.map((q) => q.y2)) + PAD),
        }
      : { x1: 0, y1: 0, x2: W, y2: H }
    const z = Math.max(zFit, Math.min(zFit * 2.3, Math.min(size.w / (r.x2 - r.x1), size.h / (r.y2 - r.y1))))
    const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
    setCam({
      z,
      x: clamp(size.w / 2 - ((r.x1 + r.x2) / 2) * z, size.w - W * z, 0),
      y: clamp(size.h / 2 - ((r.y1 + r.y2) / 2) * z, size.h - H * z, 0),
    })

    const c = at(CURSOR, t)[1]
    if (typeof c === 'string') {
      const el = root.querySelector<HTMLElement>(`[data-mv="${c}"]`)
      if (el) {
        const b = box(el, root)
        setCur({ x: (b.x1 + b.x2) / 2, y: (b.y1 + b.y2) / 2 })
      }
    } else setCur({ x: c[0], y: c[1] })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shotKey, cursorKey, size.w, size.h, s.screen, s.modal])

  const active_nav = s.screen === 'domains' ? 'Domains' : 'Transactional'
  return (
    <div ref={frame} aria-hidden className="absolute inset-0 overflow-hidden" style={{ background: C.bg }}>
      <div
        ref={win}
        className="absolute left-0 top-0 origin-top-left overflow-hidden font-sans text-[#f4f4f5]"
        style={{ width: W, height: H, background: C.bg, transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.z})`, transition: `transform ${CAMERA_MS}ms ${EASE}` }}
      >
        <Sidebar active={active_nav} />

        {/* top bar: breadcrumb */}
        <div className="absolute left-[200px] right-0 top-0 flex h-11 items-center gap-2 border-b px-6 text-[12px]" style={{ borderColor: C.line }}>
          <span style={{ color: C.muted }}>{s.screen === 'domains' ? 'Configuration' : 'Sending'}</span>
          <span style={{ color: C.faint }}>/</span>
          <span className="font-medium text-[#f4f4f5]">{s.screen === 'domains' ? 'Domains' : 'Transactional'}</span>
        </div>

        {/* page */}
        <main className="absolute bottom-0 left-[200px] right-0 top-11 px-6 py-5">
          <div key={s.screen} className="animate-[menu-in_300ms_ease_both]">
            {s.screen === 'list' && <ListScreen />}
            {s.screen === 'message' && <MessageScreen events={s.events} />}
            {s.screen === 'domains' && <DomainsScreen verify={s.verify} />}
          </div>
        </main>

        <SendTestModal open={s.modal} />

        {/* toast */}
        <div
          className="absolute bottom-4 right-4 z-20 flex items-center gap-2 rounded-[8px] px-3 py-2 text-[12px] text-[#f4f4f5] transition-all duration-300"
          style={{ background: C.surface, boxShadow: `0 24px 64px -16px rgba(0,0,0,0.7), 0 0 0 1px ${C.lineStrong}`, opacity: s.toast ? 1 : 0, transform: s.toast ? 'none' : 'translateY(8px)' }}
        >
          <Check className="h-3.5 w-3.5 text-[#4ade80]" /> acme.dev is verified.
        </div>

        {/* cursor */}
        <div className="pointer-events-none absolute left-0 top-0 z-30" style={{ transform: `translate(${cur.x}px, ${cur.y}px)`, transition: `transform ${CURSOR_MS}ms ${EASE}` }}>
          <svg width="20" height="20" viewBox="0 0 24 24" className="-translate-x-[3px] -translate-y-[2px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" style={{ transform: s.press ? 'scale(0.85)' : 'scale(1)', transition: 'transform 120ms' }}>
            <path d="M3 2 L3 19 L7.5 14.8 L10.6 21.6 L13.4 20.4 L10.4 13.8 L16.6 13.8 Z" fill="white" stroke="black" strokeWidth="1.2" strokeLinejoin="round" />
          </svg>
          {s.press && <span className="absolute left-0 top-0 h-7 w-7 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-white/30" />}
        </div>
      </div>
    </div>
  )
}
