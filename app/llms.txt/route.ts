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

> Forke is a developer-only micro-task and bounty marketplace. Engineers claim bite-sized coding tasks (30 minutes to 4 hours), ship real code via Git pull requests, level up their engineering tier, and receive instant UPI payouts upon approval.

## What is Forke?

Forke connects startups and repository owners with independent developers for scoped software engineering tasks. Unlike generic freelancing platforms with bidding wars and proposals, Forke is Git-native, skill-gated, and built around verified code contributions.

### How It Works:
1. **Claim a Task**: Developers browse a live feed gated to their earned skill level and trust score. No bidding wars or lengthy proposals — claim a task and start building immediately.
2. **Build in an Isolated Branch**: Work takes place in an isolated, Forke-managed GitHub branch, keeping repository owners' codebases secure.
3. **Submit a Pull Request**: Developers open a PR with a structured submission. Automated tests and an AI-assisted code review pipeline run before the repository owner reviews the work.
4. **Instant Payout & Merging**: 100% of the task bounty is held in escrow before work starts. When the owner approves the pull request, Forke merges upstream and releases the payout instantly via UPI.

### Core Value Proposition:
- **No Resumes**: Your merged GitHub pull requests build a real, verifiable public engineering portfolio.
- **No Interviews**: Developer tiers (Level 1 to Level 10) and XP are earned through shipped code, not claimed on a CV.
- **No Proposals**: Claim open tasks directly without endless cover letters or price negotiations.
- **Upfront Escrow Protection**: Bounties are deposited before work begins, ensuring guaranteed compensation for approved code.
- **India-First Startup Focus**: Native ₹ INR pricing, instant UPI settlement, and community-driven open-source growth.

## Canonical Platform Links

- [Home](https://www.forke.space/) - Platform overview, active bounty feed, and developer onboarding.
- [What is Forke?](https://www.forke.space/whats-forke) - Detailed product story, comparison with traditional platforms, and core mechanics.
- [Developer Levels](https://www.forke.space/levels) - Complete 10-tier developer progression ladder, XP milestones, and perks.
- [Engineering Documentation](https://www.forke.space/docs) - Technical guides, repo linking, task lifecycle, and submission requirements.
- [Changelog](https://www.forke.space/changelog) - Chronological log of product updates, feature enhancements, and platform releases.
- [Engineering Blog](https://www.forke.space/blogs) - Systems engineering deep-dives, developer culture, Git workflows, and AI coding insights.
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
