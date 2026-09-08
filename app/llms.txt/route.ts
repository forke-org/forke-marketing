/**
 * @fileoverview Forke Platform - Dynamic llms.txt standard endpoint
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 */

import { NextResponse } from 'next/server'
import { getPublishedBlogs } from '@/lib/blog-actions'

export const dynamic = 'force-dynamic'

export async function GET() {
  const blogs = await getPublishedBlogs().catch(() => [])

  const blogMarkdown = blogs
    .map((b) => {
      const title = b.title.replace(/[\[\]]/g, '')
      const excerpt = b.excerpt ? ` - ${b.excerpt.replace(/[\r\n]+/g, ' ').trim()}` : ''
      return `- [${title}](https://www.forke.space/blogs/${b.slug})${excerpt}`
    })
    .join('\n')

  const content = `# Forke (forke.space)

> Forke is a developer micro-task and bounty marketplace where independent software engineers ship real code, earn money, and build verified on-chain and GitHub portfolios.

## Overview

Forke connects tech companies, startups, and open-source project owners with verified engineers for scoped software engineering tasks. Rather than traditional freelancing with proposals and bidding wars, Forke operates on a task-claim model with escrow protection, automated code reviews, and developer XP progression.

### Core Architecture & Roles
- **Developers**: Browse open technical bounties, claim tasks matched to their skill level, submit GitHub pull requests, receive code review, and earn instant escrow payouts upon approval.
- **Project Owners**: Connect GitHub repositories, define task specifications and acceptance criteria, fund bounties in escrow, and merge verified code contributions.
- **Leveling System (Levels 1-10)**: Developers progress by earning XP from approved submissions, unlocking higher-tier bounties, priority task claiming, and specialized project tracks.
- **Safety & Escrow**: 100% of task bounties are held in verified escrow before work commences and released directly to the contributor upon approval.

## Canonical Platform Links

- [Home](https://www.forke.space/) - Platform overview, active bounty showcase, and developer onboarding.
- [What is Forke?](https://www.forke.space/whats-forke) - Detailed product philosophy, marketplace mechanics, and architecture.
- [Developer Levels](https://www.forke.space/levels) - Complete developer progression ladder, XP milestones, and perks from Level 1 to 10.
- [Engineering Documentation](https://www.forke.space/docs) - Technical guides, repo linking, task lifecycle, and submission requirements.
- [Changelog](https://www.forke.space/changelog) - Chronological log of product updates, enhancements, and platform releases.
- [Engineering Blog](https://www.forke.space/blogs) - Deep-dives into systems engineering, developer productivity, Git, and AI tools.
- [Full Documentation for LLMs](https://www.forke.space/llms-full.txt) - Comprehensive single-file text documentation for deep-context AI models.

## Live Engineering Articles

${blogMarkdown || '- [Engineering Blog Index](https://www.forke.space/blogs) - Stories, architectural deep-dives, and guides from the Forke team.'}

## Machine & AI Ingestion Resources

- Sitemap: https://www.forke.space/sitemap.xml
- RSS Feed: https://www.forke.space/feed.xml
- Full LLM Bundle: https://www.forke.space/llms-full.txt
`

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
