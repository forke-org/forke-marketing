'use client'

/**
 * @fileoverview Forke Platform - Client-Side Search Engine & External Referrer Attribution Tracker
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 */

import { useEffect } from 'react'

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'))
  return match ? decodeURIComponent(match[2]) : null
}

export function ClientAttributionTracker() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const pathname = window.location.pathname
      // Only track public marketing landing pages
      if (
        pathname.startsWith('/admin') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/dashboard') ||
        pathname.startsWith('/tasks') ||
        pathname.startsWith('/settings') ||
        pathname.startsWith('/ide') ||
        pathname.startsWith('/auth')
      ) {
        return
      }

      // Deduplicate per browser tab session so we don't fire on internal page transitions
      if (sessionStorage.getItem('forke_session_landed')) return
      sessionStorage.setItem('forke_session_landed', 'true')

      const ref = document.referrer || ''
      const host = window.location.hostname.toLowerCase()

      let source = 'direct'
      let medium = 'direct'
      let refHost = ''
      let isInternal = true

      if (ref) {
        try {
          refHost = new URL(ref).hostname.toLowerCase().replace(/^www\./, '')
        } catch {
          refHost = ref.replace(/^[a-z0-9_-]+:\/\//i, '').split('/')[0].toLowerCase().replace(/^www\./, '')
        }
        isInternal = !refHost || refHost === host || refHost.endsWith('.forke.space') || refHost === 'forke.space' || refHost.includes('localhost')
        if (!isInternal) {
          source = 'referral'
          medium = 'referral'
          if (
            refHost.includes('google') || 
            refHost.includes('bing') || 
            refHost.includes('yahoo') || 
            refHost.includes('duckduckgo') || 
            refHost.includes('yandex') || 
            refHost.includes('brave') || 
            refHost.includes('ecosia') || 
            refHost.includes('baidu') ||
            refHost.includes('startpage') ||
            refHost.includes('kagi')
          ) {
            source = 'organic'
            medium = 'organic'
          } else if (refHost.includes('chatgpt') || refHost.includes('openai')) {
            source = 'chatgpt'
            medium = 'ai'
          } else if (refHost.includes('claude') || refHost.includes('anthropic')) {
            source = 'claude'
            medium = 'ai'
          } else if (refHost.includes('perplexity')) {
            source = 'perplexity'
            medium = 'ai'
          } else if (refHost.includes('github')) {
            source = 'github'
          } else if (refHost.includes('reddit')) {
            source = 'reddit'
            medium = 'social'
          } else if (refHost.includes('twitter') || refHost.includes('x.com') || refHost.includes('t.co')) {
            source = 'twitter'
            medium = 'social'
          } else if (refHost.includes('linkedin') || refHost.includes('lnkd.in')) {
            source = 'linkedin'
            medium = 'social'
          }
        }
      }

      // Check URL query parameters (utm_source, source, ref)
      const params = new URLSearchParams(window.location.search)
      const urlSource = params.get('source') || params.get('utm_source') || params.get('ref')
      const urlMedium = params.get('utm_medium')
      const urlCampaign = params.get('utm_campaign')
      if (urlSource) source = urlSource
      if (urlMedium) medium = urlMedium

      const hasUrlParams = Boolean(urlSource || urlMedium || urlCampaign)
      const hasExternalReferrer = Boolean(ref && refHost && !isInternal)

      // If there is no external referrer and no tracking params, the server-side middleware
      // already recorded this direct landing visit. Avoid redundant client pings.
      if (!hasExternalReferrer && !hasUrlParams) {
        return
      }

      const sessionId = getCookie('forke_session') || undefined

      // Ping /api/track with client-captured landing data and session ID for deduplication
      fetch('/api/track', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          source,
          medium,
          campaign: urlCampaign || undefined,
          referrer: ref || undefined,
          landingPath: pathname,
        }),
      }).catch(() => {})

    } catch {
      // Attribution should never disrupt user experience
    }
  }, [])

  return null
}
