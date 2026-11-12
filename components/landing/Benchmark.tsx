'use client'

import type { ReactNode } from 'react'
import { Bug, ClipboardList, Mail, Store } from 'lucide-react'
import { ForkeMark, Section, cn, useInView } from './primitives'

const ROWS: { name: string; icon: ReactNode; value: number }[] = [
  { name: 'Forke (target)', icon: <ForkeMark className="h-5 w-5 rounded-md" />, value: 94.2 },
  { name: 'Bounty boards', icon: <ClipboardList className="h-5 w-5" />, value: 61.5 },
  { name: 'Freelance sites', icon: <Store className="h-5 w-5" />, value: 48.0 },
  { name: 'Issue trackers', icon: <Bug className="h-5 w-5" />, value: 37.4 },
  { name: 'Cold outreach', icon: <Mail className="h-5 w-5" />, value: 12.0 },
]

export default function Benchmark() {
  const [ref, inView] = useInView<HTMLDivElement>(0.3)

  return (
    <Section>
      <div className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-[560px]">
          <h2 className="text-[30px] font-medium leading-9 tracking-[-0.01em] text-ink">
            The <span className="text-shimmer animate-shimmer">fastest</span> path to a merge.
          </h2>
          <p className="mt-3 text-lg leading-7 text-white/45">
            How often paid work actually gets merged. Here&rsquo;s the merge rate we&rsquo;re designing Forke for, next
            to the usual ways developers find paid work.{' '}
            <a href="/whats-forke" className="text-accent-text hover:underline">
              Learn more
            </a>
          </p>
        </div>

        <div ref={ref} className="mx-auto mt-16 max-w-[796px]">
          {ROWS.map((r, i) => (
            <div key={r.name + i} className="flex h-14 items-center gap-4 border-t border-line last:border-b">
              <div className="flex w-[130px] shrink-0 items-center gap-2.5 text-[15px] text-ink/90 sm:w-[200px]">
                <span className="flex h-5 w-5 items-center justify-center text-white/70">{r.icon}</span>
                <span className="truncate">{r.name}</span>
              </div>
              <div className="h-[18px] flex-1">
                <div
                  className={cn(
                    'h-full rounded-[3px] transition-[width] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
                    i === 0 ? 'bg-accent' : 'bg-white/[0.09]',
                  )}
                  style={{ width: inView ? `${r.value}%` : '0%', transitionDelay: `${i * 70}ms` }}
                />
              </div>
              <span className="w-14 text-right text-[15px] tabular-nums text-ink/90">
                {r.value.toFixed(1)}%
              </span>
            </div>
          ))}

        </div>
      </div>
    </Section>
  )
}
