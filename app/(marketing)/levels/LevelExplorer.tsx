'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, LockOpen } from 'lucide-react'
import { Painting, cn } from '@/components/landing/primitives'
import { ALL_LEVELS, TIERS } from './data'

/**
 * Pick a tier, then a level: the painted panel shows that level's title, the XP it
 * takes and what it unlocks. The 25-step ladder underneath shows where it sits.
 * Left/right arrow keys step through levels.
 */
export default function LevelExplorer() {
  const [active, setActive] = useState(0)
  const level = ALL_LEVELS[active]
  const tier = TIERS[level.tier]

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest?.('input, textarea')) return
      if (e.key === 'ArrowLeft') setActive((i) => (i + 24) % 25)
      if (e.key === 'ArrowRight') setActive((i) => (i + 1) % 25)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div>
      {/* tier tabs */}
      <div className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 sm:mx-0 sm:px-0">
        {TIERS.map((t, i) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActive(i * 5)}
            className={cn(
              'flex h-10 shrink-0 items-center gap-2 rounded-[10px] border px-3.5 text-[14px] transition-colors',
              level.tier === i
                ? 'border-white/20 bg-white/[0.08] text-white'
                : 'border-white/[0.08] text-white/50 hover:border-white/15 hover:text-white/80',
            )}
          >
            {t.label}
            <span className="font-mono text-[11px] text-white/35">{t.range}</span>
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.15fr_1fr]">
        {/* painted level card */}
        <Painting src={tier.painting} className="min-h-[420px] rounded-[20px] border border-white/[0.07]" shade={0.35}>
          <div className="flex h-full min-h-[420px] flex-col justify-between p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <span className="rounded-full border border-white/20 bg-black/35 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.1em] text-white/85 backdrop-blur-md">
                {tier.label} · {tier.range}
              </span>
              <span
                key={tier.id}
                className="animate-fade-up flex h-14 w-14 items-center justify-center rounded-[14px] border border-white/20 bg-black/35 text-white backdrop-blur-md sm:h-16 sm:w-16"
              >
                <tier.icon className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.5} />
              </span>
            </div>
            <div key={level.lvl} className="animate-fade-up">
              <p className="font-mono text-[13px] text-white/70">LVL {String(level.lvl).padStart(2, '0')}</p>
              <h3 className="mt-1 text-[38px] font-medium leading-[1.05] tracking-[-0.035em] text-white sm:text-[52px]">{level.title}</h3>
              <div className="mt-6 grid gap-3 sm:grid-cols-[auto_1fr]">
                <div className="rounded-xl border border-white/15 bg-black/40 px-4 py-3 backdrop-blur-md">
                  <p className="text-[11.5px] text-white/50">XP needed</p>
                  <p className="mt-0.5 font-mono text-[15px] text-white">{level.xp}</p>
                </div>
                <div className="rounded-xl border border-white/15 bg-black/40 px-4 py-3 backdrop-blur-md">
                  <p className="flex items-center gap-1.5 text-[11.5px] text-white/50">
                    <LockOpen className="h-3 w-3 text-accent" /> Unlocks
                  </p>
                  <p className="mt-0.5 text-[15px] text-white">{level.unlock}</p>
                </div>
              </div>
            </div>
          </div>
        </Painting>

        {/* levels in this tier */}
        <div className="flex flex-col overflow-hidden rounded-[20px] border border-line">
          {tier.levels.map((l, i) => {
            const index = level.tier * 5 + i
            const on = index === active
            return (
              <button
                key={l.lvl}
                type="button"
                onClick={() => setActive(index)}
                aria-pressed={on}
                className={cn(
                  'flex flex-1 items-center gap-4 px-5 py-4 text-left transition-colors',
                  i > 0 && 'border-t border-line',
                  on ? 'bg-white/[0.05]' : 'hover:bg-white/[0.025]',
                )}
              >
                <span className={cn('font-mono text-[12px]', on ? 'text-accent' : 'text-white/30')}>{String(l.lvl).padStart(2, '0')}</span>
                <span className="min-w-0 flex-1">
                  <span className={cn('block text-[16px] font-medium', on ? 'text-white' : 'text-white/70')}>{l.title}</span>
                  <span className="mt-0.5 block truncate text-[13px] text-white/40">{l.unlock}</span>
                </span>
                <span className="shrink-0 font-mono text-[12px] text-white/40">{l.xp}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 25-step ladder */}
      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          aria-label="Previous level"
          onClick={() => setActive((i) => (i + 24) % 25)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-white/10 text-white/50 transition-colors hover:border-white/20 hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex flex-1 gap-[3px]" role="group" aria-label="All 25 levels">
          {ALL_LEVELS.map((l, i) => (
            <button
              key={l.lvl}
              type="button"
              aria-label={`Level ${l.lvl}: ${l.title}`}
              onClick={() => setActive(i)}
              className={cn('group flex h-9 flex-1 items-center', i % 5 === 0 && i > 0 && 'ml-1.5')}
            >
              <span
                className={cn(
                  'block h-1.5 w-full rounded-full transition-all duration-300 group-hover:h-2.5',
                  i < active ? 'bg-accent/45' : i === active ? 'h-2.5 bg-accent' : 'bg-white/10',
                )}
              />
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-label="Next level"
          onClick={() => setActive((i) => (i + 1) % 25)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-white/10 text-white/50 transition-colors hover:border-white/20 hover:text-white"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
