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
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import Aurora from './Aurora'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import TechStackTicker from './TechStackTicker'
import { Button } from '@/components/ui/Button'

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
    .from('.gsap-hero-mascot',
      { y: 16, opacity: 0, duration: 0.6, ease: 'power2.out' },
      0.48
    )
    .from('.gsap-hero-ticker',
      { opacity: 0, y: 16, duration: 0.6 },
      0.58
    )

    // Gentle ambient floating animation on the mascot
    gsap.to('.gsap-hero-mascot-img', {
      y: '+=5',
      duration: 3.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 0.8
    })
  }, { scope: containerRef })

  return (
    <section 
      ref={containerRef} 
      className="relative pt-28 pb-8 sm:pt-36 sm:pb-12 overflow-hidden bg-[#050505] min-h-svh flex flex-col justify-between items-center"
    >
      {/* Grain overlay — fixed, pointer-events-none, GPU-safe */}
      <div
        className="pointer-events-none absolute inset-0 z-[2] opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Aurora WebGL ambient background - masked to fade to pitch black by 45-50% */}
      <div 
        className="absolute top-0 left-0 w-full pointer-events-none z-[1] overflow-hidden h-[48%]"
        style={{
          maskImage: 'linear-gradient(to bottom, black 0%, black 25%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 25%, transparent 100%)'
        }}
      >
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <Aurora
            colorStops={["#f97316","#f97316","#f97316"]}
            amplitude={1.2}
            blend={0.5}
            height={0.5}
            speed={0.6}
            glow={1.1}
            layers={3}
            mouseInteraction={false}
          />
        </div>
      </div>

      {/* Subtle top atmospheric radial glow fading completely into black by 45% */}
      <div 
        className="absolute top-0 left-0 right-0 h-[45%] pointer-events-none z-[1]"
        style={{
          background: 'radial-gradient(ellipse 80% 55% at 50% 0%, rgba(249, 115, 22, 0.22) 0%, rgba(249, 115, 22, 0.06) 50%, transparent 100%)'
        }}
      />

      {/* Centered Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full text-center flex flex-col items-center space-y-6 sm:space-y-7 my-auto">
        
        {/* Terminal Eyebrow ("$ git push origin payday") — clean, transparent, no backdrop or shadow */}
        <div className="gsap-hero-eyebrow inline-flex items-center rounded-full px-4 py-1.5 font-mono text-xs sm:text-[13px] border border-white/10 bg-transparent select-none">
          <span className="text-white/70 tracking-normal">
            $ git push origin <span className="text-accent">payday</span>
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="gsap-hero-title text-[clamp(2.35rem,5.8vw+0.5rem,5.25rem)] font-bold text-white leading-[0.98] sm:leading-[1.02] tracking-[-0.04em] max-w-4xl mx-auto">
          Ship real work. <br />
          Earn XP. <span className="font-serif italic font-medium text-accent">Get paid.</span>
        </h1>

        {/* Subtitle - sits cleanly on the dark background */}
        <p className="gsap-hero-subtitle text-base sm:text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed font-normal">
          Claim scoped bounties from real startups, ship the fix, and cash out to UPI the moment your PR merges. No resumes. No interviews.
        </p>

        {/* CTA Buttons */}
        <div className="space-y-4 pt-1 w-full flex flex-col items-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
            {showWaitlisterView ? (
              <Button
                size="lg"
                className="gsap-hero-btn group h-12 sm:h-13 px-8 rounded-full bg-accent hover:bg-accent-hover text-[#0a0a0a] text-[15px] font-semibold tracking-tight shadow-none transition-colors w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2"
                onClick={() => router.push('/waitlist')}
              >
                Join the waitlist <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            ) : (
              <Button
                size="lg"
                className="gsap-hero-btn group h-12 sm:h-13 px-8 rounded-full bg-accent hover:bg-accent-hover text-[#0a0a0a] text-[15px] font-semibold tracking-tight shadow-none transition-colors w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2"
                onClick={() => router.push('/signin')}
              >
                Start earning <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            )}
            <a
              href="#how-it-works"
              className="gsap-hero-btn h-12 sm:h-13 px-7 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/20 text-white/80 hover:text-white text-[15px] font-semibold inline-flex items-center justify-center transition-colors w-full sm:w-auto cursor-pointer shadow-none"
            >
              See how it works
            </a>
          </div>

          {/* Microcopy Trust Line with monospace font and raised opacity */}
          <p className="gsap-hero-meta font-mono text-[11px] sm:text-xs text-white/75 tracking-wider pt-1 select-none">
            escrow protected&nbsp;&nbsp;·&nbsp;&nbsp;instant UPI payouts&nbsp;&nbsp;·&nbsp;&nbsp;25 levels to climb
          </p>
        </div>

        {/* Mascot Image - 2.5x scaled (280-320px on desktop, ~180px on mobile) with lower half overlapping into the next section */}
        <div className="gsap-hero-mascot relative w-full flex flex-col items-center justify-center mt-3 sm:mt-5 -mb-10 sm:-mb-16 md:-mb-20 z-30 pointer-events-none select-none">
          {/* Strengthened soft orange radial glow behind mascot */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] sm:w-[340px] md:w-[420px] h-[160px] sm:h-[220px] md:h-[260px] rounded-full pointer-events-none z-0"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0.46) 0%, rgba(249, 115, 22, 0.18) 45%, transparent 72%)',
              filter: 'blur(30px)'
            }}
          />

          {/* Mascot Image: Responsive 280-320px on desktop, ~180px on mobile, no overlap on text or buttons */}
          <div className="gsap-hero-mascot-img relative z-10 w-[180px] sm:w-[240px] md:w-[280px] lg:w-[310px] transition-transform duration-300">
            <Image
              src="/mascot.png"
              alt="Forky Mascot"
              width={310}
              height={206}
              priority
              className="w-full h-auto object-contain object-bottom "
            />
          </div>
        </div>

      </div>

      {/* Supported Tech Stack Ticker (Anchored below with lower half of mascot overlapping in) */}
      <div className="w-full relative z-10 pt-8 sm:pt-12 gsap-hero-ticker">
        <TechStackTicker isHeroEmbedded />
      </div>

    </section>
  )
}
