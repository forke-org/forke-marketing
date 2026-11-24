/**
 * @fileoverview Forke Platform
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

import { ALL_ITEMS, TABS } from './nav'
import { getPage, searchIndex } from './load'
import { pageAgentMarkdown, PROMPTS, SITE } from './agent-markdown'

/** Everything served to agents: llms.txt, llms-full.txt, the skill file, and the text behind the docs MCP tools. */

const pageUrl = (p: string) => `${SITE}/docs-demo${p ? '/' + p : ''}`

export function markdownFor(path: string): string | null {
  if (path === 'skill') return skill()
  const page = getPage(path)
  if (!page && path === '') return llmsIndex()
  return page ? pageAgentMarkdown(page) : null
}

export function llmsIndex(): string {
  const parts = [
    '# Forke Docs',
    '',
    '> Documentation for Forke (a marketplace where developers claim scoped coding tasks, ship them as pull requests through an AI-assisted review pipeline and get paid by UPI from escrow) and Forke Mail (an email API for developers and AI agents: transactional email, templates, contacts, events, workflows and broadcasts on Amazon SES, with an MCP server at https://mail.forke.space/mcp and a CLI).',
    '',
    'How to read these docs as an agent:',
    `- Add \`.md\` to any page address for clean markdown, for example ${SITE}/docs-demo/mail/quickstart.md. Requests with \`Accept: text/markdown\` get markdown too.`,
    `- ${SITE}/docs-demo/llms-full.txt is every page in one file.`,
    `- ${SITE}/docs-demo/mcp is a docs MCP server (Streamable HTTP, no sign-in) with search_docs and read_page tools.`,
    `- ${SITE}/docs-demo/skill.md is a ready-made agent skill for sending email with Forke Mail.`,
    '- To act on a Forke Mail account (send, add domains, write templates), connect the product MCP server https://mail.forke.space/mcp instead; it signs in with OAuth and asks the user before anything risky.',
    '',
  ]
  for (const tab of TABS.filter((t) => t.groups.length)) {
    parts.push(`## ${tab.title}`, '', tab.description, '')
    for (const g of tab.groups) {
      parts.push(`### ${g.title}`, '')
      for (const item of g.items) {
        const page = getPage(item.path)
        parts.push(`- [${page?.meta.title ?? item.title}](${pageUrl(item.path)}.md)${page?.meta.description ? `: ${page.meta.description}` : ''}`)
      }
      parts.push('')
    }
  }
  return parts.join('\n')
}

export function llmsFull(): string {
  return [llmsIndex(), ...ALL_ITEMS.map((i) => markdownFor(i.path)).filter(Boolean)].join('\n\n---\n\n')
}

export function skill(): string {
  const setup = PROMPTS.find((p) => p.name === 'setup-app')!
  return `---
name: forke-mail
description: Send email from an app with Forke Mail. Use when adding transactional email (welcome, sign-in codes, password resets, receipts), templates, webhooks or email workflows to a project, or when moving off Resend, SendGrid, Postmark or SES.
---

# Forke Mail

Forke Mail is an HTTP email API. Base URL \`https://mail.forke.space\`. Authenticate with \`Authorization: Bearer $FORKE_MAIL_API_KEY\`.

## Rules

- Read the key from the environment variable \`FORKE_MAIL_API_KEY\`. Never hard-code it, log it or commit it. Make sure \`.env\` is in \`.gitignore\`.
- Use a test key (\`fm_test_…\`) while building: requests are validated for real, emails are stored with status \`test\` and nothing is delivered. Live keys start with \`fm_live_\`.
- Send only from the server, never from browser code.
- Send an \`Idempotency-Key\` header on every send, built from what the email is about (\`welcome/<user id>\`, \`receipt/<order id>\`), so retries never send twice.
- Live sends need a from address on a verified domain. Errors are JSON \`{"error": "code"}\`; handle \`from_domain_not_verified\`, \`recipient_suppressed\`, \`trial_quota_exceeded\` (402) and \`rate_limited\` (429, honour \`Retry-After\`).
- Put repeated emails in templates (\`{{name}}\` escaped, \`{{{html}}}\` raw) and send them by name with \`data\`.

## Send an email

\`\`\`ts
const res = await fetch('https://mail.forke.space/api/transactional', {
  method: 'POST',
  headers: {
    Authorization: \`Bearer \${process.env.FORKE_MAIL_API_KEY}\`,
    'Content-Type': 'application/json',
    'Idempotency-Key': \`welcome/\${user.id}\`,
  },
  body: JSON.stringify({
    to: user.email,
    from_name: 'Acme',
    from_address: 'hi@acme.com',
    template: 'welcome',
    data: { name: user.name },
  }),
})
if (!res.ok) throw new Error(\`Forke Mail: \${(await res.json()).error}\`)
\`\`\`

## Setting up a project

${setup.text}

## Reference

- Every endpoint, with examples in nine languages: ${SITE}/docs-demo/mail/api
- Language guides: ${SITE}/docs-demo/mail/languages
- All docs as one file: ${SITE}/docs-demo/llms-full.txt
`
}

/** Search for the docs MCP server: the same ranking as the site search, returning paths agents can read. */
export function searchDocs(query: string, limit = 8) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  return searchIndex()
    .map((e) => {
      let score = 0
      for (const w of words) {
        if (e.title.toLowerCase().includes(w)) score += 10
        if (e.headings.some((h) => h.toLowerCase().includes(w))) score += 5
        if (e.description.toLowerCase().includes(w)) score += 3
        if (e.text.toLowerCase().includes(w)) score += 1
      }
      return { e, score }
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ e }) => ({ path: e.path, title: e.title, description: e.description, url: pageUrl(e.path), section: `${e.tab} › ${e.group}` }))
}
