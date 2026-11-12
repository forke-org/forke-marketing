'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import { ChevronRight } from 'lucide-react'
import GutterField from './GutterField'

export const cn = clsx

/** Fires once when the element scrolls into view. */
export function useInView<T extends Element>(threshold = 0.25) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, inView] as const
}

/** Page column with hairline side rails. */
/** Content column; the rails themselves are drawn by <RailsDecor />. */
export function Rails({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-[1200px]">{children}</div>
}

/**
 * Cloudflare's rail system, measured off cloudflare.com: a 1480px band with dashed
 * outer rails (its gutters hold a faint ASCII texture), and a solid 1200px column
 * with dashed inner rails.
 * Place inside a `relative isolate` wrapper; it fills it behind the content.
 * `ascii` toggles the ASCII texture in the outer gutters (off on reading pages).
 */
export function RailsDecor({ ascii = true }: { ascii?: boolean }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 hidden overflow-clip md:block"
      style={{
        maskImage: 'linear-gradient(180deg, transparent 0, #000 220px, #000 calc(100% - 260px), transparent 100%)',
        WebkitMaskImage: 'linear-gradient(180deg, transparent 0, #000 220px, #000 calc(100% - 260px), transparent 100%)',
      }}
    >
      <div className="absolute inset-y-0 left-1/2 w-[1480px] -translate-x-1/2">
        {/* gutters: faint ASCII texture echoing the hero */}
        {ascii && (
          <>
            <div className="absolute inset-y-0 left-0 w-[140px]">
              <GutterField side="left" />
            </div>
            <div className="absolute inset-y-0 right-0 w-[140px]">
              <GutterField side="right" />
            </div>
          </>
        )}
        <div className="rail-dash absolute inset-y-0 left-0" />
        <div className="rail-dash absolute inset-y-0 right-0" />
      </div>
      <div className="absolute inset-y-0 left-1/2 z-10 w-full max-w-[1200px] -translate-x-1/2 bg-bg">
        <div className="rail-dash absolute inset-y-0 left-0" />
        <div className="rail-dash absolute inset-y-0 right-0" />
      </div>
    </div>
  )
}

/** Cloudflare's 14px junction square, centred on a rail/line crossing. */
export function RailSquare({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn('pointer-events-none absolute z-10 hidden h-[14px] w-[14px] rounded-[3px] border border-line bg-[#191817] min-[1232px]:block', className)}
    />
  )
}

/** Small square marks where a section border meets the rails (Cloudflare-style). */
function Corners() {
  return (
    <>
      <RailSquare className="-left-[7px] -top-[7px]" />
      <RailSquare className="-right-[7px] -top-[7px]" />
    </>
  )
}

export function Section({
  children,
  className,
  id,
  corners = true,
  divider = true,
}: {
  children: ReactNode
  className?: string
  id?: string
  corners?: boolean
  /** bottom hairline; off for the last section so the rails fade out cleanly */
  divider?: boolean
}) {
  return (
    <section id={id} className={cn('relative w-full', divider && 'border-b border-line', className)}>
      {corners && <Corners />}
      {children}
    </section>
  )
}

/**
 * Heading that resolves word by word from a soft blur — the daytwo reveal.
 * `muted` renders as the quieter second line.
 */
export function BlurWords({
  text,
  className,
  delay = 0,
  stagger = 45,
}: {
  text: string
  className?: string
  delay?: number
  stagger?: number
}) {
  const [ref, inView] = useInView<HTMLSpanElement>(0.4)
  const words = text.split(' ')
  return (
    <span ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span
          key={i}
          aria-hidden
          className="inline-block transition-[opacity,filter,transform] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            opacity: inView ? 1 : 0,
            filter: inView ? 'blur(0)' : 'blur(10px)',
            transform: inView ? 'none' : 'translateY(6px)',
            transitionDelay: `${delay + i * stagger}ms`,
          }}
        >
          {w}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  )
}

/**
 * Painted backdrop that never sits still:
 *  - scroll: the painting drifts against the page (parallax)
 *  - hover: it leans away from the cursor, and exposes --px/--py (-1..1)
 *    so anything inside with `.float-layer` leans the other way.
 */
export function Painting({
  src,
  className,
  children,
  shade = 0,
  position = 'center',
}: {
  src: string
  className?: string
  children?: ReactNode
  shade?: number
  position?: string
}) {
  const wrap = useRef<HTMLDivElement>(null)
  const layer = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = wrap.current
    const img = layer.current
    if (!el || !img) return
    // overflow:hidden + border-radius doesn't reliably clip composited (transformed)
    // children, so the moving painting's square corners can poke out. clip-path does.
    const radius = getComputedStyle(el).borderRadius
    el.style.clipPath = `inset(0 round ${radius})`
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    let scroll = 0
    let mx = 0
    let my = 0
    const apply = () => {
      raf = 0
      img.style.transform = `translate3d(${(mx * -14).toFixed(1)}px, calc(${scroll.toFixed(2)}% + ${(my * -10).toFixed(1)}px), 0) scale(1.06)`
      el.style.setProperty('--px', mx.toFixed(3))
      el.style.setProperty('--py', my.toFixed(3))
    }
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(apply)
    }
    const onScroll = () => {
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.bottom < 0 || r.top > vh) return
      scroll = ((r.top + r.height / 2 - vh / 2) / vh) * -10 // -1..1 around viewport centre
      queue()
    }
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      mx = ((e.clientX - r.left) / r.width - 0.5) * 2
      my = ((e.clientY - r.top) / r.height - 0.5) * 2
      queue()
    }
    const onLeave = () => {
      mx = 0
      my = 0
      queue()
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [])
  return (
    <div ref={wrap} className={cn('relative isolate overflow-hidden', className)}>
      <div
        ref={layer}
        aria-hidden
        className="absolute -inset-y-[10%] -inset-x-[4%] -z-10 transition-transform duration-500 ease-out will-change-transform"
      >
        <div
          className="animate-breathe h-full w-full bg-cover"
          style={{ backgroundImage: `url(${src})`, backgroundPosition: position }}
        />
      </div>
      {shade > 0 && <div aria-hidden className="absolute inset-0 -z-10 bg-black" style={{ opacity: shade }} />}
      {children}
    </div>
  )
}

/** Endless horizontal strip of items. */
export function Ticker({ items, className }: { items: ReactNode[]; className?: string }) {
  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={{ maskImage: 'linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent)' }}
    >
      <div className="animate-marquee flex w-max hover:[animation-play-state:paused]">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
            {items.map((it, i) => (
              <div key={i} className="flex shrink-0 items-center px-6">
                {it}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/** Counts up to `to` once visible. */
export function CountUp({ to, decimals = 0, duration = 1400, prefix = '', suffix = '' }: {
  to: number
  decimals?: number
  duration?: number
  prefix?: string
  suffix?: string
}) {
  const [ref, inView] = useInView<HTMLSpanElement>(0.5)
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!inView) return
    let raf = 0
    const t0 = performance.now()
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / duration)
      setV(to * (1 - Math.pow(1 - k, 3)))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to, duration])
  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {v.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  )
}

export function Eyebrow({ children, href = '#' }: { children: ReactNode; href?: string }) {
  return (
    <a
      href={href}
      className="group inline-flex items-center gap-1 text-base text-accent-text transition-colors hover:text-accent"
    >
      {children}
      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
    </a>
  )
}

/** Logo mark + wordmark, matching the forke* brand. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn('flex items-center gap-2', className)} aria-label="Forke home">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/forke-assets/favicon.png" alt="" className="h-7 w-7 rounded-[7px]" />
      <span className="text-[22px] font-semibold tracking-[-0.04em] text-white">
        forke<span className="text-accent">*</span>
      </span>
    </Link>
  )
}

export function ForkeMark({ className }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/forke-assets/favicon.png" alt="" className={className} />
}

/**
 * Forke is waitlist-only for now, so the main button everywhere is "Join the
 * waitlist", which opens the /waitlist page.
 */
export function WaitlistButton({
  label = 'Join the waitlist',
  size = 'md',
  href = '/waitlist',
}: {
  label?: string
  size?: 'sm' | 'md'
  href?: string
}) {
  const sm = size === 'sm'
  return (
    <Link
      href={href}
      className={cn(
        'group inline-flex shrink-0 items-center gap-1.5 border border-transparent bg-accent font-medium leading-none text-[#1a0a00] shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_8px_24px_-8px_rgba(255,122,0,0.55)] transition-colors hover:bg-accent-hover',
        sm ? 'h-8 rounded-lg px-3 text-[13px]' : 'h-10 rounded-[10px] px-4 text-[15px]',
      )}
    >
      {label}
      <ChevronRight className={cn('transition-transform group-hover:translate-x-0.5', sm ? 'h-3.5 w-3.5' : 'h-4 w-4')} />
    </Link>
  )
}

/**
 * Secondary button. Shares the exact box of WaitlistButton (height, border, radius,
 * padding, line-height) so a pair of them always lines up — keep the two in step.
 */
export function GhostButton({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        'group inline-flex h-10 shrink-0 items-center gap-1.5 rounded-[10px] border border-white/15 px-4 text-[15px] leading-none text-white/85 backdrop-blur-md transition-colors',
        className ?? 'bg-white/[0.05] hover:bg-white/10',
      )}
    >
      {children}
    </Link>
  )
}

const GLYPHS = '*'

/**
 * Starts as asterisks and resolves into the real word left-to-right once
 * scrolled into view — the "masked secret" reveal.
 */
export function ScrambleText({ text, className }: { text: string; className?: string }) {
  const [ref, inView] = useInView<HTMLSpanElement>(0.6)
  const [shown, setShown] = useState(() => text.replace(/[^ ]/g, GLYPHS))
  useEffect(() => {
    if (!inView) return
    let i = 0
    const start = setTimeout(() => {
      const id = setInterval(() => {
        i++
        setShown(text.slice(0, i) + text.slice(i).replace(/[^ ]/g, GLYPHS))
        if (i >= text.length) clearInterval(id)
      }, 55)
    }, 600)
    return () => clearTimeout(start)
  }, [inView, text])
  return (
    <span ref={ref} className={className} aria-label={text}>
      {shown}
    </span>
  )
}

/** Fades children up when they enter the viewport. */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const [ref, inView] = useInView<HTMLDivElement>(0.15)
  return (
    <div
      ref={ref}
      className={cn(
        'transition-[opacity,transform,filter] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
        inView ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-4 opacity-0 blur-[3px]',
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

/** Caption under a feature card: bold lead-in, muted body. */
export function Caption({ title, children }: { title: string; children: ReactNode }) {
  return (
    <p className="mt-5 px-3 text-[15px] leading-6 text-white/45">
      <span className="font-medium text-ink">{title}</span> {children}
    </p>
  )
}
