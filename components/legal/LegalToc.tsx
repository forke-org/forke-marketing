'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/components/landing/primitives'

/** Sticky contents list that follows the section you are reading. */
export default function LegalToc({ items }: { items: { id: string; title: string }[] }) {
  const [active, setActive] = useState(items[0]?.id)

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => !!el)
    const onScroll = () => {
      const line = window.innerHeight * 0.3
      let current = els[0]?.id
      for (const el of els) if (el.getBoundingClientRect().top <= line) current = el.id
      // short last sections can never reach the line; once the last heading is on
      // screen and the page can't scroll further, mark it as the one being read
      const last = els[els.length - 1]
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      if (last && atBottom && last.getBoundingClientRect().top < window.innerHeight) current = last.id
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [items])

  return (
    <nav aria-label="On this page" className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
      <p className="text-sm text-white/40">On this page</p>
      <ol className="mt-3 space-y-[3px] border-l border-line">
        {items.map((item, i) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                '-ml-px flex gap-2.5 border-l py-1 pl-4 text-[13px] leading-5 transition-colors',
                active === item.id ? 'border-accent text-white' : 'border-transparent text-white/45 hover:text-white/80',
              )}
            >
              <span className={cn('font-mono text-[11px] leading-5', active === item.id ? 'text-accent' : 'text-white/25')}>
                {String(i + 1).padStart(2, '0')}
              </span>
              {item.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
