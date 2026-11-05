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
    <section id="pillars" className="mx-auto w-full border-b border-white/15">
      <div className="mx-auto w-full max-w-[1536px] px-4 sm:px-6 lg:px-12 xl:px-24">
        <div className="border-x border-white/15 px-6 py-16 sm:px-8 sm:py-20 md:px-14 md:py-28 xl:px-36">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <p className="mb-3">
              <a 
                className="text-brand-content inline-flex items-center gap-1.5 text-sm font-medium decoration-accent/50 decoration-dotted decoration-2 underline-offset-4 hover:underline md:text-base group" 
                href="#pillars"
              >
                <span>Proof of Work</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </p>
            <h2 className="font-display text-white text-3xl sm:text-4xl xl:text-5xl font-bold tracking-tight leading-tight mb-4">
              Anything you can build, <br className="hidden sm:block" />
              you can monetize on Forke.
            </h2>
            <p className="text-base sm:text-lg text-white/60 leading-relaxed font-normal">
              Unlike traditional freelancing platforms that rely on bidding wars and take 20% commission cuts, Forke gives you verified task specs with 100% escrow-backed payouts. The only wall is your skill.
            </p>
          </div>

          {/* 3 Horizontal Pill Cards (Aside Style) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-16">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/15 transition-all">
              <div className="size-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4">
                <Code2 className="size-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Real Repositories</h3>
              <p className="text-sm text-white/60 leading-relaxed font-normal">
                Work on production codebases across Next.js, TypeScript, Python, and Go. No simulated dummy exercises.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/15 transition-all">
              <div className="size-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4">
                <CheckCircle2 className="size-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Automated CI Gates</h3>
              <p className="text-sm text-white/60 leading-relaxed font-normal">
                Pass automated linters and test suites. When CI greenlights your code, client maintainer review is fast-tracked.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/15 transition-all">
              <div className="size-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4">
                <Zap className="size-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Zero Platform Cuts</h3>
              <p className="text-sm text-white/60 leading-relaxed font-normal">
                You keep 100% of every bounty you ship. Direct UPI deposit with zero hidden deductions or foreign exchange fees.
              </p>
            </div>
          </div>

          {/* Two Big Bento Feature Blocks (Aside Child 06 Blocks) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Block 1: SOTA Developer Benchmarks */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-display">
                  The SOTA developer marketplace.
                </h3>
                <p className="text-sm sm:text-base text-white/60 leading-relaxed mb-6 font-normal">
                  Forke ranks #1 in India for developer merge velocity and verified payouts. Tested on production micro-tasks, surpassing Upwork, Freelancer, and traditional gig boards.
                </p>

                {/* Tab buttons */}
                <div className="flex items-center gap-2 p-1 rounded-xl bg-black/40 border border-white/10 w-fit mb-6">
                  <button
                    onClick={() => setActiveBenchmark('speed')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeBenchmark === 'speed' 
                        ? 'bg-white text-black shadow' 
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Merge Velocity
                  </button>
                  <button
                    onClick={() => setActiveBenchmark('payout')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeBenchmark === 'payout' 
                        ? 'bg-white text-black shadow' 
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Payout Speed
                  </button>
                  <button
                    onClick={() => setActiveBenchmark('takehome')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeBenchmark === 'takehome' 
                        ? 'bg-white text-black shadow' 
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Take-Home Rate
                  </button>
                </div>

                {/* Metric Display */}
                <div className="p-6 rounded-2xl bg-black/50 border border-white/10">
                  {activeBenchmark === 'speed' && (
                    <div className="space-y-3">
                      <div className="flex items-baseline justify-between">
                        <span className="text-3xl sm:text-4xl font-bold font-mono text-accent">4.2 Hours</span>
                        <span className="text-xs font-mono text-emerald-400">● 7x faster than Upwork</span>
                      </div>
                      <p className="text-xs text-white/60 font-sans">
                        Median time from bounty claim to merged PR in production codebases across 2,400+ tasks.
                      </p>
                    </div>
                  )}

                  {activeBenchmark === 'payout' && (
                    <div className="space-y-3">
                      <div className="flex items-baseline justify-between">
                        <span className="text-3xl sm:text-4xl font-bold font-mono text-emerald-400">&lt; 3 Minutes</span>
                        <span className="text-xs font-mono text-accent">● Instant UPI</span>
                      </div>
                      <p className="text-xs text-white/60 font-sans">
                        Automated UPI webhook triggers immediately when the maintainer merges your PR.
                      </p>
                    </div>
                  )}

                  {activeBenchmark === 'takehome' && (
                    <div className="space-y-3">
                      <div className="flex items-baseline justify-between">
                        <span className="text-3xl sm:text-4xl font-bold font-mono text-white">100%</span>
                        <span className="text-xs font-mono text-emerald-400">● Zero Commission</span>
                      </div>
                      <p className="text-xs text-white/60 font-sans">
                        You earn ₹1,200? You receive ₹1,200. Startups pay the platform fee, developers keep 100%.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-white/40 font-mono">
                <span>Verified by 20 Rev Ecosystem</span>
                <span className="text-accent">Live Production Data</span>
              </div>
            </div>

            {/* Block 2: Memory & Reputation Passport */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-display">
                  Memory that proves what you've shipped.
                </h3>
                <p className="text-sm sm:text-base text-white/60 leading-relaxed mb-6 font-normal">
                  Forke turns your merged pull requests into an immutable developer passport. No need to rewrite resumes or repeat technical credentials every time.
                </p>

                {/* Profile Card Mockup */}
                <div className="p-5 rounded-2xl bg-black/50 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center font-bold text-accent text-sm">
                        FP
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">forke.space/@swayam</div>
                        <div className="text-[11px] text-white/50 font-mono">Level 12 · 4,250 XP</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-accent/15 text-accent border border-accent/30 font-semibold">
                      VERIFIED BUILDER
                    </span>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/[0.06] font-mono text-xs">
                    <div className="flex items-center justify-between text-white/70">
                      <span>Merged Pull Requests</span>
                      <span className="font-bold text-white">28 PRs</span>
                    </div>
                    <div className="flex items-center justify-between text-white/70">
                      <span>Average Review Score</span>
                      <span className="font-bold text-accent">4.9 / 5.0 ★</span>
                    </div>
                    <div className="flex items-center justify-between text-white/70">
                      <span>Primary Stacks</span>
                      <span className="text-white/90">Next.js, TS, Tailwind, Supabase</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-white/40 font-mono">
                <span>Public Profile & Embeds</span>
                <span className="text-emerald-400">Shareable to LinkedIn</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
