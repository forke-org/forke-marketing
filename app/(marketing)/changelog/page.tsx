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
    'The official live changelog and product updates for Forke.space. Hand-curated shipping updates, new features, developer tools, bug fixes, and platform releases across the Forke developer marketplace.',
  keywords: [
    'forke changelog',
    'forke updates',
    'forke release notes',
    'forke space changelog',
    'forke features',
    'developer platform updates',
    'shipping log',
    'forke platform updates',
    'forke developer ecosystem',
  ],
  authors: [{ name: 'Forke Engineering Team', url: 'https://www.forke.space' }],
  creator: 'Forke Inc.',
  publisher: 'Forke',
  alternates: { canonical: 'https://www.forke.space/changelog' },
  openGraph: buildOpenGraph({
    title: 'Changelog — Everything We’ve Actually Shipped | Forke',
    description:
      'The official live changelog and product updates for Forke.space. Hand-curated shipping updates, new features, developer tools, and platform releases.',
    url: 'https://www.forke.space/changelog',
  }),
  twitter: buildTwitter({
    title: 'Changelog — Everything We’ve Actually Shipped | Forke',
    description:
      'The official live changelog and product updates for Forke.space. Hand-curated shipping updates, new features, developer tools, and platform releases.',
  }),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

// Re-read at most every 60 seconds.
export const revalidate = 60

export default async function ChangelogPage(props: {
  searchParams?: Promise<{ page?: string }>
}) {
  const searchParams = await props.searchParams
  const initialPage = Math.max(1, parseInt(searchParams?.page || '1', 10) || 1)
  const changelogs = await getPublishedChangelogs()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://www.forke.space/changelog#webpage',
        url: 'https://www.forke.space/changelog',
        name: 'Changelog — Everything We’ve Actually Shipped | Forke',
        description:
          'The official live changelog and product updates for Forke.space. Hand-curated shipping updates, new features, developer tools, and platform releases.',
        inLanguage: 'en-US',
        isPartOf: {
          '@type': 'WebSite',
          '@id': 'https://www.forke.space/#website',
          url: 'https://www.forke.space',
          name: 'Forke',
          description: 'The micro-task marketplace for developers.',
          publisher: {
            '@type': 'Organization',
            name: 'Forke Inc.',
            url: 'https://www.forke.space',
          },
        },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://www.forke.space',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Changelog',
              item: 'https://www.forke.space/changelog',
            },
          ],
        },
      },
      {
        '@type': 'ItemList',
        '@id': 'https://www.forke.space/changelog#changelog-list',
        name: 'Forke Releases & Platform Updates',
        description: 'Timeline of user-visible shipping moments across the Forke developer platform.',
        numberOfItems: changelogs.length,
        itemListElement: changelogs.slice(0, 10).map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'SoftwareApplication',
            name: item.title,
            description: item.description,
            datePublished: item.publishedAt,
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Web',
            author: {
              '@type': 'Organization',
              name: 'Forke Inc.',
            },
          },
        })),
      },
    ],
  }

  return (
    <div className="min-h-screen bg-[#060608] text-white flex flex-col antialiased relative selection:bg-accent/30 selection:text-white">
      {/* Schema.org Structured Data for Search Engines & LLM Crawlers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      {/* Ambient Top Radial Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(255,122,0,0.12)_0%,transparent_60%)] z-0"
      />

      <main className="flex-grow pt-20 sm:pt-36 pb-20 sm:pb-32 relative z-10">
        <Rails fadeTop fadeBottom>
          <ChangelogFeed items={changelogs} initialPage={initialPage} />
        </Rails>
      </main>

      <Footer />
    </div>
  )
}


