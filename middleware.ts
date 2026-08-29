import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ATTRIBUTION_COOKIE = 'forke_attribution'
const SESSION_COOKIE = 'forke_session'

const TRACKING_PARAMS = [
  'source',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'ref',
]

function newSessionId(): string {
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
  const h = host.toLowerCase()
  if (/(^|\.)(google|bing|yahoo|yandex|duckduckgo|brave|baidu|ecosia|qwant)\./.test(h)) return 'organic'
  if (/(^|\.)reddit\.|^out\.reddit\./.test(h)) return 'reddit'
  if (/(^|\.)(linkedin\.|lnkd\.in)/.test(h)) return 'linkedin'
  if (/(^|\.)(twitter\.|x\.com|t\.co)/.test(h)) return 'twitter'
  if (/(^|\.)github\./.test(h)) return 'github'
  if (/(^|\.)producthunt\./.test(h)) return 'producthunt'
  if (/(^|\.)(instagram\.|l\.instagram\.)/.test(h)) return 'instagram'
  if (/(^|\.)(facebook\.|m\.facebook\.|fb\.me)/.test(h)) return 'facebook'
  if (/(^|\.)(youtube\.|youtu\.be)/.test(h)) return 'youtube'
  if (/(^|\.)(discord\.|discordapp\.)/.test(h)) return 'discord'
  if (/(^|\.)(t\.me|telegram\.)/.test(h)) return 'telegram'
  if (/(^|\.)whatsapp\./.test(h) || h === 'wa.me') return 'whatsapp'
  return 'referral'
}

function computeAttribution(req: NextRequest): object | null {
  const search = req.nextUrl.searchParams
  const sourceParam = search.get('source') || search.get('utm_source')
  const medium = search.get('utm_medium')
  const campaign = search.get('utm_campaign')
  const refParam = search.get('ref')
  const referrerHeader = req.headers.get('referer')

  let source = normalizeSource(sourceParam || refParam)
  let derivedMedium = cleanField(medium)

  if (source === 'direct' && referrerHeader) {
    try {
      const refUrl = new URL(referrerHeader)
      if (refUrl.hostname !== req.nextUrl.hostname) {
        source = sourceFromReferrerHost(refUrl.hostname)
        if (!derivedMedium) derivedMedium = source === 'organic' ? 'organic' : 'referral'
      }
    } catch (_) {}
  }

  if (source === 'direct' && !derivedMedium && !campaign) {
    return null
  }

  return {
    source,
    medium: derivedMedium,
    campaign: cleanField(campaign),
    referrer: referrerHeader ? referrerHeader.slice(0, 500) : undefined,
    landingPage: req.nextUrl.pathname.slice(0, 255),
    firstSeenAt: new Date().toISOString(),
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

async function fetchWaitlistStatus(origin: string): Promise<boolean> {
  const url = new URL('/api/waitlist/status', origin)
  if (url.hostname === 'localhost') {
    url.hostname = '127.0.0.1'
  }
  try {
    const res = await fetch(url, { cache: 'no-store' })
    const data = await res.json()
    return data.enabled
  } catch (e) {
    return true // Default enabled
  }
}

export async function middleware(req: NextRequest) {
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

  const hasTrackingParams = TRACKING_PARAMS.some((p) => req.nextUrl.searchParams.has(p))
  if (hasTrackingParams) {
    const cleanUrl = new URL(req.nextUrl.pathname, req.nextUrl.origin)
    req.nextUrl.searchParams.forEach((value, key) => {
      if (!TRACKING_PARAMS.includes(key)) cleanUrl.searchParams.set(key, value)
    })
    const redirect = NextResponse.redirect(cleanUrl)
    const attribution = computeAttribution(req)
    if (attribution) {
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
    return res
  }

  const res = NextResponse.next()
  res.cookies.set('waitlist_active', waitlistEnabled ? 'true' : 'false', { path: '/', ...domainOption })
  res.cookies.set('site_access_public', siteAccess ? 'true' : 'false', { path: '/', ...domainOption })

  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
