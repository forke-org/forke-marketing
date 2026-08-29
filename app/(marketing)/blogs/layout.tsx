/**
 * @fileoverview Forke Platform
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

import { Metadata } from 'next'
import { buildOpenGraph, buildTwitter } from '@/lib/utils/og'

export const metadata: Metadata = {
  title: 'Blogs',
  description: 'Stories, updates, and ideas from the Forke team.',
  alternates: { canonical: '/blogs' },
  openGraph: buildOpenGraph({
    title: 'The Forke Blogs',
    description: 'Stories, updates, and ideas from the Forke team.',
    url: 'https://www.forke.space/blogs',
  }),
  twitter: buildTwitter({
    title: 'The Forke Blogs',
    description: 'Stories, updates, and ideas from the Forke team.',
  }),
}

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
