'use client'

import Link from 'next/link'
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { RiGithubFill, RiInstagramLine, RiLinkedinBoxFill, RiMailLine, type RemixiconComponentType } from '@remixicon/react'
import { cn } from './primitives'
import { NAV_MENUS, isExternal, type SiteLink } from './siteMenus'
import { SoonBadge, type RecentPost } from './NavBentos'

/**
 * Phone and tablet navigation (below lg, where the sticky bar's dropdowns are hidden): the menu button drops a glass
 * card from the bar with the four menus as tabs (tap or swipe), one menu at a time, and the call to action at the
 * bottom (the bar itself carries only the logo and the menu button on these sizes).
 */

// ---------------------------------------------------------------- shared state (open + tab)

let state = { open: false, tab: 0 }
const subs = new Set<() => void>()
const subscribe = (f: () => void) => {
  subs.add(f)
  return () => subs.delete(f)
}
const SERVER = { open: false, tab: 0 }
const set = (p: Partial<typeof state>) => {
  state = { ...state, ...p }
  subs.forEach((f) => f())
}
function useMobileNav() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => SERVER,
  )
}

const EASE = 'cubic-bezier(0.32,0.72,0,1)'
const GLASS: React.CSSProperties = {
  background: 'rgba(20,19,19,0.72)',
  backdropFilter: 'blur(40px) saturate(170%)',
  WebkitBackdropFilter: 'blur(40px) saturate(170%)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.09), 0 30px 80px -24px rgba(0,0,0,0.85)',
}

// ---------------------------------------------------------------- pieces

/** Two bars that fold into an X. */
function Burger({ open }: { open: boolean }) {
  return (
    <span className="relative block h-3 w-[18px]">
      <span
        className="absolute left-0 h-[1.5px] w-full rounded bg-white transition-transform duration-300"
        style={{
          top: 2,
          transform: open ? 'translateY(3.25px) rotate(45deg)' : 'none',
          transitionTimingFunction: EASE,
        }}
      />
      <span
        className="absolute left-0 h-[1.5px] w-full rounded bg-white transition-transform duration-300"
        style={{
          bottom: 2,
          transform: open ? 'translateY(-3.25px) rotate(-45deg)' : 'none',
          transitionTimingFunction: EASE,
        }}
      />
    </span>
  )
}

/** The menu button for the top bars. */
export function MobileMenuButton() {
  const s = useMobileNav()
  return (
    <button
      type="button"
      data-mnav
      aria-label={s.open ? 'Close menu' : 'Open menu'}
      aria-expanded={s.open}
      onClick={() => set({ open: !s.open })}
      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.04] transition-colors active:bg-white/[0.1] lg:hidden"
    >
      <Burger open={s.open} />
    </button>
  )
}

function Href({ l, onPick, className, children }: { l: SiteLink; onPick: () => void; className: string; children: ReactNode }) {
  if (l.soon) return <div className={className}>{children}</div>
  return isExternal(l.href) ? (
    <a href={l.href} target="_blank" rel="noopener noreferrer" onClick={onPick} className={className}>
      {children}
    </a>
  ) : (
    <Link href={l.href} onClick={onPick} className={className}>
      {children}
    </Link>
  )
}

function RowEnd({ href }: { href: string }) {
  const Icon = linkIcon(href)
  return Icon ? <Icon className="h-[18px] w-[18px] shrink-0 text-white/45" /> : <ArrowUpRight className="h-4 w-4 shrink-0 text-white/25" />
}

/** Contact links show where they go (mail, Instagram, LinkedIn, GitHub) instead of the slanted arrow. */
function linkIcon(href: string): RemixiconComponentType | null {
  if (href.startsWith('mailto:')) return RiMailLine
  if (href.includes('instagram.com')) return RiInstagramLine
  if (href.includes('linkedin.com')) return RiLinkedinBoxFill
  if (href.includes('github.com')) return RiGithubFill
  return null
}

function LinkRow({ l, onPick, big = false }: { l: SiteLink; onPick: () => void; big?: boolean }) {
  return (
    <Href
      l={l}
      onPick={onPick}
      className="group flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors active:bg-white/[0.07]"
    >
      <span className="min-w-0">
        <span className={cn('flex items-center gap-2 text-white/90', big ? 'text-[16px]' : 'text-[15px]')}>
          {l.label}
          {l.soon && <SoonBadge />}
        </span>
        {l.desc && <span className="mt-0.5 block truncate text-[12.5px] text-white/40">{l.desc}</span>}
      </span>
      {!l.soon && <RowEnd href={l.href} />}
    </Href>
  )
}

function usePosts(on: boolean) {
  const [posts, setPosts] = useState<RecentPost[] | null>(null)
  const done = useRef(false)
  useEffect(() => {
    if (!on || done.current) return
    done.current = true
    fetch('/api/recent-blogs')
      .then((r) => (r.ok ? r.json() : { posts: [] }))
      .then((d: { posts?: RecentPost[] }) => setPosts(d.posts ?? []))
      .catch(() => setPosts([]))
  }, [on])
  return posts
}

function PostStrip({ posts, onPick }: { posts: RecentPost[] | null; onPick: () => void }) {
  if (!posts?.length) return null
  return (
    <div className="flex snap-x gap-2 overflow-x-auto px-3 pb-1 [scrollbar-width:none]">
      {posts.slice(0, 3).map((p) => (
        <Link
          key={p.slug}
          href={`/blogs/${p.slug}`}
          onClick={onPick}
          className="w-[210px] shrink-0 snap-start overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]"
        >
          {p.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.coverImage} alt="" className="aspect-[16/9] w-full object-cover" />
          )}
          <p className="line-clamp-2 px-3 py-2 text-[12.5px] leading-4 text-white/75">{p.title}</p>
        </Link>
      ))}
    </div>
  )
}

const close = () => set({ open: false })

// ---------------------------------------------------------------- B · Tabs

function Tabs({ cta }: { cta: ReactNode }) {
  const { open, tab } = useMobileNav()
  const posts = usePosts(open)
  const [dir, setDir] = useState<'left' | 'right'>('right')
  const row = useRef<HTMLDivElement>(null)
  const [pill, setPill] = useState({ x: 0, w: 0 })
  useLayoutEffect(() => {
    const b = row.current?.querySelector<HTMLElement>(`[data-tab="${tab}"]`)
    if (b) setPill({ x: b.offsetLeft, w: b.offsetWidth })
  }, [tab, open])
  useEffect(() => {
    if (!open) return
    const out = (e: PointerEvent) => {
      const t = e.target as HTMLElement
      if (!t.closest('[data-mnav]')) close()
    }
    document.addEventListener('pointerdown', out)
    return () => document.removeEventListener('pointerdown', out)
  }, [open])
  const go = (i: number) => {
    if (i < 0 || i >= NAV_MENUS.length || i === tab) return
    setDir(i > tab ? 'right' : 'left')
    set({ tab: i })
  }
  const start = useRef<number | null>(null)
  const m = NAV_MENUS[tab]
  return (
    <>
      <div
        aria-hidden
        className={cn(
          'fixed inset-0 z-[45] bg-black/50 transition-opacity duration-300 lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />
      <div
        data-mnav
        className={cn(
          'fixed inset-x-3 top-[76px] z-[60] origin-top rounded-2xl border border-white/10 lg:hidden',
          !open && 'pointer-events-none',
        )}
        style={{
          ...GLASS,
          opacity: open ? 1 : 0,
          transform: open ? 'none' : 'translateY(-10px) scale(0.97)',
          transition: `opacity 220ms ease, transform 380ms ${EASE}`,
        }}
      >
        <div ref={row} className="relative flex gap-0.5 overflow-x-auto p-1.5 [scrollbar-width:none]">
          <span
            aria-hidden
            className="absolute inset-y-1.5 rounded-xl bg-white/[0.09]"
            style={{
              left: pill.x,
              width: pill.w,
              transition: `left 260ms ${EASE}, width 260ms ${EASE}`,
            }}
          />
          {NAV_MENUS.map((t, i) => (
            <button
              key={t.title}
              type="button"
              data-tab={i}
              onClick={() => go(i)}
              className={cn(
                'relative flex-1 whitespace-nowrap rounded-xl px-2 py-2 text-[13px] transition-colors',
                tab === i ? 'text-white' : 'text-white/55',
              )}
            >
              {t.title}
            </button>
          ))}
        </div>
        <div className="mx-3 h-px bg-white/[0.07]" />
        <div
          className="overflow-hidden"
          onPointerDown={(e) => (start.current = e.clientX)}
          onPointerUp={(e) => {
            if (start.current === null) return
            const dx = e.clientX - start.current
            start.current = null
            if (Math.abs(dx) > 50) go(tab + (dx < 0 ? 1 : -1))
          }}
        >
          <div
            key={tab}
            className={cn(
              'pb-2 pt-1.5',
              dir === 'right'
                ? 'animate-[menu-from-right_260ms_cubic-bezier(0.22,1,0.36,1)_both]'
                : 'animate-[menu-from-left_260ms_cubic-bezier(0.22,1,0.36,1)_both]',
            )}
          >
            <div className="px-1.5">
              {m.links.map((l) => (
                <LinkRow key={l.label} l={l} onPick={close} />
              ))}
            </div>
            {m.bento === 'blogs' && (
              <div className="pt-2">
                <PostStrip posts={posts} onPick={close} />
              </div>
            )}
          </div>
        </div>
        {/* the call to action lives here on phones and tablets, not in the bar */}
        <div className="border-t border-white/[0.07] p-3 [&>*]:w-full [&_a]:h-10 [&_a]:w-full [&_a]:justify-center [&_button]:h-10 [&_button]:w-full [&_button]:justify-center">{cta}</div>
      </div>
    </>
  )
}

/** Mount once per page (the sticky nav does). */
export function MobileNav({ cta }: { cta: ReactNode }) {
  return <Tabs cta={cta} />
}
