'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/**
 * Full-bleed hero that tucks into a rounded card as you scroll.
 * Animates clip-path (not padding) so the panel — and the WebGL canvas
 * inside it — never changes size mid-scroll.
 */
export default function HeroFrame({ children }: { children: ReactNode }) {
  const panel = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = panel.current
    const edge = ring.current
    if (!el || !edge) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0

    const update = () => {
      raf = 0
      const range = Math.min(320, window.innerHeight * 0.4)
      const t = reduce ? 1 : Math.min(1, Math.max(0, window.scrollY / range))
      const k = 1 - Math.pow(1 - t, 3) // ease-out
      const gap = (window.innerWidth < 640 ? 8 : 14) * k
      const radius = (window.innerWidth < 640 ? 22 : 30) * k
      const clip = `inset(${gap}px ${gap}px ${gap}px ${gap}px round ${radius}px)`
      el.style.clipPath = clip
      el.style.setProperty('-webkit-clip-path', clip)
      edge.style.inset = `${gap}px`
      edge.style.borderRadius = `${radius}px`
      edge.style.opacity = String(k)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className="relative">
      <div ref={panel} className="relative isolate min-h-[100svh] overflow-hidden bg-[#0b0604] will-change-[clip-path]">
        {children}
      </div>
      {/* hairline edge that fades in with the frame */}
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none absolute border border-white/[0.08] opacity-0"
        style={{ inset: 0 }}
      />
    </div>
  )
}
