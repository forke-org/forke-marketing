'use client'

/**
 * @fileoverview Forke Platform — Pipeline Bento Grid
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

/* ── Step vignettes — crisp, readable miniatures of the real product UI.
     They come alive once the bento container scrolls into view. ─────────── */

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

function ClaimCard({ seconds }: { seconds: number }) {
  return (
    <div className="w-full max-w-[280px] rounded-xl border border-white/10 bg-[#0c0c0f] p-3.5 sm:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.55)] transition-all duration-300 hover:border-white/20">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] font-semibold leading-snug text-white">Fix OAuth redirect loop</p>
        <span className="font-mono text-[13px] font-medium text-accent">₹450</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {['react · tier 2', 'lvl 8+', 'trust 80%+'].map((chip) => (
          <span
            key={chip}
            className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[9px] sm:text-[9.5px] text-white/50"
          >
            {chip}
          </span>
        ))}
      </div>
      <div className="mt-3.5 flex items-center gap-2">
        <span className="inline-flex h-8 flex-1 items-center justify-center rounded-md bg-accent text-[11px] font-semibold text-[#0a0a0a] px-2 whitespace-nowrap">
          claim task
        </span>
        <span className="inline-flex h-8 items-center rounded-md border border-white/10 px-2 sm:px-2.5 font-mono text-[11px] text-white/60 tabular-nums shrink-0">
          {formatTimer(seconds)}
        </span>
      </div>
    </div>
  )
}

function ShipCard({ shown }: { shown: number }) {
  return (
    <div className="w-full max-w-[290px] rounded-xl border border-white/10 bg-[#0c0c0f] p-3.5 sm:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.55)] transition-all duration-300 hover:border-white/20">
      <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2.5">
        <GitPullRequest className="h-3.5 w-3.5 shrink-0 text-accent" />
        <span className="truncate font-mono text-[11px] text-white/80">dev/you/task-2841</span>
        <span className="ml-auto rounded border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[9px] text-emerald-400">
          pr #42
        </span>
      </div>
      <ul className="mt-2.5 space-y-1.5 sm:space-y-2">
        {SHIP_CHECKS.map(([label, status], i) => {
          const visible = i < shown
          return (
            <li
              key={label}
              className="flex items-center justify-between font-mono text-[11px] transition-all duration-300"
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
      <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-2 font-mono text-[9.5px]">
        <span className="uppercase tracking-wider text-white/35">pipeline</span>
        <span className="text-accent/80">build · tests · AI · human</span>
      </div>
    </div>
  )
}

function PaidCard({ amount, done }: { amount: number; done: boolean }) {
  return (
    <div className="w-full max-w-[280px] rounded-xl border border-dashed border-white/[0.16] bg-[#0c0c0f] p-3.5 sm:p-4 font-mono shadow-[0_20px_50px_rgba(0,0,0,0.55)] transition-all duration-300 hover:border-white/25">
      <p className="text-[10px] uppercase tracking-[0.14em] text-white/40">escrow release</p>
      <p className="mt-1 text-[24px] sm:text-[26px] font-medium tracking-tight text-accent tabular-nums">
        ₹{amount.toFixed(2)}
      </p>
      <div className="mt-2.5 space-y-1.5 text-[11px]">
        <div className="flex justify-between">
          <span className="text-white/40">to</span>
          <span className="text-white/80">ayushman@upi</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/40">after merge</span>
          <span className="text-white/80">41s</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/40">status</span>
          <span className={`transition-colors duration-300 ${done ? 'text-emerald-400 font-medium' : 'text-white/45'}`}>
            {done ? 'paid ✓' : 'releasing…'}
          </span>
        </div>
      </div>
      <div className="mt-2.5 flex justify-between border-t border-dashed border-white/10 pt-2 text-[11px]">
        <span className="text-white/40">xp earned</span>
        <span
          className="text-accent transition-opacity duration-500 font-medium"
          style={{ opacity: done ? 1 : 0.25 }}
        >
          +150
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

  // Arm the vignettes when the bento container scrolls into view
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

  // Claim card: reservation timer ticks down (cycles so it never hits zero)
  useEffect(() => {
    if (!live || reduced) return
    const i = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(i)
  }, [live, reduced])

  // Ship card: checks land one by one, hold, then replay
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
    <Section id="pipeline" className="px-5 py-16 md:px-10 md:py-24">
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

      {/* ONE Continuous Unified Asymmetrical Bento Grid */}
      <Reveal delay={120}>
        <div
          ref={gridRef}
          className="mt-14 overflow-hidden rounded-2xl lg:rounded-3xl border border-white/[0.08] bg-[#070709] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.7)] flex flex-col lg:flex-row items-stretch lg:min-h-[640px]"
        >
          {/* ── LEFT COLUMN — CLAIM (~26% width, 65% upper / 35% lower) ── */}
          <div className="flex flex-col lg:w-[26%] lg:flex-[26_26_0%] border-b lg:border-b-0 lg:border-r border-white/[0.08]">
            {/* Upper Region (~65% height on desktop): Bounty card visual miniature + Title + Copy */}
            <div className="flex flex-col justify-between p-6 sm:p-7 lg:p-6 xl:p-8 bg-[#08080a] lg:flex-[65_65_0%] transition-colors duration-300 hover:bg-white/[0.015]">
              <div>
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <span className="font-mono text-[11px] font-medium tracking-[0.08em] text-accent/80 uppercase">
                    01 // CLAIM
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-accent/40" />
                </div>
                <div className="flex items-center justify-center py-2 sm:py-3">
                  <ClaimCard seconds={timerSeconds} />
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-white/[0.06]">
                <h3 className="text-xl lg:text-[22px] font-semibold tracking-[-0.02em] text-white">
                  <span className="bg-gradient-to-r from-accent via-[#ff9436] to-[#ffb84d] bg-clip-text text-transparent">
                    Claim
                  </span>
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-white/50 font-normal">
                  Browse tasks gated to your level, skill tier, and trust score. Claiming locks it for you — 20 minutes to activate, and nobody can snipe it.
                </p>
              </div>
            </div>

            {/* Internal Divider */}
            <div className="border-t border-white/[0.08]" />

            {/* Lower Region (~35% height on desktop): "30m–4h" scoped task size metric */}
            <div className="flex flex-col justify-center p-6 sm:p-7 lg:p-6 xl:p-8 bg-[#070709] lg:flex-[35_35_0%] transition-colors duration-300 hover:bg-white/[0.015]">
              <p className="font-mono text-3xl sm:text-4xl lg:text-[40px] font-medium tracking-tight text-white tabular-nums">
                30m–4h
              </p>
              <p className="font-mono text-xs uppercase tracking-wider text-accent/80 mt-2 font-medium">
                scoped task size
              </p>
              <p className="text-[12.5px] text-white/40 mt-1">
                bite-sized by design
              </p>
            </div>
          </div>

          {/* ── MIDDLE COLUMN — SHIP (~36% width, 28% upper / 72% lower) ── */}
          <div className="flex flex-col lg:w-[36%] lg:flex-[36_36_0%] border-b lg:border-b-0 lg:border-r border-white/[0.08]">
            {/* Upper Region (~28% height on desktop): "<60s" merge -> UPI payout metric */}
            <div className="flex flex-col justify-center p-6 sm:p-7 lg:p-6 xl:p-8 bg-[#070709] lg:flex-[28_28_0%] transition-colors duration-300 hover:bg-white/[0.015]">
              <p className="font-mono text-3xl sm:text-4xl lg:text-[40px] font-medium tracking-tight text-white tabular-nums">
                &lt;60s
              </p>
              <p className="font-mono text-xs uppercase tracking-wider text-accent/80 mt-2 font-medium">
                merge → UPI payout
              </p>
              <p className="text-[12.5px] text-white/40 mt-1">
                escrow releases on merge
              </p>
            </div>

            {/* Internal Divider */}
            <div className="border-t border-white/[0.08]" />

            {/* Lower Region (~72% height on desktop): Main Visual Area — Developer Workflow / PR Checks + Title + Copy */}
            <div className="flex flex-col justify-between p-6 sm:p-7 lg:p-6 xl:p-8 bg-[#08080a] lg:flex-[72_72_0%] relative transition-colors duration-300 hover:bg-white/[0.015]">
              {/* Subtle atmospheric center glow in the developer workspace */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(255,122,0,0.04)_0%,transparent_75%)]"
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <span className="font-mono text-[11px] font-medium tracking-[0.08em] text-accent/80 uppercase">
                    02 // SHIP
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-accent/40" />
                </div>
                <div className="flex items-center justify-center py-2 sm:py-3">
                  <ShipCard shown={checksShown} />
                </div>
              </div>

              <div className="relative z-10 mt-6 pt-5 border-t border-white/[0.06]">
                <h3 className="text-xl lg:text-[22px] font-semibold tracking-[-0.02em] text-white">
                  <span className="bg-gradient-to-r from-accent via-[#ff9436] to-[#ffb84d] bg-clip-text text-transparent">
                    Ship
                  </span>
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-white/50 font-normal">
                  Work in an isolated Forke branch — never on the owner&apos;s repo. Submit a PR; automated checks and an AI review run before a human ever looks.
                </p>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN — GET PAID (~38% width, 65% upper / 35% lower) ── */}
          <div className="flex flex-col lg:w-[38%] lg:flex-[38_38_0%]">
            {/* Upper Region (~65% height on desktop): Escrow / Payout Card miniature + Title + Copy */}
            <div className="flex flex-col justify-between p-6 sm:p-7 lg:p-6 xl:p-8 bg-[#08080a] lg:flex-[65_65_0%] transition-colors duration-300 hover:bg-white/[0.015]">
              <div>
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <span className="font-mono text-[11px] font-medium tracking-[0.08em] text-accent/80 uppercase">
                    03 // GET PAID
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-accent/40" />
                </div>
                <div className="flex items-center justify-center py-2 sm:py-3">
                  <PaidCard amount={amount} done={paidDone} />
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-white/[0.06]">
                <h3 className="text-xl lg:text-[22px] font-semibold tracking-[-0.02em] text-white">
                  <span className="bg-gradient-to-r from-accent via-[#ff9436] to-[#ffb84d] bg-clip-text text-transparent">
                    Get paid
                  </span>
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-white/50 font-normal">
                  The owner approves a plain-English verdict, Forke merges, and escrow releases straight to your UPI — usually within a minute of the merge.
                </p>
              </div>
            </div>

            {/* Internal Divider */}
            <div className="border-t border-white/[0.08]" />

            {/* Lower Region (~35% height on desktop): "25 levels" metric */}
            <div className="flex flex-col justify-center p-6 sm:p-7 lg:p-6 xl:p-8 bg-[#070709] lg:flex-[35_35_0%] transition-colors duration-300 hover:bg-white/[0.015]">
              <p className="font-mono text-3xl sm:text-4xl lg:text-[40px] font-medium tracking-tight text-white tabular-nums">
                25 levels
              </p>
              <p className="font-mono text-xs uppercase tracking-wider text-accent/80 mt-2 font-medium">
                levels to climb
              </p>
              <p className="text-[12.5px] text-white/40 mt-1">
                earn XP with every merged PR
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
