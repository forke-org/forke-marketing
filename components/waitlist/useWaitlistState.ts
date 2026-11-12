'use client'

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
  const source = params.get('source') || params.get('utm_source') || 'waitlist'

  const [count, setCount] = useState<number | null>(null)
  const [verifying, setVerifying] = useState(Boolean(emailParam))
  const [joined, setJoined] = useState(false)

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
          window.location.href = '/'
          return
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
