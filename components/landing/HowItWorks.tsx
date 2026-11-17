'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { GitBranch, GitPullRequest, Loader2, Play } from 'lucide-react'
import { RiGithubFill, RiVisaFill } from '@remixicon/react'
import { BlurWords, CountUp, ForkeMark, Painting, Section, cn, useInView } from './primitives'
import FitScale from './FitScale'
import { Badge, C, Eyebrow, Primary, Secondary, Stat, StatStrip, TONE } from './dashUi'

/** The thin breadcrumb bar every dashboard page opens with. */
function Crumb({ trail, here }: { trail: string; here: string }) {
  return (
    <div className="flex h-9 items-center gap-2 border-b px-4 text-[11.5px]" style={{ borderColor: C.line }}>
      <span style={{ color: C.muted }}>{trail}</span>
      <span style={{ color: C.faint }}>/</span>
      <span className="truncate font-medium text-[#f4f4f5]">{here}</span>
    </div>
  )
}

function ClaimUI() {
  const [left, setLeft] = useState(20 * 60 - 18)
  const [ref, inView] = useInView<HTMLDivElement>(0.4)
  useEffect(() => {
    if (!inView) return
    const id = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 20 * 60)), 1000)
    return () => clearInterval(id)
  }, [inView])
  const mm = String(Math.floor(left / 60)).padStart(2, '0')
  const ss = String(left % 60).padStart(2, '0')
  return (
    <div ref={ref}>
      <Crumb trail="Tasks" here="Paginate /v1/invoices" />
      <div className="px-4 py-3.5">
        <Eyebrow>acme/api · Go · Level 2+</Eyebrow>
        <div className="mt-1.5 flex items-center gap-2.5">
          <h3 className="text-[17px] font-medium tracking-[-0.03em] text-[#f4f4f5]">Paginate /v1/invoices</h3>
          <Badge tone="accent">claimed</Badge>
        </div>
        <StatStrip cols={3} className="mt-3">
          <Stat label="Bounty" value="₹3,200" hint="escrowed by the owner" />
          <Stat label="Start within" value={`${mm}:${ss}`} hint="or the task reopens" />
          <Stat label="Estimate" value="~2h" hint="tests required" />
        </StatStrip>
        <div className="mt-3 flex gap-2">
          <Primary icon={Play} className="flex-1">
            Start working
          </Primary>
          <Secondary icon={GitBranch}>Open branch</Secondary>
        </div>
      </div>
    </div>
  )
}

const CHECKS = ['Build', 'Unit tests', 'Lint & format', 'Scope check', 'Security scan', 'AI review']

function ShipUI() {
  const [ref, inView] = useInView<HTMLDivElement>(0.5)
  const [done, setDone] = useState(0)
  useEffect(() => {
    if (!inView) return
    let n = 0
    const id = setInterval(() => {
      n = n >= CHECKS.length + 3 ? 0 : n + 1
      setDone(n)
    }, 700)
    return () => clearInterval(id)
  }, [inView])
  const all = done >= CHECKS.length
  return (
    <div ref={ref}>
      <Crumb trail="Submissions" here="PR #1190" />
      <div className="px-4 py-3">
        <section className="overflow-hidden rounded-[8px]" style={{ background: C.surface, boxShadow: `0 0 0 1px ${C.line}` }}>
          <div className="flex h-9 items-center justify-between border-b px-3.5" style={{ background: C.surface2, borderColor: C.line }}>
            <span className="flex items-center gap-2 truncate text-[12px] font-semibold text-[#f4f4f5]">
              <GitPullRequest className="h-3.5 w-3.5 text-[#ff7a00]" /> feat: cursor pagination for invoices
            </span>
            <Badge tone={all ? 'green' : 'blue'}>{all ? 'checks passed' : 'running'}</Badge>
          </div>
          {CHECKS.map((c, i) => {
            const ok = i < done
            const run = i === done
            return (
              <div key={c} className="flex h-[28px] items-center justify-between border-b px-3.5 last:border-0" style={{ borderColor: C.line }}>
                <span className="text-[11.5px]" style={{ color: ok || run ? '#f4f4f5' : C.muted }}>
                  {c}
                </span>
                {ok ? (
                  <Badge tone="green">{i === CHECKS.length - 1 ? '92 / 100' : 'passed'}</Badge>
                ) : run ? (
                  <span className={cn('inline-flex h-[20px] items-center gap-1.5 rounded-[4px] px-1.5 text-[11px] font-medium', TONE.blue)}>
                    <Loader2 className="h-3 w-3 animate-spin" /> running
                  </span>
                ) : (
                  <Badge tone="neutral">queued</Badge>
                )}
              </div>
            )
          })}
        </section>
      </div>
    </div>
  )
}

function PaidUI() {
  return (
    <div>
      <Crumb trail="Earnings" here="Payout #2291" />
      <div className="px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <h3 className="text-[17px] font-medium tracking-[-0.03em] text-[#f4f4f5]">Approved by the owner</h3>
          <Badge tone="green">merged</Badge>
        </div>
        <p className="mt-1 text-[11.5px]" style={{ color: C.muted }}>
          &ldquo;Pagination works, tests are solid. Merging.&rdquo;
        </p>
        <StatStrip cols={2} className="mt-3">
          <Stat label="Escrow released" value={<CountUp to={3200} prefix="₹" />} hint="to riya@okaxis · UPI" />
          <Stat label="Settled" value="41s" hint="after the merge" />
        </StatStrip>
        <div className="mt-3.5 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.08em]" style={{ color: C.muted }}>
            Level 6 · 72%
          </span>
          <Badge tone="accent">+180 XP</Badge>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full" style={{ background: C.surface3 }}>
          <div className="h-full w-[72%] rounded-full bg-[#ff7a00]" />
        </div>
      </div>
    </div>
  )
}

/** UPI's two-arrow mark in its brand orange and green. */
function UpiMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path d="M5 3.5 13.2 12 5 20.5z" fill="#ED752E" />
      <path d="M10.6 3.5 18.8 12l-8.2 8.5z" fill="#098041" />
    </svg>
  )
}

/** Mastercard's interlocking circles. */
function MastercardMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <circle cx="9" cy="12" r="6" fill="#EB001B" />
      <circle cx="15" cy="12" r="6" fill="#F79E1B" />
      <path d="M12 6.8A6 6 0 0 1 12 17.2 6 6 0 0 1 12 6.8z" fill="#FF5F00" />
    </svg>
  )
}

/** Logo tiles fill the whole badge, each on its own brand background. */
const tile = 'flex h-full w-full items-center justify-center'

const PAY_METHODS = [
  { label: 'UPI', badge: <span className={`${tile} bg-white`}><UpiMark className="h-5 w-5" /></span> },
  { label: 'Visa', badge: <span className={`${tile} bg-[#1A1F71] text-white`}><RiVisaFill className="h-6 w-6" /></span> },
  { label: 'Mastercard', badge: <span className={`${tile} bg-[#141414]`}><MastercardMark className="h-6 w-6" /></span> },
]

/** Payout badge that cycles through the ways you can be paid. */
function PayoutIcon() {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setI((n) => (n + 1) % PAY_METHODS.length), 1800)
    return () => clearInterval(id)
  }, [])
  return (
    <span className="relative block h-full w-full" role="img" aria-label="UPI, Visa or Mastercard">
      {PAY_METHODS.map((m, k) => (
        <span
          key={m.label}
          aria-hidden
          className="absolute inset-0 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            opacity: k === i ? 1 : 0,
            transform: k === i ? 'none' : `translateY(${k === (i + PAY_METHODS.length - 1) % PAY_METHODS.length ? -100 : 100}%)`,
          }}
        >
          {m.badge}
        </span>
      ))}
    </span>
  )
}

const STEPS: { icon: ReactNode; title: string; body: string; painting: string; ui: ReactNode }[] = [
  {
    icon: <ForkeMark className="h-full w-full rounded-[9px]" />,
    title: 'Claim it.',
    body: 'Pick a scoped task that matches your level. The bounty is already escrowed, and you get a 20-minute window to start.',
    painting: '/paintings/meadow.webp',
    ui: <ClaimUI />,
  },
  {
    icon: (
      <span className={`${tile} bg-white text-[#181717]`}>
        <RiGithubFill className="h-5 w-5" />
      </span>
    ),
    title: 'Ship it.',
    body: 'Work in an isolated Forke branch. Build, tests, scope and an AI review score your diff before the owner ever looks.',
    painting: '/paintings/dusk-hill.webp',
    ui: <ShipUI />,
  },
  {
    icon: <PayoutIcon />,
    title: 'Get paid.',
    body: 'The owner approves a plain-English verdict. The escrow releases straight to your UPI, and your level moves up.',
    painting: '/paintings/lantern-orchard.webp',
    ui: <PaidUI />,
  },
]

export default function HowItWorks() {
  const list = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const el = list.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const mid = window.innerHeight * 0.55
      setProgress(Math.min(1, Math.max(0, (mid - r.top) / r.height)))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <Section id="how">
      <div className="grid gap-12 px-6 py-20 sm:px-12 sm:py-28 lg:grid-cols-[1fr_1.35fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="text-[34px] font-medium leading-[1.08] tracking-[-0.03em] text-ink sm:text-[44px]">
            <BlurWords text="Claim it. Ship it." className="block" />
            <BlurWords text="Get paid." className="block text-white/40" delay={200} />
          </h2>
          <p className="mt-5 max-w-[360px] text-[16px] leading-7 text-white/50">
            Forke swaps proposals for small, pre-paid tasks. Claim one, ship it through automatic review, and the
            money lands in your UPI the day it merges.
          </p>
        </div>

        <div ref={list} className="relative">
          {/* timeline rail + scroll-driven fill */}
          <div className="absolute bottom-0 left-[17px] top-2 w-px bg-white/[0.08]" />
          <div
            className="absolute left-[17px] top-2 w-px bg-gradient-to-b from-accent via-[#FFB25C] to-accent shadow-[0_0_12px_rgba(255,122,0,0.7)]"
            style={{ height: `${progress * 100}%` }}
          />

          <div className="space-y-20">
            {STEPS.map((s, i) => {
              const active = progress * STEPS.length > i
              return (
                <div key={s.title} className="relative pl-14">
                  <span
                    className={cn(
                      'absolute left-0 top-0 h-9 w-9 overflow-hidden rounded-[10px] bg-bg',
                    )}
                  >
                    {/* dim the logo, not the tile, so the timeline never shows through */}
                    <span
                      className={cn(
                        'block h-full w-full transition-[opacity,filter] duration-500',
                        !active && 'opacity-40 grayscale',
                      )}
                    >
                      {s.icon}
                    </span>
                  </span>
                  <p className="text-[18px] leading-7 text-white/45">
                    <span className="font-medium text-ink">{s.title}</span> {s.body}
                  </p>
                  {/* on phones the card keeps its desktop proportions and is scaled down, never re-wrapped */}
                  <FitScale width={560} grow className="mt-6">
                    <Painting src={s.painting} className="rounded-[18px] border border-white/[0.06] pl-[8%] pt-12">
                      {/* window bleeds off the right and bottom edges, like a cropped screenshot */}
                      <div className="float-layer -mb-8 -mr-8 overflow-hidden rounded-xl pointer-events-none select-none border border-white/15 bg-[#151414] shadow-[0_24px_60px_rgba(0,0,0,0.6)]">
                        {/* one fixed size for all three, so the cards line up */}
                        <div className="h-[300px] pb-8 pr-8">{s.ui}</div>
                      </div>
                    </Painting>
                  </FitScale>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Section>
  )
}
