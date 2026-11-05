'use client'

/**
 * @fileoverview Forke Platform - Aside Sticky Navbar
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 */

import React, { useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export default function StickyNav() {
  const [isVisible, setIsVisible] = useState(false)

  const marketingUrl = process.env.NEXT_PUBLIC_MARKETING_URL || 'https://www.forke.space'

  useEffect(() => {
    const handleScroll = () => {
      // Appear after scrolling 400px down past hero header
      if (window.scrollY > 400) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCtaClick = () => {
    window.location.href = `${marketingUrl}/waitlist`
  }

  return (
    <nav
      className={cn(
        "font-display fixed top-0 left-0 isolate z-50 w-full transition-all duration-300 bg-[#060608]/90 backdrop-blur-md border-b border-white/[0.08] px-4 sm:px-6 lg:px-12",
        isVisible 
          ? "translate-y-0 opacity-100 pointer-events-auto" 
          : "-translate-y-full opacity-0 pointer-events-none"
      )}
    >
      <div className="mx-auto flex h-14 max-w-[1536px] items-center justify-between">
        {/* Brand */}
        <a 
          href="#" 
          onClick={scrollToTop}
          className="select-none flex items-center gap-1.5 cursor-pointer"
        >
          <span className="text-xl font-bold tracking-tight text-white">
            forke<span className="text-accent">*</span>
          </span>
        </a>

        {/* Center Links */}
        <ul className="hidden md:flex items-center gap-8 lg:gap-10 font-mono text-xs sm:text-sm text-white/70">
          <li>
            <a href={`${marketingUrl}/whats-forke`} className="hover:text-white transition-colors">
              whats-forke
            </a>
          </li>
          <li>
            <a href={`${marketingUrl}/levels`} className="hover:text-white transition-colors">
              levels
            </a>
          </li>
          <li>
            <a href={`${marketingUrl}/blogs`} className="hover:text-white transition-colors">
              blogs
            </a>
          </li>
          <li>
            <a href={`${marketingUrl}/contact`} className="hover:text-white transition-colors">
              contact-us
            </a>
          </li>
        </ul>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCtaClick}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-white hover:bg-neutral-100 text-black px-4 py-1.5 text-xs font-semibold tracking-tight shadow transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>Get Started</span>
            <ArrowRight className="size-3" />
          </button>
        </div>
      </div>
    </nav>
  )
}
