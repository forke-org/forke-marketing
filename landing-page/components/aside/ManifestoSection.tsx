'use client'

/**
 * @fileoverview Forke Platform - Aside Manifesto Section
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 */

import React from 'react'
import { ArrowRight } from 'lucide-react'
import PixelBlast from './PixelBlast'

export default function ManifestoSection() {
  return (
    <div id="manifesto" className="relative mx-auto w-full border-b border-black/[0.08] bg-white overflow-hidden">
      {/* PixelBlast Canvas Background (Forke * Asterisks & Animated Mascot Shape) */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
        <PixelBlast
          variant="cross"
          pixelSize={3.5}
          color="#f97316"
          patternScale={1.7}
          patternDensity={0.65}
          softness={0.6}
          glow={0.4}
          twinkle={0.2}
          drift={0.2}
          hoverEffect="none"
          enableRipples
          edgeFade={0.25}
          accentColor="#000000"
          pixelSizeJitter={0.09}
          smoothing={1}
          speed={0.6}
          driftAngle={30}
          hoverRadius={140}
          rippleSpeed={0.3}
          rippleThickness={0.1}
          rippleIntensityScale={1}
          autoRipple={0}
          tiltX={0}
          tiltY={0}
          intro
          transparent
          lightMode
          mascotCenterX={-0.22}
          mascotCenterY={0.05}
          mascotScale={0.52}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1536px] px-4 sm:px-6 lg:px-12 xl:px-24">
        {/* div.border-x with exact Aside stroke & spacing: 144px top (pt-36), 56px x (px-14), 96px bottom (pb-24) */}
        <div className="border-x border-black/[0.08] px-6 sm:px-8 md:px-14 xl:px-36 pt-24 md:pt-36 pb-20 md:pb-24 gap-16 lg:flex">
          {/* Left Eyebrow Column */}
          <div className="mb-8 w-64 shrink-0">
            <a 
              className="text-accent inline-flex items-center gap-1.5 text-sm font-medium decoration-accent/50 decoration-dotted decoration-2 underline-offset-4 hover:underline md:text-base group" 
              href="#manifesto"
            >
              <span>Introducing Forke</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>

          {/* Right Text Column */}
          <div className="space-y-8 max-w-3xl">
            <p className="font-display text-neutral-600 text-base sm:text-lg xl:text-xl font-normal leading-relaxed">
              <span className="font-semibold text-[#0a0a0a]">Today’s tech hiring process is broken.</span>{' '}
              Resumes lie, LeetCode tests rote memorization over real engineering, and recruiters judge talent by college tags rather than what you can build. Developers waste weeks on artificial interviews and unpaid assignments with zero feedback.
            </p>
            <p className="font-display text-neutral-600 text-base sm:text-lg xl:text-xl font-normal leading-relaxed">
              <span className="font-semibold text-[#0a0a0a]">Forke is the marketplace built for pure proof of work.</span>{' '}
              We connect Indian developers with fast-moving startups through scoped, paid engineering bounties. Claim an issue, write production code that passes CI, merge your pull request, and cash out directly to UPI upon maintainer verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
