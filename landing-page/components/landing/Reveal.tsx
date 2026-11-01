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

import React, { useEffect, useRef } from 'react'
import type scrollReveal from 'scrollreveal'

export interface RevealProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  distance?: string
  origin?: 'bottom' | 'top' | 'left' | 'right'
  easing?: string
  opacity?: number
  scale?: number
  reset?: boolean
  viewFactor?: number
  className?: string
  options?: scrollReveal.ScrollRevealObjectOptions
}

/**
 * ScrollReveal integration powered by https://github.com/jlmakes/scrollreveal
 * Animates elements smoothly into view as the user scrolls through the page.
 */
export default function Reveal({
  children,
  delay = 0,
  duration = 750,
  distance = '24px',
  origin = 'bottom',
  easing = 'cubic-bezier(0.16, 1, 0.3, 1)',
  opacity = 0,
  scale = 1,
  reset = false,
  viewFactor = 0.12,
  className = '',
  options,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof window === 'undefined') return

    // Honor prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.opacity = '1'
      el.style.transform = 'none'
      return
    }

    let isMounted = true
    let sr: scrollReveal.ScrollRevealObject | null = null

    import('scrollreveal').then((module) => {
      if (!isMounted || !el) return
      const ScrollReveal = module.default
      sr = ScrollReveal({
        reset: false,
        mobile: true,
      })

      sr.reveal(el, {
        delay,
        duration,
        distance,
        origin,
        easing,
        opacity,
        scale,
        reset,
        viewFactor,
        cleanup: true,
        ...options,
      })
    })

    return () => {
      isMounted = false
      if (sr && el) {
        try {
          sr.clean(el)
        } catch (_) {}
      }
    }
  }, [delay, duration, distance, origin, easing, opacity, scale, reset, viewFactor, options])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

/**
 * Custom React Hook to reveal any element or group of elements using ScrollReveal
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options?: scrollReveal.ScrollRevealObjectOptions
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof window === 'undefined') return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.opacity = '1'
      el.style.transform = 'none'
      return
    }

    let isMounted = true
    let sr: scrollReveal.ScrollRevealObject | null = null

    import('scrollreveal').then((module) => {
      if (!isMounted || !el) return
      const ScrollReveal = module.default
      sr = ScrollReveal({
        reset: false,
        mobile: true,
      })

      sr.reveal(el, {
        delay: 0,
        duration: 750,
        distance: '24px',
        origin: 'bottom',
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        cleanup: true,
        ...options,
      })
    })

    return () => {
      isMounted = false
      if (sr && el) {
        try {
          sr.clean(el)
        } catch (_) {}
      }
    }
  }, [options])

  return ref
}
