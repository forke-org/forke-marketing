'use client'

/**
 * @fileoverview Forke Platform — ButtonGrain Component
 * Fine, organic film-grain surface texture matching Framer Grain specifications.
 * Clips inside button bounds, zero-overhead cached texture, pointer-events-none.
 */

import React, { useEffect, useState } from 'react'

interface ButtonGrainProps {
  opacity?: number
  warmTone?: boolean
  className?: string
}

let cachedNeutralUrl = ''
let cachedWarmUrl = ''

export default function ButtonGrain({
  opacity = 0.1,
  warmTone = false,
  className = '',
}: ButtonGrainProps) {
  const [textureUrl, setTextureUrl] = useState<string>(() =>
    warmTone ? cachedWarmUrl : cachedNeutralUrl
  )

  useEffect(() => {
    if (warmTone && cachedWarmUrl) {
      setTextureUrl(cachedWarmUrl)
      return
    }
    if (!warmTone && cachedNeutralUrl) {
      setTextureUrl(cachedNeutralUrl)
      return
    }

    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 128
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const imageData = ctx.createImageData(128, 128)
    const data = imageData.data

    // Fine organic film-grain algorithm (Box-Muller gaussian distribution)
    let seed = warmTone ? 42 : 108
    const random = () => {
      const x = Math.sin(seed++) * 10000
      return x - Math.floor(x)
    }

    for (let i = 0; i < data.length; i += 4) {
      const u = Math.max(0.0001, 1 - random())
      const v = random()
      const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
      let val = 128 + z * 58
      val = Math.max(0, Math.min(255, val))

      if (warmTone) {
        // Subtle warm amber/orange tint matching Forke palette
        data[i] = Math.min(255, val * 1.12)
        data[i + 1] = Math.min(255, val * 0.78)
        data[i + 2] = Math.min(255, val * 0.35)
      } else {
        // Understated neutral grey
        data[i] = val
        data[i + 1] = val
        data[i + 2] = val
      }
      data[i + 3] = 255
    }

    ctx.putImageData(imageData, 0, 0)
    const url = canvas.toDataURL()

    if (warmTone) {
      cachedWarmUrl = url
    } else {
      cachedNeutralUrl = url
    }

    setTextureUrl(url)
  }, [warmTone])

  if (!textureUrl) return null

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] select-none z-[1] ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-[35%] animate-button-grain"
        style={{
          backgroundImage: `url(${textureUrl})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px',
          opacity,
          mixBlendMode: 'overlay',
        }}
      />
    </div>
  )
}
