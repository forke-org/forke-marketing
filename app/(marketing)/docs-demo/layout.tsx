/**
 * @fileoverview Forke Platform
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

import type { Metadata } from 'next'
import { buildOpenGraph, buildTwitter } from '@/lib/utils/og'
import DocsShell from '@/components/docs/DocsShell'
import { searchIndex } from '@/lib/docs/load'
import './docs.css'

const OG = { url: '/docs-demo/img/docs-og.jpg', width: 1200, height: 630, alt: 'Forke Docs' }

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: { default: 'Forke Docs', template: '%s · Forke Docs' },
  description:
    'Documentation for Forke and Forke Mail. Claim scoped coding tasks, ship pull requests through AI-assisted review and get paid by UPI; send email from any language with the Forke Mail API, MCP server and CLI.',
  alternates: { canonical: '/docs-demo', types: { 'text/plain': '/docs-demo/llms.txt' } },
  openGraph: {
    ...buildOpenGraph({
      title: 'Forke Docs',
      description: 'Guides and API reference for Forke, the developer task marketplace, and Forke Mail, the email API for developers and AI agents.',
      url: 'https://www.forke.space/docs-demo',
    }),
    images: [OG],
  },
  twitter: { ...buildTwitter({ title: 'Forke Docs', description: 'Guides and API reference for Forke and Forke Mail.' }), images: [OG.url] },
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const index = searchIndex().map((e) => ({ ...e, text: e.text.slice(0, 500) }))
  return <DocsShell index={index}>{children}</DocsShell>
}
