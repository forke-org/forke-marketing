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

import { useState } from 'react'
import {
  BarChart3,
  Check,
  ChevronDown,
  Copy,
  Globe,
  KeyRound,
  LifeBuoy,
  Mail,
  Newspaper,
  Repeat,
  Rocket,
  Truck,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

type PromptItem = { name: string; title: string; description: string; text: string }

const ICONS: Record<string, [LucideIcon, string]> = {
  'setup-app': [Rocket, 'Start here'],
  'welcome-email': [Mail, 'Template'],
  'auth-emails': [KeyRound, 'Templates'],
  'welcome-series': [Repeat, 'Workflow'],
  newsletter: [Newspaper, 'Broadcast'],
  'verify-domain': [Globe, 'Domain'],
  'debug-delivery': [LifeBuoy, 'Debug'],
  migrate: [Truck, 'Migrate'],
  'weekly-report': [BarChart3, 'Report'],
}

export function PromptGrid({ prompts }: { prompts: PromptItem[] }) {
  const [copied, setCopied] = useState('')
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const copy = async (name: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(name)
      setTimeout(() => setCopied(''), 1500)
    } catch {}
  }

  const toggle = (name: string) => {
    setExpanded((prev) => ({ ...prev, [name]: !prev[name] }))
  }

  const lead = prompts.find((p) => p.name === 'setup-app')
  const rest = prompts.filter((p) => p.name !== 'setup-app')

  return (
    <div className="space-y-4">
      {lead ? <FeaturedPromptCard prompt={lead} copied={copied === lead.name} onCopy={() => copy(lead.name, lead.text)} /> : null}
      <div className="grid gap-3.5 sm:grid-cols-2">
        {rest.map((p) => {
          const [Icon, tag] = ICONS[p.name] ?? [Mail, 'Prompt']
          const done = copied === p.name
          const open = Boolean(expanded[p.name])
          return (
            <article
              key={p.name}
              className="group/p flex h-full flex-col rounded-xl border border-white/[0.08] bg-[#121111]/80 p-4 transition-colors hover:border-white/[0.16] hover:bg-[#161514]"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-white/65 transition-colors group-hover/p:border-accent/30 group-hover/p:text-accent">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="rounded-full border border-white/[0.07] bg-white/[0.03] px-2.5 py-0.5 font-mono text-[10.5px] tracking-[0.05em] text-white/45 uppercase">
                  {tag}
                </span>
              </div>

              <h3 className="mt-3.5 text-[15px] font-medium tracking-[-0.01em] text-white">{p.title}</h3>
              <p className="mt-1 text-[13px] leading-relaxed text-white/50">{p.description}</p>

              <div className="mt-3.5 flex-1 rounded-lg border border-white/[0.06] bg-[#0b0a0a] px-3 py-2.5">
                <p
                  className={cn(
                    'font-mono text-[11.5px] leading-[1.6] whitespace-pre-wrap text-white/65',
                    !open && 'line-clamp-3',
                  )}
                >
                  {p.text}
                </p>
              </div>

              <div className="mt-3.5 flex items-center justify-between gap-2 pt-0.5 text-[12px]">
                <code className="font-mono text-[11.5px] text-white/35">/{p.name}</code>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => toggle(p.name)}
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11.5px] text-white/45 transition-colors hover:bg-white/[0.05] hover:text-white/80"
                  >
                    {open ? 'Less' : 'Full'}
                    <ChevronDown className={cn('h-3 w-3 transition-transform', open && 'rotate-180')} />
                  </button>
                  <button
                    type="button"
                    onClick={() => copy(p.name, p.text)}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[12px] font-medium transition-colors',
                      done
                        ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
                        : 'border-white/[0.1] bg-white/[0.04] text-white/80 hover:border-white/[0.2] hover:bg-white/[0.08] hover:text-white',
                    )}
                  >
                    {done ? <><Check className="h-3.5 w-3.5" />Copied</> : <><Copy className="h-3.5 w-3.5" />Copy</>}
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

function FeaturedPromptCard({ prompt, copied, onCopy }: { prompt: PromptItem; copied: boolean; onCopy: () => void }) {
  const lines = prompt.text.split('\n').filter(Boolean)
  const heading = lines[0]
  const steps = lines.slice(1)

  return (
    <article className="relative overflow-hidden rounded-2xl border border-accent/25 bg-[radial-gradient(90%_140%_at_0%_0%,rgba(255,122,0,0.09),transparent_55%),#121111] p-5 sm:p-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.25fr] lg:items-center">
        <div className="flex flex-col">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-black">
              <Rocket className="h-4 w-4" />
            </span>
            <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 font-mono text-[10.5px] tracking-[0.06em] text-accent uppercase">
              Start here
            </span>
          </div>

          <h3 className="mt-4 text-[18px] font-semibold tracking-[-0.02em] text-white">{prompt.title}</h3>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/55">{prompt.description}</p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onCopy}
              className={cn(
                'inline-flex h-9 items-center gap-2 rounded-lg px-3.5 text-[13px] font-medium transition-colors',
                copied
                  ? 'bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/30'
                  : 'bg-accent text-black hover:bg-[#ff8a1f]',
              )}
            >
              {copied ? <><Check className="h-3.5 w-3.5" />Copied to clipboard</> : <><Copy className="h-3.5 w-3.5" />Copy setup prompt</>}
            </button>
            <code className="font-mono text-[12px] text-white/35">/{prompt.name}</code>
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-[#0b0a0a]/90 p-4">
          <p className="border-b border-white/[0.06] pb-2.5 text-[12.5px] font-medium text-white/90">{heading}</p>
          <ol className="mt-2.5 space-y-1.5">
            {steps.map((s, i) => (
              <li key={i} className="flex gap-2.5 text-[12px] leading-relaxed text-white/60">
                <span className="shrink-0 font-mono text-[11px] text-accent/80 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <span>{s.replace(/^\d+\.\s*/, '')}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </article>
  )
}
