import type { Metadata } from 'next'
import PageShell, { PageHeader } from '@/components/shared/PageShell'
import { getPublishedChangelogs } from '@/lib/actions/changelog-actions'
import ChangelogFeed from './ChangelogFeed'

export const metadata: Metadata = {
  title: 'Changelog — Everything We’ve Actually Shipped',
  description:
    'The live changelog for Forke. Hand-curated shipping updates, new features, developer tools, bug fixes and platform releases.',
  alternates: { canonical: 'https://www.forke.space/changelog' },
}

export const revalidate = 60

export default async function ChangelogPage(props: { searchParams?: Promise<{ page?: string }> }) {
  const searchParams = await props.searchParams
  const initialPage = Math.max(1, parseInt(searchParams?.page || '1', 10) || 1)
  const items = await getPublishedChangelogs()
  const latest = items[0] ? new Date(items[0].publishedAt) : null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    url: 'https://www.forke.space/changelog',
    name: 'Changelog — Everything We’ve Actually Shipped | Forke',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items.slice(0, 10).map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: { '@type': 'SoftwareApplication', name: item.title, description: item.description, datePublished: item.publishedAt },
      })),
    },
  }

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHeader
        eyebrow="Changelog"
        title="Everything we've"
        muted="actually shipped."
        aside={
          <dl className="grid grid-cols-2 gap-x-10 gap-y-1 font-mono text-[12px] lg:text-right">
            <dt className="text-white/35">Updates</dt>
            <dt className="text-white/35">Last shipped</dt>
            <dd className="text-[15px] text-ink">{items.length}</dd>
            <dd className="text-[15px] text-ink">
              {latest ? latest.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
            </dd>
          </dl>
        }
      >
        Hand-curated, not generated from commits. One entry is one change you can actually see, even when it spans
        several repos.
      </PageHeader>
      <ChangelogFeed items={items} initialPage={initialPage} />
    </PageShell>
  )
}
