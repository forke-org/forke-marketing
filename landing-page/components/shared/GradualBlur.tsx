'use client'

/**
 * @fileoverview GradualBlur component (React Bits / Progressive Blur)
 * Creates a smooth, multi-layered progressive backdrop blur along an edge.
 */

import React, { useEffect, useRef, useState, useMemo, CSSProperties } from 'react'

export interface GradualBlurProps {
  position?: 'top' | 'bottom' | 'left' | 'right'
  height?: string | number
  width?: string | number
  strength?: number
  layers?: number
  curve?: 'linear' | 'bezier' | 'ease-in' | 'ease-out' | 'ease-in-out'
  exponential?: boolean
  tint?: string
  autoHide?: boolean
  target?: 'parent' | 'window' | string
  opacity?: number
  saturation?: number
  hoverIntensity?: number
  zIndex?: number
  className?: string
  style?: CSSProperties
}

export default function GradualBlur({
  position = 'top',
  height = '6rem',
  width = '100%',
  strength = 2,
  layers = 8,
  curve = 'linear',
  exponential = false,
  tint = 'transparent',
  autoHide = false,
  target = 'parent',
  opacity = 1,
  saturation = 1,
  hoverIntensity = 1,
  zIndex = 40,
  className = '',
  style = {},
}: GradualBlurProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(!autoHide)
  const [isWindowTarget, setIsWindowTarget] = useState(false)

  // Detect scroll target and handle autoHide
  useEffect(() => {
    let scrollTarget: EventTarget | null = null
    const container = containerRef.current

    if (target === 'parent' && container?.parentElement) {
      const parent = container.parentElement
      const style = window.getComputedStyle(parent)
      const isScrollable = parent.scrollHeight > parent.clientHeight && (style.overflowY === 'auto' || style.overflowY === 'scroll')
      if (isScrollable) {
        scrollTarget = parent
        setIsWindowTarget(false)
      } else {
        scrollTarget = window
        setIsWindowTarget(true)
      }
    } else if (target === 'window') {
      scrollTarget = window
      setIsWindowTarget(true)
    } else if (typeof target === 'string') {
      const el = document.querySelector(target)
      scrollTarget = el || window
      setIsWindowTarget(!el)
    } else {
      scrollTarget = window
      setIsWindowTarget(true)
    }

    if (!autoHide) {
      setIsVisible(true)
      return
    }

    const checkScroll = () => {
      let currentScroll = 0
      if (scrollTarget === window) {
        currentScroll = window.scrollY || document.documentElement.scrollTop
      } else if (scrollTarget instanceof HTMLElement) {
        currentScroll = position === 'left' || position === 'right' 
          ? scrollTarget.scrollLeft 
          : scrollTarget.scrollTop
      }

      // For top: show blur once user has scrolled past top boundary
      if (position === 'top') {
        setIsVisible(currentScroll > 10)
      } else if (position === 'bottom') {
        if (scrollTarget === window) {
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight
          setIsVisible(currentScroll < maxScroll - 10)
        } else if (scrollTarget instanceof HTMLElement) {
          const maxScroll = scrollTarget.scrollHeight - scrollTarget.clientHeight
          setIsVisible(currentScroll < maxScroll - 10)
        }
      } else {
        setIsVisible(true)
      }
    }

    checkScroll()
    scrollTarget.addEventListener('scroll', checkScroll, { passive: true })
    return () => {
      scrollTarget?.removeEventListener('scroll', checkScroll)
    }
  }, [autoHide, target, position])

  // Gradient directions based on edge position
  const gradientDirection = useMemo(() => {
    switch (position) {
      case 'top':
        return 'to bottom'
      case 'bottom':
        return 'to top'
      case 'left':
        return 'to right'
      case 'right':
        return 'to left'
      default:
        return 'to bottom'
    }
  }, [position])

  // Calculate blur layer elements
  const blurLayers = useMemo(() => {
    const layerCount = Math.max(1, Math.min(16, Math.round(layers)))
    const elements: React.ReactNode[] = []

    for (let i = 0; i < layerCount; i++) {
      const progress = (i + 1) / layerCount

      // Curve calculation
      let factor = progress
      if (curve === 'ease-in') {
        factor = progress * progress
      } else if (curve === 'ease-out') {
        factor = Math.sqrt(progress)
      } else if (curve === 'ease-in-out') {
        factor = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2
      } else if (curve === 'bezier') {
        factor = progress * progress * (3 - 2 * progress)
      } else {
        factor = progress // linear
      }

      if (exponential) {
        factor = Math.pow(factor, 2)
      }

      const activeHover = isHovered ? hoverIntensity : 1
      const blurPx = Math.max(0.5, factor * strength * 4 * activeHover)
      const stopPercent = progress * 100

      const mask = `linear-gradient(${gradientDirection}, rgba(0, 0, 0, ${opacity}) 0%, transparent ${stopPercent}%)`

      elements.push(
        <div
          key={i}
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none transition-all duration-300"
          style={{
            backdropFilter: `blur(${blurPx}px) saturate(${saturation})`,
            WebkitBackdropFilter: `blur(${blurPx}px) saturate(${saturation})`,
            maskImage: mask,
            WebkitMaskImage: mask,
          }}
        />
      )
    }

    return elements
  }, [layers, curve, exponential, strength, isHovered, hoverIntensity, gradientDirection, opacity, saturation])

  // Positioning style
  const positionStyles: CSSProperties = useMemo(() => {
    const isVertical = position === 'top' || position === 'bottom'
    const isFixed = isWindowTarget || style?.position === 'fixed'

    return {
      position: isFixed ? 'fixed' : 'absolute',
      [position]: 0,
      left: 0,
      right: isVertical ? 0 : undefined,
      top: !isVertical ? 0 : position === 'top' ? 0 : undefined,
      bottom: !isVertical ? 0 : position === 'bottom' ? 0 : undefined,
      height: isVertical ? height : '100%',
      width: isVertical ? '100%' : width,
      zIndex,
      pointerEvents: 'none',
      opacity: isVisible ? 1 : 0,
      transition: 'opacity 0.35s ease-out',
      overflow: 'hidden',
      ...style,
    }
  }, [position, height, width, zIndex, isVisible, isWindowTarget, style])

  return (
    <div
      ref={containerRef}
      className={`gradual-blur-container pointer-events-none ${className}`}
      style={positionStyles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-hidden="true"
    >
      {blurLayers}

      {/* Tint Overlay */}
      {tint && tint !== 'transparent' && (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundColor: tint,
            maskImage: `linear-gradient(${gradientDirection}, rgba(0, 0, 0, ${opacity}) 0%, transparent 100%)`,
            WebkitMaskImage: `linear-gradient(${gradientDirection}, rgba(0, 0, 0, ${opacity}) 0%, transparent 100%)`,
          }}
        />
      )}
    </div>
  )
}
