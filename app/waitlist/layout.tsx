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

export const metadata: Metadata = {
  title: 'Join the Waitlist',
  description:
    'Forke is rolling out access in waves. Join the waitlist to be among the first developers and teams to ship real work and get paid on the platform.',
  alternates: { canonical: '/waitlist' },
  openGraph: {
    title: 'Join the Waitlist',
    description: 'Be among the first to ship real work and get paid on Forke.',
    url: 'https://www.forke.space/waitlist',
  },
}

export default function WaitlistLayout({ children }: { children: React.ReactNode }) {
  return children
}
