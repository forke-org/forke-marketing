/**
 * @fileoverview Forke Platform
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

import { LOADER_SHAPES } from '@/components/loader/forky-loader-data'

/** Forky as a line icon: the same outline the loading screen draws, in the current text colour. */
export function ForkyMark({ className }: { className?: string }) {
  const { w, h, parts } = LOADER_SHAPES.mascot
  const pad = Math.max(w, h) * 0.04
  return (
    <svg viewBox={`${-pad} ${-pad} ${w + pad * 2} ${h + pad * 2}`} className={className} aria-hidden fill="none">
      {parts.map((p, i) => (
        <path key={i} d={p.d} stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  )
}
