'use client'

/**
 * Forky loader for page-to-page navigation on slow connections.
 *
 * Next's `loading.tsx` would also do this, but it makes Next send every page (static
 * ones included) hidden behind the fallback until a script reveals it. That is a blank
 * page without JavaScript, so instead this listens for clicks on internal links and
 * covers the page until the new route has rendered (the pathname changes).
 * `.route-loader` keeps it invisible for the first 250ms, so quick navigations never flash.
 */
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ForkyLoader } from './ForkyLoader'

const GIVE_UP_MS = 15000

export default function RouteLoader() {
  const pathname = usePathname()
  const [pending, setPending] = useState(false)

  // the new page has rendered: hide
  useEffect(() => {
    setPending(false)
  }, [pathname])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element | null)?.closest?.('a')
      if (!a || !a.href || a.hasAttribute('download')) return
      if (a.target && a.target !== '_self') return
      const url = new URL(a.href, window.location.href)
      if (url.origin !== window.location.origin) return
      // same page (hash jumps, or the page you're on): nothing to load
      if (url.pathname === window.location.pathname) return
      setPending(true)
    }
    // capture phase: Next's <Link> cancels the default click before it bubbles to document
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  useEffect(() => {
    if (!pending) return undefined
    const t = setTimeout(() => setPending(false), GIVE_UP_MS)
    return () => clearTimeout(t)
  }, [pending])

  if (!pending) return null
  return (
    <div className="route-loader">
      <ForkyLoader fullScreen />
    </div>
  )
}
