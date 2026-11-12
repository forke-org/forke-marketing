'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type Thumb = { size: number; offset: number; scrollable: boolean }
type Source = {
  read: () => { top: number; height: number; client: number }
  scrollTo: (top: number) => void
  listen: (onChange: () => void) => () => void
}

const PAD = 4
const MIN_THUMB = 32
const IDLE_MS = 900

function useScrollbar(source: Source | null) {
  const [thumb, setThumb] = useState<Thumb>({ size: 0, offset: 0, scrollable: false })
  const [active, setActive] = useState(false)
  const idle = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const drag = useRef<{ startY: number; startTop: number; ratio: number } | null>(null)

  const measure = useCallback(() => {
    if (!source) return
    const { top, height, client } = source.read()
    const range = height - client
    if (range <= 1) {
      setThumb({ size: 0, offset: 0, scrollable: false })
      return
    }
    const track = client - PAD * 2
    const size = Math.max(MIN_THUMB, (client / height) * track)
    setThumb({ size, offset: PAD + (top / range) * (track - size), scrollable: true })
  }, [source])

  const wake = useCallback(() => {
    setActive(true)
    clearTimeout(idle.current)
    idle.current = setTimeout(() => setActive(false), IDLE_MS)
  }, [])

  useEffect(() => {
    if (!source) return undefined
    measure()
    const stop = source.listen(() => {
      measure()
      wake()
    })
    return () => {
      stop()
      clearTimeout(idle.current)
    }
  }, [source, measure, wake])

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!source) return
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    const { top, height, client } = source.read()
    const track = client - PAD * 2
    drag.current = { startY: e.clientY, startTop: top, ratio: (height - client) / Math.max(1, track - thumb.size) }
  }
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!source || !drag.current) return
    source.scrollTo(drag.current.startTop + (e.clientY - drag.current.startY) * drag.current.ratio)
  }
  const onPointerUp = () => {
    drag.current = null
  }

  return { thumb, active, onPointerDown, onPointerMove, onPointerUp, wake }
}

function Bar({ bar, fixed }: { bar: ReturnType<typeof useScrollbar>; fixed?: boolean }) {
  if (!bar.thumb.scrollable) return null
  return (
    <div
      aria-hidden
      onPointerEnter={bar.wake}
      className={`group/bar z-40 w-3 ${fixed ? 'fixed top-0 right-0 bottom-0' : 'absolute top-0 right-0 bottom-0'}`}
    >
      <div
        onPointerDown={bar.onPointerDown}
        onPointerMove={bar.onPointerMove}
        onPointerUp={bar.onPointerUp}
        onPointerCancel={bar.onPointerUp}
        style={{ height: bar.thumb.size, transform: `translateY(${bar.thumb.offset}px)` }}
        className={`absolute top-0 right-[3px] w-1 cursor-grab touch-none rounded-full bg-accent/80 transition-[opacity,width] duration-200 group-hover/bar:w-1.5 hover:bg-accent active:cursor-grabbing ${
          bar.active ? 'opacity-100' : 'opacity-0 group-hover/bar:opacity-100'
        }`}
      />
    </div>
  )
}

export function WindowScrollbar() {
  const [source, setSource] = useState<Source | null>(null)
  useEffect(() => {
    const doc = document.scrollingElement || document.documentElement
    document.documentElement.classList.add('no-scrollbar')
    setSource({
      read: () => ({ top: doc.scrollTop, height: doc.scrollHeight, client: window.innerHeight }),
      scrollTo: (top) => window.scrollTo({ top }),
      listen: (onChange) => {
        const resize = new ResizeObserver(onChange)
        resize.observe(document.body)
        window.addEventListener('scroll', onChange, { passive: true })
        window.addEventListener('resize', onChange)
        return () => {
          resize.disconnect()
          window.removeEventListener('scroll', onChange)
          window.removeEventListener('resize', onChange)
        }
      },
    })
    return () => document.documentElement.classList.remove('no-scrollbar')
  }, [])
  const bar = useScrollbar(source)
  return <Bar bar={bar} fixed />
}
