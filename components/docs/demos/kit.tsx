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

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { Lock, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useLoop, MiniCursor, LOOP_EASE } from '@/components/landing/loops'

/**
 * Shared pieces for the docs demos: short, looping "screen recordings" of the real product, drawn in HTML so they
 * stay sharp, light and accessible. Each demo is a timeline of 100 ms ticks that only plays while on screen.
 */

export { MiniCursor, LOOP_EASE }

export function useTimeline(ticks: number) {
  return useLoop<HTMLDivElement>(ticks, 100, { threshold: 0.4 })
}

/** Typed text: `from` is the tick typing starts, `cps` characters per tick. */
export function typed(text: string, t: number, from: number, cps = 2) {
  if (t < from) return ''
  return text.slice(0, Math.min(text.length, Math.floor((t - from) * cps)))
}
export const typingDone = (text: string, from: number, cps = 2) => from + Math.ceil(text.length / cps)

export const show = (on: boolean, cls = '') => cn('transition-all duration-500 ease-out', on ? 'opacity-100 translate-y-0' : 'pointer-events-none translate-y-1.5 opacity-0', cls)

/**
 * A fixed-size stage scaled to fit its column, so the demo looks identical on every screen width,
 * like a video. Width and height are the design pixels.
 */
export function Stage({ w, h, children, className, label }: { w: number; h: number; children: ReactNode; className?: string; label: string }) {
  const box = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  useLayoutEffect(() => {
    const el = box.current
    if (!el) return
    const fit = () => setScale(Math.min(1, el.clientWidth / w))
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [w])
  return (
    <div ref={box} role="img" aria-label={label} className={cn('docs-demo relative w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[radial-gradient(120%_120%_at_50%_0%,#1f1b18_0%,#121111_55%,#0e0d0d_100%)]', className)} style={{ height: h * scale + 2 }}>
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:14px_14px]" />
      <div className="absolute top-0 left-1/2 origin-top" style={{ width: w, height: h, transform: `translateX(-50%) scale(${scale})` }}>
        {children}
      </div>
      <span className="pointer-events-none absolute right-3 bottom-2.5 z-40 flex items-center gap-1 font-mono text-[9.5px] tracking-[0.12em] text-white/25 uppercase">
        <RotateCcw className="h-2.5 w-2.5" /> Loop
      </span>
    </div>
  )
}

/** macOS-style window chrome, optionally with an address bar. */
export function Window({ title, url, children, className, style, dark }: { title?: string; url?: string; children: ReactNode; className?: string; style?: React.CSSProperties; dark?: boolean }) {
  return (
    <div className={cn('absolute overflow-hidden rounded-xl border border-white/[0.1] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9),0_0_0_1px_rgba(0,0,0,0.4)]', dark ? 'bg-[#0d0c0c]' : 'bg-[#151414]', className)} style={style}>
      <div className="flex h-9 items-center gap-3 border-b border-white/[0.07] bg-[#1a1918] px-3.5">
        <span className="flex gap-1.5">
          <i className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
          <i className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" />
          <i className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
        </span>
        {url ? (
          <span className="mx-auto flex h-6 min-w-[260px] items-center justify-center gap-1.5 rounded-md bg-white/[0.05] px-3 text-[11px] text-white/45">
            <Lock className="h-2.5 w-2.5" />
            {url}
          </span>
        ) : (
          <span className="mx-auto text-[11.5px] text-white/40">{title}</span>
        )}
        <span className="w-[46px]" />
      </div>
      {children}
    </div>
  )
}

export function Caret({ on = true }: { on?: boolean }) {
  return <span className={cn('ml-px inline-block h-[1.05em] w-[7px] translate-y-[2px] bg-white/70', on ? 'animate-[docs-blink_1s_steps(1)_infinite]' : 'opacity-0')} />
}

export function Badge({ tone, children }: { tone: 'green' | 'amber' | 'blue' | 'neutral' | 'accent' | 'red'; children: ReactNode }) {
  const tones = {
    green: 'bg-emerald-400/10 text-emerald-300',
    amber: 'bg-amber-400/10 text-amber-200',
    blue: 'bg-sky-400/10 text-sky-300',
    neutral: 'bg-white/[0.06] text-white/50',
    accent: 'bg-accent/15 text-[#ffa347]',
    red: 'bg-red-400/10 text-red-300',
  }
  return (
    <span className={cn('inline-flex h-5 items-center gap-1.5 rounded-[5px] px-1.5 text-[11px] font-medium whitespace-nowrap transition-colors duration-500', tones[tone])}>
      <span className="h-1.5 w-1.5 rounded-[1.5px] bg-current" />
      {children}
    </span>
  )
}

/** Picks the value for the current tick from [startTick, value] pairs. */
export function at<T>(frames: [number, T][], t: number): T {
  let v = frames[0][1]
  for (const [k, x] of frames) if (t >= k) v = x
  return v
}
