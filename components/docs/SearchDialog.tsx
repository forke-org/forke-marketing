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

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CornerDownLeft, FileText, Hash, Search } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { SearchEntry } from '@/lib/docs/load'
import { MethodBadge } from './DocsShell'

const SUGGESTED = ['mail/quickstart', 'agents/quickstart', 'mail/api/emails/send', 'mail/domains', 'forke', 'forke/claiming', 'forke/review-pipeline']

type Hit = { entry: SearchEntry; score: number; heading?: string; snippet?: string }

function search(index: SearchEntry[], query: string): Hit[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (!words.length) return []
  const hits: Hit[] = []
  for (const e of index) {
    const title = e.title.toLowerCase()
    const text = e.text.toLowerCase()
    let score = 0
    let heading: string | undefined
    let all = true
    for (const w of words) {
      let s = 0
      if (title.startsWith(w)) s += 14
      else if (title.includes(w)) s += 10
      const h = e.headings.find((x) => x.toLowerCase().includes(w))
      if (h) {
        s += 5
        heading ??= h
      }
      if (e.description.toLowerCase().includes(w)) s += 3
      if (e.group.toLowerCase().includes(w) || e.tab.toLowerCase().includes(w)) s += 2
      if (text.includes(w)) s += 1
      if (!s) all = false
      score += s
    }
    if (!all) continue
    let snippet: string | undefined
    const at = text.indexOf(words[0])
    if (at >= 0 && !title.includes(words[0])) {
      const start = Math.max(0, at - 50)
      snippet = (start ? '…' : '') + e.text.slice(start, at + 90).trim() + '…'
    }
    hits.push({ entry: e, score, heading, snippet })
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, 12)
}

function Highlight({ text, query }: { text: string; query: string }) {
  const words = query.toLowerCase().split(/\s+/).filter((w) => w.length > 1)
  if (!words.length) return <>{text}</>
  const re = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi')
  return <>{text.split(re).map((part, i) => (i % 2 ? <mark key={i} className="rounded-sm bg-accent/20 px-0.5 text-white">{part}</mark> : part))}</>
}

export function SearchDialog({ open, onClose, index }: { open: boolean; onClose: () => void; index: SearchEntry[] }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const list = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const results = useMemo<Hit[]>(() => (query.trim() ? search(index, query) : SUGGESTED.map((p) => index.find((e) => e.path === p)).filter(Boolean).map((entry) => ({ entry: entry!, score: 0 }))), [index, query])

  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
      setTimeout(() => input.current?.focus(), 10)
    }
  }, [open])
  useEffect(() => setActive(0), [query])
  useEffect(() => {
    list.current?.querySelector(`[data-i="${active}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const go = (h: Hit) => {
    onClose()
    const anchor = h.heading ? '#' + h.heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : ''
    router.push(`/docs-demo/${h.entry.path}${anchor}`)
  }

  if (!open) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Search the docs">
      <div className="absolute inset-0 animate-[docs-fade_0.15s_ease-out] bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-[620px] animate-[docs-in_0.18s_ease-out] overflow-hidden rounded-2xl border border-white/[0.1] bg-[#171615] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]">
        <div className="flex items-center gap-3 border-b border-white/[0.07] px-4">
          <Search className="h-4 w-4 text-white/40" />
          <input
            ref={input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') onClose()
              else if (e.key === 'ArrowDown') {
                e.preventDefault()
                setActive((a) => Math.min(results.length - 1, a + 1))
              } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setActive((a) => Math.max(0, a - 1))
              } else if (e.key === 'Enter' && results[active]) go(results[active])
            }}
            placeholder="Search Forke, Forke Mail, the API and the CLI…"
            className="h-14 flex-1 bg-transparent text-[15px] text-white outline-none placeholder:text-white/30"
          />
          <kbd className="rounded border border-white/[0.1] px-1.5 py-px font-mono text-[10.5px] text-white/40">Esc</kbd>
        </div>
        <div ref={list} className="docs-scroll max-h-[min(60vh,480px)] overflow-y-auto p-2">
          {!query.trim() ? <p className="px-3 pt-2 pb-1.5 text-[11.5px] font-medium text-white/35">Popular</p> : null}
          {results.length === 0 ? (
            <div className="px-4 py-10 text-center text-[13.5px] text-white/40">
              No results for “{query}”. Try a shorter word, like <span className="text-white/70">domain</span>, <span className="text-white/70">webhook</span> or <span className="text-white/70">claim</span>.
            </div>
          ) : (
            results.map((h, i) => (
              <button
                key={h.entry.path}
                data-i={i}
                onMouseMove={() => setActive(i)}
                onClick={() => go(h)}
                className={cn('flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors', i === active ? 'bg-white/[0.06]' : '')}
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.02] text-white/45">
                  {h.entry.method ? <MethodBadge method={h.entry.method} className="w-auto bg-transparent px-0 text-[8.5px]" /> : h.heading ? <Hash className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 text-[13.5px] text-white">
                    <span className="truncate"><Highlight text={h.entry.title} query={query} /></span>
                    {h.heading ? <span className="truncate text-white/40">› <Highlight text={h.heading} query={query} /></span> : null}
                  </span>
                  <span className="mt-0.5 block truncate text-[12px] text-white/40">{h.snippet ? <Highlight text={h.snippet} query={query} /> : h.entry.description}</span>
                </span>
                <span className="mt-1 shrink-0 text-[11px] text-white/30">{h.entry.tab}</span>
              </button>
            ))
          )}
        </div>
        <div className="flex items-center gap-4 border-t border-white/[0.06] px-4 py-2.5 text-[11px] text-white/35">
          <span className="flex items-center gap-1"><kbd className="docs-kbd">↑</kbd><kbd className="docs-kbd">↓</kbd> to move</span>
          <span className="flex items-center gap-1"><kbd className="docs-kbd"><CornerDownLeft className="h-2.5 w-2.5" /></kbd> to open</span>
          <span className="ml-auto">Agents: <a href="/docs-demo/llms.txt" className="text-white/55 hover:text-white">llms.txt</a> · <a href="/docs-demo/agents/docs-for-agents" onClick={onClose} className="text-white/55 hover:text-white">docs MCP</a></span>
        </div>
      </div>
    </div>
  )
}
