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
import { BarChart3, Check, Copy, Globe, KeyRound, LifeBuoy, Mail, Newspaper, Repeat, Rocket, Truck, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

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

export function PromptGrid({ prompts }: { prompts: { name: string; title: string; description: string; text: string }[] }) {
  const [copied, setCopied] = useState('')
  const copy = async (name: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(name)
      setTimeout(() => setCopied(''), 1500)
    } catch {}
  }
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {prompts.map((p) => {
        const [Icon, tag] = ICONS[p.name] ?? [Mail, 'Prompt']
        const done = copied === p.name
        const lead = p.name === 'setup-app'
        return (
          <button
            key={p.name}
            onClick={() => copy(p.name, p.text)}
            className={cn(
              'group/p flex flex-col rounded-xl border p-4 text-left transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0',
              lead ? 'border-accent/30 bg-accent/[0.06]' : 'border-white/[0.07] bg-white/[0.015] hover:border-white/[0.14] hover:bg-white/[0.03]',
            )}
          >
            <span className="flex items-start justify-between gap-3">
              <span className={cn('flex h-8 w-8 items-center justify-center rounded-lg', lead ? 'bg-accent text-black' : 'border border-white/[0.08] bg-white/[0.03] text-white/60 group-hover/p:text-accent')}>
                <Icon className="h-4 w-4" />
              </span>
              <span className={cn('rounded-full px-2 py-0.5 font-mono text-[10px] tracking-[0.06em] uppercase', lead ? 'bg-accent/15 text-accent' : 'bg-white/[0.05] text-white/35')}>{tag}</span>
            </span>
            <span className="mt-3 text-[14px] font-medium text-white">{p.title}</span>
            <span className="mt-1 text-[12.5px] leading-relaxed text-white/50">{p.description}</span>
            <span className="mt-3 block rounded-lg border border-white/[0.06] bg-black/30 px-3 py-2.5">
              <span className="block max-h-[52px] overflow-hidden font-mono text-[11px] leading-relaxed text-white/55 [mask-image:linear-gradient(to_bottom,black_40%,transparent)]">{p.text}</span>
            </span>
            <span className="mt-3 flex items-center justify-between text-[12px]">
              <code className="font-mono text-white/30">/{p.name}</code>
              <span className={cn('inline-flex items-center gap-1 font-medium', done ? 'text-emerald-400' : 'text-white/50 group-hover/p:text-white')}>
                {done ? <><Check className="h-3.5 w-3.5" />Copied</> : <><Copy className="h-3.5 w-3.5" />Copy prompt</>}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
