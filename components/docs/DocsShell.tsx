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

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, Menu, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { TABS, tabFor, type Tab } from '@/lib/docs/nav'
import type { SearchEntry } from '@/lib/docs/load'
import { DocIcon } from './Icon'
import { hasLogo } from './LangLogo'
import { SearchDialog } from './SearchDialog'

const pathOf = (pathname: string) => pathname.replace(/^\/docs-demo\/?/, '').replace(/\/$/, '')
const href = (p: string) => (p ? `/docs-demo/${p}` : '/docs-demo')

export const METHOD_TONE: Record<string, string> = {
  GET: 'text-emerald-300 bg-emerald-400/10',
  POST: 'text-sky-300 bg-sky-400/10',
  PUT: 'text-amber-200 bg-amber-400/10',
  PATCH: 'text-violet-300 bg-violet-400/10',
  DELETE: 'text-red-300 bg-red-400/10',
}

export function MethodBadge({ method, className }: { method: string; className?: string }) {
  return <span className={cn('inline-flex w-[42px] shrink-0 justify-center rounded px-1 py-px font-mono text-[9.5px] font-semibold tracking-wide', METHOD_TONE[method], className)}>{method === 'DELETE' ? 'DEL' : method}</span>
}

export default function DocsShell({ index, children }: { index: SearchEntry[]; children: React.ReactNode }) {
  const pathname = usePathname()
  const current = pathOf(pathname)
  const tab = tabFor(current)
  const [drawer, setDrawer] = useState(false)
  const [search, setSearch] = useState(false)

  useEffect(() => setDrawer(false), [pathname])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearch((s) => !s)
      } else if (e.key === '/' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault()
        setSearch(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawer])

  return (
    <div className="docs-root min-h-screen bg-[#121111] font-sans text-white selection:bg-accent selection:text-black">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/[0.06] bg-[#121111]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[1500px] items-center gap-4 px-4 sm:px-6">
          <button onClick={() => setDrawer(true)} aria-label="Open menu" className="-ml-1 flex h-9 w-9 items-center justify-center rounded-lg text-white/60 hover:bg-white/[0.05] hover:text-white lg:hidden">
            <Menu className="h-[18px] w-[18px]" />
          </button>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-[19px] font-semibold tracking-[-0.04em] text-white transition-opacity hover:opacity-80" aria-label="Forke home">
              forke<span className="text-accent">*</span>
            </Link>
            <span aria-hidden className="h-4 w-px bg-white/[0.14]" />
            <Link href="/docs-demo" className="text-[14px] font-medium text-white/80 hover:text-white">Docs</Link>
          </div>
          <button onClick={() => setSearch(true)} className="mx-auto hidden h-9 w-full max-w-[420px] items-center gap-2.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 text-[13px] text-white/40 transition-colors hover:border-white/[0.14] hover:bg-white/[0.05] hover:text-white/60 md:flex">
            <Search className="h-3.5 w-3.5" />
            <span>Search docs…</span>
            <kbd className="ml-auto rounded border border-white/[0.1] bg-white/[0.04] px-1.5 py-px font-mono text-[10.5px] text-white/40">⌘K</kbd>
          </button>
          <div className="ml-auto flex items-center gap-1.5 md:ml-0">
            <button onClick={() => setSearch(true)} aria-label="Search" className="flex h-9 w-9 items-center justify-center rounded-lg text-white/60 hover:bg-white/[0.05] md:hidden">
              <Search className="h-4 w-4" />
            </button>
            <a href="https://status.forke.space" target="_blank" rel="noopener noreferrer" className="hidden h-8 items-center rounded-lg px-3 text-[13px] text-white/55 transition-colors hover:bg-white/[0.05] hover:text-white sm:flex">Status</a>
            <a href={tab.id === 'mail' || tab.id === 'api' || tab.id === 'agents' ? 'https://mail.forke.space' : 'https://dashboard.forke.space'} className="flex h-8 items-center gap-1 rounded-lg border border-white/[0.1] bg-white px-3 text-[13px] font-medium text-black transition-opacity hover:opacity-90">
              Dashboard <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
        <nav aria-label="Products" className="docs-scroll-x mx-auto hidden h-11 max-w-[1500px] items-end gap-1 overflow-x-auto px-4 sm:px-6 md:flex">
          {TABS.map((t) => (
            <TabLink key={t.id} tab={t} active={t.id === tab.id} />
          ))}
        </nav>
      </header>

      <div className="mx-auto flex max-w-[1500px] pt-14 md:pt-[100px]">
        {tab.groups.length ? (
          <aside className="docs-scroll sticky top-[100px] hidden h-[calc(100vh-100px)] w-[272px] shrink-0 overflow-y-auto border-r border-white/[0.05] px-3 pt-6 pb-16 lg:block">
            <SidebarNav tab={tab} current={current} />
          </aside>
        ) : null}
        <div className="min-w-0 flex-1">{children}</div>
      </div>

      <div className={cn('fixed inset-0 z-50 lg:hidden', drawer ? 'pointer-events-auto' : 'pointer-events-none')} aria-hidden={!drawer}>
        <div onClick={() => setDrawer(false)} className={cn('absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300', drawer ? 'opacity-100' : 'opacity-0')} />
        <div className={cn('docs-scroll absolute inset-y-0 left-0 flex w-[300px] max-w-[85vw] flex-col overflow-y-auto border-r border-white/[0.08] bg-[#121111] transition-transform duration-300 ease-out', drawer ? 'translate-x-0' : '-translate-x-full')}>
          <div className="flex h-14 items-center justify-between border-b border-white/[0.06] px-4">
            <span className="text-[15px] font-medium">Docs</span>
            <button onClick={() => setDrawer(false)} aria-label="Close menu" className="flex h-8 w-8 items-center justify-center rounded-lg text-white/60 hover:bg-white/[0.05]">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1.5 border-b border-white/[0.06] p-3">
            {TABS.map((t) => (
              <Link key={t.id} href={href(t.root)} className={cn('flex items-center gap-2 rounded-lg px-2.5 py-2 text-[13px]', t.id === tab.id ? 'bg-white/[0.07] text-white' : 'text-white/55')}>
                {t.title}
              </Link>
            ))}
          </div>
          <div className="px-3 pt-4 pb-10">
            <SidebarNav tab={tab} current={current} />
          </div>
        </div>
      </div>

      <SearchDialog open={search} onClose={() => setSearch(false)} index={index} />
    </div>
  )
}

function TabLink({ tab, active }: { tab: Tab; active: boolean }) {
  return (
    <Link href={href(tab.root)} className={cn('group relative flex h-full shrink-0 items-center px-3 text-[13.5px] transition-colors', active ? 'text-white' : 'text-white/45 hover:text-white/80')}>
      {tab.title}
      <span className={cn('absolute inset-x-2 bottom-0 h-[2px] rounded-full bg-accent transition-opacity', active ? 'opacity-100' : 'opacity-0')} />
    </Link>
  )
}

function SidebarNav({ tab, current }: { tab: Tab; current: string }) {
  return (
    <nav aria-label={`${tab.title} pages`} className="space-y-6">
      {tab.groups.map((g) => (
        <div key={g.title}>
          <p className="mb-1.5 px-3 text-[11.5px] font-medium tracking-[0.01em] text-white/35">{g.title}</p>
          <ul className="space-y-px">
            {g.items.map((item) => {
              const active = item.path === current
              const isApi = Boolean(item.badge)
              return (
                <li key={item.path}>
                  <Link
                    href={href(item.path)}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'group flex items-center gap-2.5 rounded-lg px-3 py-[7px] text-[13.5px] transition-colors',
                      active ? 'bg-white/[0.06] font-medium text-white' : 'text-white/55 hover:bg-white/[0.03] hover:text-white/90',
                    )}
                  >
                    {isApi ? <MethodBadge method={item.badge!} /> : item.icon && hasLogo(item.icon) ? <DocIcon name={item.icon} className="h-[15px] w-[15px] shrink-0" /> : null}
                    <span className="truncate">{item.title}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}
