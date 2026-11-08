'use client'

/**
 * @fileoverview Forke Platform - Aside Reimagined Hero
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 */

import React, { useState } from 'react'
import Image from 'next/image'
import { ArrowRight, CheckCircle2, ChevronDown, ChevronRight, Download, GitPullRequest, RotateCcw, Terminal, Zap, Shield, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Rev20Logo } from '@/components/ui/Rev20Logo'

export default function HeroCard() {
  const [activeTab, setActiveTab] = useState<'terminal' | 'diff' | 'payout'>('terminal')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const marketingUrl = process.env.NEXT_PUBLIC_MARKETING_URL || 'https://www.forke.space'
  const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL || 'https://dashboard.forke.space'

  const navLinks = [
    { name: 'whats-forke', href: `${marketingUrl}/whats-forke` },
    { name: 'levels', href: `${marketingUrl}/levels` },
    { name: 'blogs', href: `${marketingUrl}/blogs` },
    { name: 'contact-us', href: `${marketingUrl}/contact` },
  ]

  const handleCtaClick = () => {
    window.location.href = `${marketingUrl}/waitlist`
  }

  return (
    <div id="hero-section" className="p-2 pb-0 sm:p-3 sm:pb-0 md:p-4 md:pb-0 w-full relative z-20">
      {/* Ambient drop shadow under the hero card onto the white section below (Aside style) */}
      <div className="absolute -bottom-4 inset-x-8 sm:inset-x-16 h-12 bg-black/25 blur-2xl pointer-events-none z-0" />

      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-[#0b0c10] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] border border-white/10 z-10">
        {/* Ambient Video Background (WebM looping animated background) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/forke-assets/landing-assets/hero-bg.webp"
          className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none z-0"
        >
          <source src="/forke-assets/landing-assets/hero-bg.webm" type="video/webm" />
        </video>

        {/* Subtle dark gradient overlay to ensure perfect contrast for both dark and bright areas */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/85 pointer-events-none z-[1]" />

        {/* Deep shadow in the down area of the video background (Aside style) */}
        <div className="absolute inset-x-0 bottom-0 h-72 sm:h-96 bg-gradient-to-t from-black via-black/70 to-transparent pointer-events-none z-[2]" />
        <div className="absolute inset-x-0 bottom-0 h-36 sm:h-48 bg-gradient-to-t from-black/95 to-transparent pointer-events-none z-[2]" />

        {/* Inner Border Ring */}
        <div className="pointer-events-none absolute inset-0 z-20 rounded-2xl md:rounded-3xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]" />

        {/* TOP NAVBAR (embedded inside Hero card like Aside) */}
        <nav className="relative z-30 flex h-14 md:h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <a href="#" className="select-none flex items-center gap-2 group cursor-pointer">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-md">
              forke<span className="text-accent">*</span>
            </span>
          </a>

          {/* Nav Links */}
          <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:gap-10 font-mono text-xs sm:text-sm text-white/70 md:flex">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a 
                  href={link.href} 
                  className="transition-colors hover:text-white drop-shadow-sm font-medium"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>

          {/* Right spacer (Get Started removed from landing page navbar per user request) */}
          <div className="hidden md:flex items-center w-10" />

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white flex size-9 items-center justify-center rounded-lg bg-black/40 backdrop-blur-md border border-white/10"
            aria-label="Toggle menu"
          >
            <span className="text-lg leading-none">☰</span>
          </button>
        </nav>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="relative z-30 md:hidden px-4 pb-4">
            <div className="rounded-xl bg-black/85 backdrop-blur-xl border border-white/10 p-4 space-y-3 font-mono">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-sm font-medium text-white/80 hover:text-white py-1"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* HERO HEADER */}
        <header className="relative z-10 pt-10 pb-12 sm:pt-14 sm:pb-16 text-center px-4 max-w-5xl mx-auto">
          {/* Eyebrow Badge Pill */}
          <a
            href="https://20rev.com/?source=forke.space"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/35 backdrop-blur-md px-3.5 py-1 text-xs font-medium tracking-wide text-white/90 hover:bg-black/50 transition-colors shadow-sm group"
          >
            <Rev20Logo className="h-3 w-auto text-white/90 shrink-0" />
            <span>Supported by 20 Rev</span>
            <ChevronRight className="size-3 opacity-50 -ml-0.5 group-hover:translate-x-0.5 transition-transform" />
          </a>

          {/* Main Display Headline */}
          <h1
            className="hero-display-headline text-white mb-8 drop-shadow-xl"
            style={{
              fontFamily: 'displayFont, "displayFont Fallback"',
              fontWeight: 400,
              textAlign: 'center',
            }}
          >
            Ship real work. <br />
            Earn XP.{' '}
            <span className="relative inline-block">
              Get paid.
              {/* Orange Scribble Underline */}
              <svg
                aria-hidden="true"
                viewBox="0 0 255 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                className="absolute -bottom-2 sm:-bottom-2.5 left-0 w-full h-3 sm:h-4 text-accent pointer-events-none drop-shadow-[0_2px_8px_rgba(255,122,0,0.45)]"
              >
                <path
                  d="M4 14.5C55 5 135 4 251 10.5M16 19.5C82 12.5 178 10.5 245 16.5"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </h1>

          {/* CTA Button (Single 'Get started ->' button, no hover state) */}
          <div className="flex items-center justify-center">
            <button
              onClick={handleCtaClick}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-black px-6 py-3 text-sm font-semibold tracking-tight shadow-xl cursor-pointer"
            >
              <span>Get started</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        </header>

        {/* HERO PRODUCT STAGE / PROMO SHOWCASE FRAME (Aside 832px sizing & pixel-aligned grid lines) */}
        <div className="relative z-10 -mb-20 sm:-mb-24 md:-mb-28 w-full px-2 sm:px-3 lg:px-8 xl:px-20">
          <div className="relative w-full h-[832px] max-[1441px]:h-[740px] max-[1281px]:h-[700px] max-[1241px]:h-[640px] max-[641px]:h-[500px] overflow-hidden select-none">
            <div className="max-w-[1344px] w-full mx-auto h-[740px] max-[1441px]:h-[680px] max-[1281px]:h-[640px] max-[1241px]:h-[580px] max-[641px]:h-[460px] rounded-t-xl overflow-hidden shadow-[0_-20px_50px_rgba(0,0,0,0.6)] border-t border-x border-white/15 bg-[#0b0c10]/95 backdrop-blur-2xl relative flex flex-col pb-8 sm:pb-10">
              {/* Top Mockup Window Chrome (42px like Aside) */}
              <div className="h-10 sm:h-11 border-b border-white/10 px-4 flex items-center justify-between bg-black/40 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-red-500/80 inline-block" />
                  <span className="size-3 rounded-full bg-yellow-500/80 inline-block" />
                  <span className="size-3 rounded-full bg-green-500/80 inline-block" />
                  <span className="ml-3 font-mono text-[11px] text-white/50 hidden sm:inline-block">
                    forke-workspace / bounty-issue-142.ts
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="px-2.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    CI PASSING
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-accent/15 text-accent font-semibold border border-accent/25">
                    ₹1,200 UPI
                  </span>
                </div>
              </div>

              {/* Split Mockup Body */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
                {/* Left Column: Developer Profile & Bounty Queue (Desktop & Tablet) */}
                <div className="hidden md:flex md:col-span-4 border-b md:border-b-0 md:border-r border-white/10 p-4 sm:p-5 bg-black/30 flex-col justify-between overflow-hidden">
                  <div className="space-y-3.5">
                    {/* User Profile Bar */}
                    <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                      <div className="size-9 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center font-bold text-accent text-xs shrink-0">
                        FP
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-white truncate">swayam_codes</span>
                          <span className="text-[10px] font-mono text-accent">LVL 12</span>
                        </div>
                        <p className="text-[10px] text-white/50">Feature Shipper · 4,250 XP</p>
                      </div>
                    </div>

                    {/* Active Bounties Feed */}
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-mono uppercase tracking-wider text-white/40 px-1 font-semibold">
                        Claimed Bounties (4)
                      </p>
                      <div className="p-2.5 rounded-lg bg-accent/[0.08] border border-accent/30 text-left">
                        <div className="flex items-center justify-between text-xs font-medium text-white mb-0.5">
                          <span className="truncate">Fix Supabase Edge Middleware</span>
                          <span className="text-accent font-mono font-bold">₹1,200</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-white/50 font-mono">
                          <span>PR #142</span>
                          <span>·</span>
                          <span className="text-emerald-400 font-semibold">Ready to Merge</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05] text-left hover:bg-white/[0.04] transition-colors">
                        <div className="flex items-center justify-between text-xs font-medium text-white/80 mb-0.5">
                          <span className="truncate">Responsive Bento Hero CSS</span>
                          <span className="text-white/70 font-mono font-bold">₹800</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-white/40 font-mono">
                          <span>PR #138</span>
                          <span>·</span>
                          <span className="text-emerald-400">Paid to UPI</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05] text-left opacity-75">
                        <div className="flex items-center justify-between text-xs font-medium text-white/70 mb-0.5">
                          <span className="truncate">Add PostHog Funnel Analytics</span>
                          <span className="text-white/60 font-mono font-bold">₹1,500</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-white/40 font-mono">
                          <span>PR #126</span>
                          <span>·</span>
                          <span className="text-emerald-400">Paid to UPI</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05] text-left opacity-60">
                        <div className="flex items-center justify-between text-xs font-medium text-white/70 mb-0.5">
                          <span className="truncate">PostgreSQL RPC Function</span>
                          <span className="text-white/60 font-mono font-bold">₹2,000</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-white/40 font-mono">
                          <span>PR #119</span>
                          <span>·</span>
                          <span className="text-emerald-400">Paid to UPI</span>
                        </div>
                      </div>
                    </div>

                    {/* Stacks verified */}
                    <div className="hidden sm:block pt-0.5">
                      <p className="text-[10px] font-mono uppercase tracking-wider text-white/40 px-1 mb-1.5 font-semibold">
                        Verified Stacks
                      </p>
                      <div className="flex flex-wrap gap-1.5 px-1">
                        {['Next.js 15', 'TypeScript', 'Supabase', 'Tailwind', 'PostgreSQL'].map((t) => (
                          <span key={t} className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.04] text-white/70 border border-white/[0.06]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Instant UPI Summary Card */}
                  <div className="mt-3 mb-2 p-2.5 rounded-lg bg-emerald-500/[0.06] border border-emerald-500/20 flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-white/50 block">Total Lifetime Payouts</span>
                      <span className="text-emerald-400 font-bold font-mono text-sm">₹18,400.00</span>
                    </div>
                    <span className="text-[10px] text-emerald-400/90 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      UPI · Instant
                    </span>
                  </div>
                </div>

                {/* Right Column: Code Terminal, Test Results & Instant Settlement */}
                <div className="col-span-12 md:col-span-8 p-4 sm:p-5 md:p-6 flex flex-col justify-between font-mono text-xs overflow-hidden">
                  {/* Simulated Code / Terminal */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                      <div className="flex items-center gap-2 text-white/80">
                        <GitPullRequest className="size-3.5 text-accent" />
                        <span className="text-white font-medium text-[12px]">pull/142: Fix cookie parse in auth middleware</span>
                      </div>
                      <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        14/14 Tests Passed
                      </span>
                    </div>

                    {/* Code Diff Preview (Desktop/Tablet) */}
                    <div className="hidden sm:block bg-black/40 rounded-lg p-2.5 text-[11px] font-mono leading-relaxed border border-white/[0.04]">
                      <div className="flex items-center justify-between text-white/40 pb-1 mb-1 border-b border-white/[0.04] text-[10px]">
                        <span>src/middleware/auth.ts</span>
                        <span className="text-emerald-400/80">Diff +2 -1</span>
                      </div>
                      <p className="text-red-400/80">- const session = cookies.get(&apos;auth&apos;);</p>
                      <p className="text-emerald-400">+ const session = cookies.get(&apos;auth&apos;) ?? parseBearer(headers);</p>
                      <p className="text-emerald-400">+ if (!session?.userId) throw new UnauthorizedError();</p>
                    </div>

                    {/* Interactive Code & Test Terminal */}
                    <div className="bg-black/60 rounded-lg p-2.5 sm:p-3 text-white/85 space-y-1 font-mono text-[10.5px] sm:text-[11px] leading-relaxed border border-white/[0.06] shadow-inner">
                      <p className="text-white/40">// Automated CI Test Suite Output — Jest & Vitest</p>
                      <p className="text-emerald-400">✓ PASS src/middleware.test.ts (24ms)</p>
                      <p className="text-emerald-400">✓ PASS src/lib/auth/session.test.ts (18ms)</p>
                      <p className="text-emerald-400">✓ PASS src/lib/upi/settlement.test.ts (31ms)</p>
                      <div className="pt-1 text-white/60 border-t border-white/[0.05] space-y-0.5 text-[9.5px] sm:text-[10px]">
                        <p>Test Suites: <span className="text-emerald-400 font-semibold">3 passed</span>, 3 total</p>
                        <p>Tests:       <span className="text-emerald-400 font-semibold">14 passed</span>, 14 total</p>
                        <p className="hidden sm:block">Time:        0.742 s · Ran all test suites matching /middleware|auth|settlement/.</p>
                      </div>
                      <p className="text-accent pt-0.5 text-[10px] sm:text-[11px]">Maintainer @founder: "Merged! Clean code and fast delivery."</p>
                    </div>

                    {/* Git merge status bar (Desktop/Tablet) */}
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05] text-[11px] text-white/60">
                      <span className="size-2 rounded-full bg-emerald-400 shrink-0" />
                      <span>commit <code className="text-accent font-semibold">8f3a91c</code> merged into <code className="text-white/80">main</code> by repo-bot</span>
                    </div>
                  </div>

                  {/* Instant Settlement Banner (Fully visible with bottom margin clearance) */}
                  <div className="mt-3 mb-2 p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-emerald-950/50 via-black/80 to-emerald-950/30 border border-emerald-500/35 flex items-center justify-between gap-3 shadow-xl">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/35 text-emerald-400">
                        <CheckCircle2 className="size-4.5" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-white font-sans">
                          Instant UPI Settlement Complete
                        </p>
                        <p className="text-[10px] sm:text-[11px] text-white/60 font-mono">
                          ₹1,200.00 transferred to dev@okaxis · UTR: FKT-982410772
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="inline-block px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm">
                        PAID ✓
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Promo Replay / Action Button (Aside Style) */}
              <button
                type="button"
                aria-label="Replay promo animation"
                title="Replay product showcase"
                className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 size-8 sm:size-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer z-20"
              >
                <RotateCcw className="size-3.5 sm:size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
