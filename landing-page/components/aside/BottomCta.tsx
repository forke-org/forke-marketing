'use client'

/**
 * @fileoverview Forke Platform - Aside Bottom CTA Section
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 */

import React from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function BottomCta() {
  const marketingUrl = process.env.NEXT_PUBLIC_MARKETING_URL || 'https://www.forke.space'

  const handleCtaClick = () => {
    window.location.href = `${marketingUrl}/waitlist`
  }

  return (
    <div className="mx-auto w-full py-16 sm:py-20 xl:py-28 bg-transparent">
      <div className="mx-auto w-full max-w-[1536px] px-4 sm:px-6 lg:px-12 xl:px-24">
        <div className="relative overflow-hidden rounded-3xl bg-[#0b0c10] px-6 py-20 text-center sm:px-10 sm:py-28 xl:py-36 border border-neutral-200/80 shadow-2xl">
          {/* Ambient Video Background */}
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

          {/* Subtle dark gradient overlay */}
          <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px] pointer-events-none z-[1]" />

          {/* Inner ring */}
          <div className="pointer-events-none absolute inset-0 z-20 rounded-3xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]" />

          {/* Content */}
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-accent/20 border border-accent/40 text-accent mb-6">
              <Sparkles className="size-3" />
              <span>EARN REAL MONEY BY SHIPPING CODE</span>
            </div>

            <h2 className="font-display text-white text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.1] mb-6 drop-shadow-md">
              Stop grinding LeetCode. <br />
              Start shipping for real money.
            </h2>

            <p className="text-base sm:text-lg text-white/80 max-w-xl mx-auto mb-10 leading-relaxed font-normal">
              Join thousands of Indian developers claiming bounties, leveling up their technical skills, and building immutable proof of work.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleCtaClick}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-neutral-100 text-black px-7 py-3.5 text-sm font-semibold tracking-tight shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>Claim your username</span>
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
