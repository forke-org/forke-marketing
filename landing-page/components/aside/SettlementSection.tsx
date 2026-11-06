'use client'

/**
 * @fileoverview Forke Platform - Aside Settlement Section
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 */

import React from 'react'
import { ArrowRight, CheckCircle2, Lock, Shield, Zap, Receipt, Landmark } from 'lucide-react'

export default function SettlementSection() {
  return (
    <section id="settlement" className="mx-auto w-full border-b border-black/[0.08] bg-white">
      <div className="mx-auto w-full max-w-[1536px] px-4 sm:px-6 lg:px-12 xl:px-24">
        <div className="border-x border-black/[0.08] px-6 py-16 sm:px-8 sm:py-20 md:px-14 md:py-28 xl:px-36">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <p className="mb-3">
              <a 
                className="text-accent inline-flex items-center gap-1.5 text-sm font-medium decoration-accent/50 decoration-dotted decoration-2 underline-offset-4 hover:underline md:text-base group" 
                href="#settlement"
              >
                <span>Instant Settlement</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </p>
            <h2 className="font-display text-[#0a0a0a] text-3xl sm:text-4xl xl:text-5xl font-bold tracking-tight leading-tight mb-4">
              Bounties that pay out instantly. <br className="hidden sm:block" />
              Merged is paid.
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed font-normal">
              Traditional freelance sites hold your money in 30-day clearance purgatory. Forke deposits client funds into escrow upon bounty posting, and releases them directly to your UPI the second your PR is merged.
            </p>
          </div>

          {/* 3 Horizontal Pill Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-16">
            <div className="p-6 rounded-2xl bg-neutral-50/70 border border-neutral-200/80 hover:border-neutral-300 hover:shadow-sm transition-all">
              <div className="size-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4">
                <Lock className="size-5" />
              </div>
              <h3 className="text-base font-semibold text-[#0a0a0a] mb-2">Pre-Funded Escrow</h3>
              <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                No unpaid work. Client founders lock bounty funds in escrow before you write a single line of code.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-50/70 border border-neutral-200/80 hover:border-neutral-300 hover:shadow-sm transition-all">
              <div className="size-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4">
                <Zap className="size-5" />
              </div>
              <h3 className="text-base font-semibold text-[#0a0a0a] mb-2">Automated UPI Webhooks</h3>
              <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                Direct transfers to Google Pay, PhonePe, or Paytm. Cash in your bank account, not platform tokens.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-50/70 border border-neutral-200/80 hover:border-neutral-300 hover:shadow-sm transition-all">
              <div className="size-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4">
                <Receipt className="size-5" />
              </div>
              <h3 className="text-base font-semibold text-[#0a0a0a] mb-2">Immutable Receipt</h3>
              <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                Every payout is cryptographically tied to the merged GitHub commit hash and client review score.
              </p>
            </div>
          </div>

          {/* Big Vault Feature Card (Aside Child 07 Vault Card) */}
          <div className="rounded-3xl bg-neutral-50/50 border border-neutral-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-xs">
            {/* Left Content Column */}
            <div className="lg:col-span-6 p-8 sm:p-10 xl:p-14 flex flex-col justify-between">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-accent/10 text-accent border border-accent/25 inline-block mb-4">
                  FORKE VAULT
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#0a0a0a] mb-4 leading-tight">
                  The first instant payout engine built for open-source contributors.
                </h3>
                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed mb-8 font-normal">
                  Our escrow smart engine verifies CI test reports and GitHub webhook merge events. When both conditions pass, payment is executed in under 180 seconds.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="size-5 text-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-[#0a0a0a]">48-Hour Review Window</p>
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        Startups must review within 48 hours. If uncontested, automated payout triggers to protect builders.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="size-5 text-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-[#0a0a0a]">Direct INR Bank Transfers</p>
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        Zero PayPal conversion fees or wire delays. Real Indian rupees transferred straight to your UPI VPA.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500 font-mono">
                <span>Backed by RBI-compliant UPI Rails</span>
                <span className="text-emerald-600 font-semibold">100% Payout Success Rate</span>
              </div>
            </div>

            {/* Right Graphic Column: Payout Receipt Terminal */}
            <div className="lg:col-span-6 p-6 sm:p-8 bg-neutral-100/60 border-t lg:border-t-0 lg:border-l border-neutral-200 flex items-center justify-center">
              <div className="w-full max-w-md rounded-2xl bg-[#0e0f14] border border-neutral-800 p-6 shadow-xl font-mono text-xs space-y-4 text-white">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-white/60">ESCROW TRANSACTION</span>
                  <span className="text-emerald-400 font-bold">SETTLED</span>
                </div>

                <div className="space-y-2.5 text-white/80">
                  <div className="flex justify-between">
                    <span className="text-white/40">Bounty ID:</span>
                    <span className="text-white">BNT-2026-8941</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Repository:</span>
                    <span className="text-white">forke-space/landing</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Merged PR:</span>
                    <span className="text-accent underline">#142 (commit 7a1b313)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">CI Verification:</span>
                    <span className="text-emerald-400">PASSED (20/20)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Settlement Destination:</span>
                    <span className="text-white">dev.swayam@oksbi</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-baseline justify-between">
                  <span className="text-white/60 font-sans text-xs">Total Transferred:</span>
                  <span className="text-2xl font-bold text-accent font-mono">₹1,200.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
