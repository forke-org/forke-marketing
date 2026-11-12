'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Lays its children out at a fixed desktop `width` and scales the result down to fit
 * the available space, so a UI preview keeps exactly its desktop proportions on phones
 * (smaller, never re-wrapped). With room for the full width it simply fills the space.
 */
export default function FitScale({ width, children, className = '' }: { width: number; children: ReactNode; className?: string }) {
  const outer = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [fits, setFits] = useState(true)
  const [height, setHeight] = useState<number | undefined>(undefined)

  useEffect(() => {
    const o = outer.current
    const i = inner.current
    if (!o || !i) return undefined
    const update = () => {
      const roomy = o.clientWidth >= width
      const k = roomy ? 1 : o.clientWidth / width
      setFits(roomy)
      setScale(k)
      setHeight(roomy ? undefined : i.offsetHeight * k)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(o)
    ro.observe(i)
    return () => ro.disconnect()
  }, [width])

  return (
    // when scaling, the inner box is taken out of flow so its fixed width can't stretch the
    // parent column (which would make the page wider than the phone)
    <div ref={outer} className={`relative w-full min-w-0 ${className}`} style={{ height }}>
      <div
        ref={inner}
        style={fits ? undefined : { position: 'absolute', left: 0, top: 0, width, transform: `scale(${scale})`, transformOrigin: 'top left' }}
      >
        {children}
      </div>
    </div>
  )
}
