'use client'

import { useEffect, useRef } from 'react'

/*
 * Gutter texture between the rails: the hero's ASCII character set at very low
 * opacity, shaped by smooth noise and drifting slowly as the page scrolls.
 * One sticky, viewport-sized canvas per gutter paints only the visible slice;
 * Positions are in strip coordinates so the texture scrolls with the page.
 */

const CHARS = ' .:-=+*#'
const CW = 10 // cell width, px
const CH = 14 // cell height, px

function rand(a: number, b: number, s: number) {
  const v = Math.sin(a * 127.1 + b * 311.7 + s * 74.7) * 43758.5453
  return v - Math.floor(v)
}

/** Smooth 2D value noise in [0, 1]. */
function noise(x: number, y: number) {
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  const fx = x - ix
  const fy = y - iy
  const sx = fx * fx * (3 - 2 * fx)
  const sy = fy * fy * (3 - 2 * fy)
  const a = rand(ix, iy, 9)
  const b = rand(ix + 1, iy, 9)
  const c = rand(ix, iy + 1, 9)
  const d = rand(ix + 1, iy + 1, 9)
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy
}

export default function GutterField({ side }: { side: 'left' | 'right' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const strip = canvas?.parentElement
    const ctx = canvas?.getContext('2d')
    if (!canvas || !strip || !ctx) return
    const mono =
      getComputedStyle(document.documentElement).getPropertyValue('--font-geist-mono').trim() || 'ui-monospace, monospace'
    const seed = side === 'left' ? 1 : 2
    let raf = 0
    let visible = true
    let w = 0
    let h = 0
    let dpr = 1

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
    }

    const paint = () => {
      raf = 0
      if (!visible || document.hidden) return
      // where this sticky canvas currently sits inside the full-height strip
      const top = canvas.getBoundingClientRect().top - strip.getBoundingClientRect().top
      const drift = window.scrollY * 0.0016
      const cols = Math.floor(w / CW)
      const x0 = (w - cols * CW) / 2

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      ctx.font = `11px ${mono}`
      ctx.textBaseline = 'top'
      for (let row = Math.floor(top / CH); row <= Math.ceil((top + h) / CH); row++) {
        for (let col = 0; col < cols; col++) {
          const v = noise(col * 0.28 + seed * 13, row * 0.16 + drift)
          const idx = Math.min(CHARS.length - 1, Math.floor(Math.pow(v, 1.5) * CHARS.length))
          if (!idx) continue
          // densest glyphs pick up a faint orange; the rest stay warm grey
          ctx.fillStyle =
            idx >= 6 ? `rgba(255,122,0,${0.1 + v * 0.14})` : `rgba(240,227,222,${0.08 + v * 0.16})`
          ctx.fillText(CHARS[idx], x0 + col * CW, row * CH - top)
        }
      }
    }
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(paint)
    }

    const ro = new ResizeObserver(() => {
      resize()
      wake()
    })
    ro.observe(canvas)
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) wake()
    })
    io.observe(strip)
    window.addEventListener('scroll', wake, { passive: true })
    document.addEventListener('visibilitychange', wake)
    // repaint once Geist Mono has loaded so glyphs use the right face
    document.fonts?.ready.then(wake)
    resize()
    wake()
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('scroll', wake)
      document.removeEventListener('visibilitychange', wake)
    }
  }, [side])

  return <canvas ref={canvasRef} aria-hidden className="sticky top-0 block h-screen w-full" />
}
