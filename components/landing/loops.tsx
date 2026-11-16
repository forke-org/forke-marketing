'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from './primitives'

/**
 * Small helpers for the landing page's little looping "videos" (the problem cards and the how-it-works steps):
 * a tick counter that only runs while its element is on screen, and the same cursor the hero loop uses.
 */

export const LOOP_EASE = 'cubic-bezier(0.65, 0, 0.35, 1)' // the hero loop's easing

/**
 * Counts 0 → steps-1 every `ms`, then starts over, only while the element is at least `threshold` on screen.
 * Off screen it pauses where it is; with reduced motion it rests on `rest` (the finished frame by default).
 */
export function useLoop<T extends Element>(steps: number, ms = 100, { threshold = 0.35, rest = steps - 1 } = {}) {
  const ref = useRef<T>(null)
  const [t, setT] = useState(rest)
  const [visible, setVisible] = useState(false)
  const [reduced, setReduced] = useState(false)
  useEffect(() => setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches), [])
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  const started = useRef(false)
  useEffect(() => {
    if (reduced) {
      setT(rest)
      return
    }
    if (!visible) return
    if (!started.current) {
      started.current = true
      setT(0)
    }
    const id = window.setInterval(() => setT((n) => (n + 1) % steps), ms)
    return () => window.clearInterval(id)
  }, [visible, reduced, steps, ms, rest])
  return [ref, t] as const
}

/** The hero loop's cursor, placed in its parent's pixels; `press` squeezes it and rings a click. */
export function MiniCursor({ x, y, press, show = true, className }: { x: number; y: number; press?: boolean; show?: boolean; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute left-0 top-0 z-30', className)}
      style={{ transform: `translate(${x}px, ${y}px)`, opacity: show ? 1 : 0, transition: `transform 700ms ${LOOP_EASE}, opacity 250ms ease` }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" className="-translate-x-[3px] -translate-y-[2px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" style={{ transform: press ? 'scale(0.85)' : 'scale(1)', transition: 'transform 120ms' }}>
        <path d="M3 2 L3 19 L7.5 14.8 L10.6 21.6 L13.4 20.4 L10.4 13.8 L16.6 13.8 Z" fill="white" stroke="black" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
      {press && <span className="absolute left-0 top-0 h-6 w-6 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-white/30" />}
    </div>
  )
}

/** Where an element's centre sits inside `root`, in layout pixels (ignores transforms), for aiming the cursor. */
export function centreIn(el: HTMLElement | null, root: HTMLElement | null) {
  if (!el || !root) return null
  let x = el.offsetWidth / 2
  let y = el.offsetHeight / 2
  let n: HTMLElement | null = el
  while (n && n !== root) {
    x += n.offsetLeft
    y += n.offsetTop
    n = n.offsetParent as HTMLElement | null
  }
  return { x, y }
}
