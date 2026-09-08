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
import { isPublicMarketingRoute } from '@/middleware'

/** Validate a 2-letter ISO country code coming from edge headers or body. */
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

    const landingPath = clean(body.landingPath, 255) || '/'
    if (!isPublicMarketingRoute(landingPath)) {
      return NextResponse.json({ ok: true, skipped: 'non_marketing_route' })
    }

    // Resolve sessionId from body, cookie, or header
    const sessionId =
      clean(body.sessionId, 64) ||
      clean(req.cookies.get('forke_session')?.value, 64) ||
      clean(req.headers.get('x-forke-session'), 64) ||
      null

    const referrer = clean(body.referrer, 255)
    let source = normalizeSource(typeof body.source === 'string' ? body.source : null)
    let medium = clean(body.medium, 64)

    // Automatically detect search engines and AI tools from referrer
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

    // Active session deduplication: record 1 visit per active 30-minute session
    if (sessionId) {
      const existing = await db
        .select({ id: pageVisits.id, source: pageVisits.source, referrer: pageVisits.referrer })
        .from(pageVisits)
        .where(
          and(
            eq(pageVisits.sessionId, sessionId),
            gt(pageVisits.createdAt, new Date(Date.now() - 30 * 60 * 1000))
          )
        )
        .limit(1)

      if (existing.length > 0) {
        // If existing record was recorded as 'direct', but this follow-up has richer attribution
        // (e.g. client detected search engine or external referrer), upgrade the existing row!
        if (existing[0].source === 'direct' && source !== 'direct') {
          await db
            .update(pageVisits)
            .set({
              source,
              medium,
              campaign: clean(body.campaign, 64),
              referrer,
            })
            .where(eq(pageVisits.id, existing[0].id))
        }
        return NextResponse.json({ ok: true, skipped: 'session_active' })
      }
    }

    // Rapid duplicate debounce: prevent duplicate records within a 15-second window
    if (!sessionId) {
      const recentDupe = await db
        .select({ id: pageVisits.id })
        .from(pageVisits)
        .where(
          and(
            eq(pageVisits.landingPath, landingPath),
            gt(pageVisits.createdAt, new Date(Date.now() - 15 * 1000))
          )
        )
        .limit(1)

      if (recentDupe.length > 0) {
        return NextResponse.json({ ok: true, skipped: 'rapid_duplicate' })
      }
    }

    const resolvedCountry =
      cleanCountry(body.country) ??
      cleanCountry(req.headers.get('cf-ipcountry')) ??
      cleanCountry(req.headers.get('x-country-code')) ??
      cleanCountry(req.headers.get('x-real-ip-country')) ??
      getCountry(req.headers) ??
      'IN'

    await db.insert(pageVisits).values({
      sessionId,
      source,
      medium,
      campaign: clean(body.campaign, 64),
      referrer,
      landingPath,
      country: resolvedCountry,
      isBot: false,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    // Tracking must never break a page load — swallow and report 200.
    console.error('track insert failed:', error)
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}
