'use client'

/**
 * @fileoverview Forke Platform — Refined Bento Grid
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

import React, { useEffect, useRef, useState } from 'react'
import { Check, GitPullRequest } from 'lucide-react'
import { Section, Eyebrow, H2 } from './primitives'
import Reveal from './Reveal'

/* ── Step vignettes — crisp miniatures of the real Forke product UI. ────────── */

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

/* Card 1 Visual: Bounty Card */
function ClaimVisual({ seconds }: { seconds: number }) {
  return (
    <div className="w-full max-w-[310px] rounded-xl border border-white/10 bg-[#09090c] p-3 sm:p-3.5 shadow-[0_16px_40px_rgba(0,0,0,0.6)] transition-all duration-300 hover:border-white/20">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[12.5px] font-semibold leading-snug text-white">Fix OAuth redirect loop</p>
        <span className="font-mono text-[12.5px] font-medium text-accent">₹450</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {['react · tier 2', 'lvl 8+', 'trust 80%+'].map((chip) => (
          <span
            key={chip}
            className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[9px] text-white/50"
          >
            {chip}
          </span>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className="inline-flex h-7 flex-1 items-center justify-center rounded-md bg-accent text-[10.5px] font-semibold text-[#0a0a0a] px-2 whitespace-nowrap">
          claim task
        </span>
        <span className="inline-flex h-7 items-center rounded-md border border-white/10 px-2 font-mono text-[10.5px] text-white/60 tabular-nums shrink-0">
          {formatTimer(seconds)}
        </span>
      </div>
    </div>
  )
}

/* Card 4 Visual: Ship Developer Workflow */
function ShipVisual({ shown }: { shown: number }) {
  return (
    <div className="w-full max-w-[310px] rounded-xl border border-white/10 bg-[#09090c] p-3 sm:p-3.5 shadow-[0_16px_40px_rgba(0,0,0,0.6)] transition-all duration-300 hover:border-white/20">
      <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
        <GitPullRequest className="h-3.5 w-3.5 shrink-0 text-accent" />
        <span className="truncate font-mono text-[10.5px] text-white/80">dev/you/task-2841</span>
        <span className="ml-auto rounded border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[9px] text-emerald-400">
          pr #42
        </span>
      </div>
      <ul className="mt-2 space-y-1">
        {SHIP_CHECKS.map(([label, status], i) => {
          const visible = i < shown
          return (
            <li
              key={label}
              className="flex items-center justify-between font-mono text-[10px] transition-all duration-300"
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
      <div className="mt-2 flex items-center justify-between border-t border-white/[0.06] pt-1.5 font-mono text-[9px]">
        <span className="uppercase tracking-wider text-white/35">pipeline</span>
        <span className="text-accent/80">build · tests · AI · human</span>
      </div>
    </div>
  )
}

/* Card 5 Visual: Get Paid Escrow Payout */
function PaidVisual({ amount, done }: { amount: number; done: boolean }) {
  return (
    <div className="w-full max-w-[310px] rounded-xl border border-dashed border-white/[0.16] bg-[#09090c] p-3 sm:p-3.5 font-mono shadow-[0_16px_40px_rgba(0,0,0,0.6)] transition-all duration-300 hover:border-white/25">
      <div className="flex items-center justify-between">
        <p className="text-[9.5px] uppercase tracking-[0.14em] text-white/40">escrow release</p>
        <span className={`text-[9.5px] transition-colors duration-300 ${done ? 'text-emerald-400 font-semibold' : 'text-white/45'}`}>
          {done ? 'paid ✓' : 'releasing…'}
        </span>
      </div>
      <p className="mt-1 text-[22px] font-medium tracking-tight text-accent tabular-nums">
        ₹{amount.toFixed(2)}
      </p>
      <div className="mt-1.5 space-y-1 text-[10px]">
        <div className="flex justify-between">
          <span className="text-white/40">to</span>
          <span className="text-white/80">ayushman@upi</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/40">after merge</span>
          <span className="text-white/80">41s</span>
        </div>
      </div>
      <div className="mt-2 flex justify-between border-t border-dashed border-white/10 pt-1.5 text-[10px]">
        <span className="text-white/40">xp earned</span>
        <span
          className="text-accent transition-opacity duration-500 font-medium"
          style={{ opacity: done ? 1 : 0.25 }}
        >
          +150 XP
        </span>
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
    <Section id="pipeline" className="px-5 pt-10 sm:pt-14 md:pt-16 pb-14 md:pb-20 lg:pb-24 md:px-10">
      <Reveal>
        <Eyebrow n="001" label="the pipeline" />
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <H2 accent="cash.">From claim to</H2>
          <p className="max-w-md pb-1 text-[14.5px] font-normal leading-relaxed text-white/45">
            One workflow, three moves. No proposals, no negotiation threads, no
            invoices — the pipeline does the trust work for you.
          </p>
        </div>
      </Reveal>

      {/* ── Compact Alternating Bento Grid ── */}
      <Reveal delay={100}>
        <div
          ref={gridRef}
          className="mt-8 sm:mt-10 lg:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4"
        >
          {/* ── ROW 1: Wide (7 cols) / Narrow (5 cols) ── */}

          {/* CARD 1: CLAIM (Wide: 7 cols) */}
          <div className="lg:col-span-7 rounded-2xl border border-white/[0.08] bg-[#0c0c0f] p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 hover:border-white/[0.16] hover:bg-[#0e0e12] min-h-[290px] sm:min-h-[310px]">
            {/* Visual Top */}
            <div className="flex-1 flex items-center justify-center py-2">
              <ClaimVisual seconds={timerSeconds} />
            </div>
            {/* Content Bottom */}
            <div className="mt-3">
              <span className="font-mono text-[10px] uppercase tracking-wider text-accent/80 font-medium">
                01 // CLAIM
              </span>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white uppercase mt-0.5">
                Claim bounties
              </h3>
              <p className="text-[13px] text-white/55 leading-relaxed font-normal mt-1 max-w-xl">
                Browse tasks gated to your level, skill tier, and trust score. Claiming locks it for you — 20 minutes to activate, and nobody can snipe it.
              </p>
            </div>
          </div>

          {/* CARD 2: 30m–4h (Narrow: 5 cols) — Pure typography without nested card */}
          <div className="lg:col-span-5 rounded-2xl border border-white/[0.08] bg-[#0c0c0f] p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 hover:border-white/[0.16] hover:bg-[#0e0e12] min-h-[290px] sm:min-h-[310px]">
            {/* Direct Typography Metric Display */}
            <div className="flex-1 flex flex-col justify-center">
              <p className="font-mono text-4xl sm:text-5xl font-medium tracking-tight text-white tabular-nums">
                30m–4h
              </p>
              <p className="mt-2 text-[13px] text-white/55">scoped task size</p>
              <p className="mt-1 font-mono text-[11px] text-white/30">bite-sized by design</p>
            </div>
            {/* Content Bottom */}
            <div className="mt-3">
              <p className="text-[13px] text-white/55 leading-relaxed font-normal">
                Every task is scoped between 30 minutes to 4 hours. Ship focused code and earn without endless review cycles.
              </p>
            </div>
          </div>

          {/* ── ROW 2: Narrow (5 cols) / Wide (7 cols) ── */}

          {/* CARD 3: <60s (Narrow: 5 cols) — Pure typography without nested card */}
          <div className="lg:col-span-5 rounded-2xl border border-white/[0.08] bg-[#0c0c0f] p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 hover:border-white/[0.16] hover:bg-[#0e0e12] min-h-[290px] sm:min-h-[310px]">
            {/* Direct Typography Metric Display */}
            <div className="flex-1 flex flex-col justify-center">
              <p className="font-mono text-4xl sm:text-5xl font-medium tracking-tight text-white tabular-nums">
                &lt;60s
              </p>
              <p className="mt-2 text-[13px] text-white/55">merge → UPI payout</p>
              <p className="mt-1 font-mono text-[11px] text-white/30">escrow releases on merge</p>
            </div>
            {/* Content Bottom */}
            <div className="mt-3">
              <p className="text-[13px] text-white/55 leading-relaxed font-normal">
                Automated escrow releases funds to your UPI handle in under 60 seconds the moment your pull request merges into main.
              </p>
            </div>
          </div>

          {/* CARD 4: SHIP (Wide: 7 cols) */}
          <div className="lg:col-span-7 rounded-2xl border border-white/[0.08] bg-[#0c0c0f] p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 hover:border-white/[0.16] hover:bg-[#0e0e12] min-h-[290px] sm:min-h-[310px]">
            {/* Visual Top */}
            <div className="flex-1 flex items-center justify-center py-2">
              <ShipVisual shown={checksShown} />
            </div>
            {/* Content Bottom */}
            <div className="mt-3">
              <span className="font-mono text-[10px] uppercase tracking-wider text-accent/80 font-medium">
                02 // SHIP
              </span>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white uppercase mt-0.5">
                Ship the fix
              </h3>
              <p className="text-[13px] text-white/55 leading-relaxed font-normal mt-1 max-w-xl">
                Work in an isolated Forke branch — never on the owner&apos;s repo. Submit a PR; automated checks and an AI review run before a human ever looks.
              </p>
            </div>
          </div>

          {/* ── ROW 3: Wide (7 cols) / Narrow (5 cols) ── */}

          {/* CARD 5: GET PAID (Wide: 7 cols) */}
          <div className="lg:col-span-7 rounded-2xl border border-white/[0.08] bg-[#0c0c0f] p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 hover:border-white/[0.16] hover:bg-[#0e0e12] min-h-[290px] sm:min-h-[310px]">
            {/* Visual Top */}
            <div className="flex-1 flex items-center justify-center py-2">
              <PaidVisual amount={amount} done={paidDone} />
            </div>
            {/* Content Bottom */}
            <div className="mt-3">
              <span className="font-mono text-[10px] uppercase tracking-wider text-accent/80 font-medium">
                03 // GET PAID
              </span>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white uppercase mt-0.5">
                Get paid
              </h3>
              <p className="text-[13px] text-white/55 leading-relaxed font-normal mt-1 max-w-xl">
                The owner approves a plain-English verdict, Forke merges, and escrow releases straight to your UPI — with zero invoicing or payment chasing.
              </p>
            </div>
          </div>

          {/* CARD 6: 25 LEVELS (Narrow: 5 cols) — Pure typography without nested card */}
          <div className="lg:col-span-5 rounded-2xl border border-white/[0.08] bg-[#0c0c0f] p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 hover:border-white/[0.16] hover:bg-[#0e0e12] min-h-[290px] sm:min-h-[310px]">
            {/* Direct Typography Metric Display */}
            <div className="flex-1 flex flex-col justify-center">
              <p className="font-mono text-4xl sm:text-5xl font-medium tracking-tight text-white tabular-nums">
                25 levels
              </p>
              <p className="mt-2 text-[13px] text-white/55">levels to climb</p>
              <p className="mt-1 font-mono text-[11px] text-white/30">newcomer → forke legend</p>
            </div>
            {/* Content Bottom */}
            <div className="mt-3">
              <p className="text-[13px] text-white/55 leading-relaxed font-normal">
                Earn XP with every merged PR. Level up from newcomer to Forke legend to unlock higher-tier bounties and exclusive startup repos.
              </p>
            </div>
          </div>

        </div>
      </Reveal>
    </Section>
  )
}
