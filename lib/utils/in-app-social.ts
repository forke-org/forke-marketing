/**
 * @fileoverview Forke Platform - In-App Mobile Browser (Dark Social) Detector
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Safe for Client, Edge Middleware, and Node.js runtimes (zero server-only dependencies).
 */

export interface InAppSocialResult {
  source: string
  medium: string
}

/**
 * Detect mobile in-app webviews (Dark Social).
 *
 * Native apps (WhatsApp, Instagram, Telegram, LinkedIn, Facebook, Discord, etc.)
 * strip the HTTP Referer header when opening in-app browsers, causing visits to default
 * to "direct". However, their User-Agent headers contain distinct app signatures.
 */
export function detectInAppSocial(userAgent?: string | null): InAppSocialResult | null {
  if (!userAgent || typeof userAgent !== 'string') return null
  const ua = userAgent.toLowerCase()

  // WhatsApp (iOS appends "WhatsApp/...", Android appends "WhatsApp/...")
  if (ua.includes('whatsapp') || ua.includes('wa.me')) {
    return { source: 'whatsapp', medium: 'social' }
  }

  // Instagram (in-app browser on iOS / Android)
  if (ua.includes('instagram')) {
    return { source: 'instagram', medium: 'social' }
  }

  // LinkedIn (iOS appends "LinkedInApp", Android appends "LinkedInApp" or "linkedin ... mobile")
  if (ua.includes('linkedinapp') || (ua.includes('linkedin') && ua.includes('mobile'))) {
    return { source: 'linkedin', medium: 'social' }
  }

  // Facebook / Meta (FBAN = Facebook App Name, FBAV = Facebook App Version, FB_IAB = In-App Browser)
  if (
    ua.includes('fban') ||
    ua.includes('fbav') ||
    ua.includes('fb_iab') ||
    ua.includes('fbios') ||
    ua.includes('fb4a')
  ) {
    return { source: 'facebook', medium: 'social' }
  }

  // Telegram (Telegram-Android or Telegram in iOS webview)
  if (ua.includes('telegram')) {
    return { source: 'telegram', medium: 'social' }
  }

  // Twitter / X (TwitterAndroid, Twitter for iPhone, Tweetie)
  if (ua.includes('twitter') || ua.includes('tweetie')) {
    return { source: 'twitter', medium: 'social' }
  }

  // Discord mobile app
  if (ua.includes('discord')) {
    return { source: 'discord', medium: 'social' }
  }

  // Slack mobile app
  if (ua.includes('slack')) {
    return { source: 'slack', medium: 'social' }
  }

  // Threads by Meta
  if (ua.includes('threads')) {
    return { source: 'threads', medium: 'social' }
  }

  // TikTok / ByteDance Webview
  if (ua.includes('tiktok') || ua.includes('bytedance') || ua.includes('musical_ly')) {
    return { source: 'tiktok', medium: 'social' }
  }

  // Snapchat
  if (ua.includes('snapchat')) {
    return { source: 'snapchat', medium: 'social' }
  }

  // Reddit mobile app
  if (ua.includes('redditapp') || (ua.includes('reddit') && ua.includes('mobile'))) {
    return { source: 'reddit', medium: 'social' }
  }

  // WeChat / MicroMessenger
  if (ua.includes('micromessenger') || ua.includes('wechat')) {
    return { source: 'wechat', medium: 'social' }
  }

  // Line
  if (ua.includes('line/') || ua.includes(' line/')) {
    return { source: 'line', medium: 'social' }
  }

  // Pinterest
  if (ua.includes('pinterest')) {
    return { source: 'pinterest', medium: 'social' }
  }

  // YouTube mobile in-app webview
  if (ua.includes('youtube') && ua.includes('mobile')) {
    return { source: 'youtube', medium: 'social' }
  }

  return null
}
