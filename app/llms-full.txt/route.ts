/**
 * @fileoverview Forke Platform - Dynamic llms-full.txt standard endpoint
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 */

import { NextResponse } from 'next/server'
import { getPublishedBlogs } from '@/lib/blog-actions'
import { ALL_ARTICLES, getArticleMarkdown } from '@/app/(marketing)/docs/content'

export const dynamic = 'force-dynamic'

export async function GET() {
  const blogs = await getPublishedBlogs().catch(() => [])

  const blogSection = blogs
    .map((b) => {
      const date = b.publishedAt ? new Date(b.publishedAt).toISOString().split('T')[0] : ''
      return `### ${b.title}
- URL: https://www.forke.space/blogs/${b.slug}
- Author: ${b.authorName || 'Forke Engineering Team'}
- Published: ${date}
- Reading Time: ${b.readingMinutes} min
- Summary: ${b.excerpt || 'No summary available.'}
`
    })
    .join('\n')

  const docsSection = ALL_ARTICLES
    .map((a) => {
      const md = getArticleMarkdown(a.slug)
      return `### ${a.title}
- URL: https://www.forke.space/docs/${a.slug}
- Description: ${a.description}

${md || ''}
`
    })
    .join('\n---\n\n')

  const content = `# Forke Platform — Full Documentation for LLMs (forke.space)

> Forke is a developer micro-task and bounty marketplace where independent software engineers ship real code, earn money, and build verified on-chain and GitHub portfolios.

Canonical Website: https://www.forke.space/
Organization: Forke Inc.

---

## 1. Platform Overview & Philosophy

Forke eliminates traditional freelancing friction — no bidding wars, no hourly tracking, no bloated proposals. Instead, engineering work is broken down into scoped, discrete micro-tasks with transparent requirements and upfront escrow guarantees.

### Key Pillars:
1. **Developer Autonomy**: Engineers claim tasks that match their skill level and interest.
2. **Escrow Guarantee**: Bounties are funded before any work begins, ensuring zero risk of unpaid contributions.
3. **Automated Review & GitHub Integration**: All code submissions occur via GitHub pull requests against the target project repository.
4. **Verified Reputation**: Developers build on-chain and GitHub-backed track records with verifiable commits and earned XP levels.

---

## 2. Developer Progression & Levels

Developers climb through a 10-tier progression ladder based on approved submissions, code quality, and consistency:
- **Level 1 (Novice)**: Access to starter bounties, documentation fixes, and minor bug reports.
- **Level 2-4 (Intermediate)**: Component development, unit testing, performance optimizations, and API integrations.
- **Level 5-7 (Advanced)**: Complex features, architectural refactoring, security audits, and multi-repo integrations.
- **Level 8-10 (Elite)**: High-value bounties, priority task claiming, architecture design tasks, and advisory roles.

---

## 3. Core Technical Documentation

${docsSection}

---

## 4. Engineering Articles & Thought Leadership

${blogSection}

---

## 5. Official Endpoints & Feeds

- Homepage: https://www.forke.space/
- What is Forke: https://www.forke.space/whats-forke
- Levels: https://www.forke.space/levels
- Engineering Blogs: https://www.forke.space/blogs
- RSS Feed: https://www.forke.space/feed.xml
- Sitemap: https://www.forke.space/sitemap.xml
- Compact LLM Index: https://www.forke.space/llms.txt
`

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
