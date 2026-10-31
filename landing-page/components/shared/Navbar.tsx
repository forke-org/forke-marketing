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

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [hasSiteAccess, setHasSiteAccess] = useState(false)
  const [waitlistActive, setWaitlistActive] = useState(true)

  const marketingUrl = process.env.NEXT_PUBLIC_MARKETING_URL || 'https://www.forke.space'
  const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL || 'https://dashboard.forke.space'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15)
    }
    window.addEventListener('scroll', handleScroll)

    // Read helper cookies
    const getCookie = (name: string): string | null => {
      if (typeof document === 'undefined') return null
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop()?.split(';').shift() || null
      return null
    }

    const siteAccess = getCookie('site_access_public') === 'true'
    const waitlist = getCookie('waitlist_active') === 'true'
    const animHandle = requestAnimationFrame(() => {
      setHasSiteAccess(siteAccess)
      setWaitlistActive(waitlist)
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(animHandle)
    }
  }, [])

  // Gating evaluation:
  // 1. Authenticated -> Show "Dashboard"
  // 2. Not logged in + waitlist enabled + NO checkout pass -> Show "Join the waitlist" -> /waitlist
  // 3. Not logged in + (waitlist disabled OR has checkout pass) -> Show "Get Started" -> /signin
  const showJoinWaitlist = !isLoggedIn && waitlistActive && !hasSiteAccess

  const navLinks = [
    { name: "What's Forke?", href: `${marketingUrl}/whats-forke` },
    { name: 'Levels', href: `${marketingUrl}/levels` },
    { name: 'Blogs', href: `${marketingUrl}/blogs` },
    { name: 'Contact Us', href: `${marketingUrl}/contact` },
  ]

  const handleCtaClick = () => {
    setIsMobileMenuOpen(false)
    if (isLoggedIn) {
      window.location.href = `${dashboardUrl}/dashboard`
    } else if (showJoinWaitlist) {
      window.location.href = `${marketingUrl}/waitlist`
    } else {
      window.location.href = `${marketingUrl}/signin`
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
      <nav
        className={cn(
          "pointer-events-auto transition-all duration-300 ease-out",
          // Attached to top with rounded bottom corners (compact notch capsule)
          "rounded-b-[20px] sm:rounded-b-[24px] border-b border-x border-white/[0.12]",
          // Glossy transparent glassmorphism
          "backdrop-blur-2xl sm:backdrop-blur-3xl",
          isScrolled || isMobileMenuOpen
            ? "bg-black/60 border-white/[0.16] shadow-[0_16px_40px_rgba(0,0,0,0.65),inset_0_1px_1px_rgba(255,255,255,0.18)]"
            : "bg-black/40 border-white/[0.10] shadow-[0_12px_32px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.14)]",
          // Compact width hugging contents with no giant empty space
          "w-fit max-w-[95vw]",
          // Glass gloss highlight gradient overlay
          "before:absolute before:inset-0 before:rounded-b-[20px] sm:before:rounded-b-[24px] before:bg-gradient-to-b before:from-white/[0.08] before:to-transparent before:pointer-events-none"
        )}
      >
        {/* Main Header Bar - tightly grouped without excessive spacing */}
        <div className="flex items-center gap-5 sm:gap-7 h-12 sm:h-13 px-4 sm:px-6">
          {/* Left: Only forke* text, logo image removed */}
          <a
            href={marketingUrl}
            className="group shrink-0 relative cursor-pointer select-none"
          >
            <span className="text-lg sm:text-xl font-semibold tracking-[-0.04em] text-white">
              forke<span className="text-accent">*</span>
            </span>
          </a>

          {/* Center: Navigation Links */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="group/link font-mono text-[12px] lg:text-[12.5px] lowercase text-white/60 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                <span className="text-accent/0 group-hover/link:text-accent/90 transition-colors">/</span>
                {link.name.replace(/[?'’]/g, '').replace(/\s+/g, '-').toLowerCase()}
              </a>
            ))}
          </div>

          {/* Right: CTA & Mobile Hamburger */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              variant="primary"
              className="hidden sm:inline-flex rounded-full px-4 py-1.5 h-8 text-[12px] font-semibold tracking-tight bg-accent hover:bg-accent-hover text-[#0a0a0a] shadow-none transition-colors cursor-pointer whitespace-nowrap"
              onClick={handleCtaClick}
            >
              {isLoggedIn
                ? 'Dashboard'
                : showJoinWaitlist
                  ? 'Join the waitlist'
                  : 'Get Started'}
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer text-white"
              aria-label="Menu"
            >
              <span
                className={`block h-[1.5px] w-4 bg-white transition-all duration-300 ${
                  isMobileMenuOpen ? 'translate-y-[5.5px] rotate-45' : ''
                }`}
              />
              <span
                className={`block h-[1.5px] w-4 bg-white transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block h-[1.5px] w-4 bg-white transition-all duration-300 ${
                  isMobileMenuOpen ? '-translate-y-[5.5px] -rotate-45' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        <div
          className={cn(
            "md:hidden grid transition-all duration-300 border-t border-white/[0.08]",
            isMobileMenuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"
          )}
        >
          <div className="overflow-hidden">
            <div className="px-4 pb-4 pt-2.5 flex flex-col gap-1.5 min-w-[240px]">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block rounded-lg px-3 py-1.5 text-[13px] text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer font-mono"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-accent mr-1">/</span>
                  {link.name.replace(/[?'’]/g, '').replace(/\s+/g, '-').toLowerCase()}
                </a>
              ))}
              <div className="pt-1.5">
                <Button
                  variant="primary"
                  className="w-full h-9 rounded-full bg-accent hover:bg-accent-hover text-[#0a0a0a] text-[12px] font-semibold tracking-tight shadow-none transition-colors cursor-pointer"
                  onClick={handleCtaClick}
                >
                  {isLoggedIn
                    ? 'Dashboard'
                    : showJoinWaitlist
                      ? 'Join the waitlist'
                      : 'Get Started'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
