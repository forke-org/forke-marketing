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

import { useEffect, useState } from 'react'

/**
 * Mirrors the middleware's waitlist gate on the client: true when the waitlist
 * is active and this visitor has no site access — CTAs should read "Coming
 * soon" and route to "/" instead of /register.
 */
export function useWaitlisterView(): boolean {
  const [hasSiteAccess, setHasSiteAccess] = useState(true)
  const [waitlistActive, setWaitlistActive] = useState(false)

  useEffect(() => {
    const getCookie = (name: string): string | null => {
      if (typeof document === 'undefined') return null
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop()?.split(';').shift() || null
      return null
    }

    setHasSiteAccess(getCookie('site_access_public') === 'true')
    setWaitlistActive(getCookie('waitlist_active') === 'true')
  }, [])

  return waitlistActive && !hasSiteAccess
}

/**
 * Whether sign up is open for this visitor: the waitlist is off, or they unlocked
 * the site with an access key at /checkout. null until the cookies have been read,
 * so callers can keep the waitlist wording for the first paint (most visitors).
 */
export function useSiteOpen(): boolean | null {
  const [open, setOpen] = useState<boolean | null>(null)
  useEffect(() => {
    const read = (name: string) => document.cookie.split('; ').find((c) => c.startsWith(`${name}=`))?.slice(name.length + 1) ?? null
    setOpen(read('site_access_public') === 'true' || read('waitlist_active') === 'false')
  }, [])
  return open
}

/** Dashboard origin for signed-in visitors. */
export function dashboardUrl(): string {
  const prod = typeof window !== 'undefined' && window.location.hostname.endsWith('forke.space')
  return process.env.NEXT_PUBLIC_DASHBOARD_URL || (prod ? 'https://dashboard.forke.space' : 'http://localhost:3001')
}
