/**
 * @fileoverview Forke Platform
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { eq, and, gt } from 'drizzle-orm'
import { db } from '@/lib/db'
import { pageVisits } from '@/lib/db/schema'
import { normalizeSource } from '@/lib/utils/attribution'
import { getCountry, isBotUserAgent } from '@/lib/utils/analytics'
/** Validate a 2-letter ISO country code coming from the middleware body. */
function cleanCountry(raw: unknown): string | null {
  if (typeof raw !== 'string') return null
  const code = raw.trim().toUpperCase()
  return /^[A-Z]{2}$/.test(code) ? code : null
}

function clean(raw: unknown, max: number): string | null {
  if (typeof raw !== 'string') return null
  const v = raw.trim().slice(0, max)
  return v || null
}

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const consent = req.cookies.get('forke_cookie_consent')?.value
    if (consent === 'declined') {
      return NextResponse.json({ ok: true, skipped: 'consent_declined' })
    }

    const body = await req.json().catch(() => ({}))

    const ua = req.headers.get('user-agent')
    const isBot = isBotUserAgent(ua)

    // Don't write bot rows at all — keeps the table small and the charts human.
    if (isBot) return NextResponse.json({ ok: true, skipped: 'bot' })

    const sessionId = clean(body.sessionId, 64)
    const landingPath = clean(body.landingPath, 255) || '/'

    // 1-Device deduplication: prevent duplicate visit rows from the same device/session within 24 hours
    if (sessionId) {
      const existing = await db
        .select({ id: pageVisits.id })
        .from(pageVisits)
        .where(
          and(
            eq(pageVisits.sessionId, sessionId),
            eq(pageVisits.landingPath, landingPath),
            gt(pageVisits.createdAt, new Date(Date.now() - 24 * 60 * 60 * 1000))
          )
        )
        .limit(1)

      if (existing.length > 0) {
        return NextResponse.json({ ok: true, skipped: 'deduplicated' })
      }
    }

    const referrer = clean(body.referrer, 255)
    let source = normalizeSource(typeof body.source === 'string' ? body.source : null)
    let medium = clean(body.medium, 64)

    // Automatically detect search engines from referrer even if source wasn't passed in URL
    if (source === 'direct' && referrer) {
      const refLower = referrer.toLowerCase()
      if (/google|bing|yahoo|duckduckgo|brave|ecosia|baidu|startpage|kagi|naver|yandex/i.test(refLower)) {
        source = 'organic'
        if (!medium) medium = 'organic'
      } else if (/chatgpt|openai/i.test(refLower)) {
        source = 'chatgpt'
        if (!medium) medium = 'ai'
      } else if (/claude|anthropic/i.test(refLower)) {
        source = 'claude'
        if (!medium) medium = 'ai'
      } else if (/perplexity/i.test(refLower)) {
        source = 'perplexity'
        if (!medium) medium = 'ai'
      } else if (/github/i.test(refLower)) {
        source = 'github'
      } else if (/reddit/i.test(refLower)) {
        source = 'reddit'
        if (!medium) medium = 'social'
      } else if (/twitter|x\.com|t\.co/i.test(refLower)) {
        source = 'twitter'
        if (!medium) medium = 'social'
      } else if (/linkedin|lnkd\.in/i.test(refLower)) {
        source = 'linkedin'
        if (!medium) medium = 'social'
      }
    }

    await db.insert(pageVisits).values({
      sessionId,
      source,
      medium,
      campaign: clean(body.campaign, 64),
      referrer,
      landingPath,
      // Prefer the geo the middleware resolved from the ORIGINAL request. The edge geo
      // headers are absent on this internal fetch, so getCountry() is only a fallback
      // for any direct (non-middleware) caller.
      country: cleanCountry(body.country) ?? getCountry(req.headers),
      isBot: false,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    // Tracking must never break a page load — swallow and report 204-ish.
    console.error('track insert failed:', error)
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}
