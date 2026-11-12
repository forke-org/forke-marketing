'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Logo, WaitlistButton, cn } from './primitives'

export const NAV_LINKS = [
  { label: "What's Forke", href: '/whats-forke' },
  { label: 'Levels', href: '/levels' },
  { label: 'Blogs', href: '/blogs' },
  { label: 'Contact us', href: '/contact' },
]

function NavLinks() {
  return (
    <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
      {NAV_LINKS.map((l) => (
        <Link
          key={l.label}
          href={l.href}
          className="rounded-lg px-3.5 py-1.5 text-sm text-white/80 transition-colors hover:bg-white/[0.06] hover:text-white"
        >
          {l.label}
        </Link>
      ))}
    </div>
  )
}

/** Transparent bar that sits inside the hero panel. */
export function HeroNav() {
  return (
    <nav className="relative z-30 flex h-16 items-center justify-between px-5 sm:px-8">
      <Logo />
      <NavLinks />
      <WaitlistButton size="sm" />
    </nav>
  )
}

/** Solid bar that slides in once the hero has scrolled away. */
export function StickyNav({ always = false }: { always?: boolean }) {
  const [show, setShow] = useState(always)
  useEffect(() => {
    if (always) return
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.9)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [always])
  return (
    <nav
      aria-hidden={!show}
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b border-line bg-bg/80 backdrop-blur-xl transition-[opacity,transform] duration-300',
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-full opacity-0',
      )}
    >
      <div className="relative mx-auto flex h-14 max-w-[1200px] items-center justify-between max-[1232px]:px-4">
        <Logo />
        <NavLinks />
        <WaitlistButton size="sm" />
      </div>
    </nav>
  )
}
