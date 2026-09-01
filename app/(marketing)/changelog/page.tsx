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
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { getPublishedChangelogs } from '@/lib/actions/changelog-actions'
import ChangelogFeed from './ChangelogFeed'
import { Rails } from '@/components/landing/primitives'
import { buildOpenGraph, buildTwitter } from '@/lib/utils/og'

export const metadata: Metadata = {
  title: 'Changelog — Everything We’ve Actually Shipped',
  description:
    'Hand-curated, not auto-generated from commits. A live ledger of user-visible shipping moments across the Forke developer platform.',
  alternates: { canonical: '/changelog' },
  openGraph: buildOpenGraph({
    title: 'Changelog — Everything We’ve Actually Shipped | Forke',
    description: 'Hand-curated, not auto-generated from commits. A live ledger of user-visible shipping moments across the Forke developer platform.',
    url: 'https://www.forke.space/changelog',
  }),
  twitter: buildTwitter({
    title: 'Changelog — Everything We’ve Actually Shipped | Forke',
    description: 'Hand-curated, not auto-generated from commits. A live ledger of user-visible shipping moments across the Forke developer platform.',
  }),
}

// Re-read at most every 60 seconds.
export const revalidate = 60

export default async function ChangelogPage() {
  const changelogs = await getPublishedChangelogs()

  return (
    <div className="min-h-screen bg-[#060608] text-white flex flex-col antialiased relative selection:bg-accent/30 selection:text-white">
      <Navbar />

      {/* Ambient Top Radial Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(255,122,0,0.12)_0%,transparent_60%)] z-0"
      />

      <main className="flex-grow pt-28 sm:pt-36 pb-32 relative z-10">
        <Rails fadeTop fadeBottom>
          <ChangelogFeed items={changelogs} />
        </Rails>
      </main>

      <Footer />
    </div>
  )
}


