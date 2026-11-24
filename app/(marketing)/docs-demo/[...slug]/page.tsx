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
import { notFound, permanentRedirect } from 'next/navigation'
import { buildOpenGraph, buildTwitter } from '@/lib/utils/og'
import { allPaths, getPage } from '@/lib/docs/load'
import { LEGACY } from '@/lib/docs/nav'
import { ApiView, ArticleView } from '@/components/docs/PageViews'

const OG = { url: '/docs-demo/img/docs-og.jpg', width: 1200, height: 630, alt: 'Forke Docs' }

type Props = { params: Promise<{ slug: string[] }> }

export const dynamicParams = false

export function generateStaticParams() {
  return [...allPaths().filter(Boolean), ...Object.keys(LEGACY)].map((p) => ({ slug: p.split('/') }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const path = (await params).slug.join('/')
  const page = getPage(path)
  if (!page) return {}
  const url = `https://www.forke.space/docs-demo/${path}`
  return {
    title: page.meta.title,
    description: page.meta.description,
    alternates: { canonical: `/docs-demo/${path}`, types: { 'text/markdown': `/docs-demo/${path}.md` } },
    openGraph: { ...buildOpenGraph({ title: `${page.meta.title} · Forke Docs`, description: page.meta.description, url }), images: [OG] },
    twitter: { ...buildTwitter({ title: `${page.meta.title} · Forke Docs`, description: page.meta.description }), images: [OG.url] },
  }
}

export default async function DocPage({ params }: Props) {
  const path = (await params).slug.join('/')
  if (LEGACY[path]) permanentRedirect(`/docs-demo/${LEGACY[path]}`)
  const page = getPage(path)
  if (!page) notFound()
  return page.api ? <ApiView page={page} /> : <ArticleView page={page} />
}
