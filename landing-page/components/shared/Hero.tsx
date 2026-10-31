'use client'

/**
 * @fileoverview Forke Platform
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

import React, { useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import Aurora from './Aurora'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import TechStackTicker from './TechStackTicker'

export default function Hero() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const [hasSiteAccess, setHasSiteAccess] = React.useState(true)
  const [waitlistActive, setWaitlistActive] = React.useState(false)

  React.useEffect(() => {
    const getCookie = (name: string): string | null => {
      if (typeof document === 'undefined') return null
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop()?.split(';').shift() || null
      return null
    }

    setHasSiteAccess(getCookie('site_access_public') === 'true')
    setWaitlistActive(getCookie('waitlist_active') === 'true')
  }, [])

  const showWaitlisterView = waitlistActive && !hasSiteAccess

  useGSAP(() => {
    // 1. Entrance timeline — sleek, clean, centered
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.from('.gsap-hero-eyebrow',
      { y: 12, opacity: 0, duration: 0.5 },
      0.05
    )
    .from('.gsap-hero-title',
      { y: 20, opacity: 0, duration: 0.6 },
      0.15
    )
    .from('.gsap-hero-subtitle',
      { y: 16, opacity: 0, duration: 0.5 },
      0.25
    )
    .from('.gsap-hero-btn',
      { y: 12, opacity: 0, duration: 0.5, stagger: 0.08 },
      0.35
    )
    .from('.gsap-hero-meta',
      { opacity: 0, duration: 0.5 },
      0.45
    )
  }, { scope: containerRef })

  return (
    <section 
      ref={containerRef} 
      className="relative pt-32 pb-24 sm:pt-40 sm:pb-32 overflow-hidden bg-bg min-h-svh lg:min-h-[88vh] flex flex-col justify-center items-center"
    >
      {/* Grain overlay — fixed, pointer-events-none, GPU-safe */}
      <div
        className="pointer-events-none absolute inset-0 z-[2] opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Animated Background Components — Aurora */}
      <div className="absolute top-0 left-0 w-full pointer-events-none z-[1] overflow-hidden">
        <div style={{ width: '100%', height: '600px', position: 'relative' }}>
          <Aurora
            colorStops={["#f97316","#f97316","#f97316"]}
            amplitude={1.4}
            blend={0.5}
            height={0.45}
            speed={0.6}
            glow={1.2}
            layers={3}
            mouseInteraction={false}
          />
        </div>
      </div>

      {/* Centered Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center flex flex-col items-center space-y-7 sm:space-y-8">
        
        {/* Eyebrow badge */}
        <div className="gsap-hero-eyebrow inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 font-mono text-[11px] sm:text-xs text-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-md">
          <span>$ git push origin <span className="text-accent">payday</span></span>
          <span className="animate-caret text-accent -ml-1">▍</span>
        </div>

        {/* Hero Title */}
        <h1 className="gsap-hero-title text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-medium text-white leading-[1.04] tracking-[-0.04em] max-w-4xl mx-auto">
          Ship real work. <br />
          Earn XP. <span className="font-serif italic font-normal text-accent">Get paid.</span>
        </h1>

        {/* Subtitle */}
        <p className="gsap-hero-subtitle text-base sm:text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed font-light">
          Claim scoped bounties from real startups, ship the fix, and cash out to UPI the moment your PR merges. No resumes. No interviews.
        </p>

        {/* CTA Buttons */}
        <div className="space-y-4 pt-1 w-full flex flex-col items-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
            {showWaitlisterView ? (
              <Button
                size="lg"
                className="gsap-hero-btn group h-12 sm:h-13 px-8 rounded-full bg-accent hover:bg-accent-hover text-[#0a0a0a] text-[15px] font-semibold tracking-tight shadow-none transition-colors w-full sm:w-auto cursor-pointer"
                onClick={() => router.push('/waitlist')}
              >
                Join the waitlist <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            ) : (
              <Button
                size="lg"
                className="gsap-hero-btn group h-12 sm:h-13 px-8 rounded-full bg-accent hover:bg-accent-hover text-[#0a0a0a] text-[15px] font-semibold tracking-tight shadow-none transition-colors w-full sm:w-auto cursor-pointer"
                onClick={() => router.push('/signin')}
              >
                Start earning <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            )}
            <a
              href="#how-it-works"
              className="gsap-hero-btn h-12 sm:h-13 px-7 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/20 text-white/80 hover:text-white text-[15px] font-medium inline-flex items-center justify-center transition-colors w-full sm:w-auto cursor-pointer"
            >
              See how it works
            </a>
          </div>

          {/* Microcopy Metadata */}
          <p className="gsap-hero-meta font-mono text-[11px] sm:text-xs text-white/40 tracking-wide pt-1">
            escrow protected&nbsp;&nbsp;·&nbsp;&nbsp;instant UPI payouts&nbsp;&nbsp;·&nbsp;&nbsp;25 levels to climb
          </p>
        </div>

      </div>

      {/* Supported Tech Stack Ticker docked at the bottom of Hero */}
      <div className="absolute bottom-0 left-0 w-full z-40">
        <TechStackTicker isHeroEmbedded />
      </div>

    </section>
  )
}
