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

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import { Check, Copy, FileCode2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { LangLogo } from './LangLogo'

/**
 * A code block or a set of tabs. The chosen language is remembered across pages and tabs
 * (pick Python once and every example switches), like Resend's docs.
 */

const KEY = 'forke-docs-lang'
const EVENT = 'forke-docs-lang'
const FAMILY: Record<string, string> = { 'Node.js': 'js', TypeScript: 'js', JavaScript: 'js', 'Next.js': 'js', Express: 'js', cURL: 'shell', Terminal: 'shell', Python: 'py', Django: 'py', PHP: 'php', Laravel: 'php', Ruby: 'rb', Rails: 'rb', Go: 'go', Rust: 'rs', Java: 'java', '.NET': 'cs', 'C#': 'cs' }

const store = {
  subscribe(cb: () => void) {
    window.addEventListener(EVENT, cb)
    window.addEventListener('storage', cb)
    return () => {
      window.removeEventListener(EVENT, cb)
      window.removeEventListener('storage', cb)
    }
  },
  get: () => (typeof window === 'undefined' ? '' : localStorage.getItem(KEY) ?? ''),
  set(v: string) {
    try {
      localStorage.setItem(KEY, v)
    } catch {}
    window.dispatchEvent(new Event(EVENT))
  },
}

export type CodeTab = { title: string; lang: string; html: string; code: string }

export function CodeGroup({ tabs, filename, panel, className, wrap, bodyClassName }: { tabs: CodeTab[]; filename?: string; panel?: boolean; className?: string; wrap?: boolean; bodyClassName?: string }) {
  const preferred = useSyncExternalStore(store.subscribe, store.get, () => '')
  const [local, setLocal] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)

  const fromPref = (() => {
    if (!preferred || tabs.length < 2) return -1
    const exact = tabs.findIndex((t) => t.title === preferred)
    if (exact >= 0) return exact
    const fam = FAMILY[preferred]
    return fam ? tabs.findIndex((t) => FAMILY[t.title] === fam) : -1
  })()
  const active = local ?? (fromPref >= 0 ? fromPref : 0)
  useEffect(() => setLocal(null), [preferred])

  const pick = (i: number) => {
    setLocal(i)
    store.set(tabs[i].title)
  }
  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(tabs[active].code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }, [tabs, active])

  const single = tabs.length === 1
  const label = single ? filename ?? (tabs[0].title !== tabs[0].lang ? tabs[0].title : null) : null

  return (
    <div className={cn('docs-code group/code not-prose relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#0f0e0e]', panel && 'rounded-lg', className)}>
      {single && !label ? null : (
        <div className="flex items-center justify-between gap-2 border-b border-white/[0.06] bg-white/[0.015] pr-2">
          {single ? (
            <div className="flex min-w-0 items-center gap-2 px-4 py-2.5 font-mono text-[12px] text-white/55">
              {filename ? <FileCode2 className="h-3.5 w-3.5 shrink-0 text-white/35" /> : <LangLogo name={tabs[0].title} className="h-3.5 w-3.5" />}
              <span className="truncate">{label}</span>
            </div>
          ) : (
            <div role="tablist" className="flex min-w-0 items-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {tabs.map((t, i) => (
                <button
                  key={t.title + i}
                  role="tab"
                  aria-selected={i === active}
                  onClick={() => pick(i)}
                  className={cn(
                    'relative flex shrink-0 items-center gap-1.5 px-3.5 py-2.5 text-[12.5px] font-medium outline-none transition-colors focus-visible:bg-white/[0.04]',
                    i === active ? 'text-white' : 'text-white/40 hover:text-white/75',
                  )}
                >
                  <LangLogo name={t.title} className={cn('h-3.5 w-3.5 transition-opacity', i === active ? 'opacity-100' : 'opacity-50')} />
                  {t.title}
                  <span className={cn('absolute inset-x-2 -bottom-px h-px rounded-full bg-accent transition-opacity', i === active ? 'opacity-100' : 'opacity-0')} />
                </button>
              ))}
            </div>
          )}
          <CopyButton copied={copied} onClick={copy} />
        </div>
      )}
      {single && !label ? (
        <div className="absolute top-2 right-2 z-10 opacity-0 transition-opacity group-hover/code:opacity-100 focus-within:opacity-100">
          <CopyButton copied={copied} onClick={copy} />
        </div>
      ) : null}
      <div className={cn('docs-scroll-x overflow-x-auto text-[13px] leading-[1.7]', (wrap || tabs[active].lang === 'text') && 'docs-wrap', bodyClassName ?? (panel ? 'max-h-[520px] overflow-y-auto' : 'max-h-[640px] overflow-y-auto'))} dangerouslySetInnerHTML={{ __html: tabs[active].html }} />
    </div>
  )
}

function CopyButton({ copied, onClick }: { copied: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={copied ? 'Copied' : 'Copy code'}
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/[0.08] bg-[#151414] text-white/45 transition-colors hover:border-white/[0.16] hover:text-white"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  )
}
