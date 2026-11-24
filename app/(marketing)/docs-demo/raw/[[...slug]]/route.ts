/**
 * @fileoverview Forke Platform
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

import { allPaths } from '@/lib/docs/load'
import { markdownFor } from '@/lib/docs/agents'

/**
 * The markdown of a page. Reached as /docs-demo/<page>.md (and /docs-demo/skill.md), or as the page address itself when an
 * agent asks for text/markdown: the middleware rewrites those requests here.
 */

export const dynamic = 'force-static'

export function generateStaticParams() {
  return [...allPaths(), 'skill'].map((p) => ({ slug: p ? p.split('/') : [] }))
}

export async function GET(_: Request, { params }: { params: Promise<{ slug?: string[] }> }) {
  const path = ((await params).slug ?? []).join('/')
  const body = markdownFor(path)
  if (!body) return new Response('Not found. See https://www.forke.space/docs-demo/llms.txt for every page.\n', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=3600',
      'X-Robots-Tag': 'noindex',
      Link: `<https://www.forke.space/docs-demo${path && path !== 'skill' ? '/' + path : ''}>; rel="canonical"`,
    },
  })
}
