'use client'

import { useEffect, useState, type ReactNode } from 'react'
import {
  Check,
  GitPullRequestArrow,
  Layers,
  LoaderCircle,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Trophy,
  Wallet,
  Workflow,
} from 'lucide-react'
import { RiGithubFill } from '@remixicon/react'
import { BlurWords, CountUp, ForkeMark, RailSquare, Section, cn, useInView } from './primitives'
import { OrbitVisual, PermissionVisual } from './Privacy'

/* ── shared shell: square hairline panel, copy pinned to the bottom ─────────── */


function Panel({
  icon,
  title,
  body,
  children,
  className,
  visual = 'h-[260px]',
}: {
  icon: ReactNode
  title: string
  body: string
  children?: ReactNode
  className?: string
  visual?: string
}) {
  return (
    <div
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-[4px] border border-line bg-bg transition-colors duration-500 hover:bg-[#191817]',
        className,
      )}
    >
      {/* warm glow that wakes up on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        style={{ background: 'radial-gradient(60% 50% at 50% 0%, rgba(255,122,0,0.08), transparent 70%)' }}
      />
      <div className={cn('relative', visual)}>{children}</div>
      <div className="relative mt-auto px-8 pb-8 pt-4">
        <span className="mb-4 flex h-6 w-6 items-center justify-center text-white/70">{icon}</span>
        <p className="text-[18px] tracking-[-0.01em] text-ink">{title}</p>
        <p className="mt-1.5 max-w-[440px] text-[15px] leading-6 text-white/50">{body}</p>
      </div>
    </div>
  )
}

/* ── live ledger: Cloudflare's deploy-log rows, in Forke's money ───────────── */

type Row = { id: number; amount: string; status: 'queued' | 'paid' }
const AMOUNTS = ['₹3,200', '₹1,500', '₹6,000', '₹2,000', '₹4,500', '₹900']

function stamp() {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${String(d.getFullYear()).slice(2)}, ${p(d.getHours())}:${p(d.getMinutes())}`
}

function LedgerLog() {
  const [ref, inView] = useInView<HTMLDivElement>(0.3)
  const [rows, setRows] = useState<Row[]>(() =>
    [1194, 1193, 1192, 1191].map((id, i) => ({ id, amount: AMOUNTS[i], status: i === 0 ? 'queued' : 'paid' })),
  )
  const [now, setNow] = useState('')
  useEffect(() => setNow(stamp()), [])
  useEffect(() => {
    if (!inView) return
    let tick = 0
    const id = setInterval(() => {
      tick++
      setNow(stamp())
      setRows((r): Row[] => {
        // settle the queued row, then push a fresh one on top
        if (r[0].status === 'queued') return [{ ...r[0], status: 'paid' as const }, ...r.slice(1)]
        const next = r[0].id + 1
        return [{ id: next, amount: AMOUNTS[(next + tick) % AMOUNTS.length], status: 'queued' as const }, ...r].slice(0, 4)
      })
    }, 1600)
    return () => clearInterval(id)
  }, [inView])

  return (
    <div ref={ref} className="absolute inset-0 flex gap-5 p-7">
      <div className="relative h-[64px] w-[64px] shrink-0">
        <ForkeMark className="h-full w-full rounded-lg" />
        <span className="absolute -bottom-2.5 -right-2.5 flex h-7 w-7 items-center justify-center rounded-md border border-white/20 bg-[#f4f1ef] text-black shadow-lg">
          <RiGithubFill className="h-4 w-4" />
        </span>
      </div>
      <div className="min-w-0 flex-1 space-y-2 [mask-image:linear-gradient(180deg,#000_55%,transparent)]">
        {rows.map((r, i) => (
          <div
            key={r.id}
            className={cn(
              'grid grid-cols-[80px_1fr_auto] items-center gap-3 rounded-md bg-accent/[0.09] px-4 py-2.5 text-[13.5px] text-accent-text transition-all duration-500',
              i === 0 && 'animate-feed-in bg-accent/[0.14]',
            )}
            style={{ opacity: 1 - i * 0.22 }}
          >
            <span className="font-medium tabular-nums">#{r.id}</span>
            <span className="truncate tabular-nums text-accent-text/90">
              {r.amount} · {now || '—'}
            </span>
            <span className="flex items-center gap-2">
              {r.status === 'queued' ? (
                <>
                  Releasing
                  <LoaderCircle className="animate-spin-slow h-4 w-4" />
                </>
              ) : (
                <>
                  Paid
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-black">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                </>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── review console: checks, then an AI review, then the owner decides ───── */

// Forke's review pipeline: automated checks, then an AI review, then the owner decides.
const CHECKS = [
  { name: 'build', states: ['running', 'passed · 14s'] },
  { name: 'tests + lint', states: ['running', 'passed · 31s'] },
  { name: 'scope + security', states: ['scanning', 'clean'] },
  { name: 'ai review', states: ['scoring diff', '92 / 100'] },
]

function ReviewConsole() {
  const [ref, inView] = useInView<HTMLDivElement>(0.3)
  const [step, setStep] = useState(0)
  useEffect(() => {
    if (!inView) return
    const id = setInterval(() => setStep((s) => (s >= 9 ? 0 : s + 1)), 850)
    return () => clearInterval(id)
  }, [inView])
  const ready = step >= 8
  return (
    <div ref={ref} className="absolute inset-y-6 right-0 w-[min(440px,58%)] max-md:left-6 max-md:w-auto">
      <div className="rounded-l-[4px] border border-r-0 border-line bg-[#191817] p-5 text-[12px]">
        <p className="flex items-center gap-2 text-[13px] text-ink">
          <GitPullRequestArrow className="h-4 w-4 text-accent" /> PR #1194 · cursor pagination for invoices
        </p>
        <div className="mt-3 space-y-2 font-mono">
          {CHECKS.map((c, i) => {
            const shown = step > i
            const done = step > i + 4
            return (
              <p
                key={c.name}
                className={cn('flex items-center gap-2 whitespace-nowrap transition-opacity duration-300', shown ? 'opacity-100' : 'opacity-0')}
              >
                {done ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <LoaderCircle className="animate-spin-slow h-3.5 w-3.5 text-accent" />
                )}
                <span className="rounded bg-white/[0.07] px-1.5 py-0.5 text-white/80">{c.name}</span>
                <span className="text-white/30">→</span>
                <span className={done ? 'text-emerald-300/90' : 'text-white/45'}>{done ? c.states[1] : c.states[0]}</span>
              </p>
            )
          })}
        </div>
      </div>
      <div
        className={cn(
          'mt-3 rounded-l-[4px] border border-r-0 bg-[#191817] p-4 transition-colors duration-500',
          ready ? 'border-accent/40' : 'border-line',
        )}
      >
        <p className="text-[12.5px] text-white/80">
          {ready ? 'Verdict ready: all checks passed. Merge and release ₹3,200?' : 'Waiting on checks before the owner sees it…'}
        </p>
        <div className={cn('mt-3 flex gap-2 transition-opacity duration-500', ready ? 'opacity-100' : 'opacity-40')}>
          <span className="rounded-md bg-accent px-3 py-1.5 text-[12.5px] font-medium text-black">Merge &amp; pay</span>
          <span className="rounded-md bg-white/[0.07] px-3 py-1.5 text-[12.5px] text-white/75">Request changes</span>
        </div>
      </div>
    </div>
  )
}

/* ── level ring ───────────────────────────────────────────────────────────── */

function LevelRing() {
  const [ref, inView] = useInView<HTMLDivElement>(0.5)
  const r = 64
  const c = 2 * Math.PI * r
  return (
    <div ref={ref} className="absolute inset-0 flex items-center justify-center">
      <div className="relative h-[170px] w-[170px]">
        <svg viewBox="0 0 160 160" className="absolute inset-0 -rotate-90">
          <circle cx="80" cy="80" r={r} fill="none" stroke="rgba(240,227,222,0.08)" strokeWidth="2" strokeDasharray="2 6" />
          <circle
            cx="80"
            cy="80"
            r={r}
            fill="none"
            stroke="#FF7A00"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={inView ? c * 0.28 : c}
            style={{ transition: 'stroke-dashoffset 1.8s cubic-bezier(0.22,1,0.36,1)', filter: 'drop-shadow(0 0 8px rgba(255,122,0,0.5))' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[40px] font-medium leading-none tracking-tight text-ink">
            <CountUp to={72} suffix="%" />
          </span>
          <span className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-white/40">to level 5</span>
        </div>
      </div>
    </div>
  )
}

/* ── history ──────────────────────────────────────────────────────────────── */

function History() {
  const items = [
    { t: 'Submission #3 approved', who: 'owner · 2m ago', ok: true },
    { t: 'Changes requested: add tests', who: 'AI review · 1h ago', ok: false },
    { t: 'Submission #1 opened', who: 'you · 3h ago', ok: true },
  ]
  return (
    <div className="absolute inset-0 px-8 pt-8">
      {items.map((it, i) => (
        <div key={i} className="relative flex gap-3 pb-5 last:pb-0">
          {i < items.length - 1 && <span className="absolute left-[9px] top-5 h-full w-px border-l border-dashed border-white/15" />}
          <span
            className={cn(
              'mt-0.5 flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full',
              it.ok ? 'bg-accent/15 text-accent' : 'bg-white/10 text-white/60',
            )}
          >
            {it.ok ? <Check className="h-3 w-3" /> : <RotateCcw className="h-3 w-3" />}
          </span>
          <div>
            <p className="text-[13.5px] text-white/85">{it.t}</p>
            <p className="font-mono text-[11px] text-white/35">{it.who}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── section ──────────────────────────────────────────────────────────────── */

const fill = '[&>div]:!aspect-auto [&>div]:h-full [&>div]:rounded-none [&>div]:border-0 [&>div]:bg-transparent'

export default function Bento() {
  return (
    <Section id="features">
      <div className="px-6 pt-20 text-center sm:pt-28">
        <h2 className="text-[34px] font-medium leading-[1.08] tracking-[-0.03em] sm:text-[48px]">
          <BlurWords text="And it looks after the rest." className="text-ink" />
        </h2>
        <p className="mx-auto mt-4 max-w-[520px] text-[17px] text-white/50">
          Built for weekend contributors and full-time maintainers alike.
        </p>
      </div>

      <div className="relative mx-4 mb-20 mt-14 sm:mx-10 sm:mb-28">
        <RailSquare className="-left-[7px] -top-[7px]" />
        <RailSquare className="-right-[7px] -top-[7px]" />
        <RailSquare className="-bottom-[7px] -left-[7px]" />
        <RailSquare className="-bottom-[7px] -right-[7px]" />

        <div className="grid gap-2 lg:grid-cols-3">
          <Panel
            className="lg:col-span-2"
            icon={<Wallet className="h-5 w-5" />}
            title="A live ledger for every rupee"
            body="Escrow, approvals and UPI settlements stream in as they happen. Export any month in one click."
          >
            <LedgerLog />
          </Panel>

          {/* the one loud card */}
          <div className="relative flex min-h-[300px] flex-col overflow-hidden rounded-[4px] bg-accent p-8 text-white shadow-[0_1px_0_rgba(255,255,255,0.18)_inset,0_10px_30px_-12px_rgba(255,122,0,0.5)]">
            <div aria-hidden className="dot-grid absolute inset-0 opacity-25 [mask-image:linear-gradient(200deg,transparent_30%,#000)]" />
            <Sparkles aria-hidden className="absolute -bottom-10 -right-10 h-56 w-56 text-white/10" strokeWidth={1} />
            <Layers className="relative h-6 w-6" />
            <p className="relative mt-4 text-[20px] font-medium tracking-[-0.01em]">One profile for all your work</p>
            <p className="relative mt-2 text-[15.5px] leading-6 text-white/90">
              Every merged task, review score and payout lands on a public DEV ID, so your next bounty already knows
              what you can ship.
            </p>
          </div>

          <Panel icon={<Trophy className="h-5 w-5" />} title="Levels that mean something" body="Every merge earns XP. Higher levels unlock bigger, better-paid bounties.">
            <LevelRing />
          </Panel>

          <Panel
            className="lg:col-span-2"
            visual="h-[290px]"
            icon={<Workflow className="h-5 w-5" />}
            title="Review that never sleeps"
            body="Build, lint and an AI reviewer run on every pull request before the owner ever opens it."
          >
            <ReviewConsole />
          </Panel>

          <Panel icon={<Sparkles className="h-5 w-5" />} title="Bring your own stack" body="GitHub or GitLab, your editor, your AI tools. Forke fits around them.">
            <div className={cn('absolute inset-0', fill)}>
              <OrbitVisual />
            </div>
          </Panel>

          <Panel icon={<ShieldCheck className="h-5 w-5" />} title="Sandbox with guardrails" body="Scoped repo access per task. Owners approve before anything merges.">
            <div className={cn('absolute inset-0', fill)}>
              <PermissionVisual />
            </div>
          </Panel>

          <Panel icon={<RotateCcw className="h-5 w-5" />} title="Every attempt, on the record" body="See what changed, who reviewed it and why. Resubmit until it ships.">
            <History />
          </Panel>
        </div>
      </div>
    </Section>
  )
}
