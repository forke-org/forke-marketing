'use client'

/**
 * @fileoverview Forke Platform — Premium Bento Grid
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

import React, { useEffect, useRef, useState } from 'react'
import { Check, GitPullRequest, Zap, Clock, ShieldCheck, Trophy } from 'lucide-react'
import { Section, Eyebrow, H2 } from './primitives'
import Reveal from './Reveal'

/* ── Step vignettes — crisp miniatures of the real Forke product UI.
     They animate once the bento container scrolls into view. ─────────────── */

const SHIP_CHECKS: [string, string][] = [
  ['FORKE_SUBMISSION.md', 'found'],
  ['build', 'passed'],
  ['tests', '14/14'],
  ['lint · scope', 'clean'],
  ['ai review', 'approve'],
]

function formatTimer(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/* Card 1 Visual: Bounty Card with Filter Tabs */
function ClaimVisual({ seconds }: { seconds: number }) {
  return (
    <div className="w-full max-w-[340px] flex flex-col items-center">
      {/* Category Pills directly inspired by reference bento */}
      <div className="flex items-center gap-1.5 sm:gap-2 mb-3 select-none">
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] text-white/50">
          All
        </span>
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] text-white/50">
          React
        </span>
        <span className="rounded-full border border-accent/40 bg-accent/15 px-2.5 py-1 font-mono text-[10px] font-medium text-accent">
          Tier 2
        </span>
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] text-white/50">
          Active
        </span>
      </div>

      {/* Floating miniature task card */}
      <div className="w-full rounded-xl border border-white/10 bg-[#09090c] p-3.5 sm:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all duration-300 hover:border-white/20">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[13px] font-semibold leading-snug text-white">Fix OAuth redirect loop</p>
          <span className="font-mono text-[13px] font-medium text-accent">₹450</span>
        </div>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {['react · tier 2', 'lvl 8+', 'trust 80%+'].map((chip) => (
            <span
              key={chip}
              className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[9px] text-white/50"
            >
              {chip}
            </span>
          ))}
        </div>
        <div className="mt-3.5 flex items-center gap-2">
          <span className="inline-flex h-7 sm:h-8 flex-1 items-center justify-center rounded-md bg-accent text-[11px] font-semibold text-[#0a0a0a] px-2 whitespace-nowrap">
            claim task
          </span>
          <span className="inline-flex h-7 sm:h-8 items-center rounded-md border border-white/10 px-2 sm:px-2.5 font-mono text-[11px] text-white/60 tabular-nums shrink-0">
            {formatTimer(seconds)}
          </span>
        </div>
      </div>
    </div>
  )
}

/* Card 2 Visual: 30m-4h Duration Graphic */
function ScopedVisual() {
  return (
    <div className="w-full max-w-[280px] flex flex-col items-center justify-center py-2">
      {/* Central prominent metric box */}
      <div className="relative flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#09090c] px-6 py-5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] w-full">
        <div className="flex items-center gap-2 text-accent/80 mb-1">
          <Clock className="w-3.5 h-3.5" />
          <span className="font-mono text-[10.5px] uppercase tracking-wider text-accent">scoped task size</span>
        </div>
        <p className="font-mono text-3xl sm:text-4xl font-medium tracking-tight text-white tabular-nums my-1">
          30m–4h
        </p>
        <div className="w-full bg-white/[0.08] h-1.5 rounded-full mt-3 overflow-hidden">
          <div className="bg-gradient-to-r from-accent via-amber-400 to-accent h-full w-[65%] rounded-full" />
        </div>
        <div className="flex justify-between w-full mt-2 font-mono text-[9px] text-white/40">
          <span>quick fix</span>
          <span>bite-sized</span>
          <span>deep dive</span>
        </div>
      </div>
    </div>
  )
}

/* Card 3 Visual: <60s Instant Settlement Graphic */
function SettlementVisual() {
  return (
    <div className="w-full max-w-[280px] flex flex-col items-center justify-center py-2">
      <div className="relative flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#09090c] px-6 py-5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] w-full overflow-hidden">
        {/* Subtle orange radial ambient glow */}
        <div 
          className="absolute -top-10 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(249, 115, 22, 0.25) 0%, transparent 70%)',
            filter: 'blur(20px)'
          }}
        />
        <div className="flex items-center gap-1.5 text-emerald-400 mb-1 relative z-10">
          <Zap className="w-3.5 h-3.5" />
          <span className="font-mono text-[10.5px] uppercase tracking-wider">instant release</span>
        </div>
        <p className="font-mono text-3xl sm:text-4xl font-medium tracking-tight text-white tabular-nums my-1 relative z-10">
          &lt;60s
        </p>
        <p className="font-mono text-[11px] text-white/60 mt-1 relative z-10">
          merge → UPI payout
        </p>
        <span className="mt-3 inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[9.5px] text-emerald-400 relative z-10">
          escrow releases on merge
        </span>
      </div>
    </div>
  )
}

/* Card 4 Visual: Ship Developer Workflow */
function ShipVisual({ shown }: { shown: number }) {
  return (
    <div className="w-full max-w-[340px] flex flex-col items-center">
      {/* Background blueprint grid wrapper */}
      <div 
        className="w-full rounded-xl border border-white/10 bg-[#09090c] p-3.5 sm:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all duration-300 hover:border-white/20 relative overflow-hidden"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)',
          backgroundSize: '16px 16px'
        }}
      >
        <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
          <GitPullRequest className="h-3.5 w-3.5 shrink-0 text-accent" />
          <span className="truncate font-mono text-[11px] text-white/80">dev/you/task-2841</span>
          <span className="ml-auto rounded border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[9px] text-emerald-400">
            pr #42
          </span>
        </div>
        <ul className="mt-2.5 space-y-1.5">
          {SHIP_CHECKS.map(([label, status], i) => {
            const visible = i < shown
            return (
              <li
                key={label}
                className="flex items-center justify-between font-mono text-[10.5px] transition-all duration-300"
                style={{ opacity: visible ? 1 : 0.2, transform: visible ? 'none' : 'translateY(2px)' }}
              >
                <span className="text-white/50">{label}</span>
                <span className="flex items-center gap-1.5 text-white/80">
                  {visible ? status : '…'}
                  <Check
                    className="h-3 w-3 text-emerald-400 transition-transform duration-300"
                    style={{ transform: visible ? 'scale(1)' : 'scale(0)' }}
                  />
                </span>
              </li>
            )
          })}
        </ul>
        <div className="mt-2.5 flex items-center justify-between border-t border-white/[0.06] pt-2 font-mono text-[9px]">
          <span className="uppercase tracking-wider text-white/35">4-layer pipeline</span>
          <span className="text-accent/90">build · tests · AI · human</span>
        </div>
      </div>
    </div>
  )
}

/* Card 5 Visual: Get Paid Escrow Payout */
function PaidVisual({ amount, done }: { amount: number; done: boolean }) {
  return (
    <div className="w-full max-w-[340px] flex flex-col items-center">
      <div className="w-full rounded-xl border border-dashed border-white/[0.16] bg-[#09090c] p-3.5 sm:p-4 font-mono shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all duration-300 hover:border-white/25">
        <div className="flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.14em] text-white/40">escrow release</p>
          <span className={`text-[10px] transition-colors duration-300 ${done ? 'text-emerald-400 font-semibold' : 'text-white/45'}`}>
            {done ? 'paid ✓' : 'releasing…'}
          </span>
        </div>
        <p className="mt-1 text-[24px] sm:text-[26px] font-medium tracking-tight text-accent tabular-nums">
          ₹{amount.toFixed(2)}
        </p>
        <div className="mt-2 space-y-1 text-[10.5px]">
          <div className="flex justify-between">
            <span className="text-white/40">to</span>
            <span className="text-white/80">ayushman@upi</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/40">after merge</span>
            <span className="text-white/80">41s</span>
          </div>
        </div>
        <div className="mt-2.5 flex justify-between border-t border-dashed border-white/10 pt-2 text-[10.5px]">
          <span className="text-white/40">xp earned</span>
          <span
            className="text-accent transition-opacity duration-500 font-medium"
            style={{ opacity: done ? 1 : 0.25 }}
          >
            +150 XP
          </span>
        </div>
      </div>
    </div>
  )
}

/* Card 6 Visual: 25 Levels Progression Graphic */
function LevelsVisual() {
  return (
    <div className="w-full max-w-[280px] flex flex-col items-center justify-center py-2">
      <div className="relative flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#09090c] px-6 py-5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] w-full">
        <div className="flex items-center gap-1.5 text-accent mb-1">
          <Trophy className="w-3.5 h-3.5" />
          <span className="font-mono text-[10.5px] uppercase tracking-wider">developer tier</span>
        </div>
        <p className="font-mono text-3xl sm:text-4xl font-medium tracking-tight text-white tabular-nums my-1">
          25 levels
        </p>
        {/* Progression milestone track */}
        <div className="flex items-center justify-between w-full mt-3 px-1">
          <div className="flex flex-col items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-accent/60" />
            <span className="font-mono text-[8.5px] text-white/40 mt-1">Lvl 1</span>
          </div>
          <div className="h-0.5 flex-1 bg-gradient-to-r from-accent/60 via-accent to-amber-400 mx-1" />
          <div className="flex flex-col items-center">
            <span className="w-3 h-3 rounded-full bg-accent ring-2 ring-accent/30 shadow-[0_0_10px_rgba(255,122,0,0.8)]" />
            <span className="font-mono text-[8.5px] text-accent font-semibold mt-1">Lvl 12</span>
          </div>
          <div className="h-0.5 flex-1 bg-white/10 mx-1" />
          <div className="flex flex-col items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
            <span className="font-mono text-[8.5px] text-white/40 mt-1">Lvl 25</span>
          </div>
        </div>
        <p className="font-mono text-[10px] text-white/50 mt-2.5">
          newcomer → forke legend
        </p>
      </div>
    </div>
  )
}

/* ── Section Component ─────────────────────────────────────────────────────── */

export default function Pipeline() {
  const gridRef = useRef<HTMLDivElement>(null)
  const [live, setLive] = useState(false)
  const [reduced, setReduced] = useState(false)

  // Animation states
  const [tick, setTick] = useState(0) // claim timer countdown
  const [shown, setShown] = useState(0) // ship checks revealed
  const [amount, setAmount] = useState(0) // payout count-up

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  // Arm vignettes when bento container enters viewport
  useEffect(() => {
    const el = gridRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLive(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -15% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Claim card: reservation timer ticks down
  useEffect(() => {
    if (!live || reduced) return
    const i = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(i)
  }, [live, reduced])

  // Ship card: checks land one by one, hold, replay
  useEffect(() => {
    if (!live || reduced) return
    const t = setTimeout(
      () => setShown((s) => (s >= SHIP_CHECKS.length ? 0 : s + 1)),
      shown === 0 ? 600 : shown >= SHIP_CHECKS.length ? 3400 : 480
    )
    return () => clearTimeout(t)
  }, [live, reduced, shown])

  // Paid card: count up to ₹800 once live
  useEffect(() => {
    if (!live) return
    if (reduced) {
      setAmount(800)
      return
    }
    const start = performance.now()
    const duration = 1100
    let raf: number
    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setAmount(Math.round(800 * eased))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [live, reduced])

  const timerSeconds = reduced ? 1200 : 1200 - (tick % 95)
  const checksShown = reduced ? SHIP_CHECKS.length : shown
  const paidDone = amount >= 800

  return (
    <Section id="pipeline" className="px-5 pt-12 sm:pt-16 md:pt-20 pb-16 md:pb-24 lg:pb-28 md:px-10">
      <Reveal>
        <Eyebrow n="001" label="the pipeline" />
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <H2 accent="cash.">From claim to</H2>
          <p className="max-w-md pb-1.5 text-[15px] font-normal leading-relaxed text-white/45">
            One workflow, three moves. No proposals, no negotiation threads, no
            invoices — the pipeline does the trust work for you.
          </p>
        </div>
      </Reveal>

      {/* ── Modern Alternating Bento Grid (Inspired by Reference Design) ── */}
      <Reveal delay={120}>
        <div
          ref={gridRef}
          className="mt-10 sm:mt-12 lg:mt-14 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5"
        >
          {/* ── ROW 1: Wide (7 cols) / Narrow (5 cols) ── */}

          {/* CARD 1: PRODUCT DESIGN / CLAIM (Wide: 7 cols) */}
          <div className="lg:col-span-7 rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-[#0c0c0f] p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:border-white/[0.16] hover:bg-[#0e0e12] min-h-[380px] sm:min-h-[420px]">
            {/* Visual Header */}
            <div className="flex-1 flex items-center justify-center py-4">
              <ClaimVisual seconds={timerSeconds} />
            </div>
            {/* Content Bottom */}
            <div className="mt-4">
              <span className="font-mono text-[10.5px] uppercase tracking-wider text-accent/80 font-medium">
                01 // CLAIM
              </span>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase mt-1">
                Claim bounties
              </h3>
              <p className="text-[13.5px] text-white/55 leading-relaxed font-normal mt-2 max-w-xl">
                Browse tasks gated to your level, skill tier, and trust score. Claiming locks it for you — 20 minutes to activate, and nobody can snipe it.
              </p>
            </div>
          </div>

          {/* CARD 2: WEB DEVELOPMENT / SCOPED TASKS (Narrow: 5 cols) */}
          <div className="lg:col-span-5 rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-[#0c0c0f] p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:border-white/[0.16] hover:bg-[#0e0e12] min-h-[380px] sm:min-h-[420px]">
            {/* Visual Header */}
            <div className="flex-1 flex items-center justify-center py-4">
              <ScopedVisual />
            </div>
            {/* Content Bottom */}
            <div className="mt-4">
              <span className="font-mono text-[10.5px] uppercase tracking-wider text-accent/80 font-medium">
                TASK DURATION
              </span>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase mt-1">
                Scoped task sizes
              </h3>
              <p className="text-[13.5px] text-white/55 leading-relaxed font-normal mt-2">
                Every task is scoped between 30 minutes to 4 hours. Bite-sized by design so you ship focused code and earn without endless reviews.
              </p>
            </div>
          </div>

          {/* ── ROW 2: Narrow (5 cols) / Wide (7 cols) ── */}

          {/* CARD 3: BRAND IDENTITY / INSTANT SETTLEMENT (Narrow: 5 cols) */}
          <div className="lg:col-span-5 rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-[#0c0c0f] p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:border-white/[0.16] hover:bg-[#0e0e12] min-h-[380px] sm:min-h-[420px]">
            {/* Visual Header */}
            <div className="flex-1 flex items-center justify-center py-4">
              <SettlementVisual />
            </div>
            {/* Content Bottom */}
            <div className="mt-4">
              <span className="font-mono text-[10.5px] uppercase tracking-wider text-emerald-400/90 font-medium">
                SETTLEMENT SPEED
              </span>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase mt-1">
                Instant UPI payout
              </h3>
              <p className="text-[13.5px] text-white/55 leading-relaxed font-normal mt-2">
                Automated escrow releases funds to your UPI handle in under 60 seconds the moment your pull request merges into main.
              </p>
            </div>
          </div>

          {/* CARD 4: DESIGN SYSTEMS / SHIP (Wide: 7 cols) */}
          <div className="lg:col-span-7 rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-[#0c0c0f] p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:border-white/[0.16] hover:bg-[#0e0e12] min-h-[380px] sm:min-h-[420px]">
            {/* Visual Header */}
            <div className="flex-1 flex items-center justify-center py-4">
              <ShipVisual shown={checksShown} />
            </div>
            {/* Content Bottom */}
            <div className="mt-4">
              <span className="font-mono text-[10.5px] uppercase tracking-wider text-accent/80 font-medium">
                02 // SHIP
              </span>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase mt-1">
                Ship the fix
              </h3>
              <p className="text-[13.5px] text-white/55 leading-relaxed font-normal mt-2 max-w-xl">
                Work in an isolated Forke branch — never on the owner&apos;s repo. Submit a PR; automated checks, tests, and AI review run before a human ever looks.
              </p>
            </div>
          </div>

          {/* ── ROW 3: Wide (7 cols) / Narrow (5 cols) ── */}

          {/* CARD 5: MOTION DESIGN / GET PAID (Wide: 7 cols) */}
          <div className="lg:col-span-7 rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-[#0c0c0f] p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:border-white/[0.16] hover:bg-[#0e0e12] min-h-[380px] sm:min-h-[420px]">
            {/* Visual Header */}
            <div className="flex-1 flex items-center justify-center py-4">
              <PaidVisual amount={amount} done={paidDone} />
            </div>
            {/* Content Bottom */}
            <div className="mt-4">
              <span className="font-mono text-[10.5px] uppercase tracking-wider text-accent/80 font-medium">
                03 // GET PAID
              </span>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase mt-1">
                Get paid
              </h3>
              <p className="text-[13.5px] text-white/55 leading-relaxed font-normal mt-2 max-w-xl">
                The owner approves a plain-English verdict, Forke merges, and escrow releases straight to your UPI — with zero invoicing or payment chasing.
              </p>
            </div>
          </div>

          {/* CARD 6: LECTURING / 25 LEVELS (Narrow: 5 cols) */}
          <div className="lg:col-span-5 rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-[#0c0c0f] p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:border-white/[0.16] hover:bg-[#0e0e12] min-h-[380px] sm:min-h-[420px]">
            {/* Visual Header */}
            <div className="flex-1 flex items-center justify-center py-4">
              <LevelsVisual />
            </div>
            {/* Content Bottom */}
            <div className="mt-4">
              <span className="font-mono text-[10.5px] uppercase tracking-wider text-accent/80 font-medium">
                TIER PROGRESSION
              </span>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase mt-1">
                25 levels to climb
              </h3>
              <p className="text-[13.5px] text-white/55 leading-relaxed font-normal mt-2">
                Earn XP with every merged PR. Level up from newcomer to Forke legend to unlock higher-tier bounties and exclusive startup repos.
              </p>
            </div>
          </div>

        </div>
      </Reveal>
    </Section>
  )
}
