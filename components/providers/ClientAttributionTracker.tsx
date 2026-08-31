'use client'

/**
 * @fileoverview Forke Platform - Client-Side Search Engine & External Referrer Attribution Tracker
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 */

import { useEffect } from 'react'

export function ClientAttributionTracker() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const ref = document.referrer || ''
      const host = window.location.hostname.toLowerCase()
      
      // If no referrer or internal navigation, skip
      if (!ref) return
      let refHost = ''
      try {
        refHost = new URL(ref).hostname.toLowerCase().replace(/^www\./, '')
      } catch {
        refHost = ref.replace(/^[a-z0-9_-]+:\/\//i, '').split('/')[0].toLowerCase().replace(/^www\./, '')
      }

      const isInternal = !refHost || refHost === host || refHost.endsWith('.forke.space') || refHost === 'forke.space' || refHost.includes('localhost')
      if (isInternal) return

      // Deduplicate per browser session so we don't spam on every intra-site route change
      const sessionKey = `forke_ref_tracked_${refHost}`
      if (sessionStorage.getItem(sessionKey)) return
      sessionStorage.setItem(sessionKey, 'true')

      // Determine channel
      let source = 'referral'
      let medium = 'referral'
      
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

      // Ping /api/track with client-captured referrer
      fetch('/api/track', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          source,
          medium,
          referrer: ref,
          landingPath: window.location.pathname,
        }),
      }).catch(() => {})

    } catch {
      // Attribution should never disrupt user experience
    }
  }, [])

  return null
}
