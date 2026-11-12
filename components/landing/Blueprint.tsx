'use client'

import { useInView } from './primitives'
import { WORDMARK } from './wordmark-data'

/*
 * The real Geist "forke*" wordmark, drawn like a drafting-table sketch:
 * smooth outlines, construction strokes that overshoot straight edges,
 * and small registration crosses on every on-curve node.
 */

const OVER = 30 // overshoot past each straight edge, in font units
const TICK = 15 // half-size of a node cross
const r2 = (v: number) => Math.round(v * 100) / 100

export default function Blueprint({ className = 'mx-auto max-w-[1200px] px-4 py-8 sm:px-0' }: { className?: string }) {
  const [wrap, inView] = useInView<HTMLDivElement>(0.3)
  const { width, top, bottom, glyphs } = WORDMARK
  const y0 = top - 70
  const h = bottom - top + 140

  return (
    <div ref={wrap} aria-hidden className={`select-none ${className}`}>
      <svg viewBox={`0 ${y0} ${width} ${h}`} className="block h-auto w-full" fill="none" strokeLinecap="round">
        {glyphs.map((g, gi) => {
          const ink = g.accent ? '#FF7A00' : 'rgba(240,227,222,0.8)'
          const faint = g.accent ? 'rgba(255,122,0,0.42)' : 'rgba(240,227,222,0.28)'
          const delay = gi * 0.16
          const draw = (extra: number, dur = 1.4) =>
            ({
              strokeDasharray: 1,
              strokeDashoffset: inView ? 0 : 1,
              transition: `stroke-dashoffset ${dur}s cubic-bezier(0.65,0,0.35,1) ${delay + extra}s`,
            }) as const
          const appear = (extra: number, to = 1) =>
            ({ opacity: inView ? to : 0, transition: `opacity 0.6s ease ${delay + extra}s` }) as const

          return (
            <g key={gi}>
              {/* faint fill so the letter reads as a solid form */}
              <path d={g.d} fill={g.accent ? 'rgba(255,122,0,0.07)' : 'rgba(240,227,222,0.035)'} stroke="none" style={appear(1.2)} />

              {/* construction strokes running past straight edges */}
              {g.lines.map(([x1, y1, x2, y2], i) => {
                const len = Math.hypot(x2 - x1, y2 - y1) || 1
                const ux = (x2 - x1) / len
                const uy = (y2 - y1) / len
                return (
                  <line
                    key={i}
                    x1={r2(x1 - ux * OVER)}
                    y1={r2(y1 - uy * OVER)}
                    x2={r2(x2 + ux * OVER)}
                    y2={r2(y2 + uy * OVER)}
                    stroke={faint}
                    strokeWidth="2"
                    pathLength={1}
                    style={draw(0.15, 1)}
                  />
                )
              })}

              {/* the inked outline, plus a slightly offset second pencil pass */}
              <path d={g.d} stroke={ink} strokeWidth="3.4" pathLength={1} style={draw(0)} />
              <path d={g.d} stroke={faint} strokeWidth="1.8" pathLength={1} transform="translate(3 -2.5)" style={draw(0.3)} />

              {/* small tick across the middle of long straight edges */}
              {g.lines.map(([x1, y1, x2, y2], i) => {
                const len = Math.hypot(x2 - x1, y2 - y1)
                if (len < 260) return null
                const ux = (x2 - x1) / len
                const uy = (y2 - y1) / len
                const mx = (x1 + x2) / 2
                const my = (y1 + y2) / 2
                return (
                  <line
                    key={`t${i}`}
                    x1={r2(mx - uy * TICK)}
                    y1={r2(my + ux * TICK)}
                    x2={r2(mx + uy * TICK)}
                    y2={r2(my - ux * TICK)}
                    stroke={ink}
                    strokeWidth="2.6"
                    style={appear(1.1, 0.8)}
                  />
                )
              })}

              {/* registration cross on every on-curve node */}
              <g stroke={ink} strokeWidth="2.4" style={appear(1, 0.85)}>
                {g.nodes.map(([x, y], i) => (
                  <g key={i}>
                    <line x1={x - TICK} y1={y} x2={x + TICK} y2={y} />
                    <line x1={x} y1={y - TICK} x2={x} y2={y + TICK} />
                  </g>
                ))}
              </g>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
