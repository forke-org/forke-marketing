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

import React, { useRef, useCallback } from 'react'
import { cn } from '@/lib/utils/cn'

export interface GlassyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  surfaceColor?: string
  textColor?: string
  children: React.ReactNode
}

/**
 * GlassyButton - High-fidelity 3D frosted glass button with dynamic parallax reflection
 * Inspired by Patrick Hill's Dribbble Glass Button concept.
 */
export const GlassyButton = React.forwardRef<HTMLButtonElement, GlassyButtonProps>(
  (
    {
      className,
      surfaceColor = 'var(--color-accent, #FF7A00)',
      textColor = '#0a0a0a',
      style,
      children,
      onMouseMove,
      onMouseLeave,
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLButtonElement | null>(null)

    const setRef = useCallback(
      (node: HTMLButtonElement | null) => {
        internalRef.current = node
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ;(ref as React.MutableRefObject<HTMLButtonElement | null>).current = node
        }
      },
      [ref]
    )

    const handleMouseMove = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        const button = internalRef.current
        if (button) {
          const rect = button.getBoundingClientRect()
          const centerX = rect.width / 2
          const centerY = rect.height / 2
          const offsetX = e.clientX - rect.left - centerX
          const offsetY = e.clientY - rect.top - centerY

          button.style.setProperty('--_x-motion', `${offsetX}px`)
          button.style.setProperty('--_y-motion', `${offsetY}px`)
        }
        onMouseMove?.(e)
      },
      [onMouseMove]
    )

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        const button = internalRef.current
        if (button) {
          button.style.setProperty('--_x-motion', '0px')
          button.style.setProperty('--_y-motion', '0px')
        }
        onMouseLeave?.(e)
      },
      [onMouseLeave]
    )

    return (
      <button
        ref={setRef}
        className={cn('glassy-button group', className)}
        style={{
          ['--_surface' as string]: surfaceColor,
          ['--_text-color' as string]: textColor,
          ...style,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <span>
          {children}
        </span>
      </button>
    )
  }
)

GlassyButton.displayName = 'GlassyButton'
export default GlassyButton
