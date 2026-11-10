'use client'

/**
 * @fileoverview Forke Platform - Statistics & Velocity Showcase Section
 * Calendly-style 2-column showcase:
 * - Left side: Squircle gradient container with floating white metric card & rich preview
 * - Right side: Section eyebrow, displayFont headline, and interactive items written about each metric
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 */

import React, { useState, useEffect } from 'react'
import {
  Timer,
  GitMerge,
  Layers,
  Trophy,
  Sparkles,
  ArrowUpRight,
  Check,
  Clock,
  LucideIcon,
} from 'lucide-react'

interface StatShowcaseItem {
  id: string
  number: string
  stat: string
  label: string
  title: string
  shortDescription: string
  fullDescription: string
  tag: string
  note: string
  Icon: LucideIcon
  bars: number[]
}

const STAT_ITEMS: StatShowcaseItem[] = [
  {
    id: 'time',
    number: '01',
    stat: '30m–4h',
    label: 'scoped task size',
    title: '30m–4h — Scoped task size',
    shortDescription: 'Bite-sized by design',
    fullDescription:
      'Tasks are calibrated strictly between 30 minutes and 4 hours. No multi-week bloated sprints, no ambiguity — bite-sized by design so you ship clean PRs fast and close bounties on the same day.',
    tag: 'Scoped Task',
    note: 'bite-sized by design',
    Icon: Timer,
    bars: [22, 38, 18, 30, 48, 26, 34, 52, 24, 40, 20, 32, 44, 28, 36, 20],
  },
  {
    id: 'payout',
    number: '02',
    stat: '<60s',
    label: 'merge → UPI payout',
    title: '<60s — Merge → UPI payout',
    shortDescription: 'Escrow releases on merge',
    fullDescription:
      'The moment the repository owner approves and merges your PR, Forke smart escrow releases the bounty straight to your UPI ID in under 60 seconds. Zero invoice chasing, zero payment delays.',
    tag: 'Instant Escrow',
    note: 'escrow releases on merge',
    Icon: GitMerge,
    bars: [34, 22, 46, 30, 54, 36, 24, 42, 28, 50, 18, 38, 48, 32, 26, 44],
  },
  {
    id: 'pipeline',
    number: '03',
    stat: '4-layer',
    label: 'review pipeline',
    title: '4-layer — Review pipeline',
    shortDescription: 'Build · tests · ai · human',
    fullDescription:
      'Every pull request runs through our four automated verification gates: isolated container build, full test suites, AI semantic diff audit, and repo owner human verdict before merging.',
    tag: 'Review Gates',
    note: 'build · tests · ai · human',
    Icon: Layers,
    bars: [18, 30, 40, 52, 36, 46, 24, 38, 50, 28, 34, 44, 26, 48, 32, 22],
  },
  {
    id: 'levels',
    number: '04',
    stat: '25',
    label: 'levels to climb',
    title: '25 — Levels to climb',
    shortDescription: 'Newcomer → forke legend',
    fullDescription:
      'Climb from L1 bug-fixer to L25 repo legend. Every merged pull request mints immutable XP, raises your trust score, and unlocks higher bounty tiers across top open-source repositories.',
    tag: 'Rank Ladder',
    note: 'newcomer → forke legend',
    Icon: Trophy,
    bars: [26, 44, 22, 36, 50, 32, 42, 56, 28, 40, 24, 38, 52, 30, 46, 34],
  },
]

export default function StatsShowcaseSection() {
  const [activeTab, setActiveTab] = useState<string>('time')
  const [isPaused, setIsPaused] = useState<boolean>(false)

  // Auto-advance tabs every 5.5s when not hovered
  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(() => {
      setActiveTab((current) => {
        const idx = STAT_ITEMS.findIndex((item) => item.id === current)
        const nextIdx = (idx + 1) % STAT_ITEMS.length
        return STAT_ITEMS[nextIdx].id
      })
    }, 5500)
    return () => clearInterval(interval)
  }, [isPaused])

  const activeItem = STAT_ITEMS.find((item) => item.id === activeTab) || STAT_ITEMS[0]

  return (
    <section id="metrics" className="mx-auto w-full border-b border-black/[0.08] bg-white">
      <div className="mx-auto w-full max-w-[1536px] px-4 sm:px-6 lg:px-12 xl:px-24">
        <div className="border-x border-black/[0.08]">
          <div className="px-6 py-16 sm:px-8 sm:py-20 md:px-14 md:py-24 xl:px-20">
            {/* Mobile Header: Visible only on < lg screens */}
            <div className="block lg:hidden mb-10">
              <div className="mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00]/25 text-[#FF7A00] font-mono text-xs font-semibold tracking-wider uppercase">
                  <Sparkles className="size-3.5" />
                  <span>002 — Platform Velocity</span>
                </span>
              </div>

              <h2
                className="text-[#0a0a0a] text-3xl sm:text-4xl font-normal tracking-tight leading-[1.15]"
                style={{
                  fontFamily: 'displayFont, "displayFont Fallback", sans-serif',
                  fontWeight: 400,
                }}
              >
                Built for velocity,{' '}
                <span className="text-[#FF7A00]">
                  backed by code.
                </span>
              </h2>
            </div>

            {/* 2-Column Calendly Layout: Left = Cards Canvas, Right = Text Accordion */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Column: Calendly Squircle Stage with Floating Card */}
              <div className="lg:col-span-6 w-full flex items-center justify-center">
                <div className="relative w-full min-h-[500px] sm:min-h-[540px] rounded-[32px] sm:rounded-[36px] p-6 sm:p-10 flex items-center justify-center overflow-hidden border border-[#FDBA74]/50 bg-gradient-to-br from-[#FFF7ED] via-[#FFF1E7] to-[#FED7AA]/45 shadow-[0_16px_50px_-12px_rgba(234,88,12,0.12)]">
                  {/* Ambient Luminous Glow (Calendly Reference Aura) */}
                  <div
                    className="absolute inset-0 pointer-events-none z-0"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle at 50% 18%, rgba(255, 255, 255, 0.95) 0%, transparent 60%), radial-gradient(circle at 85% 85%, rgba(251, 146, 60, 0.22) 0%, transparent 65%)',
                    }}
                  />

                  {/* Vertical Fluted Equalizer Bars (Calendly Reference Signature) */}
                  <div className="absolute inset-x-6 sm:inset-x-10 top-1/2 -translate-y-1/2 h-44 flex items-center justify-between pointer-events-none opacity-25 z-0">
                    {activeItem.bars.map((h, i) => (
                      <div
                        key={i}
                        className="w-1 sm:w-1.5 bg-[#EA580C] rounded-full transition-all duration-500 ease-out"
                        style={{ height: `${h * 2.2}px` }}
                      />
                    ))}
                  </div>

                  {/* Floating White Metric Card */}
                  <div className="relative z-10 w-full max-w-[420px] rounded-2xl sm:rounded-[24px] bg-white/95 backdrop-blur-md border border-black/[0.06] p-6 sm:p-7 shadow-[0_20px_50px_-12px_rgba(234,88,12,0.16),0_2px_8px_rgba(0,0,0,0.04)] flex flex-col justify-between">
                    {/* Top Row: Premium Line Icon Badge + Kicker Tag */}
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <div className="size-11 rounded-xl bg-[#FFF1E7] border border-[#FDBA74]/50 flex items-center justify-center shadow-xs shrink-0">
                        <activeItem.Icon className="size-5 text-[#EA580C]" strokeWidth={2.2} />
                      </div>

                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold uppercase tracking-wider text-[#EA580C] bg-[#FFF1E7] border border-[#FDBA74]/50">
                        {activeItem.tag}
                      </span>
                    </div>

                    {/* Big Metric Value & Label */}
                    <div className="mb-4">
                      <div className="font-mono text-4xl sm:text-5xl font-bold tracking-tight text-[#0a0a0a] leading-none mb-1.5">
                        {activeItem.stat}
                      </div>
                      <div className="text-sm sm:text-base font-semibold text-neutral-800 tracking-tight">
                        {activeItem.label}
                      </div>
                    </div>

                    {/* Rich Interactive Mockup tailored to the active stat */}
                    <div className="rounded-xl border border-black/[0.06] bg-[#FAFAFA] p-3.5 sm:p-4 mb-4">
                      {activeItem.id === 'time' && (
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[11px] text-neutral-500 uppercase tracking-wider">
                              Active Task
                            </span>
                            <span className="font-mono text-xs font-semibold text-[#EA580C] bg-[#FFF1E7] px-2 py-0.5 rounded border border-[#FDBA74]/40">
                              ₹450 Payout
                            </span>
                          </div>
                          <div className="font-mono text-xs font-semibold text-[#0a0a0a]">
                            Fix OAuth redirect loop on mobile
                          </div>
                          <div className="flex items-center gap-2 pt-1 border-t border-black/[0.05] text-[11px] font-mono text-neutral-500">
                            <Clock className="size-3 text-[#EA580C]" />
                            <span>Avg completion: 45m</span>
                            <span className="ml-auto text-emerald-600 font-semibold">Tier 2 · Lvl 3+</span>
                          </div>
                        </div>
                      )}

                      {activeItem.id === 'payout' && (
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[11px] text-neutral-500 uppercase tracking-wider">
                              UPI Escrow Release
                            </span>
                            <span className="font-mono text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              Verified ✓
                            </span>
                          </div>
                          <div className="font-mono text-2xl font-bold text-[#EA580C]">
                            ₹800.00
                          </div>
                          <div className="flex items-center justify-between pt-1 border-t border-black/[0.05] text-[11px] font-mono text-neutral-500">
                            <span>To: ayushman@upi</span>
                            <span className="text-[#0a0a0a] font-semibold">41s after merge</span>
                          </div>
                        </div>
                      )}

                      {activeItem.id === 'pipeline' && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between pb-1.5 border-b border-black/[0.05]">
                            <span className="font-mono text-[11px] text-neutral-500 uppercase tracking-wider">
                              Automated Gate Check
                            </span>
                            <span className="font-mono text-[11px] text-emerald-600 font-semibold">
                              4/4 Passed
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
                            <div className="flex items-center gap-1.5 text-neutral-700">
                              <Check className="size-3 text-emerald-600 shrink-0" />
                              <span>1. Isolated Build</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-neutral-700">
                              <Check className="size-3 text-emerald-600 shrink-0" />
                              <span>2. 14/14 Tests</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-neutral-700">
                              <Check className="size-3 text-emerald-600 shrink-0" />
                              <span>3. AI Scope Audit</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-neutral-700">
                              <Check className="size-3 text-emerald-600 shrink-0" />
                              <span>4. Human Verdict</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeItem.id === 'levels' && (
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-semibold text-[#0a0a0a]">
                              Ayushman Sen
                            </span>
                            <span className="font-mono text-[11px] font-semibold text-[#EA580C] bg-[#FFF1E7] px-2 py-0.5 rounded border border-[#FDBA74]/40">
                              Rank #42
                            </span>
                          </div>
                          <div>
                            <div className="flex justify-between text-[11px] font-mono text-neutral-500 mb-1">
                              <span>Level 14 → 15</span>
                              <span>3,450 / 4,000 XP</span>
                            </div>
                            <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-[#EA580C] to-[#F97316] w-[86%]" />
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-1 border-t border-black/[0.05] text-[11px] font-mono text-neutral-500">
                            <span>Trust Score: <strong className="text-emerald-600">94% Top Tier</strong></span>
                            <span>Forke Legend Path</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Clean Separator Line & Supporting Note */}
                    <div className="pt-3 border-t border-black/[0.06]">
                      <div className="flex items-center gap-2 font-mono text-xs text-neutral-500">
                        <span className="size-1.5 rounded-full bg-[#EA580C] shrink-0" />
                        <span>{activeItem.note}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Eyebrow + Display Headline + Interactive Item Accordion */}
              <div className="lg:col-span-6 flex flex-col justify-center">
                {/* Desktop Header: Visible only on lg+ screens */}
                <div className="hidden lg:block mb-8">
                  {/* Eyebrow Badge */}
                  <div className="mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00]/25 text-[#FF7A00] font-mono text-xs font-semibold tracking-wider uppercase">
                      <Sparkles className="size-3.5" />
                      <span>002 — Platform Velocity</span>
                    </span>
                  </div>

                  {/* Main Headline (displayFont with zero secondary paragraph) */}
                  <h2
                    className="text-[#0a0a0a] text-3xl sm:text-4xl xl:text-5xl font-normal tracking-tight leading-[1.15]"
                    style={{
                      fontFamily: 'displayFont, "displayFont Fallback", sans-serif',
                      fontWeight: 400,
                    }}
                  >
                    Built for velocity,{' '}
                    <span className="text-[#FF7A00]">
                      backed by code.
                    </span>
                  </h2>
                </div>

                {/* Interactive Vertical Tab Accordion (Calendly Item List) */}
                <div
                  className="space-y-0 divide-y divide-black/[0.08] border-y border-black/[0.08]"
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                >
                  {STAT_ITEMS.map((item) => {
                    const isActive = activeTab === item.id
                    return (
                      <div
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`group relative cursor-pointer py-5 transition-colors duration-200 ${
                          isActive ? '' : 'hover:bg-neutral-50/60'
                        }`}
                      >
                        {/* Header Row: Icon + Title + Arrow Button */}
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3.5">
                            <div
                              className={`size-9 rounded-lg flex items-center justify-center transition-colors duration-200 shrink-0 ${
                                isActive
                                  ? 'bg-[#EA580C] text-white shadow-xs'
                                  : 'bg-neutral-100 text-neutral-500 group-hover:bg-neutral-200 group-hover:text-neutral-800'
                              }`}
                            >
                              <item.Icon
                                className={`size-4.5 ${isActive ? 'text-white' : 'text-neutral-600'}`}
                                strokeWidth={2.2}
                              />
                            </div>

                            <span
                              className={`text-base sm:text-lg font-semibold tracking-tight transition-colors duration-200 ${
                                isActive ? 'text-[#0a0a0a]' : 'text-neutral-600 group-hover:text-neutral-900'
                              }`}
                            >
                              {item.title}
                            </span>
                          </div>

                          {/* Arrow Action Indicator */}
                          <div
                            className={`size-8 rounded-lg flex items-center justify-center transition-colors duration-200 shrink-0 ${
                              isActive
                                ? 'bg-black text-white'
                                : 'bg-transparent text-neutral-400 group-hover:text-neutral-700'
                            }`}
                          >
                            <ArrowUpRight className="size-4" />
                          </div>
                        </div>

                        {/* Expandable Description for Active Item */}
                        {isActive && (
                          <div className="mt-3 pl-[48px] pr-8">
                            <p className="text-sm sm:text-[14.5px] leading-relaxed text-neutral-600">
                              {item.fullDescription}
                            </p>

                            {/* Active orange indicator line (Calendly Signature) */}
                            <div className="mt-4 h-0.5 w-16 bg-[#EA580C] rounded-full" />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
