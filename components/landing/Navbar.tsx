'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { ChevronDown, LayoutDashboard, LogIn, UserPlus } from 'lucide-react'
import { Logo, WaitlistButton, cn } from './primitives'
import { dashboardUrl, useSiteOpen } from './useWaitlisterView'

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

/**
 * The navbar's call to action:
 * signed in → Dashboard; site open (waitlist off, or unlocked at /checkout) → Get started menu
 * with Log in and Create account; otherwise → Join the waitlist.
 */
function NavCta() {
  const { data: session } = useSession()
  const open = useSiteOpen()
  const [menu, setMenu] = useState(false)
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menu) return
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !box.current?.contains(e.target as Node)) setMenu(false)
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', close)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', close)
    }
  }, [menu])

  if (session?.user) {
    return (
      <a href={`${dashboardUrl()}/dashboard`} className="group inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-transparent bg-accent px-3 text-[13px] font-medium leading-none text-[#1a0a00] shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_8px_24px_-8px_rgba(255,122,0,0.55)] transition-colors hover:bg-accent-hover">
        <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
      </a>
    )
  }
  if (!open) return <WaitlistButton size="sm" />

  const item = 'flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] text-white/80 transition-colors hover:bg-white/[0.06] hover:text-white'
  return (
    <div ref={box} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={menu}
        onClick={() => setMenu((m) => !m)}
        className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-transparent bg-accent px-3 text-[13px] font-medium leading-none text-[#1a0a00] shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_8px_24px_-8px_rgba(255,122,0,0.55)] transition-colors hover:bg-accent-hover"
      >
        Get started <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', menu && 'rotate-180')} />
      </button>
      {menu && (
        <div role="menu" className="absolute right-0 top-[calc(100%+8px)] z-50 w-52 rounded-xl border border-white/10 bg-[#1a1919]/95 p-1.5 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          <Link role="menuitem" href="/signin" className={item} onClick={() => setMenu(false)}>
            <LogIn className="h-4 w-4 text-white/50" /> Log in
          </Link>
          <Link role="menuitem" href="/register" className={item} onClick={() => setMenu(false)}>
            <UserPlus className="h-4 w-4 text-accent" /> Create account
          </Link>
        </div>
      )}
    </div>
  )
}

/** Transparent bar that sits inside the hero panel. */
export function HeroNav() {
  return (
    <nav className="relative z-30 flex h-16 items-center justify-between px-5 sm:px-8">
      <Logo />
      <NavLinks />
      <NavCta />
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
        <NavCta />
      </div>
    </nav>
  )
}
