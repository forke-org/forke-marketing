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

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { LOOP_MS, MailFilmFrame, MailFilmMeasure, type Boxes } from './mail-film'

/** The Forke Mail film, filling its parent: live code on a clock. Plays while `active`; otherwise holds its last frame. */
export default function MailVideo({ active }: { active: boolean }) {
  const frame = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 548, h: 343 })
  const [boxes, setBoxes] = useState<Boxes | null>(null)
  const [now, setNow] = useState(LOOP_MS - 1)

  useLayoutEffect(() => {
    const el = frame.current
    if (!el) return
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!active || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setNow(LOOP_MS - 1)
      return
    }
    const start = performance.now()
    let id = requestAnimationFrame(function tick(t) {
      setNow((t - start) % LOOP_MS)
      id = requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(id)
  }, [active])

  return (
    <div ref={frame} aria-hidden className="absolute inset-0 overflow-hidden bg-[#151414]">
      <MailFilmMeasure onMeasure={setBoxes} />
      {boxes && <MailFilmFrame now={now} width={size.w} height={size.h} boxes={boxes} />}
    </div>
  )
}
