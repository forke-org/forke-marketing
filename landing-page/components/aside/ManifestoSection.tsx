'use client'

/**
 * @fileoverview Forke Platform - Aside Manifesto Section
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 */

import React from 'react'
import { ArrowRight } from 'lucide-react'

export default function ManifestoSection() {
  return (
    <div id="manifesto" className="mx-auto w-full border-b border-white/15">
      <div className="mx-auto w-full max-w-[1536px] px-4 sm:px-6 lg:px-12 xl:px-24">
        {/* div.border-x with exact Aside stroke & spacing: 144px top (pt-36), 56px x (px-14), 96px bottom (pb-24) */}
        <div className="border-x border-white/15 px-6 sm:px-8 md:px-14 xl:px-36 pt-24 md:pt-36 pb-20 md:pb-24 gap-16 lg:flex">
          {/* Left Eyebrow Column */}
          <div className="mb-8 w-64 shrink-0">
            <a 
              className="text-brand-content inline-flex items-center gap-1.5 text-sm font-medium decoration-accent/50 decoration-dotted decoration-2 underline-offset-4 hover:underline md:text-base group" 
              href="#manifesto"
            >
              <span>Introducing Forke</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>

          {/* Right Text Column */}
          <div className="space-y-8 max-w-3xl">
            <p className="font-display text-white/60 text-base sm:text-lg xl:text-xl font-normal leading-relaxed">
              <span className="font-semibold text-white">Today’s tech hiring process is broken.</span>{' '}
              Resumes lie, LeetCode tests rote memorization over real engineering, and recruiters judge talent by college tags rather than what you can build. Developers waste weeks on artificial interviews and unpaid assignments with zero feedback.
            </p>
            <p className="font-display text-white/60 text-base sm:text-lg xl:text-xl font-normal leading-relaxed">
              <span className="font-semibold text-white">Forke is the marketplace built for pure proof of work.</span>{' '}
              We connect Indian developers with fast-moving startups through scoped, paid engineering bounties. Claim an issue, write production code that passes CI, merge your pull request, and cash out directly to UPI upon maintainer verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
