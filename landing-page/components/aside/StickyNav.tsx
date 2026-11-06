'use client'

/**
 * @fileoverview Forke Platform - Aside Sticky Floating Navbar
 * Appears totally after the landing page hero section on scroll,
 * featuring Aceternity/21st.dev navbar-menu dropdowns, brand logo, and Get Started CTA.
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 */

import React, { useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Menu, MenuItem, ProductItem, HoveredLink } from '@/components/ui/navbar-menu'

export default function StickyNav() {
  const [isVisible, setIsVisible] = useState(false)
  const [active, setActive] = useState<string | null>(null)

  const marketingUrl = process.env.NEXT_PUBLIC_MARKETING_URL || 'https://www.forke.space'

  useEffect(() => {
    const handleScroll = () => {
      // Preview flag for automated testing / inspection
      if (typeof window !== 'undefined' && window.location.search.includes('nav_preview=1')) {
        setIsVisible(true)
        return
      }

      // Show navbar when completely after the landing page hero section (as in Aside website)
      const hero = document.getElementById('hero-section')
      if (hero) {
        const rect = hero.getBoundingClientRect()
        setIsVisible(rect.bottom <= 80)
      } else {
        setIsVisible(window.scrollY > 850)
      }
    }

    handleScroll()
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
    <div
      className={cn(
        "font-display fixed top-4 sm:top-6 inset-x-0 z-50 mx-auto w-full px-3 sm:px-6 flex justify-center transition-all duration-300 pointer-events-none",
        isVisible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "-translate-y-10 opacity-0 pointer-events-none"
      )}
    >
      <div className="w-full max-w-4xl">
        <Menu
          setActive={setActive}
          className="items-center justify-between px-4 sm:px-6 py-2.5 bg-white/95 backdrop-blur-md border border-black/[0.08] shadow-[0_10px_35px_rgba(0,0,0,0.1)]"
        >
          {/* Brand Logo (Left) */}
          <a
            href="#"
            onClick={scrollToTop}
            className="select-none flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span className="text-xl font-bold tracking-tight text-[#0a0a0a]">
              forke<span className="text-[#FF7A00]">*</span>
            </span>
          </a>

          {/* Center Interactive Menu Items (Framer Motion Dropdowns) */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8 font-mono text-xs sm:text-sm">
            <MenuItem setActive={setActive} active={active} item="whats-forke">
              <div className="text-sm grid grid-cols-2 gap-6 p-2 max-w-lg">
                <ProductItem
                  title="Pull Request Escrow"
                  href="/#settlement"
                  src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=300&q=80"
                  description="Bounties locked in vault. Instant release on merge."
                />
                <ProductItem
                  title="Automated CI Check"
                  href="/#pillars"
                  src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=300&q=80"
                  description="Automated tests verify your pull request before payout."
                />
              </div>
              <div className="flex flex-col space-y-2 text-xs pt-3 border-t border-black/[0.08] mt-2">
                <HoveredLink href="/#manifesto">Read the Manifesto</HoveredLink>
                <HoveredLink href="/#trust">Reputation & XP Protocol</HoveredLink>
              </div>
            </MenuItem>

            <MenuItem setActive={setActive} active={active} item="levels">
              <div className="flex flex-col space-y-3 text-sm p-2 w-56">
                <HoveredLink href={`${marketingUrl}/levels`}>
                  <span className="font-semibold block text-black">L1 · Bug Fixes & Scripts</span>
                  <span className="text-xs text-neutral-500">₹500 - ₹2,000 per bounty</span>
                </HoveredLink>
                <HoveredLink href={`${marketingUrl}/levels`}>
                  <span className="font-semibold block text-black">L2 · Full Stack Features</span>
                  <span className="text-xs text-neutral-500">₹2,000 - ₹10,000 per bounty</span>
                </HoveredLink>
                <HoveredLink href={`${marketingUrl}/levels`}>
                  <span className="font-semibold block text-black">L3 · Core Architecture</span>
                  <span className="text-xs text-neutral-500">₹10,000+ per bounty</span>
                </HoveredLink>
              </div>
            </MenuItem>

            <MenuItem setActive={setActive} active={active} item="blogs">
              <div className="text-sm grid grid-cols-2 gap-6 p-2 max-w-lg">
                <ProductItem
                  title="Bounty Hunter Guide"
                  href={`${marketingUrl}/blogs`}
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=300&q=80"
                  description="How top developers earn ₹50,000/mo shipping PRs."
                />
                <ProductItem
                  title="The Death of LeetCode"
                  href={`${marketingUrl}/blogs`}
                  src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=300&q=80"
                  description="Why real proof-of-work is replacing rote interviews."
                />
              </div>
              <div className="flex flex-col space-y-2 text-xs pt-3 border-t border-black/[0.08] mt-2">
                <HoveredLink href={`${marketingUrl}/blogs`}>View All Articles</HoveredLink>
                <HoveredLink href={`${marketingUrl}/changelog`}>Product Changelog</HoveredLink>
              </div>
            </MenuItem>

            <MenuItem setActive={setActive} active={active} item="contact-us">
              <div className="flex flex-col space-y-3 text-sm p-2 w-48">
                <HoveredLink href="https://discord.gg/forke">Discord Community</HoveredLink>
                <HoveredLink href="https://github.com/forke">GitHub Organization</HoveredLink>
                <HoveredLink href="https://x.com/forke">Twitter / X</HoveredLink>
                <HoveredLink href={`${marketingUrl}/contact`}>Founder Direct Line</HoveredLink>
              </div>
            </MenuItem>
          </div>

          {/* Right Action CTA (Get Started Button) */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCtaClick}
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-black hover:bg-neutral-800 text-white px-4 py-2 text-xs sm:text-sm font-semibold tracking-tight shadow transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </Menu>
      </div>
    </div>
  )
}
