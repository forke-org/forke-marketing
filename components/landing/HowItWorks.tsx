'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Check, CircleDashed, GitPullRequest, Timer } from 'lucide-react'
import { RiGithubFill, RiVisaFill } from '@remixicon/react'
import { BlurWords, CountUp, ForkeMark, Painting, Section, cn, useInView } from './primitives'
import FitScale from './FitScale'

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
    <div ref={ref} className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[13px] font-medium text-white/90">Paginate /v1/invoices</p>
          <p className="mt-0.5 text-[11px] text-white/40">acme/api · Go · Level 2+</p>
        </div>
        <span className="font-mono text-[14px] font-semibold text-accent">₹3,200</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {['cursor pagination', 'tests required', '~2h'].map((t) => (
          <span key={t} className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-white/45">
            {t}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className="flex h-9 flex-1 items-center justify-center rounded-lg bg-accent text-[12.5px] font-semibold text-black">
          Claimed — start working
        </span>
        <span className="flex h-9 items-center gap-1.5 rounded-lg border border-white/10 px-3 font-mono text-[12px] tabular-nums text-white/70">
          <Timer className="h-3.5 w-3.5 text-accent" />
          {mm}:{ss}
        </span>
      </div>
      <p className="mt-2 text-[10.5px] text-emerald-300/80">● Bounty escrowed by the owner</p>
    </div>
  )
}

const CHECKS = ['Build', 'Unit tests', 'Lint & format', 'Scope check', 'Security scan', 'AI review · 92/100']

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
  return (
    <div ref={ref} className="p-4">
      <p className="flex items-center gap-2 text-[12.5px] font-medium text-white/85">
        <GitPullRequest className="h-4 w-4 text-accent" /> feat: cursor pagination for invoices #1190
      </p>
      <div className="mt-3 space-y-1.5">
        {CHECKS.map((c, i) => {
          const ok = i < done
          return (
            <div key={c} className="flex items-center justify-between rounded-md bg-white/[0.03] px-2.5 py-1.5 text-[11.5px]">
              <span className={ok ? 'text-white/80' : 'text-white/40'}>{c}</span>
              {ok ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : i === done ? (
                <CircleDashed className="animate-spin-slow h-3.5 w-3.5 text-accent" />
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function PaidUI() {
  return (
    <div className="p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
          <Check className="h-5 w-5" />
        </span>
        <div>
          <p className="text-[13px] font-medium text-white/90">Approved by the owner</p>
          <p className="text-[11px] text-white/40">“Pagination works, tests are solid. Merging.”</p>
        </div>
      </div>
      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3">
        <p className="text-[10.5px] uppercase tracking-[0.14em] text-white/35">Escrow released</p>
        <p className="mt-1 text-[30px] font-semibold tracking-tight text-white">
          <CountUp to={3200} prefix="₹" />
        </p>
        <div className="mt-2 flex items-center justify-between text-[11px] text-white/45">
          <span>to riya@okaxis · UPI</span>
          <span className="text-emerald-300">Settled in 41s</span>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-[11px] text-white/45">
        <span>Level progress</span>
        <span className="text-accent-text">+180 XP</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-accent to-[#FFB25C]" />
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
    painting: '/paintings/meadow.jpg',
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
    painting: '/paintings/dusk-hill.jpg',
    ui: <ShipUI />,
  },
  {
    icon: <PayoutIcon />,
    title: 'Get paid.',
    body: 'The owner approves a plain-English verdict. The escrow releases straight to your UPI, and your level moves up.',
    painting: '/paintings/lantern-orchard.jpg',
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
            Three steps, no proposals. Every task on Forke is scoped, escrowed and reviewed before you start.
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
                  <FitScale width={560} className="mt-6">
                    <Painting src={s.painting} className="rounded-[18px] border border-white/[0.06] pl-[8%] pt-12">
                      {/* window bleeds off the right and bottom edges, like a cropped screenshot */}
                      <div className="float-layer -mb-8 -mr-8 overflow-hidden rounded-xl border border-white/15 bg-[#0c0c0e]/92 shadow-[0_24px_60px_rgba(0,0,0,0.6)] backdrop-blur-md">
                        <div className="pb-8 pr-8">{s.ui}</div>
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
