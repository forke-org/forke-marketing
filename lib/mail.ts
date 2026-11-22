/**
 * @fileoverview Forke Platform
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

// Emails from the website are sent by Forke Mail workflows. The site only records
// what happened (an event); the workflow picks the template and timing.

const unquote = (v: string) => v.replace(/^["']|["']$/g, '')

function eventsUrl(): string {
  const api = unquote(process.env.EMAIL_API_URL || 'https://mail.forke.space/api/forke-mail').replace(/\/+$/, '')
  return `${api.replace(/\/api\/forke-mail$/, '')}/api/events`
}

export async function trackForkeMailEvent(email: string, event: string, data?: Record<string, string>): Promise<void> {
  const apiKey = unquote(process.env.FORKE_MAIL_API_KEY || '')
  if (!apiKey || !email) return
  try {
    const res = await fetch(eventsUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ email, event, data: data || {} }),
    })
    if (!res.ok) console.error(`Forke Mail event ${event} failed (${res.status}):`, await res.text())
  } catch (error) {
    console.error(`Forke Mail event ${event} failed:`, error)
  }
}
