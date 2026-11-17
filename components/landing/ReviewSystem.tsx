'use client'

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Check,
  ClipboardList,
  FileCheck,
  GitMerge,
  LayoutDashboard,
  Loader2,
  Mail,
  Search,
  Settings,
  ShieldCheck,
  Users,
  type LucideIcon,
} from 'lucide-react'
import FitScale from './FitScale'
import { Painting, ScrambleText, Section, cn } from './primitives'
import { Badge, C, Primary, Secondary, TONE, type Tone } from './dashUi'

/*
 * The review system as a guided walkthrough: the six steps on the left, the active one with a progress bar running;
 * on the right, the owner's view of one submission, filmed like the Forke Mail loop (same sidebar, tokens, page
 * header, stat strip, cards and badges) inside a window that bleeds off a painting's right and bottom edges, like the
 * "How it works" cards. A camera frames each beat and a cursor clicks through it. Everything is derived from
 * (step, time), so clicking a step jumps straight to it. It only plays while on screen.
 * Internals (weights, thresholds, formulas) stay out on purpose.
 */

const STEPS = [
  { title: 'Baseline first', desc: 'A health snapshot of the repo is taken before any work starts.', ms: 6000 },
  { title: 'Checks in a sandbox', desc: 'Build, tests and security run on an isolated copy of the repo.', ms: 6500 },
  { title: 'Compared to the baseline', desc: 'Only problems your change introduced count against you.', ms: 6000 },
  { title: 'AI review', desc: 'An AI reads the diff and scores it before anyone opens it.', ms: 6500 },
  { title: 'Routed by risk', desc: 'Low risk moves fast. Risky changes get an expert reviewer.', ms: 5500 },
  { title: 'Merge & pay', desc: 'The owner merges, and the escrow releases to your UPI.', ms: 7500 },
]

// ---------------------------------------------------------------- the dashboard's look (as in Forke Mail)

const W = 960
const H = 600
const BLEED = 32 // the window runs this far past the painting's right and bottom edges
const EASE = 'cubic-bezier(0.65, 0, 0.35, 1)'
const CAMERA_MS = 1300
const CURSOR_MS = 650

function Card({ title, actions, children, k, className }: { title: ReactNode; actions?: ReactNode; children: ReactNode; k?: string; className?: string }) {
  return (
    <section data-k={k} className={cn('flex flex-col overflow-hidden rounded-[8px]', className)} style={{ background: C.surface, boxShadow: `0 0 0 1px ${C.line}` }}>
      <div className="flex h-10 shrink-0 items-center justify-between border-b px-4" style={{ background: C.surface2, borderColor: C.line }}>
        <h2 className="text-[12.5px] font-semibold text-[#f4f4f5]">{title}</h2>
        {actions}
      </div>
      {children}
    </section>
  )
}

function Stat({ label, value, hint, k, flag }: { label: string; value: ReactNode; hint: ReactNode; k?: string; flag?: boolean }) {
  return (
    <div data-k={k} className="relative flex flex-col gap-0.5 p-3.5" style={{ background: C.surface }}>
      <span className="text-[11.5px]" style={{ color: C.muted }}>
        {label}
      </span>
      <span className="mt-0.5 h-[30px] text-[22px] font-medium tabular-nums tracking-[-0.03em] text-[#f4f4f5]">{value}</span>
      <span className="truncate text-[10.5px]" style={{ color: C.muted }}>
        {hint}
      </span>
      <span
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{ boxShadow: 'inset 0 0 0 1px rgba(251,191,36,0.45)', background: 'rgba(251,191,36,0.04)', opacity: flag ? 1 : 0 }}
      />
    </div>
  )
}

const NAV: { label: string | null; items: [string, LucideIcon][] }[] = [
  { label: null, items: [['Overview', LayoutDashboard]] },
  { label: 'Work', items: [['Tasks', ClipboardList], ['Submissions', FileCheck], ['Developers', Users], ['Messages', Mail]] },
  { label: 'Company', items: [['Escrow', ShieldCheck], ['Analytics', BarChart3], ['Settings', Settings]] },
]

function Sidebar() {
  return (
    <aside className="absolute bottom-0 left-0 top-0 w-[200px] border-r" style={{ background: C.bg, borderColor: C.line }}>
      <div className="flex h-11 items-center border-b px-4" style={{ borderColor: C.line }}>
        <span className="flex items-baseline gap-1 text-[15px] tracking-[-0.04em]">
          <span className="font-semibold text-[#f4f4f5]">
            forke<span className="text-[#ff7a00]">*</span>
          </span>
          <span style={{ color: C.muted }}>owner</span>
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
              const on = label === 'Submissions'
              return (
                <div
                  key={label}
                  className="relative flex h-[26px] items-center gap-2 rounded-[6px] px-2 text-[12px]"
                  style={{ background: on ? C.surface3 : undefined, color: on ? '#f4f4f5' : C.ink2, fontWeight: on ? 500 : 400 }}
                >
                  {on && <span className="absolute -left-2.5 bottom-1.5 top-1.5 w-[2px] rounded-r-[2px] bg-[#ff7a00]" />}
                  <Icon className="h-3.5 w-3.5" style={{ color: on ? '#ff7a00' : C.muted }} />
                  {label}
                  {on && (
                    <span className="ml-auto rounded-[3px] px-1 font-mono text-[9.5px]" style={{ background: C.surface, color: C.ink2 }}>
                      1
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </nav>
    </aside>
  )
}

// ---------------------------------------------------------------- the script

const DEV = 'https://i.pravatar.cc/80?img=12' // John Doe, the same face as across the site

type Keys = string[] | null
/** What the camera frames, by element key (null: the whole window). */
function shot(step: number, t: number): Keys {
  switch (step) {
    case 0:
      return t < 900 ? null : t < 2900 ? ['seg'] : ['stats']
    case 1:
      return t < 4300 ? ['checks'] : ['row-unit']
    case 2:
      return t < 2000 ? ['seg'] : ['stat-lint']
    case 3:
      return t < 3000 ? ['verdict'] : ['review']
    case 4:
      return ['route']
    default:
      return t < 1750 ? ['actions'] : t < 3900 ? ['modal'] : null
  }
}

type Cue = [number, string | [number, number]]
/** Where the cursor heads, by element key or page point, from each moment of each step. */
const CURSOR: Cue[][] = [
  [[0, [760, 470]], [1300, 'seg-base'], [3100, [760, 470]]],
  [[0, [520, 560]], [3900, 'row-unit']],
  [[0, [760, 300]], [500, 'seg-pr'], [2100, [600, 330]]],
  [[0, [760, 470]]],
  [[0, [760, 470]]],
  [[0, [700, 300]], [500, 'approve'], [2300, 'confirm'], [4200, [760, 470]]],
]
const SHOW: [number, number][][] = [[[1000, 3000]], [[3900, 6500]], [[300, 2200]], [], [], [[300, 4300]]]
const PRESS: number[][] = [[2300], [5000], [1400], [], [], [1600, 3600]]

// ---------------------------------------------------------------- the page

const CHECKS: [string, string][] = [
  ['Build', '41s'],
  ['Unit tests', '3.2s'],
  ['Lint', '6s'],
  ['Type checks', '9s'],
  ['Security', '12s'],
]
const SUMMARY = 'Handles the expired-session case cleanly and adds two tests for it. One unused import is left in session.ts.'

function useCount(target: number, on: boolean, ms = 1300) {
  const [v, setV] = useState(on ? target : 0)
  useEffect(() => {
    if (!on) return setV(0)
    const t0 = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / ms)
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [on, target, ms])
  return v
}

const Skel = () => <span className="mt-1.5 block h-5 w-14 animate-pulse rounded-[4px]" style={{ background: C.surface3 }} />

function Page({ step, t, pressed }: { step: number; t: number; pressed: (k: string) => boolean }) {
  const at = (s: number, ms = 0) => step > s || (step === s && t >= ms)
  const seg = at(2, 1500) ? 'pr' : at(0, 2400) ? 'base' : 'none'
  const check = (i: number) => (at(1, 900 + i * 650) ? 'passed' : at(1, 300 + i * 650) ? 'running' : 'queued')
  const reviewed = at(3, 300)
  const score = useCount(86, reviewed)
  const typed = step > 3 ? SUMMARY : step === 3 ? SUMMARY.slice(0, Math.max(0, Math.round((t - 700) / 20))) : ''
  const risk = at(4, 300)
  const routed = at(4, 1700)
  const merged = at(5, 3750)
  const status: [Tone, string] = merged
    ? ['green', 'merged']
    : reviewed
      ? ['accent', 'awaiting your review']
      : at(1, 4200)
        ? ['green', 'checks passed']
        : step >= 1
          ? ['blue', 'checks running']
          : ['neutral', 'task open']

  return (
    <>
      <header data-k="head" className="mb-5 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="mb-2 flex items-center gap-1.5 text-[11.5px]" style={{ color: C.muted }}>
            <ArrowLeft className="h-3 w-3" /> Submissions
          </p>
          <div className="flex items-center gap-2.5">
            <h1 className="text-[22px] font-medium leading-tight tracking-[-0.03em] text-[#f4f4f5]">fix: handle null session on refresh</h1>
            <span key={status[1]} className="animate-[menu-in_300ms_ease_both]">
              <Badge tone={status[0]}>{status[1]}</Badge>
            </span>
          </div>
          <p className="mt-1.5 flex items-center gap-1.5 text-[12px]" style={{ color: C.muted }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={DEV} alt="" className="h-4 w-4 rounded-full object-cover" />
            @johndoe · PR #318 · ₹3,200 {merged ? 'released from escrow' : 'held in escrow'}
          </p>
        </div>
        <div data-k="actions" className="flex shrink-0 gap-2">
          {merged ? (
            <Badge tone="green">paid ₹3,200</Badge>
          ) : (
            <>
              <Secondary>Request changes</Secondary>
              <Primary k="approve" icon={GitMerge} pressed={pressed('approve')}>
                Approve &amp; merge
              </Primary>
            </>
          )}
        </div>
      </header>

      {/* health: the baseline, then this PR against it */}
      <div className="mb-2 flex items-center justify-between">
        <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.08em]" style={{ color: C.muted }}>
          <span className="h-1.5 w-1.5 rounded-[1.5px] bg-[#ff7a00]" />
          Repo health
        </p>
        <div data-k="seg" className="flex rounded-[6px] p-0.5 text-[11px]" style={{ background: C.surface, boxShadow: `inset 0 0 0 1px ${C.line}` }}>
          {(['base', 'pr'] as const).map((k) => (
            <span
              key={k}
              data-k={`seg-${k}`}
              className="w-[68px] rounded-[4px] py-0.5 text-center transition-colors duration-300"
              style={{ background: seg === k ? C.surface3 : undefined, color: seg === k ? '#f4f4f5' : C.muted }}
            >
              {k === 'base' ? 'Baseline' : 'This PR'}
            </span>
          ))}
        </div>
      </div>
      <div data-k="stats" className="mb-4 grid grid-cols-4 gap-px overflow-hidden rounded-[8px]" style={{ background: C.line, boxShadow: `0 0 0 1px ${C.line}` }}>
        <Stat
          label="Tests passing"
          value={seg === 'none' ? <Skel /> : seg === 'pr' ? '214' : '212'}
          hint={seg === 'pr' ? <span className="text-[#4ade80]">+2 new tests</span> : seg === 'base' ? 'main@a91c2e0' : 'Waiting for the baseline'}
        />
        <Stat
          k="stat-lint"
          label="Lint warnings"
          value={seg === 'none' ? <Skel /> : seg === 'pr' ? '15' : '14'}
          hint={
            seg === 'pr' ? (
              <>
                <span className="text-[#fbbf24]">+1 new</span> · 14 on main not counted
              </>
            ) : seg === 'base' ? (
              'main@a91c2e0'
            ) : (
              'Waiting for the baseline'
            )
          }
          flag={step === 2 && t >= 2300}
        />
        <Stat label="Type errors" value={seg === 'none' ? <Skel /> : '0'} hint={seg === 'pr' ? 'same as main' : seg === 'base' ? 'main@a91c2e0' : 'Waiting for the baseline'} />
        <Stat label="AI score" value={reviewed ? score : <span style={{ color: C.faint }}>Pending</span>} hint={reviewed ? 'out of 100' : 'After checks pass'} />
      </div>

      <div className="grid grid-cols-[1fr_1.15fr] gap-4">
        <Card
          k="checks"
          title="Checks"
          actions={
            <span className="font-mono text-[10.5px]" style={{ color: C.muted }}>
              sandbox · isolated
            </span>
          }
        >
          {CHECKS.map(([name, time], i) => {
            const s = check(i)
            const open = i === 1 && at(1, 5100)
            return (
              <div key={name} data-k={i === 1 ? 'row-unit' : undefined} className="flex h-[34px] items-center gap-3 border-b px-4 last:border-0" style={{ borderColor: C.line }}>
                <span className="flex-1 text-[12px] font-medium" style={{ color: s === 'queued' ? C.muted : '#f4f4f5' }}>
                  {name}
                </span>
                <span className="font-mono text-[10.5px] tabular-nums" style={{ color: open ? C.ink2 : C.muted }}>
                  {open ? '214 passed' : s === 'passed' ? time : ''}
                </span>
                <span className="w-[86px] text-right">
                  {s === 'passed' ? (
                    <Badge tone="green">passed</Badge>
                  ) : s === 'running' ? (
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
        </Card>

        <Card k="review" title="AI review" actions={reviewed ? <Badge tone="green">{score} / 100</Badge> : <Badge tone="neutral">waiting</Badge>}>
          <div data-k="verdict" className="border-b px-4 py-3" style={{ borderColor: C.line }}>
            {reviewed ? (
              <>
                <p className="flex items-center gap-2 text-[12.5px] font-medium text-[#f4f4f5]">
                  <Check className="h-3.5 w-3.5 text-[#4ade80]" /> Recommended: approve
                </p>
                <p className="mt-1 h-[34px] text-[11.5px] leading-[17px]" style={{ color: C.muted }}>
                  {typed}
                  {step === 3 && typed.length < SUMMARY.length && <span className="ml-px inline-block h-3 w-px translate-y-0.5 bg-white/60" />}
                </p>
              </>
            ) : (
              <p className="h-[53px] pt-1 text-[11.5px]" style={{ color: C.muted }}>
                Reads the diff against the task once the checks pass.
              </p>
            )}
          </div>
          <div data-k="route" className="px-4 py-2.5">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="font-mono text-[9.5px] uppercase tracking-[0.08em]" style={{ color: C.faint }}>
                Route
              </span>
              <span className={cn('transition-opacity duration-300', risk ? 'opacity-100' : 'opacity-0')}>
                <Badge tone="amber">medium risk</Badge>
              </span>
            </div>
            {(
              [
                ['Auto-approve', 'Low risk, small diffs'],
                ['Owner review', 'You read the verdict and merge'],
                ['Expert reviewer', 'High risk or wide changes'],
              ] as const
            ).map(([a, b], i) => {
              const on = routed && i === 1
              return (
                <div
                  key={a}
                  className="flex h-[26px] items-center gap-2 rounded-[6px] px-2 text-[12px] transition-all duration-500"
                  style={{ background: on ? C.surface3 : undefined, opacity: routed && !on ? 0.4 : 1 }}
                >
                  <span className="h-1.5 w-1.5 rounded-full transition-colors" style={{ background: on ? '#ff7a00' : C.faint }} />
                  <span className="text-[#f4f4f5]">{a}</span>
                  <span className="flex-1 truncate text-[11px]" style={{ color: C.muted }}>
                    {b}
                  </span>
                  {on && <Badge tone="accent">routed</Badge>}
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </>
  )
}

// ---------------------------------------------------------------- the film

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

/** The owner's view of the submission, filling its parent, under a camera that frames each beat. */
function Film({ step, t }: { step: number; t: number }) {
  const frameRef = useRef<HTMLDivElement>(null)
  const win = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 547, h: 340 })
  useLayoutEffect(() => {
    const el = frameRef.current
    if (!el) return
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const keys = shot(step, t)
  const cue = [...CURSOR[step]].reverse().find((c) => t >= c[0]) ?? CURSOR[step][0]
  const show = SHOW[step].some(([a, b]) => t >= a && t < b)
  const pressAt = PRESS[step].find((p) => t >= p && t < p + 150)
  const press = pressAt !== undefined
  const modal = step === 5 && t >= 1750 && t < 3750
  const merged = step === 5 && t >= 3750
  const toast = step === 5 && t >= 4100

  // the visible part of the window (it bleeds off the right and bottom)
  const vw = size.w - BLEED
  const vh = size.h - BLEED
  const zFit = Math.max(size.w / W, size.h / H)
  const [cam, setCam] = useState({ x: 0, y: 0, z: zFit })
  const [cur, setCur] = useState({ x: 760, y: 470 })
  const keyStr = keys?.join() ?? 'wide'
  const cueStr = typeof cue[1] === 'string' ? cue[1] : cue[1].join()
  useLayoutEffect(() => {
    const root = win.current
    if (!root) return
    const rects = (keys ?? [])
      .map((k) => root.querySelector<HTMLElement>(`[data-k="${k}"]`))
      .filter((el): el is HTMLElement => !!el)
      .map((el) => box(el, root))
    const PAD = 20
    const r = rects.length
      ? {
          x1: Math.max(0, Math.min(...rects.map((q) => q.x1)) - PAD),
          y1: Math.max(0, Math.min(...rects.map((q) => q.y1)) - PAD),
          x2: Math.min(W, Math.max(...rects.map((q) => q.x2)) + PAD),
          y2: Math.min(H, Math.max(...rects.map((q) => q.y2)) + PAD),
        }
      : { x1: 0, y1: 0, x2: W, y2: H }
    const z = Math.max(zFit, Math.min(zFit * 2.3, Math.min(vw / (r.x2 - r.x1), vh / (r.y2 - r.y1))))
    const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
    setCam({
      z,
      x: rects.length ? clamp(vw / 2 - ((r.x1 + r.x2) / 2) * z, size.w - W * z, 0) : 0,
      y: rects.length ? clamp(vh / 2 - ((r.y1 + r.y2) / 2) * z, size.h - H * z, 0) : 0,
    })
    const c = cue[1]
    if (typeof c === 'string') {
      const el = root.querySelector<HTMLElement>(`[data-k="${c}"]`)
      if (el) {
        const b = box(el, root)
        setCur({ x: (b.x1 + b.x2) / 2, y: (b.y1 + b.y2) / 2 })
      }
    } else setCur({ x: c[0], y: c[1] })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyStr, cueStr, size.w, size.h, modal, merged])

  return (
    <div ref={frameRef} aria-hidden className="absolute inset-0 overflow-hidden" style={{ background: C.bg }}>
      <div
        ref={win}
        className="absolute left-0 top-0 origin-top-left overflow-hidden font-sans text-[#f4f4f5]"
        style={{ width: W, height: H, background: C.bg, transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.z})`, transition: `transform ${CAMERA_MS}ms ${EASE}` }}
      >
        <Sidebar />
        <div className="absolute left-[200px] right-0 top-0 flex h-11 items-center gap-2 border-b px-6 text-[12px]" style={{ borderColor: C.line }}>
          <span style={{ color: C.muted }}>Submissions</span>
          <span style={{ color: C.faint }}>/</span>
          <span className="font-medium text-[#f4f4f5]">PR #318</span>
        </div>
        <main className="absolute bottom-0 left-[200px] right-0 top-11 px-6 py-5">
          <Page step={step} t={t} pressed={(k) => press && cue[1] === k} />
        </main>

        {/* the confirm dialog */}
        <div className={cn('absolute inset-0 z-10 grid place-items-center transition-opacity duration-300', modal ? 'opacity-100' : 'pointer-events-none opacity-0')} style={{ background: 'rgba(0,0,0,0.55)' }}>
          <div
            data-k="modal"
            className="w-[440px] rounded-[10px] p-5 transition-transform duration-300"
            style={{ background: C.surface, boxShadow: `0 24px 64px -16px rgba(0,0,0,0.7), 0 0 0 1px ${C.lineStrong}`, transform: modal ? 'none' : 'translateY(8px) scale(0.98)' }}
          >
            <h3 className="text-[15px] font-medium tracking-[-0.02em] text-[#f4f4f5]">Approve and merge PR #318?</h3>
            <p className="mt-1 text-[11.5px] leading-relaxed" style={{ color: C.muted }}>
              Forke merges it upstream and releases ₹3,200 from escrow to @johndoe&rsquo;s UPI.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <Secondary>Cancel</Secondary>
              <Primary k="confirm" icon={GitMerge} pressed={press && cue[1] === 'confirm'}>
                Merge &amp; pay
              </Primary>
            </div>
          </div>
        </div>

        {/* toast */}
        <div
          className="absolute bottom-12 right-12 z-20 flex items-center gap-2 rounded-[8px] px-3 py-2 text-[12px] text-[#f4f4f5] transition-all duration-300"
          style={{ background: C.surface, boxShadow: `0 24px 64px -16px rgba(0,0,0,0.7), 0 0 0 1px ${C.lineStrong}`, opacity: toast ? 1 : 0, transform: toast ? 'none' : 'translateY(8px)' }}
        >
          <Check className="h-3.5 w-3.5 text-[#4ade80]" /> Merged. ₹3,200 is on its way to @johndoe.
        </div>

        {/* cursor */}
        <div
          className="pointer-events-none absolute left-0 top-0 z-30"
          style={{ transform: `translate(${cur.x}px, ${cur.y}px)`, opacity: show ? 1 : 0, transition: `transform ${CURSOR_MS}ms ${EASE}, opacity 250ms ease` }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" className="-translate-x-[3px] -translate-y-[2px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" style={{ transform: press ? 'scale(0.85)' : 'scale(1)', transition: 'transform 120ms' }}>
            <path d="M3 2 L3 19 L7.5 14.8 L10.6 21.6 L13.4 20.4 L10.4 13.8 L16.6 13.8 Z" fill="white" stroke="black" strokeWidth="1.2" strokeLinejoin="round" />
          </svg>
          {press && <span className="absolute left-0 top-0 h-7 w-7 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-white/30" />}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- the walkthrough

const TICK = 100

export default function ReviewSystem() {
  const [step, setStep] = useState(0)
  const [t, setT] = useState(0)
  const box = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [reduced, setReduced] = useState(false)
  useEffect(() => setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches), [])
  useEffect(() => {
    const el = box.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  // one clock for the whole walkthrough: time into the current step, moving on when its bar fills
  const clock = useRef({ step: 0, t: 0 })
  useEffect(() => {
    if (!visible || reduced) return
    const id = window.setInterval(() => {
      const c = clock.current
      c.t += TICK
      if (c.t >= STEPS[c.step].ms) {
        c.step = (c.step + 1) % STEPS.length
        c.t = 0
        setStep(c.step)
      }
      setT(c.t)
    }, TICK)
    return () => window.clearInterval(id)
  }, [visible, reduced])
  const shownT = reduced ? STEPS[step].ms : t
  const go = (i: number) => {
    clock.current = { step: i, t: 0 }
    setStep(i)
    setT(0)
  }

  return (
    <Section id="review">
      <div className="px-6 pt-16 sm:pt-24 md:px-[144px]">
        <h2 className="text-[32px] font-[450] leading-[1.1] tracking-[-0.01em] text-ink sm:text-[44px] sm:leading-[48px]">
          Reviews that <ScrambleText text="never sleep" />.
        </h2>
        <p className="mt-6 max-w-[640px] text-base leading-6 text-white/45">
          Every pull request is checked, compared and scored before the owner opens it. People step in only where it
          matters, and the merge is what pays you.
        </p>
      </div>

      <div ref={box} className="mx-4 mb-16 mt-12 grid overflow-hidden rounded-[4px] border border-white/[0.08] sm:mx-10 sm:mb-24 lg:grid-cols-[minmax(0,0.36fr)_minmax(0,0.64fr)]">
        {/* the steps */}
        <ol className="border-white/[0.08] lg:border-r">
          {STEPS.map((s, i) => {
            const active = i === step
            return (
              <li key={s.title} className="border-b border-white/[0.08] last:border-b-0">
                <button type="button" onClick={() => go(i)} className="group block w-full px-6 py-4 text-left outline-none focus-visible:bg-white/[0.03]">
                  <span className="flex items-center justify-between gap-3">
                    <span className="flex items-baseline gap-3">
                      <span className={cn('font-mono text-[11px] transition-colors', active ? 'text-accent-text' : 'text-white/30')}>{String(i + 1).padStart(2, '0')}</span>
                      <span className={cn('text-[16px] font-medium tracking-[-0.01em] transition-colors', active ? 'text-white' : 'text-white/45 group-hover:text-white/75')}>{s.title}</span>
                    </span>
                    <ArrowRight className={cn('h-4 w-4 shrink-0 transition-all duration-300', active ? 'translate-x-0 text-white/80 opacity-100' : '-translate-x-1 opacity-0')} />
                  </span>
                  <span className="grid transition-[grid-template-rows] duration-500" style={{ gridTemplateRows: active ? '1fr' : '0fr' }}>
                    <span className="overflow-hidden">
                      <span className="block pl-[34px] pt-1.5 text-[13.5px] leading-[21px] text-white/50">{s.desc}</span>
                      <span className="ml-[34px] mt-3 block h-[2px] overflow-hidden rounded-full bg-white/[0.08]">
                        <span className="block h-full rounded-full bg-accent" style={{ width: `${(shownT / s.ms) * 100}%`, transition: 'width 100ms linear' }} />
                      </span>
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ol>

        {/* the film: the same card as the "How it works" steps, the window bleeding off the painting's right and bottom edges */}
        {/* on phones the film comes first, so the step being played sits right under it */}
        <div className="order-first border-b border-white/[0.08] p-5 sm:p-8 lg:order-none lg:border-b-0">
          <FitScale width={560} grow>
            <Painting src="/paintings/ember-shore.webp" position="center 40%" className="rounded-[18px] border border-white/[0.06] pl-[8%] pt-12">
              <div className="float-layer -mb-8 -mr-8 overflow-hidden rounded-xl pointer-events-none select-none border border-white/15 bg-[#0c0c0e]/92 shadow-[0_24px_60px_rgba(0,0,0,0.6)]">
                <div className="relative h-[300px]">
                  <Film step={step} t={shownT} />
                </div>
              </div>
            </Painting>
          </FitScale>
        </div>
      </div>
    </Section>
  )
}
