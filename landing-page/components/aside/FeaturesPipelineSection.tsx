'use client'

/**
 * @fileoverview Forke Platform - Interactive Features & Pipeline Section
 * Calendly-style interactive tabbed showcase with gradient orange background,
 * displaying Forke's core pipeline ("From claim to cash.") and real task workflow mockups.
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  GitPullRequest,
  Lock,
  Shield,
  Sparkles,
  Terminal,
  Zap,
  Clock,
  Award,
  Wallet,
  Check,
  TrendingUp,
} from 'lucide-react'

interface FeatureTab {
  id: string
  number: string
  title: string
  description: string
  icon: React.ReactNode
  tag: string
}

const FEATURE_TABS: FeatureTab[] = [
  {
    id: 'claim',
    number: '01',
    title: 'Claim scoped bounties',
    description:
      'Browse tasks gated to your skill tier and trust score. Claiming locks the issue exclusively for you — 20 minutes to activate, and nobody can snipe it.',
    icon: <Lock className="size-5" />,
    tag: '30m - 4h',
  },
  {
    id: 'ship',
    number: '02',
    title: 'Automated CI verification',
    description:
      'Work in an isolated Forke branch — never on the owner’s repository. Submit a PR; automated builds, test suites, and AI scope checks verify your code before human review.',
    icon: <GitPullRequest className="size-5" />,
    tag: '4-layer check',
  },
  {
    id: 'payout',
    number: '03',
    title: 'Instant UPI escrow release',
    description:
      'Client founders deposit bounty funds into escrow upfront. The second the maintainer approves and merges your PR, funds release directly to your UPI ID in under 60 seconds.',
    icon: <Zap className="size-5" />,
    tag: '<60s payout',
  },
  {
    id: 'reputation',
    number: '04',
    title: 'Verified XP & proof-of-work',
    description:
      'Climb from L1 bug fixer to L25 repo architect. Every merged pull request mints immutable XP, raises your trust score, and unlocks higher bounty tiers across the platform.',
    icon: <Award className="size-5" />,
    tag: '25 levels',
  },
]

const STAT_METRICS = [
  { value: '30m–4h', label: 'scoped task size', note: 'bite-sized by design' },
  { value: '<60s', label: 'merge → UPI payout', note: 'escrow releases on merge' },
  { value: '4-layer', label: 'review pipeline', note: 'build · tests · ai · human' },
  { value: '25', label: 'levels to climb', note: 'newcomer → forke legend' },
]

export default function FeaturesPipelineSection() {
  const [activeTab, setActiveTab] = useState<string>('claim')
  const [isPaused, setIsPaused] = useState<boolean>(false)

  // Auto-advance tabs every 5s if user hasn't paused/hovered
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setActiveTab((current) => {
        const currentIndex = FEATURE_TABS.findIndex((t) => t.id === current)
        const nextIndex = (currentIndex + 1) % FEATURE_TABS.length
        return FEATURE_TABS[nextIndex].id
      })
    }, 5500)
    return () => clearInterval(timer)
  }, [isPaused])

  return (
    <section id="pipeline" className="mx-auto w-full border-b border-black/[0.08] bg-white">
      <div className="mx-auto w-full max-w-[1536px] px-4 sm:px-6 lg:px-12 xl:px-24">
        <div className="border-x border-black/[0.08]">
          {/* Top Stat Metrics Strip (from user design) */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-b border-black/[0.08] bg-neutral-50/50">
            {STAT_METRICS.map((stat, idx) => (
              <div
                key={stat.label}
                className={`p-6 sm:p-8 ${
                  idx !== 0 ? 'border-t sm:border-t-0 md:border-l border-black/[0.08]' : ''
                } ${idx === 1 ? 'border-l border-black/[0.08] md:border-l' : ''}`}
              >
                <div className="font-mono text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0a0a0a] mb-1.5">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-medium text-neutral-800">
                  {stat.label}
                </div>
                <div className="font-mono text-[11px] text-neutral-500 mt-0.5">
                  {stat.note}
                </div>
              </div>
            ))}
          </div>

          {/* Main 2-Column Showcase (Calendly Style with Gradient Orange Background) */}
          <div className="px-6 py-16 sm:px-8 sm:py-20 md:px-14 md:py-24 xl:px-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Column: Eyebrow + Title + Interactive Tab Accordion List */}
              <div className="lg:col-span-6 flex flex-col justify-center">
                {/* Eyebrow Badge */}
                <div className="mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00]/25 text-[#FF7A00] font-mono text-xs font-semibold tracking-wider uppercase">
                    <Sparkles className="size-3.5" />
                    <span>001 — The Pipeline</span>
                  </span>
                </div>

                {/* Main Headline */}
                <h2 className="font-display text-[#0a0a0a] text-3xl sm:text-4xl xl:text-5xl font-bold tracking-tight leading-[1.15] mb-4">
                  From claim to{' '}
                  <span className="font-serif italic font-normal text-[#FF7A00]">
                    cash.
                  </span>
                </h2>

                {/* Subhead Description */}
                <p className="text-sm sm:text-base text-neutral-600 font-normal leading-relaxed mb-8 max-w-xl">
                  One workflow, three moves. No proposals, no negotiation threads, no invoices — the pipeline does the trust work for you.
                </p>

                {/* Interactive Vertical Tab Accordion */}
                <div
                  className="space-y-0 divide-y divide-black/[0.08] border-y border-black/[0.08]"
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                >
                  {FEATURE_TABS.map((tab) => {
                    const isActive = activeTab === tab.id
                    return (
                      <div
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`group cursor-pointer py-5 transition-all ${
                          isActive ? 'opacity-100' : 'opacity-65 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3.5">
                            <div
                              className={`size-9 rounded-xl flex items-center justify-center transition-colors ${
                                isActive
                                  ? 'bg-[#FF7A00] text-white shadow-sm'
                                  : 'bg-neutral-100 text-neutral-600 group-hover:bg-neutral-200 group-hover:text-black'
                              }`}
                            >
                              {tab.icon}
                            </div>
                            <span
                              className={`text-base sm:text-lg font-semibold tracking-tight transition-colors ${
                                isActive ? 'text-[#0a0a0a]' : 'text-neutral-700 group-hover:text-black'
                              }`}
                            >
                              {tab.title}
                            </span>
                          </div>

                          <div
                            className={`size-8 rounded-lg flex items-center justify-center border transition-all ${
                              isActive
                                ? 'bg-[#0a0a0a] text-white border-black'
                                : 'bg-neutral-50 text-neutral-400 border-neutral-200 group-hover:border-neutral-400 group-hover:text-black'
                            }`}
                          >
                            <ArrowUpRight
                              className={`size-4 transition-transform ${
                                isActive ? 'translate-x-0.5 -translate-y-0.5' : ''
                              }`}
                            />
                          </div>
                        </div>

                        {/* Collapsible Clean Description */}
                        <AnimatePresence initial={false}>
                          {isActive && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden"
                            >
                              <p className="pt-3 pl-12 text-xs sm:text-sm text-neutral-600 font-normal leading-relaxed pr-8">
                                {tab.description}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Right Column: Large Rounded Container with Orange Gradient Background */}
              <div
                className="lg:col-span-6"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <div className="relative rounded-[32px] overflow-hidden p-6 sm:p-10 lg:p-12 min-h-[460px] sm:min-h-[520px] flex items-center justify-center shadow-[0_25px_60px_-15px_rgba(255,90,31,0.28)] border border-[#FF7A00]/20">
                  {/* Multi-stop vibrant Orange Gradient Background Mesh */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FFA756] via-[#FF5A1F] to-[#C23800] z-0" />

                  {/* Soft Radial Luminous Center Glow */}
                  <div
                    className="absolute inset-0 pointer-events-none z-0"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle at 50% 35%, rgba(255, 235, 210, 0.5) 0%, transparent 65%), radial-gradient(circle at 85% 85%, rgba(140, 25, 0, 0.45) 0%, transparent 60%)',
                    }}
                  />

                  {/* Vertical Translucent Glass Stripes (Calendly-style Fluted Columns) */}
                  <div className="absolute inset-0 flex justify-between px-6 pointer-events-none opacity-20 z-0">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-4 sm:w-6 h-full bg-white/40 rounded-full blur-[1px]"
                      />
                    ))}
                  </div>

                  {/* Inner Dynamic Mockup Card (Framer Motion Crossfade) */}
                  <div className="relative z-10 w-full max-w-sm sm:max-w-md">
                    <AnimatePresence mode="wait">
                      {activeTab === 'claim' && (
                        <motion.div
                          key="claim-card"
                          initial={{ opacity: 0, scale: 0.95, y: 12 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -12 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-7 shadow-[0_22px_45px_rgba(0,0,0,0.18)] border border-white/80"
                        >
                          {/* Card Header */}
                          <div className="flex items-start justify-between gap-3 mb-4">
                            <div>
                              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                                Open Micro-Bounty
                              </div>
                              <h3 className="text-base sm:text-lg font-bold text-[#0a0a0a] leading-tight">
                                Fix OAuth redirect loop
                              </h3>
                            </div>
                            <span className="font-mono text-lg font-extrabold text-[#FF5A1F] bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 px-2.5 py-1 rounded-lg shrink-0">
                              ₹450
                            </span>
                          </div>

                          {/* Skill & Tier Badges */}
                          <div className="flex flex-wrap gap-1.5 font-mono text-[11px] text-neutral-600 mb-6">
                            <span className="px-2 py-0.5 rounded bg-neutral-100 border border-neutral-200">
                              react
                            </span>
                            <span className="px-2 py-0.5 rounded bg-neutral-100 border border-neutral-200">
                              tier 2
                            </span>
                            <span className="px-2 py-0.5 rounded bg-neutral-100 border border-neutral-200">
                              lvl 3+
                            </span>
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                              trust 85%+
                            </span>
                          </div>

                          {/* Interactive Claim Action Bar */}
                          <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
                            <button
                              type="button"
                              className="flex-1 bg-[#FF7A00] hover:bg-[#FF6A00] text-white font-mono text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl shadow transition-transform active:scale-[0.98] cursor-pointer"
                            >
                              claim task
                            </button>
                            <div className="flex items-center gap-1 font-mono text-xs font-semibold text-neutral-700 bg-neutral-100 border border-neutral-200 px-3 py-2.5 rounded-xl shrink-0">
                              <Clock className="size-3.5 text-[#FF5A1F]" />
                              <span>19:46</span>
                            </div>
                          </div>

                          {/* Lock Subtext */}
                          <div className="mt-3 flex items-center justify-between font-mono text-[10px] text-neutral-400">
                            <span>locks exclusively for 20m</span>
                            <span className="text-emerald-600 font-medium">anti-sniping active</span>
                          </div>
                        </motion.div>
                      )}

                      {activeTab === 'ship' && (
                        <motion.div
                          key="ship-card"
                          initial={{ opacity: 0, scale: 0.95, y: 12 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -12 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-7 shadow-[0_22px_45px_rgba(0,0,0,0.18)] border border-white/80"
                        >
                          {/* Branch & PR Badge */}
                          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4 font-mono text-xs">
                            <div className="flex items-center gap-1.5 text-neutral-700 font-semibold truncate">
                              <GitPullRequest className="size-3.5 text-[#FF5A1F]" />
                              <span>dev/you/task-2841</span>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold shrink-0">
                              pr #42
                            </span>
                          </div>

                          {/* Automated 4-Layer CI Pipeline Checks */}
                          <div className="space-y-2.5 font-mono text-xs">
                            <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 border border-neutral-150">
                              <span className="text-neutral-600">FORKE_SUBMISSION.md</span>
                              <span className="text-emerald-600 font-bold flex items-center gap-1">
                                found <Check className="size-3 stroke-[3]" />
                              </span>
                            </div>
                            <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 border border-neutral-150">
                              <span className="text-neutral-600">build · next build</span>
                              <span className="text-emerald-600 font-bold flex items-center gap-1">
                                passed <Check className="size-3 stroke-[3]" />
                              </span>
                            </div>
                            <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 border border-neutral-150">
                              <span className="text-neutral-600">tests · 14/14</span>
                              <span className="text-emerald-600 font-bold flex items-center gap-1">
                                passed <Check className="size-3 stroke-[3]" />
                              </span>
                            </div>
                            <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 border border-neutral-150">
                              <span className="text-neutral-600">lint · scope diff</span>
                              <span className="text-emerald-600 font-bold flex items-center gap-1">
                                clean <Check className="size-3 stroke-[3]" />
                              </span>
                            </div>
                            <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 border border-neutral-150">
                              <span className="text-neutral-600">ai review verdict</span>
                              <span className="text-emerald-600 font-bold flex items-center gap-1">
                                approved <Check className="size-3 stroke-[3]" />
                              </span>
                            </div>
                          </div>

                          {/* Verdict Footer */}
                          <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between font-mono text-[11px] text-neutral-500">
                            <span>Ready for 1-click merge</span>
                            <span className="text-neutral-900 font-semibold">0 merge conflicts</span>
                          </div>
                        </motion.div>
                      )}

                      {activeTab === 'payout' && (
                        <motion.div
                          key="payout-card"
                          initial={{ opacity: 0, scale: 0.95, y: 12 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -12 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-7 shadow-[0_22px_45px_rgba(0,0,0,0.18)] border border-white/80"
                        >
                          {/* Escrow Header */}
                          <div className="flex items-center justify-between mb-3 font-mono text-xs">
                            <span className="text-neutral-400 uppercase tracking-wider font-semibold">
                              Escrow Vault Release
                            </span>
                            <span className="flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                              <Check className="size-3 stroke-[3]" /> paid
                            </span>
                          </div>

                          {/* Large Payout Amount */}
                          <div className="font-mono text-3xl sm:text-4xl font-extrabold text-[#FF5A1F] tracking-tight mb-4">
                            ₹800.00
                          </div>

                          {/* Payout Details */}
                          <div className="space-y-2 font-mono text-xs border-y border-neutral-100 py-3.5 mb-4">
                            <div className="flex justify-between text-neutral-600">
                              <span>to UPI</span>
                              <span className="text-[#0a0a0a] font-semibold">ayushman@upi</span>
                            </div>
                            <div className="flex justify-between text-neutral-600">
                              <span>after merge</span>
                              <span className="text-neutral-900 font-semibold">41s (instant)</span>
                            </div>
                            <div className="flex justify-between text-neutral-600">
                              <span>xp earned</span>
                              <span className="text-[#FF5A1F] font-bold">+150 XP</span>
                            </div>
                          </div>

                          {/* Bank Webhook UTR */}
                          <div className="flex items-center justify-between font-mono text-[10px] text-neutral-400">
                            <span>UTR: FKT-982418772</span>
                            <span className="text-neutral-700 font-medium">UPI · Instant</span>
                          </div>
                        </motion.div>
                      )}

                      {activeTab === 'reputation' && (
                        <motion.div
                          key="reputation-card"
                          initial={{ opacity: 0, scale: 0.95, y: 12 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -12 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-7 shadow-[0_22px_45px_rgba(0,0,0,0.18)] border border-white/80"
                        >
                          {/* Profile Header */}
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <div className="text-base font-bold text-[#0a0a0a]">
                                Ayushman Sen
                              </div>
                              <div className="text-xs font-mono text-neutral-500">
                                Level 14 · Full-Stack Specialist
                              </div>
                            </div>
                            <span className="px-2.5 py-1 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00]/25 text-[#FF7A00] font-mono text-xs font-bold">
                              Rank #42
                            </span>
                          </div>

                          {/* Trust Score & Lifetime Payout */}
                          <div className="grid grid-cols-2 gap-2.5 mb-4 font-mono text-xs">
                            <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-150">
                              <div className="text-neutral-400 text-[10px] uppercase">
                                Trust Score
                              </div>
                              <div className="text-base font-bold text-emerald-600 mt-0.5">
                                94% Top Tier
                              </div>
                            </div>
                            <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-150">
                              <div className="text-neutral-400 text-[10px] uppercase">
                                Lifetime Paid
                              </div>
                              <div className="text-base font-bold text-[#0a0a0a] mt-0.5">
                                ₹18,400.00
                              </div>
                            </div>
                          </div>

                          {/* Level Progress Bar */}
                          <div className="font-mono text-xs mb-1.5 flex justify-between text-neutral-600">
                            <span>Level 14 → 15</span>
                            <span className="font-bold text-[#FF5A1F]">3,450 / 4,000 XP</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden mb-3">
                            <div
                              className="h-full bg-gradient-to-r from-[#FFA048] to-[#FF5A1F] rounded-full"
                              style={{ width: '86%' }}
                            />
                          </div>

                          {/* Milestone notice */}
                          <div className="font-mono text-[11px] text-neutral-500 pt-2 border-t border-neutral-100 flex items-center justify-between">
                            <span>Next: L15 Core Architecture Bounties</span>
                            <span className="text-[#FF5A1F] font-semibold">₹10,000+</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
