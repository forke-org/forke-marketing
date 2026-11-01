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
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
      <nav
        className={cn(
          "pointer-events-auto transition-all duration-300 ease-out",
          // Floating pill with all four corners fully rounded
          isMobileMenuOpen ? "rounded-[24px]" : "rounded-full",
          // Compact width hugging contents with no giant empty space
          "w-fit max-w-[95vw]"
        )}
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)'
        }}
      >
        {/* Main Header Bar */}
        <div className="flex items-center gap-5 sm:gap-7 h-12 sm:h-13 px-4 sm:px-6">
          {/* Left: forke* text */}
          <a
            href={marketingUrl}
            className="group shrink-0 relative cursor-pointer select-none"
          >
            <span className="text-lg sm:text-xl font-semibold tracking-[-0.04em] text-white">
              forke<span className="text-accent">*</span>
            </span>
          </a>

          {/* Center: Navigation Links in monospace and brighter near-white text */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="group/link font-medium text-[13px] lg:text-[14px] lowercase text-[#EDEDED] hover:text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                <span className="text-accent opacity-0 group-hover/link:opacity-100 transition-opacity duration-200 mr-0.5 select-none">/</span>
                {link.name.replace(/[?'’]/g, '').replace(/\s+/g, '-').toLowerCase()}
              </a>
            ))}
          </div>

          {/* Right: Clean flat Get Started CTA (no shadow, no backdrop) & Mobile Hamburger */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleCtaClick}
              className="hidden sm:inline-flex items-center justify-center rounded-full px-4 py-1.5 h-8 text-[12px] font-semibold tracking-tight bg-white hover:bg-neutral-100 text-[#0a0a0a] shadow-none transition-colors cursor-pointer whitespace-nowrap border-0"
            >
              {isLoggedIn
                ? 'Dashboard'
                : showJoinWaitlist
                  ? 'Join the waitlist'
                  : 'Get Started'}
            </button>

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
            "md:hidden grid transition-all duration-300 border-t",
            isMobileMenuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"
          )}
          style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}
        >
          <div className="overflow-hidden">
            <div className="px-4 pb-4 pt-2.5 flex flex-col gap-1.5 min-w-[240px]">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="group block rounded-lg px-3 py-1.5 text-[13.5px] text-[#EDEDED] hover:bg-white/[0.08] hover:text-white transition-colors cursor-pointer font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-200 mr-1 select-none">/</span>
                  {link.name.replace(/[?'’]/g, '').replace(/\s+/g, '-').toLowerCase()}
                </a>
              ))}
              <div className="pt-1.5">
                <button
                  className="w-full h-9 rounded-full bg-white hover:bg-neutral-100 text-[#0a0a0a] text-[12px] font-semibold tracking-tight shadow-none transition-colors cursor-pointer flex items-center justify-center border-0"
                  onClick={handleCtaClick}
                >
                  {isLoggedIn
                    ? 'Dashboard'
                    : showJoinWaitlist
                      ? 'Join the waitlist'
                      : 'Get Started'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
