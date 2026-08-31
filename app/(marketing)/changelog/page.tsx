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
import { buildOpenGraph, buildTwitter } from '@/lib/utils/og'

export const metadata: Metadata = {
  title: 'Changelog',
  description:
    'What we shipped on Forke — new features, performance improvements, and fixes.',
  alternates: { canonical: '/changelog' },
  openGraph: buildOpenGraph({
    title: 'Changelog | Forke',
    description: 'What we shipped on Forke — new features, improvements, and fixes.',
    url: 'https://www.forke.space/changelog',
  }),
  twitter: buildTwitter({
    title: 'Changelog | Forke',
    description: 'What we shipped on Forke — new features, improvements, and fixes.',
  }),
}

// Re-read at most every 60 seconds.
export const revalidate = 60

export default async function ChangelogPage() {
  const changelogs = await getPublishedChangelogs()

  return (
    <div className="min-h-screen bg-[#060608] text-white flex flex-col antialiased">
      <Navbar />

      <main className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40 pb-24">
        {/* Header matching Supermemory / Linear */}
        <div className="mb-16 sm:mb-24 pb-8 border-b border-white/[0.08]">
          <p className="font-mono text-xs text-[#ff8a00] font-bold tracking-widest uppercase mb-3">
            // CHANGELOG
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.1]">
            What we shipped.
          </h1>
          <p className="mt-4 text-white/50 text-base sm:text-lg font-light max-w-xl leading-relaxed">
            New features, fixes, and product enhancements released on the Forke developer network.
          </p>
        </div>

        {/* 2-Column Sticky Changelog Feed */}
        <ChangelogFeed items={changelogs} />
      </main>

      <Footer />
    </div>
  )
}
