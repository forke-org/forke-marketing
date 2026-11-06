'use client'

/**
 * @fileoverview Forke Platform - Aside Pillars Section
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 */

import React, { useState } from 'react'
import { ArrowRight, CheckCircle2, GitMerge, ShieldCheck, Zap, Star, Award, Code2, Clock } from 'lucide-react'

export default function PillarsSection() {
  const [activeBenchmark, setActiveBenchmark] = useState<'speed' | 'payout' | 'takehome'>('speed')

  return (
    <section id="pillars" className="mx-auto w-full border-b border-black/[0.08] bg-white">
      <div className="mx-auto w-full max-w-[1536px] px-4 sm:px-6 lg:px-12 xl:px-24">
        <div className="border-x border-black/[0.08] px-6 py-16 sm:px-8 sm:py-20 md:px-14 md:py-28 xl:px-36">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <p className="mb-3">
              <a 
                className="text-accent inline-flex items-center gap-1.5 text-sm font-medium decoration-accent/50 decoration-dotted decoration-2 underline-offset-4 hover:underline md:text-base group" 
                href="#pillars"
              >
                <span>Proof of Work</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </p>
            <h2 className="font-display text-[#0a0a0a] text-3xl sm:text-4xl xl:text-5xl font-bold tracking-tight leading-tight mb-4">
              Anything you can build, <br className="hidden sm:block" />
              you can monetize on Forke.
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed font-normal">
              Unlike traditional freelancing platforms that rely on bidding wars and take 20% commission cuts, Forke gives you verified task specs with 100% escrow-backed payouts. The only wall is your skill.
            </p>
          </div>

          {/* 3 Horizontal Pill Cards (Aside Style) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-16">
            <div className="p-6 rounded-2xl bg-neutral-50/70 border border-neutral-200/80 hover:border-neutral-300 hover:shadow-sm transition-all">
              <div className="size-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4">
                <Code2 className="size-5" />
              </div>
              <h3 className="text-base font-semibold text-[#0a0a0a] mb-2">Real Repositories</h3>
              <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                Work on production codebases across Next.js, TypeScript, Python, and Go. No simulated dummy exercises.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-50/70 border border-neutral-200/80 hover:border-neutral-300 hover:shadow-sm transition-all">
              <div className="size-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4">
                <CheckCircle2 className="size-5" />
              </div>
              <h3 className="text-base font-semibold text-[#0a0a0a] mb-2">Automated CI Gates</h3>
              <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                Pass automated linters and test suites. When CI greenlights your code, client maintainer review is fast-tracked.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-50/70 border border-neutral-200/80 hover:border-neutral-300 hover:shadow-sm transition-all">
              <div className="size-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4">
                <Zap className="size-5" />
              </div>
              <h3 className="text-base font-semibold text-[#0a0a0a] mb-2">Zero Platform Cuts</h3>
              <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                You keep 100% of every bounty you ship. Direct UPI deposit with zero hidden deductions or foreign exchange fees.
              </p>
            </div>
          </div>

          {/* Two Big Bento Feature Blocks (Aside Child 06 Blocks) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Block 1: SOTA Developer Benchmarks */}
            <div className="p-6 sm:p-8 rounded-3xl bg-neutral-50/50 border border-neutral-200 flex flex-col justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#0a0a0a] mb-3 font-display">
                  The SOTA developer marketplace.
                </h3>
                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed mb-6 font-normal">
                  Forke ranks #1 in India for developer merge velocity and verified payouts. Tested on production micro-tasks, surpassing Upwork, Freelancer, and traditional gig boards.
                </p>

                {/* Tab buttons */}
                <div className="flex items-center gap-2 p-1 rounded-xl bg-neutral-200/60 border border-neutral-300/60 w-fit mb-6">
                  <button
                    onClick={() => setActiveBenchmark('speed')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeBenchmark === 'speed' 
                        ? 'bg-white text-black shadow-xs' 
                        : 'text-neutral-600 hover:text-black'
                    }`}
                  >
                    Merge Velocity
                  </button>
                  <button
                    onClick={() => setActiveBenchmark('payout')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeBenchmark === 'payout' 
                        ? 'bg-white text-black shadow-xs' 
                        : 'text-neutral-600 hover:text-black'
                    }`}
                  >
                    Payout Speed
                  </button>
                  <button
                    onClick={() => setActiveBenchmark('takehome')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeBenchmark === 'takehome' 
                        ? 'bg-white text-black shadow-xs' 
                        : 'text-neutral-600 hover:text-black'
                    }`}
                  >
                    Take-Home Rate
                  </button>
                </div>

                {/* Metric Display */}
                <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs">
                  {activeBenchmark === 'speed' && (
                    <div className="space-y-3">
                      <div className="flex items-baseline justify-between">
                        <span className="text-3xl sm:text-4xl font-bold font-mono text-accent">4.2 Hours</span>
                        <span className="text-xs font-mono text-emerald-600 font-semibold">● 7x faster than Upwork</span>
                      </div>
                      <p className="text-xs text-neutral-600 font-sans">
                        Median time from bounty claim to merged PR in production codebases across 2,400+ tasks.
                      </p>
                    </div>
                  )}

                  {activeBenchmark === 'payout' && (
                    <div className="space-y-3">
                      <div className="flex items-baseline justify-between">
                        <span className="text-3xl sm:text-4xl font-bold font-mono text-emerald-600">&lt; 3 Minutes</span>
                        <span className="text-xs font-mono text-accent font-semibold">● Instant UPI</span>
                      </div>
                      <p className="text-xs text-neutral-600 font-sans">
                        Automated UPI webhook triggers immediately when the maintainer merges your PR.
                      </p>
                    </div>
                  )}

                  {activeBenchmark === 'takehome' && (
                    <div className="space-y-3">
                      <div className="flex items-baseline justify-between">
                        <span className="text-3xl sm:text-4xl font-bold font-mono text-[#0a0a0a]">100%</span>
                        <span className="text-xs font-mono text-emerald-600 font-semibold">● Zero Commission</span>
                      </div>
                      <p className="text-xs text-neutral-600 font-sans">
                        You earn ₹1,200? You receive ₹1,200. Startups pay the platform fee, developers keep 100%.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500 font-mono">
                <span>Verified by 20 Rev Ecosystem</span>
                <span className="text-accent font-semibold">Live Production Data</span>
              </div>
            </div>

            {/* Block 2: Memory & Reputation Passport */}
            <div className="p-6 sm:p-8 rounded-3xl bg-neutral-50/50 border border-neutral-200 flex flex-col justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#0a0a0a] mb-3 font-display">
                  Memory that proves what you&apos;ve shipped.
                </h3>
                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed mb-6 font-normal">
                  Forke turns your merged pull requests into an immutable developer passport. No need to rewrite resumes or repeat technical credentials every time.
                </p>

                {/* Profile Card Mockup */}
                <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center font-bold text-accent text-sm">
                        FP
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#0a0a0a]">forke.space/@swayam</div>
                        <div className="text-[11px] text-neutral-500 font-mono">Level 12 · 4,250 XP</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-accent/15 text-accent border border-accent/30 font-semibold">
                      VERIFIED BUILDER
                    </span>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-neutral-200 font-mono text-xs">
                    <div className="flex items-center justify-between text-neutral-600">
                      <span>Merged Pull Requests</span>
                      <span className="font-bold text-[#0a0a0a]">28 PRs</span>
                    </div>
                    <div className="flex items-center justify-between text-neutral-600">
                      <span>Average Review Score</span>
                      <span className="font-bold text-accent">4.9 / 5.0 ★</span>
                    </div>
                    <div className="flex items-center justify-between text-neutral-600">
                      <span>Primary Stacks</span>
                      <span className="text-neutral-800 font-medium">Next.js, TS, Tailwind, Supabase</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500 font-mono">
                <span>Public Profile & Embeds</span>
                <span className="text-emerald-600 font-semibold">Shareable to LinkedIn</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
