/**
 * @fileoverview Forke Platform
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

import { createHash } from 'node:crypto'

// Server-side analytics helpers (Node runtime only — uses node:crypto).
// Two distinct concerns live here on purpose:
//   1. Visit tracking  -> first-party marketing signal, NO IP (see lib/utils/attribution.ts).
//   2. IP hashing       -> security/auth log only, one-way salted hash, never the raw IP.

export const SESSION_COOKIE = 'forke_session'

/** Salt for IP hashing. Set ANALYTICS_IP_SALT in env; fall back keeps dev working. */
const IP_SALT = process.env.ANALYTICS_IP_SALT || 'forke-default-rotate-me'

/**
 * One-way, salted SHA-256 of an IP address. We store ONLY this — never the raw IP.
 * Same IP always hashes to the same value (so we can still spot "many accounts, one IP"),
 * but the hash can't be reversed back to an address.
 */
export function hashIp(ip?: string | null): string | null {
  if (!ip) return null
  const clean = ip.split(',')[0].trim() // x-forwarded-for can be a list; take the client IP
  if (!clean) return null
  return createHash('sha256').update(IP_SALT + clean).digest('hex')
}

/** Pull the client IP from Cloudflare or standard proxy headers (nginx / reverse proxy). */
export function getClientIp(headers: Headers): string | null {
  return (
    headers.get('cf-connecting-ip') ||
    headers.get('x-forwarded-for') ||
    headers.get('x-real-ip') ||
    null
  )
}

/** Coarse country from edge geo headers (Cloudflare, Nginx GeoIP2). No IP retained. */
export function getCountry(headers: Headers): string | null {
  const code =
    headers.get('cf-ipcountry') ||
    headers.get('x-country-code') ||
    headers.get('x-real-ip-country') ||
    headers.get('cloudfront-viewer-country') ||
    headers.get('fastly-client-country') ||
    headers.get('x-geo-country') ||
    null

  if (!code) return null
  const cleaned = code.trim().toUpperCase()
  if (/^[A-Z]{2}$/.test(cleaned) && cleaned !== 'XX' && cleaned !== 'T1') {
    return cleaned
  }
  return null
}

export interface BotDetectionResult {
  isBot: boolean
  category?: 'search_engine' | 'ai_agent' | 'social_preview' | 'malicious_scanner' | 'uptime_monitor'
  name?: string
}

const SEARCH_ENGINE_PATTERNS: Record<string, RegExp> = {
  Googlebot: /googlebot|adsbot|mediapartners-google/i,
  Bingbot: /bingbot|bingpreview|msnbot/i,
  Baiduspider: /baiduspider/i,
  YandexBot: /yandexbot|yandeximages/i,
  DuckDuckBot: /duckduckbot|duckassistbot/i,
  Sogou: /sogou/i,
  SeznamBot: /seznambot/i,
}

const AI_AGENT_PATTERNS: Record<string, RegExp> = {
  GPTBot: /gptbot/i,
  ChatGPTUser: /chatgpt-user/i,
  OAISearchBot: /oai-searchbot/i,
  ClaudeBot: /claudebot|anthropic-ai/i,
  PerplexityBot: /perplexitybot/i,
  Applebot: /applebot/i,
  MetaAgent: /meta-externalagent/i,
  Amazonbot: /amazonbot/i,
  Bytespider: /bytespider/i,
  Cohere: /cohere-ai/i,
  QwenBot: /qwenbot/i,
  GrokBot: /grokbot/i,
  HuaweiCrawler: /huaweicrawler/i,
}

const SOCIAL_PREVIEW_PATTERNS: Record<string, RegExp> = {
  WhatsApp: /whatsapp/i,
  TelegramBot: /telegrambot/i,
  Twitterbot: /twitterbot/i,
  FacebookExternalHit: /facebookexternalhit/i,
  Slackbot: /slackbot/i,
  Discordbot: /discordbot/i,
  LinkedInBot: /linkedinbot/i,
  Embedly: /embedly/i,
  Pinterest: /pinterest/i,
}

const MONITOR_PATTERNS: Record<string, RegExp> = {
  UptimeRobot: /uptimerobot/i,
  Pingdom: /pingdom/i,
  BetterUptime: /betteruptime/i,
  UptimeKuma: /uptime-kuma/i,
}

const SCANNER_AGENT_PATTERNS: Record<string, RegExp> = {
  PaloAlto: /paloalto|cortex-xpanse/i,
  Censys: /censys/i,
  Shodan: /shodan/i,
  Masscan: /masscan/i,
  Zgrab: /zgrab/i,
  InternetMeasurement: /internet-measurement/i,
  Netcraft: /netcraft/i,
  BinaryEdge: /binaryedge/i,
  SecurityScan: /leakix|projectdiscovery|nuclei|nikto/i,
}

const MALICIOUS_PATH_PATTERNS = [
  /\/\.env/i,
  /\/\.git/i,
  /\/\.ssh/i,
  /\/id_rsa/i,
  /\/\.kube/i,
  /\/\.aws/i,
  /\/\.config/i,
  /\/\.ds_store/i,
  /\/Jenkinsfile/i,
  /\/owa\b/i,
  /\/solr\b/i,
  /\/wp-(admin|login|content|includes)/i,
  /\/phpmyadmin/i,
  /\/server-status/i,
  /\/nginx_status/i,
  /\/actuator/i,
  /\/boaform/i,
  /\/autodiscover/i,
  /\/api\/fs\//i,
  /\/error_log/i,
  /\/graphql/i,
  /\/dns-query/i,
]

export function detectBot(
  ua?: string | null,
  landingPath?: string | null,
  host?: string | null
): BotDetectionResult {
  // 1. Path-based malicious probe detection
  if (landingPath && MALICIOUS_PATH_PATTERNS.some((pattern) => pattern.test(landingPath))) {
    return { isBot: true, category: 'malicious_scanner', name: 'Vulnerability Probe' }
  }

  // 2. Direct-to-IP access check (scanners hitting raw server IP instead of domain)
  if (host && /^[0-9.]+(:[0-9]+)?$/.test(host)) {
    return { isBot: true, category: 'malicious_scanner', name: 'Raw IP Scanner' }
  }

  // 3. Empty or generic script tool User-Agent
  if (!ua || ua.trim() === '') {
    return { isBot: true, category: 'malicious_scanner', name: 'Empty User-Agent' }
  }
  if (/^(curl|wget|python-requests|python|node-fetch|axios|go-http-client|okhttp|libwww-perl|headless|phantomjs|puppeteer|playwright|postman)/i.test(ua)) {
    return { isBot: true, category: 'malicious_scanner', name: 'HTTP Script / CLI' }
  }

  // 4. Search Engines
  for (const [name, regex] of Object.entries(SEARCH_ENGINE_PATTERNS)) {
    if (regex.test(ua)) return { isBot: true, category: 'search_engine', name }
  }

  // 5. AI Agents
  for (const [name, regex] of Object.entries(AI_AGENT_PATTERNS)) {
    if (regex.test(ua)) return { isBot: true, category: 'ai_agent', name }
  }

  // 6. Social Previews
  for (const [name, regex] of Object.entries(SOCIAL_PREVIEW_PATTERNS)) {
    if (regex.test(ua)) {
      // Differentiate: Real human clicking link in WhatsApp in-app browser has full browser engine (Mozilla + WebKit/Safari/Chrome)
      // vs WhatsApp preview crawler which only fetches og:image card metadata and lacks Mozilla browser engine.
      if (name === 'WhatsApp' && /mozilla/i.test(ua) && /webkit|safari|chrome/i.test(ua)) {
        continue // Real human user in WhatsApp mobile app
      }
      return { isBot: true, category: 'social_preview', name }
    }
  }

  // 7. Monitors
  for (const [name, regex] of Object.entries(MONITOR_PATTERNS)) {
    if (regex.test(ua)) return { isBot: true, category: 'uptime_monitor', name }
  }

  // 8. Security Scanners
  for (const [name, regex] of Object.entries(SCANNER_AGENT_PATTERNS)) {
    if (regex.test(ua)) return { isBot: true, category: 'malicious_scanner', name }
  }

  // 9. General fallback bot pattern
  if (/\bbot\b|crawl|spider|slurp|monitor/i.test(ua)) {
    return { isBot: true, category: 'search_engine', name: 'Generic Crawler' }
  }

  return { isBot: false }
}

export function isBotUserAgent(ua?: string | null): boolean {
  return detectBot(ua).isBot
}
