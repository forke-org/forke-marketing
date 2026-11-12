'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import clsx from 'clsx'

/** Question list that opens one answer at a time (same motion as the landing FAQ). */
export default function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="border-t border-line">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.q} className="border-b border-line">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-6 py-5 text-left text-[16px] text-ink/90 transition-colors hover:text-white"
            >
              {item.q}
              <Plus className={clsx('h-4 w-4 shrink-0 text-white/45 transition-transform duration-300', isOpen && 'rotate-45 text-accent')} />
            </button>
            <div
              className="grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ gridTemplateRows: isOpen ? '1fr' : '0fr', opacity: isOpen ? 1 : 0 }}
            >
              <p className="overflow-hidden pr-10 text-[15px] leading-7 text-white/50">
                <span className="block pb-5">{item.a}</span>
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
