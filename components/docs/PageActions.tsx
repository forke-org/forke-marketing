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

import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Copy, FileText, Plug } from 'lucide-react'
import { RiClaudeFill, RiOpenaiFill } from '@remixicon/react'
import { cn } from '@/lib/utils/cn'

/** Copy the page as markdown, or hand it to an AI app, in one click. */
export function PageActions({ path }: { path: string }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState<'page' | 'mcp' | null>(null)
  const box = useRef<HTMLDivElement>(null)
  const md = `/docs-demo${path ? '/' + path : ''}.md`
  const url = `https://www.forke.space/docs-demo${path ? '/' + path : ''}`
  const prompt = encodeURIComponent(`Read ${url}.md so I can ask you questions about it.`)

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => !box.current?.contains(e.target as Node) && setOpen(false)
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', esc)
    }
  }, [open])

  const flash = (k: 'page' | 'mcp') => {
    setCopied(k)
    setTimeout(() => setCopied(null), 1600)
  }
  const copyPage = async () => {
    try {
      const text = await (await fetch(md)).text()
      await navigator.clipboard.writeText(text)
      flash('page')
    } catch {}
  }
  const copyMcp = async () => {
    try {
      await navigator.clipboard.writeText('https://www.forke.space/docs-demo/mcp')
      flash('mcp')
    } catch {}
  }

  const item = 'flex w-full items-start gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-white/[0.05]'
  return (
    <div ref={box} className="relative flex shrink-0">
      <button onClick={copyPage} className="flex h-8 items-center gap-1.5 rounded-l-lg border border-white/[0.1] bg-white/[0.03] px-2.5 text-[12.5px] text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white">
        {copied === 'page' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
        {copied === 'page' ? 'Copied' : 'Copy page'}
      </button>
      <button onClick={() => setOpen((o) => !o)} aria-label="More page actions" aria-expanded={open} className="flex h-8 w-8 items-center justify-center rounded-r-lg border border-l-0 border-white/[0.1] bg-white/[0.03] text-white/55 transition-colors hover:bg-white/[0.06] hover:text-white">
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} />
      </button>
      {open ? (
        <div className="absolute top-10 right-0 z-30 w-[290px] animate-[docs-in_0.15s_ease-out] rounded-xl border border-white/[0.1] bg-[#1a1918] p-1.5 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)]">
          <button onClick={copyPage} className={item}>
            <Copy className="mt-0.5 h-4 w-4 text-white/50" />
            <span><span className="block text-[13px] text-white">Copy page</span><span className="block text-[11.5px] text-white/40">As markdown, for LLMs</span></span>
          </button>
          <a href={md} target="_blank" className={item}>
            <FileText className="mt-0.5 h-4 w-4 text-white/50" />
            <span><span className="block text-[13px] text-white">View as markdown</span><span className="block text-[11.5px] text-white/40">The plain text of this page</span></span>
          </a>
          <a href={`https://claude.ai/new?q=${prompt}`} target="_blank" rel="noopener noreferrer" className={item}>
            <RiClaudeFill className="mt-0.5 h-4 w-4 text-[#D97757]" />
            <span><span className="block text-[13px] text-white">Open in Claude</span><span className="block text-[11.5px] text-white/40">Ask questions about this page</span></span>
          </a>
          <a href={`https://chatgpt.com/?hints=search&q=${prompt}`} target="_blank" rel="noopener noreferrer" className={item}>
            <RiOpenaiFill className="mt-0.5 h-4 w-4 text-white/80" />
            <span><span className="block text-[13px] text-white">Open in ChatGPT</span><span className="block text-[11.5px] text-white/40">Ask questions about this page</span></span>
          </a>
          <div className="my-1 h-px bg-white/[0.06]" />
          <button onClick={copyMcp} className={item}>
            {copied === 'mcp' ? <Check className="mt-0.5 h-4 w-4 text-emerald-400" /> : <Plug className="mt-0.5 h-4 w-4 text-white/50" />}
            <span><span className="block text-[13px] text-white">{copied === 'mcp' ? 'Copied the MCP URL' : 'Add the docs to your AI app'}</span><span className="block text-[11.5px] text-white/40">Copies the docs MCP server URL</span></span>
          </button>
        </div>
      ) : null}
    </div>
  )
}
