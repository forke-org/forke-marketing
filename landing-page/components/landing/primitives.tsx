/**
 * @fileoverview Forke Platform
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

import React from 'react'

/**
 * Shared building blocks for the landing/marketing layout.
 * Content lives in a centered max-w-7xl responsive wrapper.
 */

export function Rails({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
  fadeTop?: boolean
  fadeBottom?: boolean
}) {
  return (
    <div className={`relative mx-auto max-w-7xl min-[1920px]:max-w-[1920px] ${className}`}>
      {children}
    </div>
  )
}

/** Crosshair joints for the top corners of a full-rail-width section. */
export function Crosses() {
  return null
}

export function Section({
  id,
  className = '',
  flush = false,
  children,
}: {
  id?: string
  className?: string
  flush?: boolean
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      className={`relative ${className}`}
    >
      {children}
    </section>
  )
}

export function Eyebrow({ n, label }: { n?: string; label: string }) {
  return (
    <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.08em] text-white/35">
      {n && (
        <>
          <span className="text-accent/80">{n}</span>
          <span className="h-px w-8 bg-white/15" />
        </>
      )}
      <span className="uppercase">{label}</span>
    </div>
  )
}

/** Section heading — sans-medium with a single serif-italic accent word. */
export function H2({
  children,
  accent,
  className = '',
}: {
  children: React.ReactNode
  accent: string
  className?: string
}) {
  return (
    <h2 className={`mt-5 text-4xl md:text-[3.25rem] font-semibold tracking-[-0.035em] leading-[1.06] text-white ${className}`}>
      {children}{' '}
      <span className="font-serif italic font-medium text-accent">{accent}</span>
    </h2>
  )
}
