import { NextResponse } from 'next/server'
import type { NextRequest, NextFetchEvent } from 'next/server'

const ATTRIBUTION_COOKIE = 'forke_attribution'
const SESSION_COOKIE = 'forke_session'
const DEVICE_COOKIE = 'forke_device_id'

const TRACKING_PARAMS = [
  'source',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'ref',
]

function newId(): string {
  return crypto.randomUUID()
}

function normalizeSource(raw?: string | null): string {
  if (!raw) return 'direct'
  const cleaned = raw.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '').slice(0, 32)
  return cleaned || 'direct'
}

function cleanField(raw?: string | null): string | undefined {
  if (!raw) return undefined
  const cleaned = raw.toLowerCase().trim().replace(/[^a-z0-9_\- ]/g, '').slice(0, 64)
  return cleaned || undefined
}

function sourceFromReferrerHost(host: string): string {
  const h = host.toLowerCase().replace(/^www\./, '')
  // Search engines -> organic
  if (
    h.includes('google') || 
    h.includes('bing.') || 
    h.includes('yahoo.') || 
    h.includes('duckduckgo.') || 
    h.includes('yandex.') || 
    h.includes('brave.com') || 
    h.includes('ecosia.') || 
    h.includes('baidu.') ||
    h.includes('startpage.') ||
    h.includes('kagi.com') ||
    h.includes('qwant.') ||
    h.includes('naver.')
  ) {
    return 'organic'
  }
  if (h.includes('chatgpt') || h.includes('openai')) return 'chatgpt'
  if (h.includes('claude') || h.includes('anthropic')) return 'claude'
  if (h.includes('perplexity')) return 'perplexity'
  if (h.includes('gemini') || h.includes('deepmind')) return 'gemini'
  if (h.includes('deepseek')) return 'deepseek'
  if (h.includes('poe.com')) return 'poe'
  if (h.includes('news.ycombinator') || h.includes('ycombinator')) return 'hackernews'
  if (h.includes('peerlist')) return 'peerlist'
  if (h.includes('reddit')) return 'reddit'
  if (h.includes('linkedin') || h.includes('lnkd.in')) return 'linkedin'
  if (h.includes('twitter') || h.includes('x.com') || h.includes('t.co')) return 'twitter'
  if (h.includes('threads.net')) return 'threads'
  if (h.includes('bsky.app') || h.includes('bluesky')) return 'bluesky'
  if (h.includes('github')) return 'github'
  if (h.includes('producthunt')) return 'producthunt'
  if (h.includes('instagram')) return 'instagram'
  if (h.includes('facebook') || h.includes('fb.me')) return 'facebook'
  if (h.includes('youtube') || h.includes('youtu.be')) return 'youtube'
  if (h.includes('discord')) return 'discord'
  if (h.includes('telegram') || h.includes('t.me')) return 'telegram'
  if (h.includes('whatsapp') || h.includes('wa.me')) return 'whatsapp'
  if (h.includes('notion')) return 'notion'
  if (h.includes('slack')) return 'slack'
  if (h.includes('dev.to') || h.includes('hashnode') || h.includes('medium.com') || h.includes('substack')) {
    return h.split('.')[0]
  }

  // Fallback: extract the clean base domain name instead of a generic "referral"
  const cleanDomain = h.replace(/:\d+$/, '').replace(/[^a-z0-9.-]/g, '').slice(0, 32)
  return cleanDomain || 'direct'
}

function computeAttribution(req: NextRequest, country?: string | null): {
  source: string
  medium?: string
  campaign?: string
  referrer?: string
  landingPage: string
  firstSeenAt: string
  country?: string
} {
  const search = req.nextUrl.searchParams
  const sourceParam = search.get('source') || search.get('utm_source')
  const medium = search.get('utm_medium')
  const campaign = search.get('utm_campaign')
  const refParam = search.get('ref')
  const referrerHeader = req.headers.get('referer') || req.headers.get('referrer')

  let source = normalizeSource(sourceParam || refParam)
  let derivedMedium = cleanField(medium)
  let validReferrer: string | undefined = undefined

  if (referrerHeader) {
    try {
      let h = ''
      try {
        h = new URL(referrerHeader).hostname.toLowerCase()
      } catch {
        h = referrerHeader.replace(/^[a-z0-9_-]+:\/\//i, '').split('/')[0].toLowerCase()
      }
      const isInternal = !h || h === req.nextUrl.hostname.toLowerCase() || h.endsWith('.forke.space') || h === 'forke.space' || h.includes('localhost')
      
      if (!isInternal) {
        validReferrer = referrerHeader.slice(0, 500)
        if (source === 'direct') {
          source = sourceFromReferrerHost(h)
          if (!derivedMedium) derivedMedium = source === 'organic' ? 'organic' : 'referral'
        }
      }
    } catch (_) {}
  }

  const cleanCountryCode = typeof country === 'string' && /^[a-zA-Z]{2}$/.test(country.trim()) ? country.trim().toUpperCase() : undefined

  return {
    source,
    medium: derivedMedium,
    campaign: cleanField(campaign),
    referrer: validReferrer,
    landingPage: req.nextUrl.pathname.slice(0, 255),
    firstSeenAt: new Date().toISOString(),
    country: cleanCountryCode,
  }
}

function setAttributionCookie(res: NextResponse, attribution: object) {
  res.cookies.set(ATTRIBUTION_COOKIE, encodeURIComponent(JSON.stringify(attribution)), {
    path: '/',
    maxAge: 60 * 60 * 24 * 90,
    sameSite: 'lax',
    domain: process.env.NODE_ENV === 'production' ? '.forke.space' : undefined,
  })
}

function setSessionCookie(res: NextResponse, sessionId: string) {
  res.cookies.set(SESSION_COOKIE, sessionId, {
    path: '/',
    maxAge: 60 * 30, // 30 minutes active session window
    sameSite: 'lax',
    domain: process.env.NODE_ENV === 'production' ? '.forke.space' : undefined,
  })
}

function setDeviceCookie(res: NextResponse, deviceId: string) {
  res.cookies.set(DEVICE_COOKIE, deviceId, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 365 days (1 year persistent device identifier)
    sameSite: 'lax',
    domain: process.env.NODE_ENV === 'production' ? '.forke.space' : undefined,
  })
}

const RESERVED_NON_MARKETING_PREFIXES = [
  '/admin',
  '/api',
  '/dashboard',
  '/tasks',
  '/earnings',
  '/escrow',
  '/submissions',
  '/notifications',
  '/settings',
  '/messages',
  '/support',
  '/developers',
  '/onboarding',
  '/post-task',
  '/ide',
  '/auth',
  '/signin',
  '/register',
  '/checkout',
  '/setup',
  '/login',
  '/logout',
  '/profile',
  '/actuator',
  '/wp-',
  '/wp',
  '/php',
  '/env',
  '/.env',
  '/_',
]

const STATIC_MARKETING_PATHS = new Set([
  '/',
  '/whats-forke',
  '/levels',
  '/waitlist',
  '/pricing',
  '/changelog',
  '/contact',
  '/privacy',
  '/terms',
  '/refund',
  '/mcp',
  '/blogs',
  '/blog',
  '/docs',
])

export function isPublicMarketingRoute(pathname: string): boolean {
  if (!pathname || pathname === '') return false
  const cleanPath = pathname.split('?')[0].replace(/\/+$/, '') || '/'

  // Explicitly reject any reserved / admin / dashboard / internal paths
  for (const prefix of RESERVED_NON_MARKETING_PREFIXES) {
    if (cleanPath === prefix || cleanPath.startsWith(`${prefix}/`) || cleanPath.startsWith(prefix)) {
      return false
    }
  }

  // Reject files, manifests, icons, images, probes
  if (
    cleanPath.includes('.') ||
    cleanPath.endsWith('/opengraph-image') ||
    cleanPath.includes('env') ||
    cleanPath.includes('probe') ||
    cleanPath.includes('config')
  ) {
    return false
  }

  // Allow static marketing landing pages
  if (STATIC_MARKETING_PATHS.has(cleanPath)) {
    return true
  }

  // Allow blog posts: /blogs/:slug or /blog/:slug
  if (cleanPath.startsWith('/blogs/') || cleanPath.startsWith('/blog/')) {
    const slug = cleanPath.replace(/^\/(blogs|blog)\//, '')
    return slug.length > 0 && !slug.includes('/') && /^[a-zA-Z0-9_-]+$/.test(slug)
  }

  // Allow documentation pages: /docs/:slug
  if (cleanPath.startsWith('/docs/')) {
    const docSlug = cleanPath.replace(/^\/docs\//, '')
    return docSlug.length > 0 && !docSlug.includes('/') && /^[a-zA-Z0-9_-]+$/.test(docSlug)
  }

  // Allow public creator / developer profile: /:username (minimum 2 chars, alphanumeric)
  const username = cleanPath.slice(1)
  if (/^[a-zA-Z0-9][a-zA-Z0-9_-]{1,38}$/.test(username)) {
    if (
      username.startsWith('wp') ||
      username.startsWith('actuator') ||
      username.includes('test') ||
      username.length < 2
    ) {
      return false
    }
    return true
  }

  return false
}

let cachedWaitlistStatus: { enabled: boolean; expiry: number } | null = null

async function fetchWaitlistStatus(origin: string): Promise<boolean> {
  const now = Date.now()
  if (cachedWaitlistStatus && now < cachedWaitlistStatus.expiry) {
    return cachedWaitlistStatus.enabled
  }

  const url = new URL('/api/waitlist/status', origin)
  if (url.hostname === 'localhost') {
    url.hostname = '127.0.0.1'
  }
  try {
    const res = await fetch(url, { cache: 'no-store' })
    const data = await res.json()
    const enabled = typeof data.enabled === 'boolean' ? data.enabled : true
    cachedWaitlistStatus = { enabled, expiry: now + 30_000 } // 30s cache
    return enabled
  } catch (e) {
    return true // Default enabled
  }
}

export async function middleware(req: NextRequest, ev?: NextFetchEvent) {
  const pathname = req.nextUrl.pathname

  // Skip static files & API routes
  if (
    pathname.includes('.') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/uploads')
  ) {
    return NextResponse.next()
  }

  const isProd = process.env.NODE_ENV === 'production'
  const domainOption = isProd ? { domain: '.forke.space' } : {}

  // Check or initialize device ID and session ID
  const existingDevice = req.cookies.get(DEVICE_COOKIE)?.value
  const deviceId = existingDevice || newId()

  const existingSession = req.cookies.get(SESSION_COOKIE)?.value
  const sessionId = existingSession || newId()
  const isNewSession = !existingSession

  const country =
    req.headers.get('cf-ipcountry') ||
    req.headers.get('x-country-code') ||
    req.headers.get('x-real-ip-country') ||
    null

  const hasTrackingParams = TRACKING_PARAMS.some((p) => req.nextUrl.searchParams.has(p))
  const attribution = computeAttribution(req, country)

  // Track visit via background ping on a strictly public marketing landing page
  if (isPublicMarketingRoute(pathname) && (isNewSession || hasTrackingParams || attribution.source !== 'direct')) {
    const trackOrigin = isProd ? 'http://127.0.0.1:3000' : req.nextUrl.origin
    const trackUrl = new URL('/api/track', trackOrigin)

    const trackPromise = fetch(trackUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'user-agent': req.headers.get('user-agent') || '',
        'x-real-ip': req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for') || '',
        'cf-ipcountry': country || '',
        'x-forke-session': sessionId,
      },
      body: JSON.stringify({
        sessionId,
        deviceId,
        source: attribution.source,
        medium: attribution.medium,
        campaign: attribution.campaign,
        referrer: attribution.referrer,
        landingPath: pathname,
        country,
      }),
    }).catch(() => {})

    if (ev?.waitUntil) {
      ev.waitUntil(trackPromise)
    }
  }

  if (hasTrackingParams) {
    const cleanUrl = new URL(req.nextUrl.pathname, req.nextUrl.origin)
    req.nextUrl.searchParams.forEach((value, key) => {
      if (!TRACKING_PARAMS.includes(key)) cleanUrl.searchParams.set(key, value)
    })
    const redirect = NextResponse.redirect(cleanUrl)
    setDeviceCookie(redirect, deviceId)
    setSessionCookie(redirect, sessionId)
    if (attribution.source !== 'direct' || attribution.medium || attribution.campaign) {
      setAttributionCookie(redirect, attribution)
    }
    return redirect
  }

  const siteAccess = req.cookies.get('site_access')?.value
  const waitlistJoined = req.cookies.get('waitlist_joined')?.value
  const waitlistEnabled = await fetchWaitlistStatus(req.nextUrl.origin)

  // Redirect /waitlist back to / if visitor already joined or has site access
  if (pathname === '/waitlist' && waitlistEnabled && (siteAccess || waitlistJoined)) {
    const redirectUrl = new URL('/', req.nextUrl.origin)
    redirectUrl.search = req.nextUrl.search
    const res = NextResponse.redirect(redirectUrl)
    res.cookies.set('waitlist_active', waitlistEnabled ? 'true' : 'false', { path: '/', ...domainOption })
    setDeviceCookie(res, deviceId)
    setSessionCookie(res, sessionId)
    if (attribution.source !== 'direct' || attribution.medium || attribution.campaign) {
      setAttributionCookie(res, attribution)
    }
    return res
  }

  const res = NextResponse.next()
  res.cookies.set('waitlist_active', waitlistEnabled ? 'true' : 'false', { path: '/', ...domainOption })
  res.cookies.set('site_access_public', siteAccess ? 'true' : 'false', { path: '/', ...domainOption })
  setDeviceCookie(res, deviceId)
  setSessionCookie(res, sessionId)
  const existingAttrCookie = req.cookies.get(ATTRIBUTION_COOKIE)?.value
  const isExternalTouch = attribution.source !== 'direct' || attribution.campaign || hasTrackingParams
  if ((!existingAttrCookie && isExternalTouch) || hasTrackingParams) {
    setAttributionCookie(res, attribution)
  }

  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

