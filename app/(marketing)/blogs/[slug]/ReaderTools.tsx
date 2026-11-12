'use client'

import { useEffect, useRef } from 'react'

/** Thin orange bar under the nav that fills as you read the article. */
export function ReadingProgress({ target }: { target: string }) {
  const bar = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = document.getElementById(target)
    if (!el || !bar.current) return
    let raf = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight * 0.6)))
      bar.current!.style.transform = `scaleX(${p})`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [target])
  return (
    <div aria-hidden className="fixed inset-x-0 top-14 z-50 h-px">
      <div ref={bar} className="h-full origin-left scale-x-0 bg-accent" />
    </div>
  )
}
