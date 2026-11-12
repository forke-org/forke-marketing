'use client'

/**
 * Full-load Forky loader — same behaviour as forke-admin's template:
 *
 * - On every hard load or manual reload it covers the page from the first paint
 *   (it is in the server HTML, so there is never a flash of half-loaded content).
 * - It stays for at least 1.2s, and until the page is actually ready: hydrated,
 *   fonts in, window loaded (capped at 6s on a very slow connection).
 * - Then Forky traces itself away and the page fades in underneath.
 * - Moving between pages inside the site does not replay it (this component lives
 *   in the root layout, which stays mounted); slow navigations use RouteLoader.
 * - Without JavaScript, CSS hides it after 12s and <noscript> hides it at once.
 */
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { ForkyLoader } from './ForkyLoader'

const MIN_MS = 1200
const MAX_WAIT = 6000

export default function BootLoader() {
  const [phase, setPhase] = useState<'boot' | 'exit' | 'fade' | 'gone'>('boot')

  useEffect(() => {
    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []
    const wait = (ms: number) => new Promise<void>((resolve) => timers.push(setTimeout(resolve, ms)))
    const loaded = new Promise<void>((resolve) => {
      if (document.readyState === 'complete') resolve()
      else window.addEventListener('load', () => resolve(), { once: true })
    })
    const fonts = document.fonts?.ready.then(() => undefined) ?? Promise.resolve()
    const ready = Promise.race([Promise.all([loaded, fonts]), wait(MAX_WAIT)])

    Promise.all([wait(MIN_MS), ready]).then(() => {
      if (!cancelled) setPhase('exit')
    })
    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [])

  useEffect(() => {
    if (phase !== 'fade') return undefined
    const t = setTimeout(() => setPhase('gone'), 260)
    return () => clearTimeout(t)
  }, [phase])

  if (phase === 'gone') return null
  return (
    <div className="boot-loader" aria-hidden={phase === 'fade'}>
      <ForkyLoader
        fullScreen
        exiting={phase === 'exit' || phase === 'fade'}
        onExited={() => setPhase('fade')}
        className={clsx('transition-opacity duration-[250ms]', phase === 'fade' && 'pointer-events-none opacity-0')}
      />
    </div>
  )
}
