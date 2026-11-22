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
import { useSearchParams } from 'next/navigation'

function setJoinedCookie() {
  document.cookie = 'waitlist_joined=true; path=/; max-age=31536000; SameSite=Lax'
}

/**
 * Shared waitlist page logic: the live "N developers waiting" count, the ?email= check
 * (already on the list → straight to the site), the sign-up source and the joined state.
 */
export function useWaitlistState() {
  const params = useSearchParams()
  const emailParam = params.get('email') || ''
  // only a real channel from the link (?source= / ?utm_source=); no placeholder, so a visit with no
  // referrer or tag is saved as 'direct' instead of looking like it came from somewhere called "waitlist"
  const source = params.get('source') || params.get('utm_source') || undefined

  const [count, setCount] = useState<number | null>(null)
  const [verifying, setVerifying] = useState(Boolean(emailParam))
  const [joined, setJoined] = useState(false)

  // returning visitors who already joined see the joined state instead of the form
  useEffect(() => {
    if (/(?:^|;\s*)waitlist_joined=true/.test(document.cookie)) setJoined(true)
  }, [])

  useEffect(() => {
    fetch('/api/waitlist/count')
      .then((r) => r.json())
      .then((d) => d?.success && setCount(d.count))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!emailParam) return
    fetch(`/api/waitlist/check?email=${encodeURIComponent(emailParam)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d?.joined) {
          setJoinedCookie()
          setJoined(true)
        }
        setVerifying(false)
      })
      .catch(() => setVerifying(false))
  }, [emailParam])

  const onJoined = () => {
    setJoinedCookie()
    setJoined(true)
    setCount((c) => (c !== null ? c + 1 : c))
  }

  return { emailParam, source, count, verifying, joined, onJoined }
}
