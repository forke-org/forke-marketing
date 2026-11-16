'use client'

import Link from 'next/link'
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowUpRight, Check, Copy } from 'lucide-react'
import { RiGithubFill, RiInstagramLine, RiLinkedinBoxFill } from '@remixicon/react'
import { cn } from './primitives'
import { dither } from './dither'

/**
 * The Contact menu's bento: a night scene with one lit window, dithered into the site's palette like Built for, with
 * the contact form, the support address and the socials over it. It reads /public/contact/night.webp; while that file
 * is missing it draws the scene itself.
 */

const tile = 'relative overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.03]'
const eyebrow = 'font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/45'
const FOCUS = 'outline-none focus-visible:ring-2 focus-visible:ring-accent/60'
const CELL = 3 // css px per dither dot
const SUPPORT = 'support@forke.space'
const SOCIALS = [
  { label: 'Instagram', href: 'https://www.instagram.com/forke.space/', icon: RiInstagramLine },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/forke/', icon: RiLinkedinBoxFill },
  { label: 'GitHub', href: 'https://github.com/forke-org', icon: RiGithubFill },
]

// ---------------------------------------------------------------- shared bits

function CopyEmail({ className }: { className?: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      await navigator.clipboard.writeText(SUPPORT)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard blocked: the address stays visible to copy by hand */
    }
  }
  return (
    <span className={cn('flex items-center gap-2', className)}>
      <a href={`mailto:${SUPPORT}`} className={cn('truncate text-[13px] text-white/85 hover:text-white', FOCUS)}>
        {SUPPORT}
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label="Copy email address"
        className={cn('flex h-7 shrink-0 items-center gap-1 rounded-md border border-white/10 bg-white/[0.05] px-2 text-[11px] text-white/70 transition-colors hover:text-white', FOCUS)}
      >
        {copied ? <Check className="h-3 w-3 text-emerald-300" /> : <Copy className="h-3 w-3" />}
        {copied ? 'Copied' : 'Copy'}
      </button>
    </span>
  )
}

function Socials({ className }: { className?: string }) {
  return (
    <span className={cn('flex gap-1.5', className)}>
      {SOCIALS.map(({ label, href, icon: Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={cn('grid h-8 w-8 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-white/55 transition-colors hover:border-white/20 hover:text-white', FOCUS)}
        >
          <Icon className="h-4 w-4" />
        </a>
      ))}
    </span>
  )
}

function FormButton({ onPick, children = 'Open the contact form' }: { onPick: () => void; children?: ReactNode }) {
  return (
    <Link
      href="/contact"
      onClick={onPick}
      className={cn('group inline-flex h-8 items-center gap-1.5 rounded-lg bg-white/[0.09] px-3 text-[12.5px] text-white/90 transition-colors hover:bg-white/[0.14]', FOCUS)}
    >
      {children}
      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  )
}

/** Size of an element, kept current. */
function useSize<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, size] as const
}

type Draw = (g: CanvasRenderingContext2D, w: number, h: number) => void

/** A picture (or, until the file exists, a drawn scene) dithered into the site's palette, filling its parent. */
function DitherArt({ image, draw }: { image?: string; draw: Draw }) {
  const [box, size] = useSize<HTMLDivElement>()
  const out = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = out.current
    if (!c || !size.w || !size.h) return
    const w = Math.ceil(size.w / CELL)
    const h = Math.ceil(size.h / CELL)
    const work = document.createElement('canvas')
    work.width = w
    work.height = h
    const g = work.getContext('2d', { willReadFrequently: true })
    if (!g) return
    const drawn = () => {
      draw(g, w, h)
      dither(g, c, w, h)
    }
    if (!image) return drawn()
    const img = new window.Image()
    img.onload = () => {
      const s = Math.max(w / img.width, h / img.height)
      g.drawImage(img, (w - img.width * s) / 2, (h - img.height * s) / 2, img.width * s, img.height * s)
      try {
        dither(g, c, w, h)
      } catch {
        drawn() // a cross-origin picture the canvas may not read
      }
    }
    img.onerror = drawn
    img.src = image
  }, [image, draw, size.w, size.h])
  return (
    <div ref={box} className="absolute inset-0">
      <canvas ref={out} className="h-full w-full" style={{ imageRendering: 'pixelated' }} />
    </div>
  )
}

const shade = (v: number) => `rgb(${v},${v},${v})`
const glow = (g: CanvasRenderingContext2D, x: number, y: number, r: number, v: number) => {
  const grad = g.createRadialGradient(x, y, 0, x, y, r)
  grad.addColorStop(0, `rgba(${v},${v},${v},1)`)
  grad.addColorStop(1, `rgba(${v},${v},${v},0)`)
  g.fillStyle = grad
  g.fillRect(x - r, y - r, r * 2, r * 2)
}

// ---------------------------------------------------------------- a dithered night scene

const drawNight: Draw = (g, w, h) => {
  const sky = g.createLinearGradient(0, 0, 0, h)
  sky.addColorStop(0, shade(8))
  sky.addColorStop(1, shade(46))
  g.fillStyle = sky
  g.fillRect(0, 0, w, h)
  for (let i = 0; i < 70; i++) {
    const x = ((i * 97.13) % 1) * w
    const y = ((i * 0.6180339 * 7.3) % 1) * h * 0.55
    g.fillStyle = shade(120 + ((i * 37) % 120))
    g.fillRect(x, y, 1, 1)
  }
  glow(g, w * 0.86, h * 0.2, h * 0.4, 150)
  g.fillStyle = shade(245)
  g.beginPath()
  g.arc(w * 0.86, h * 0.2, h * 0.07, 0, Math.PI * 2)
  g.fill()
  // hills
  g.fillStyle = shade(16)
  g.beginPath()
  g.moveTo(0, h)
  g.lineTo(0, h * 0.82)
  g.quadraticCurveTo(w * 0.35, h * 0.62, w * 0.62, h * 0.72)
  g.quadraticCurveTo(w * 0.85, h * 0.8, w, h * 0.7)
  g.lineTo(w, h)
  g.fill()
  // the house, with one lit window spilling light
  const hx = w * 0.66
  const hy = h * 0.72
  const hw = w * 0.11
  const hh = h * 0.2
  glow(g, hx + hw * 0.55, hy - hh * 0.45, h * 0.35, 120)
  g.fillStyle = shade(10)
  g.fillRect(hx, hy - hh, hw, hh)
  g.beginPath()
  g.moveTo(hx - hw * 0.12, hy - hh)
  g.lineTo(hx + hw / 2, hy - hh * 1.75)
  g.lineTo(hx + hw * 1.12, hy - hh)
  g.fill()
  g.fillRect(hx + hw * 0.7, hy - hh * 1.6, hw * 0.12, hh * 0.4)
  g.fillStyle = shade(255)
  g.fillRect(hx + hw * 0.42, hy - hh * 0.7, hw * 0.24, hh * 0.32)
}

function NightScene({ onPick }: { onPick: () => void }) {
  return (
    <div className={cn(tile, 'h-full bg-[#151414]')}>
      <DitherArt image="/contact/night.webp" draw={drawNight} />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#151414_0%,rgba(21,20,20,0.85)_32%,rgba(21,20,20,0.3)_58%,transparent_78%)]" />
      <div className="absolute inset-y-0 left-0 flex w-[58%] flex-col p-5">
        <p className={eyebrow}>Contact</p>
        <div className="mt-auto">
          <p className="text-[30px] font-medium leading-none tracking-[-0.035em] text-white">Someone&rsquo;s always home.</p>
          <p className="mt-2 max-w-[380px] text-[13px] leading-5 text-white/55">Questions, ideas, a task you want to post. Write to us and a person on the team writes back.</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <FormButton onPick={onPick} />
            <CopyEmail />
          </div>
          <Socials className="mt-3" />
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- the menu's bento

export function ContactBento({ onPick }: { onPick: () => void }) {
  return <NightScene onPick={onPick} />
}
