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

import Link from 'next/link'
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { ArrowUpRight, ChevronDown, LayoutDashboard, LogIn, UserPlus } from 'lucide-react'
import { Logo, WaitlistButton, cn } from './primitives'
import { dashboardUrl, useSiteOpen } from './useWaitlisterView'
import { NAV_MENUS, isExternal, type SiteMenu } from './siteMenus'
import { BlogBento, BuiltForBento, ForkeMailPromo, SoonBadge, type RecentPost } from './NavBentos'
import { ContactBento } from './ContactBento'
import { MobileMenuButton, MobileNav } from './MobileNav'

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

/** The navbar at the top of the hero: just the logo and the call to action (the menus live in the sticky bar). */
export function HeroNav() {
  return (
    <nav className="relative z-30 flex h-16 items-center justify-between px-5 sm:px-8">
      <Logo />
      {/* the hero always shows the call to action; the menu button only appears in the sticky bar once you scroll */}
      <NavCta />
    </nav>
  )
}

const EASE = 'cubic-bezier(0.32,0.72,0,1)'
const BAR_H = 56 // h-14
/** Menu motion is kept short so moving across the headings feels immediate. */
const T_SHEET = 340
const T_PILL = 220

/** Frosted glass: a strong blur with boosted colour, so what's behind glows through instead of turning muddy. */
const GLASS_FILTER = 'blur(40px) saturate(170%)'
/** Fine grain over the glass; it kills banding and makes it read as frosted rather than a dark film. */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

/** A link or an external anchor, picked by its href. */
function MenuHref({ href, className, onPick, children }: { href: string; className: string; onPick: () => void; children: ReactNode }) {
  return isExternal(href) ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} onClick={onPick}>
      {children}
    </a>
  ) : (
    <Link href={href} className={className} onClick={onPick}>
      {children}
    </Link>
  )
}

/** The slanted arrow every menu link carries; it nudges up-right on hover. */
const Slant = ({ className = '' }: { className?: string }) => (
  <ArrowUpRight
    className={cn(
      'h-4 w-4 shrink-0 text-white/25 transition-[color,transform] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/80',
      className,
    )}
  />
)

const FOCUS = 'outline-none focus-visible:ring-2 focus-visible:ring-accent/60'

function MenuLinks({ menu, onPick, onHover }: { menu: SiteMenu; onPick: () => void; onHover: (i: number | null) => void }) {
  return (
    <div className="flex flex-col px-2 py-3">
      <p className="px-2.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/45">{menu.title}</p>
      <ul className="mt-2.5 space-y-0.5">
        {menu.links.map((l, i) => (
          <li key={l.label} onPointerEnter={() => onHover(i)} onPointerLeave={() => onHover(null)}>
            {l.soon ? (
              <div className="flex items-start justify-between gap-3 rounded-lg px-2.5 py-[7px]">
                <span className="min-w-0">
                  <span className="flex items-center gap-2 text-[14.5px] leading-5 text-white/85">
                    {l.label}
                    <SoonBadge />
                  </span>
                  {l.desc && <span className="mt-0.5 block truncate text-[12.5px] leading-4 text-white/40">{l.desc}</span>}
                </span>
              </div>
            ) : (
              <MenuHref
                href={l.href}
                onPick={onPick}
                className={cn('group flex items-start justify-between gap-3 rounded-lg px-2.5 py-[7px] transition-colors duration-150 hover:bg-white/[0.06]', FOCUS)}
              >
                <span className="min-w-0">
                  <span className="flex items-center gap-2 text-[14.5px] leading-5 text-white/85 transition-colors group-hover:text-white">
                    {l.label}
                    {l.soon && <SoonBadge />}
                  </span>
                  {l.desc && <span className="mt-0.5 block truncate text-[12.5px] leading-4 text-white/40 transition-colors group-hover:text-white/55">{l.desc}</span>}
                </span>
                <Slant className="mt-0.5" />
              </MenuHref>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * The sticky bar, a touch narrower than the inner rails (1200px): on the landing page it fades in once the hero has
 * scrolled completely away, and fades out again when the "Supported by" strip comes into view.
 *
 * Its menus (Company, Built for, Resources, Contact) open by growing the bar downward into one sheet of glass: links
 * with one-line hints on the left, a bento on the right (Resources shows the newest posts). One element carries the
 * glass for both, and nothing above it fades or filters, because a blur nested under another blur or a fading parent
 * only sees that parent and the page shows through sharp. So the bar fades its glass and its contents separately.
 * While a menu is open the page dims, a pill and a warm glow slide to the active heading, and switching menus nudges
 * the content in from the side you moved toward. Opens on hover (with a short grace period so the pointer can travel
 * into the panel) and on click/tap; Escape or a click outside closes it.
 */
export function StickyNav({ always = false }: { always?: boolean }) {
  const [show, setShow] = useState(always)
  useEffect(() => {
    if (always) return
    const onScroll = () => {
      const hero = document.querySelector('[data-hero-frame]')
      const past = hero ? hero.getBoundingClientRect().bottom <= 0 : window.scrollY > window.innerHeight
      // and it steps aside again once the "Supported by" strip comes into view, for the rest of the page
      const end = document.querySelector('[data-supported-by]')
      const ending = !!end && end.getBoundingClientRect().top < window.innerHeight * 0.9
      setShow(past && !ending)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [always])

  // ---- menu state
  const [open, setOpen] = useState<number | null>(null)
  const [shown, setShown] = useState(0) // which menu's content the panel shows (kept while it closes)
  const [dir, setDir] = useState<'down' | 'left' | 'right'>('down')
  const timer = useRef<number | undefined>(undefined)
  const hoverAt = useRef(0) // when hover last opened a menu, so the click that follows doesn't close it again
  const [hoverLink, setHoverLink] = useState<number | null>(null) // a link pointed at in the open menu
  const wrap = useRef<HTMLDivElement>(null)
  const heads = useRef<HTMLDivElement>(null)

  const openMenu = (i: number) => {
    window.clearTimeout(timer.current)
    if (open === null) setDir('down')
    else if (i !== shown) setDir(i > shown ? 'right' : 'left')
    setOpen(i)
    setShown(i)
  }
  const hideSoon = () => {
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setOpen(null), 140)
  }
  const keep = () => window.clearTimeout(timer.current)
  const close = () => setOpen(null)

  useEffect(() => {
    if (open === null) return
    const onEvent = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !wrap.current?.contains(e.target as Node)) setOpen(null)
    }
    document.addEventListener('mousedown', onEvent)
    document.addEventListener('keydown', onEvent)
    return () => {
      document.removeEventListener('mousedown', onEvent)
      document.removeEventListener('keydown', onEvent)
    }
  }, [open])
  useEffect(() => {
    if (!show) setOpen(null)
  }, [show])
  useEffect(() => () => window.clearTimeout(timer.current), [])

  // ---- newest posts for Resources, fetched once the bar first appears
  const [posts, setPosts] = useState<RecentPost[] | null>(null)
  const fetched = useRef(false)
  useEffect(() => {
    if (!show || fetched.current) return
    fetched.current = true
    fetch('/api/recent-blogs')
      .then((r) => (r.ok ? r.json() : { posts: [] }))
      .then((d: { posts?: RecentPost[] }) => setPosts(d.posts ?? []))
      .catch(() => setPosts([]))
  }, [show])

  // ---- the panel's height, so the sheet can grow to fit it
  const content = useRef<HTMLDivElement>(null)
  const [panelH, setPanelH] = useState(0)
  useLayoutEffect(() => {
    const el = content.current
    if (!el) return
    const measure = () => setPanelH(el.offsetHeight)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // ---- the pill and the glow follow the active heading
  const [pill, setPill] = useState({ x: 0, w: 0 })
  const [glowX, setGlowX] = useState(0)
  useLayoutEffect(() => {
    if (open === null) return
    const btn = heads.current?.querySelector<HTMLElement>(`[data-menu="${open}"]`)
    const box = wrap.current?.getBoundingClientRect()
    if (!btn || !box) return
    setPill({ x: btn.offsetLeft, w: btn.offsetWidth })
    const r = btn.getBoundingClientRect()
    setGlowX(r.left + r.width / 2 - box.left)
  }, [open])

  const isOpen = open !== null
  const menu = NAV_MENUS[shown]
  const slide =
    dir === 'right'
      ? 'animate-[menu-from-right_200ms_cubic-bezier(0.22,1,0.36,1)_both]'
      : dir === 'left'
        ? 'animate-[menu-from-left_200ms_cubic-bezier(0.22,1,0.36,1)_both]'
        : 'animate-[menu-in_240ms_cubic-bezier(0.22,1,0.36,1)_both]'
  const fade = { opacity: show ? 1 : 0, transition: 'opacity 450ms ease-out' }

  return (
    <>
      {/* the page dims behind an open menu */}
      <div
        aria-hidden
        className={cn('fixed inset-0 z-40 bg-black/45 transition-opacity duration-200', isOpen ? 'opacity-100' : 'pointer-events-none opacity-0')}
      />
      <nav
        aria-hidden={!show}
        className={cn('fixed inset-x-0 top-3 z-50 px-4 sm:px-6', !show && 'pointer-events-none')}
        style={{ transform: show ? 'none' : 'translateY(-6px)', transition: `transform 450ms ${EASE}` }}
      >
        <div ref={wrap} className="relative mx-auto max-w-[1160px]">
          {/* the glass: one sheet behind the bar and the open panel; it fades itself so its blur never drops out */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 overflow-hidden rounded-2xl border border-white/10"
            style={{
              height: isOpen ? BAR_H + panelH : BAR_H,
              opacity: show ? 1 : 0,
              transition: `height ${T_SHEET}ms ${EASE}, opacity 450ms ease-out`,
              background: 'rgba(20,19,19,0.6)',
              backdropFilter: GLASS_FILTER,
              WebkitBackdropFilter: GLASS_FILTER,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.09), 0 30px 80px -24px rgba(0,0,0,0.85)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] via-transparent to-transparent" />
            <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay" style={{ backgroundImage: GRAIN }} />
            <div
              className="absolute -top-44 h-[360px] w-[620px] -translate-x-1/2"
              style={{
                left: glowX,
                opacity: isOpen ? 1 : 0,
                background: 'radial-gradient(closest-side, rgba(255,122,0,0.17), rgba(255,122,0,0.05) 55%, transparent)',
                transition: `left ${T_SHEET}ms ${EASE}, opacity 200ms ease`,
              }}
            />
          </div>

          <div style={fade}>
            {/* the bar */}
            <div className="relative flex h-14 items-center justify-between px-3 sm:px-4">
              <Logo />
              <div ref={heads} className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 lg:flex" onPointerLeave={hideSoon}>
                {/* the pill slides between headings instead of each one lighting up on its own */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 my-auto h-8 rounded-lg bg-white/[0.08]"
                  style={{
                    left: pill.x,
                    width: pill.w,
                    opacity: isOpen ? 1 : 0,
                    transition: `left ${T_PILL}ms ${EASE}, width ${T_PILL}ms ${EASE}, opacity 150ms ease`,
                  }}
                />
                {NAV_MENUS.map((m, i) => (
                  <button
                    key={m.title}
                    type="button"
                    data-menu={i}
                    aria-haspopup="true"
                    aria-expanded={open === i}
                    onPointerEnter={(e) => {
                      if (e.pointerType !== 'mouse') return
                      if (open !== i) hoverAt.current = Date.now()
                      openMenu(i)
                    }}
                    onClick={() => (open === i && Date.now() - hoverAt.current > 400 ? setOpen(null) : openMenu(i))}
                    className={cn(
                      'relative flex h-8 items-center gap-1 whitespace-nowrap rounded-lg px-3 text-sm transition-colors duration-150',
                      FOCUS,
                      open === i ? 'text-white' : 'text-white/70 hover:text-white',
                      !isOpen && 'hover:bg-white/[0.05]',
                    )}
                  >
                    {m.title}
                    <ChevronDown className={cn('h-3.5 w-3.5 text-white/45 transition-transform duration-200', open === i && 'rotate-180 text-white/70')} />
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden lg:block">
                  <NavCta />
                </div>
                <MobileMenuButton />
              </div>
            </div>

            {/* the panel: the sheet grows down to reveal it */}
            <div
              onPointerEnter={keep}
              onPointerLeave={hideSoon}
              className={cn('relative hidden overflow-hidden lg:block', !isOpen && 'pointer-events-none')}
              style={{ height: isOpen ? panelH : 0, transition: `height ${T_SHEET}ms ${EASE}` }}
            >
              <div ref={content}>
                <div className={cn('mx-4 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent transition-opacity duration-200', isOpen ? 'opacity-100' : 'opacity-0')} />
                {/* fixed height: every menu's bento fills it, so the bar never resizes between menus */}
                <div key={shown} className={cn('grid h-[312px] grid-cols-[300px_minmax(0,1fr)] gap-3 px-2', slide)}>
                  <MenuLinks menu={menu} onPick={close} onHover={setHoverLink} />
                  <div className="min-w-0 py-3 pr-1">
                    {menu.bento === 'mail' && <ForkeMailPromo active={open === shown} />}
                    {menu.bento === 'builtFor' && <BuiltForBento links={menu.links} focus={hoverLink} />}
                    {menu.bento === 'blogs' && <BlogBento posts={posts} onPick={close} />}
                    {menu.bento === 'contact' && <ContactBento onPick={close} />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <MobileNav cta={<NavCta />} />
    </>
  )
}
