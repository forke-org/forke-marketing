'use client'

/**
 * @fileoverview Forke Platform - Level System & Progression
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

import React, { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils/cn'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowRight, Zap, Coins, Award, Sparkles, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import { Eyebrow, H2 } from '@/components/landing/primitives'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export interface LevelTier {
  id: string
  lvl: string
  tierNumber: string
  label: string
  title: string
  badgeName: string
  tagline: string
  xpMultiplier: string
  xpPerTask: string
  pointsEarned: string
  bountyRange: string
  xpRequired: string
  tasks: string
  description: string
  perks: string[]
  image: string
  imgClass: string
  color: string
}

const LEVELS: LevelTier[] = [
  {
    id: 'starter',
    lvl: '1–5',
    tierNumber: '01',
    label: 'Early Game',
    title: 'Newcomer to Stack Explorer',
    badgeName: 'Newcomer Forky',
    tagline: 'Initialize your developer journey with clean git hygiene and starter bug fixes.',
    xpMultiplier: '1.0x XP',
    xpPerTask: '+100 – 350 XP',
    pointsEarned: '50 – 100 Pts / task',
    bountyRange: '₹200 – ₹500',
    xpRequired: '0 – 1,500 Total XP',
    tasks: 'HTML/CSS, Basic Bug Fixes, Documentation & Tests',
    description: 'Ship verified PRs, master branch hygiene, and pass automated CI checks. Starter bounties test your attention to detail and establish your immutable proof of work.',
    perks: [
      'Unlock public community bounties',
      'Claim your public developer profile URL (LVL 3)',
      'Eligible for team-based task applications (LVL 5)',
      'Instant UPI payout upon PR merge verification'
    ],
    image: '/forke-assets/landing-assets/newcomer_forky.webp',
    imgClass: 'scale-[0.98] -translate-y-2',
    color: '#FF7A00',
  },
  {
    id: 'bronze',
    lvl: '6–10',
    tierNumber: '02',
    label: 'Mid Game',
    title: 'Code Runner to Sprint Soldier',
    badgeName: 'Apprentice Forky',
    tagline: 'Velocity, reactivity & modular component state.',
    xpMultiplier: '1.2x XP',
    xpPerTask: '+400 – 900 XP',
    pointsEarned: '150 – 350 Pts / task',
    bountyRange: '₹500 – ₹1,200',
    xpRequired: '1,500 – 6,000 Total XP',
    tasks: 'React Components, CSS Logic, State Hooks & API Integrations',
    description: 'Deliver production-ready front-end components and clean state flows. Developers at this tier ship fast, maintain high test coverage, and unlock streak multipliers.',
    perks: [
      'Access to intermediate payout bounty pools',
      'XP streak multipliers activated on daily merges (LVL 10)',
      'Warm standby queue access for high-demand tasks',
      'Peer review eligibility on open community PRs'
    ],
    image: '/forke-assets/landing-assets/apprentice_forky.webp',
    imgClass: 'scale-[1.12] -translate-y-1',
    color: '#FF8A00',
  },
  {
    id: 'silver',
    lvl: '11–15',
    tierNumber: '03',
    label: 'Skilled Tier',
    title: 'Merge Specialist to Feature Shipper',
    badgeName: 'Builder Forky',
    tagline: 'End-to-end full stack execution with minimal review cycles.',
    xpMultiplier: '1.5x XP',
    xpPerTask: '+1,000 – 2,500 XP',
    pointsEarned: '450 – 900 Pts / task',
    bountyRange: '₹1,200 – ₹3,000',
    xpRequired: '6,000 – 18,000 Total XP',
    tasks: 'Full-stack Features, API Endpoints, DB Schema Migrations',
    description: 'Own complex end-to-end features spanning server routes, database migrations, and responsive clients. Your code gets approved on the first pass with zero regressions.',
    perks: [
      'Priority task queue & 30-minute early claim window (LVL 12)',
      'Elite bounty tier eligibility on production features (LVL 15)',
      'Reviewer pathway entry with revenue-share review fees',
      'Direct client communication channel on assigned tasks'
    ],
    image: '/forke-assets/landing-assets/builder_forky.webp',
    imgClass: '[transform:scale(-1,1)] -translate-y-1 translate-x-2',
    color: '#FFA200',
  },
  {
    id: 'gold',
    lvl: '16–20',
    tierNumber: '04',
    label: 'Elite Tier',
    title: 'Runtime Knight to Production Slayer',
    badgeName: 'Expert Forky',
    tagline: 'High-stakes microservices, distributed locking & security hardening.',
    xpMultiplier: '2.0x XP',
    xpPerTask: '+3,000 – 7,500 XP',
    pointsEarned: '1,200 – 2,800 Pts / task',
    bountyRange: '₹3,000 – ₹8,000',
    xpRequired: '18,000 – 45,000 Total XP',
    tasks: 'System Architecture, Database Bottlenecks, Security Clearance',
    description: 'Trusted by partner startups to eliminate high-concurrency race conditions, diagnose deadlocks, and patch vulnerabilities. You act as a lead engineer on critical bounties.',
    perks: [
      'Team lead eligibility & bounty pod management (LVL 18)',
      'Exclusive platform mentor access & engineering AMAs (LVL 20)',
      'Advanced production repository security clearance',
      'Top priority on instant manual review & express UPI transfer'
    ],
    image: '/forke-assets/landing-assets/expert_forky.webp',
    imgClass: 'scale-[1.05] -translate-y-1.5',
    color: '#FF7A00',
  },
  {
    id: 'legend',
    lvl: '21–25',
    tierNumber: '05',
    label: 'Legend Tier',
    title: 'Silicon Phantom to Forke Legend',
    badgeName: 'Architect Forky',
    tagline: 'The vanguard of engineering talent. Mission-critical infrastructure.',
    xpMultiplier: '2.5x XP',
    xpPerTask: '+8,000 – 20,000+ XP',
    pointsEarned: '3,500+ Pts / task',
    bountyRange: '₹8,000+',
    xpRequired: '45,000+ Total XP',
    tasks: 'Performance at Scale, Cloud DevOps, Distributed Systems & Compilers',
    description: 'The top tier of developers worldwide. You solve distributed systems bottlenecks, design cloud architectures, and handle zero-downtime database transformations.',
    perks: [
      'Private invite-only bounty allocations from high-growth tech companies',
      'Prestige reset options with permanent multiplier buffs',
      'Commit Warlord status badge & verified on-chain credentials',
      'Direct founder advisory access & high-value contract placement'
    ],
    image: '/forke-assets/landing-assets/architect_forky.webp',
    imgClass: '[transform:scale(-1,1)] -translate-y-1 translate-x-2',
    color: '#FF4500',
  },
]

export default function LevelSystem() {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const router = useRouter()
  const [activeIndex, setActiveIndex] = useState(0)

  // GSAP ScrollTrigger to track which card is active as user scrolls through the right column
  useGSAP(() => {
    const triggers: ScrollTrigger[] = []

    cardRefs.current.forEach((el, index) => {
      if (!el) return
      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top 55%',
        end: 'bottom 45%',
        onEnter: () => setActiveIndex(index),
        onEnterBack: () => setActiveIndex(index),
      })
      triggers.push(st)
    })

    return () => {
      triggers.forEach((t) => t.kill())
    }
  }, { scope: containerRef })

  const scrollToTier = (index: number) => {
    setActiveIndex(index)
    const target = cardRefs.current[index]
    if (target) {
      const yOffset = -120
      const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  const currentLevel = LEVELS[activeIndex] || LEVELS[0]

  return (
    <section
      ref={containerRef}
      id="levels"
      className="py-16 md:py-24 px-5 md:px-10 bg-transparent relative"
    >
      {/* Background Radial Atmosphere */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_center,_rgba(255,122,0,0.06)_0%,_transparent_70%)] pointer-events-none blur-2xl" />

      {/* Top Header */}
      <div className="max-w-7xl mx-auto mb-12 md:mb-16">
        <div className="max-w-2xl space-y-4">
          <Eyebrow label="progression" />
          <H2 accent="legend." className="mt-0">
            Script kiddie to
          </H2>
          <p className="text-white/60 text-base md:text-lg font-normal leading-relaxed">
            Completing tasks earns XP. XP increases your level. Higher levels unlock larger bounties,
            better opportunities, and exclusive platform privileges. Consistency is rewarded—the more you ship, the faster you ascend.
          </p>
          <div className="pt-2">
            <Button
              size="lg"
              onClick={() => router.push('/levels')}
              className="group gap-2 h-11 px-6 rounded-lg bg-accent hover:bg-accent-hover text-[#0a0a0a] text-sm font-semibold tracking-tight shadow-none transition-colors"
            >
              Explore all 25 levels <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Header (< lg screens) */}
      <div className="lg:hidden sticky top-16 z-30 mb-8 -mx-2 px-2">
        <div className="rounded-2xl border border-white/10 bg-[#08080c]/95 backdrop-blur-md p-3.5 shadow-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
              <Image
                src={currentLevel.image}
                alt={currentLevel.badgeName}
                width={44}
                height={44}
                className="object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-accent bg-accent/15 border border-accent/30 px-2 py-0.5 rounded-full">
                  LVL {currentLevel.lvl}
                </span>
                <span className="text-[10px] font-mono text-white/50">
                  {currentLevel.xpMultiplier}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white tracking-tight mt-0.5">
                {currentLevel.label}
              </h4>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-mono text-white/40 uppercase">Bounty</div>
            <div className="text-sm font-bold font-mono text-accent">{currentLevel.bountyRange}</div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="max-w-7xl mx-auto relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start min-[1920px]:max-w-[1920px]">

        {/* LEFT COLUMN: Sticky Badge Card (Badge, Name of Badge, and LVL) */}
        <div className="hidden lg:block lg:col-span-5 lg:sticky lg:top-28 self-start z-20">
          <div className="relative rounded-3xl border border-white/10 bg-[#0a0a0f]/90 backdrop-blur-xl p-7 xl:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden transition-all duration-500">
            {/* Ambient Background Aura */}
            <div
              className="absolute -top-24 -left-24 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all duration-700 opacity-20"
              style={{ background: currentLevel.color }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(255,122,0,0.08)_0%,_transparent_65%)] pointer-events-none" />

            {/* Top Bar: LVL Indicator & Tier Index */}
            <div className="flex items-center justify-between relative z-10 pb-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono font-bold text-accent bg-accent/10 border border-accent/40 px-3 py-1 rounded-full uppercase tracking-wider shadow-[0_0_12px_rgba(255,122,0,0.2)]">
                  LVL {currentLevel.lvl}
                </span>
                <span className="text-xs font-mono text-white/60 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full font-medium">
                  {currentLevel.xpMultiplier}
                </span>
              </div>
              <span className="text-[11px] font-mono text-white/40 tracking-widest uppercase">
                TIER {currentLevel.tierNumber} / 05
              </span>
            </div>

            {/* Badge Mascot Stage */}
            <div className="relative my-6 h-[260px] xl:h-[300px] w-full flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/[0.04]">
              {/* Radial glow spotlight behind Forky */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,122,0,0.18)_0%,_transparent_65%)] pointer-events-none" />

              {/* Crossfading mascot badges */}
              {LEVELS.map((tier, idx) => {
                const isActive = idx === activeIndex
                return (
                  <div
                    key={tier.id}
                    className={cn(
                      'absolute inset-0 flex items-center justify-center p-4 transition-all duration-500 ease-out',
                      isActive
                        ? 'opacity-100 scale-100 translate-y-0 filter-none pointer-events-auto'
                        : idx < activeIndex
                        ? 'opacity-0 scale-95 -translate-y-6 pointer-events-none'
                        : 'opacity-0 scale-95 translate-y-6 pointer-events-none'
                    )}
                  >
                    <div className={cn('relative w-full h-full flex items-center justify-center', tier.imgClass)}>
                      <Image
                        src={tier.image}
                        alt={tier.badgeName}
                        fill
                        sizes="400px"
                        className="object-contain object-center drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)] select-none"
                        priority={idx === 0}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Name of Badge & Titles */}
            <div className="space-y-2 relative z-10">
              <div className="flex items-baseline justify-between">
                <h3 className="text-2xl xl:text-3xl font-bold text-white tracking-tight">
                  {currentLevel.label}
                </h3>
                <span className="text-xs font-mono font-bold text-accent">
                  {currentLevel.bountyRange}
                </span>
              </div>

              <p className="text-xs xl:text-sm font-mono text-accent/90 font-medium">
                {currentLevel.title}
              </p>

              <p className="text-xs text-white/50 leading-relaxed pt-1">
                {currentLevel.tagline}
              </p>
            </div>

            {/* Interactive Tier Progress Bar / Quick Links */}
            <div className="mt-6 pt-5 border-t border-white/[0.08] relative z-10">
              <div className="text-[10px] font-mono text-white/35 uppercase tracking-widest mb-2.5 flex items-center justify-between">
                <span>Progression Track</span>
                <span className="text-accent/80">Select to jump</span>
              </div>
              <div className="flex items-center gap-1.5">
                {LEVELS.map((tier, idx) => {
                  const isSelected = idx === activeIndex
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => scrollToTier(idx)}
                      className={cn(
                        'flex-1 py-1.5 px-1 rounded-md transition-all text-center flex flex-col items-center gap-1 cursor-pointer',
                        isSelected ? 'bg-accent/15' : 'hover:bg-white/5'
                      )}
                    >
                      <div
                        className={cn(
                          'h-1.5 w-full rounded-full transition-all duration-300',
                          isSelected
                            ? 'bg-accent shadow-[0_0_8px_rgba(255,122,0,0.8)]'
                            : 'bg-white/20 hover:bg-white/40'
                        )}
                      />
                      <span
                        className={cn(
                          'text-[9px] font-mono transition-colors',
                          isSelected ? 'text-accent font-bold' : 'text-white/40 hover:text-white/70'
                        )}
                      >
                        T{tier.tierNumber}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Scrolling Stream (Points & XP Earn) */}
        <div className="lg:col-span-7 space-y-12 md:space-y-16">
          {LEVELS.map((tier, idx) => {
            const isActive = idx === activeIndex
            return (
              <div
                key={tier.id}
                ref={(el) => {
                  cardRefs.current[idx] = el
                }}
                className={cn(
                  'relative rounded-3xl border p-6 sm:p-8 transition-all duration-500 overflow-hidden',
                  isActive
                    ? 'border-accent/40 bg-[#0d0d14]/95 shadow-[0_20px_50px_rgba(255,122,0,0.12),_inset_0_1px_0_rgba(255,122,0,0.15)] ring-1 ring-accent/20'
                    : 'border-white/[0.08] bg-[#09090d]/70 hover:border-white/20'
                )}
              >
                {/* Active Card Subtle Radiant Ambient */}
                <div
                  className={cn(
                    'absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle_at_top_right,_rgba(255,122,0,0.1)_0%,_transparent_70%)] pointer-events-none transition-opacity duration-700',
                    isActive ? 'opacity-100' : 'opacity-0'
                  )}
                />

                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-white/[0.06] relative z-10">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent font-bold">
                      LVL {tier.lvl}
                    </span>
                    <span className="text-xs font-mono text-white/50 tracking-wider">
                      TIER {tier.tierNumber} // {tier.label.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-accent font-semibold bg-accent/15 px-3 py-1 rounded-full border border-accent/40 shadow-[0_0_12px_rgba(255,122,0,0.2)] flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      {tier.xpMultiplier} Multiplier
                    </span>
                  </div>
                </div>

                {/* Headline & Narrative */}
                <div className="pt-5 space-y-2 relative z-10">
                  <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {tier.title}
                  </h4>
                  <p className="text-sm text-white/60 leading-relaxed font-normal">
                    {tier.description}
                  </p>
                </div>

                {/* === POINTS AND XP EARN SHOWCASE === */}
                <div className="my-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] p-4 sm:p-5 relative z-10">
                  <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-semibold mb-3.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5 text-accent" />
                      Points & Earnings Breakdown
                    </span>
                    <span className="text-accent/80 font-normal">Instant Verified Settlement</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3.5">
                    {/* XP Per Task */}
                    <div className="p-3 sm:p-3.5 rounded-xl bg-black/40 border border-white/[0.05] flex flex-col justify-between">
                      <div className="text-[10px] font-mono text-white/40 uppercase">XP Earned</div>
                      <div className="text-base sm:text-lg font-bold font-mono text-white mt-1">
                        {tier.xpPerTask}
                      </div>
                      <div className="text-[10px] text-accent/80 font-mono mt-1">Per merged PR</div>
                    </div>

                    {/* Platform Points */}
                    <div className="p-3 sm:p-3.5 rounded-xl bg-black/40 border border-white/[0.05] flex flex-col justify-between">
                      <div className="text-[10px] font-mono text-white/40 uppercase">Platform Points</div>
                      <div className="text-base sm:text-lg font-bold font-mono text-white mt-1">
                        {tier.pointsEarned}
                      </div>
                      <div className="text-[10px] text-white/40 font-mono mt-1">Karma score</div>
                    </div>

                    {/* Cash Bounty */}
                    <div className="p-3 sm:p-3.5 rounded-xl bg-black/40 border border-accent/25 bg-accent/[0.03] flex flex-col justify-between">
                      <div className="text-[10px] font-mono text-accent/80 uppercase">Cash Bounty</div>
                      <div className="text-base sm:text-lg font-bold font-mono text-accent mt-1">
                        {tier.bountyRange}
                      </div>
                      <div className="text-[10px] text-white/40 font-mono mt-1">Direct UPI transfer</div>
                    </div>

                    {/* Tier XP Target */}
                    <div className="p-3 sm:p-3.5 rounded-xl bg-black/40 border border-white/[0.05] flex flex-col justify-between">
                      <div className="text-[10px] font-mono text-white/40 uppercase">Ascend Target</div>
                      <div className="text-base sm:text-lg font-bold font-mono text-white mt-1">
                        {tier.xpRequired}
                      </div>
                      <div className="text-[10px] text-white/40 font-mono mt-1">Milestone unlock</div>
                    </div>
                  </div>
                </div>

                {/* Task Focus & Scope */}
                <div className="space-y-1.5 pb-3 relative z-10">
                  <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-semibold">
                    Task Focus & Eligible Scope
                  </div>
                  <div className="text-xs sm:text-sm font-mono text-white/80 bg-white/[0.025] px-3.5 py-2.5 rounded-xl border border-white/[0.05]">
                    {tier.tasks}
                  </div>
                </div>

                {/* Platform Unlocks */}
                <div className="space-y-2.5 pt-4 border-t border-white/[0.06] relative z-10">
                  <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-accent" />
                    Platform Privileges Unlocked
                  </div>
                  <ul className="grid sm:grid-cols-2 gap-2.5">
                    {tier.perks.map((perk, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2 text-xs text-white/70">
                        <span className="text-accent text-xs mt-0.5 select-none">✦</span>
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
