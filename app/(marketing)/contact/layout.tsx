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
  title: 'Contact',
  description:
    'Get in touch with the Forke team. Questions about bounties, payouts, the review pipeline, or partnerships — reach us by email or send a message.',
  keywords: ['contact forke', 'forke support', 'forke email', 'get in touch', 'developer marketplace contact'],
  alternates: { canonical: '/contact' },
  openGraph: buildOpenGraph({
    title: 'Contact | Forke',
    description: 'Questions about bounties, payouts, or partnerships? Reach the Forke team.',
    url: 'https://www.forke.space/contact',
  }),
  twitter: buildTwitter({
    title: 'Contact | Forke',
    description: 'Questions about bounties, payouts, or partnerships? Reach the Forke team.',
  }),
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
