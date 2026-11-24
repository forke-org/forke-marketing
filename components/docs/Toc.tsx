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
import { AlignLeft } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { TocEntry } from '@/lib/docs/markdown'

export function Toc({ items }: { items: TocEntry[] }) {
  const [active, setActive] = useState(items[0]?.id ?? '')
  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[]
    if (!els.length) return
    const onScroll = () => {
      const y = 140
      let cur = els[0].id
      for (const el of els) if (el.getBoundingClientRect().top - y <= 0) cur = el.id
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) cur = els[els.length - 1].id
      setActive(cur)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [items])
  if (!items.length) return null
  return (
    <nav aria-label="On this page">
      <p className="mb-3 flex items-center gap-2 text-[12px] font-medium text-white/45">
        <AlignLeft className="h-3.5 w-3.5" /> On this page
      </p>
      <ul className="space-y-0.5 border-l border-white/[0.06]">
        {items.map((i) => (
          <li key={i.id}>
            <a
              href={`#${i.id}`}
              className={cn(
                '-ml-px block border-l py-1 text-[12.5px] leading-snug transition-colors',
                i.depth === 3 ? 'pl-6' : 'pl-3.5',
                active === i.id ? 'border-accent text-white' : 'border-transparent text-white/40 hover:text-white/75',
              )}
            >
              {i.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
