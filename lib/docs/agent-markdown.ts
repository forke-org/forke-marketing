/**
 * @fileoverview Forke Platform
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

import agentsData from './agents-data.json'
import type { ApiGroup, Endpoint, Field } from './api-spec'
import { LANGUAGE_GUIDES } from './languages'
import { allSnippets, jsonText } from './snippets'

/**
 * The markdown agents read: /docs-demo/<page>.md, llms-full.txt and the docs MCP server. Directives become plain
 * markdown, links become absolute, demos (which only make sense on screen) are dropped, and every API page
 * carries its parameters, all language samples, the response and the errors.
 */

export const SITE = 'https://www.forke.space'

export const PROMPTS = agentsData.prompts as { name: string; title: string; description: string; text: string }[]
export const TOOLS = agentsData.tools as { name: string; description: string; level: string }[]

const absolute = (href: string) => (href.startsWith('/') ? SITE + href : href)

function fieldRows(fields: Field[], prefix = ''): string[] {
  return fields.flatMap((f) => [
    `| \`${prefix}${f.name}\` | ${f.type} | ${f.required ? 'yes' : 'no'} | ${f.description.replace(/\|/g, '\\|').replace(/\n/g, ' ')} |`,
    ...(f.children ? fieldRows(f.children, `${prefix}${f.name}.`) : []),
  ])
}
const fieldTable = (title: string, fields: Field[]) => `### ${title}\n\n| Name | Type | Required | Description |\n| --- | --- | --- | --- |\n${fieldRows(fields).join('\n')}\n`

export function apiPageMarkdown(group: ApiGroup, e: Endpoint, opts: { frontmatter?: boolean } = {}): string {
  const parts: string[] = []
  if (opts.frontmatter) parts.push(`---\ntitle: ${e.title}\ndescription: ${e.summary.replace(/\n/g, ' ')}\n---\n`)
  parts.push(`\`${e.method} ${e.path}\`\n`)
  parts.push(e.summary + '\n')
  if (e.details) parts.push(e.details + '\n')
  parts.push(`**Who can call it:** ${e.access === 'any' ? 'any API key, including keys with sending access only' : 'API keys with full access'}.${e.tool ? ` **Agent tool:** \`${e.tool}\`.` : ''}${e.cli ? ` **CLI:** \`${e.cli}\`.` : ''}\n`)
  if (e.pathParams?.length) parts.push(fieldTable('Path parameters', e.pathParams))
  if (e.query?.length) parts.push(fieldTable('Query parameters', e.query))
  if (e.headers?.length) parts.push(fieldTable('Headers', e.headers))
  if (e.body?.length) parts.push(fieldTable(e.bodyKind === 'multipart' ? 'Form fields (multipart/form-data)' : 'Body parameters (JSON)', e.body))
  parts.push('### Request\n')
  for (const s of allSnippets(e.example)) parts.push(`\`\`\`${s.shiki} ${s.name}\n${s.code}\n\`\`\`\n`)
  parts.push(`### Response\n\n\`${e.response.status}\`${e.response.status === 204 ? ' with no body.' : ''}\n`)
  if (e.response.body !== null) parts.push(`\`\`\`json\n${jsonText(e.response.body)}\n\`\`\`\n`)
  if (e.response.note) parts.push(e.response.note + '\n')
  if (e.errors?.length) parts.push(`### Errors\n\n| Status | Code | Meaning |\n| --- | --- | --- |\n${e.errors.map((x) => `| ${x.status} | \`${x.code}\` | ${x.meaning} |`).join('\n')}\n\nEvery endpoint can also answer \`401 unauthorized\`, \`403 insufficient_scope\` and \`429 rate_limited\`. See ${SITE}/docs-demo/mail/api/errors.\n`)
  return parts.join('\n')
}

function generated(name: string): string {
  if (name === 'languages') return LANGUAGE_GUIDES.map((g) => `- [${g.name}](${SITE}/docs-demo/mail/send-with-${g.id})`).join('\n')
  if (name === 'prompts') return PROMPTS.map((p) => `### ${p.title}\n\n${p.description} (MCP prompt name: \`${p.name}\`)\n\n\`\`\`text\n${p.text}\n\`\`\``).join('\n\n')
  if (name === 'tools') return `| Tool | What it does | Safety level |\n| --- | --- | --- |\n${TOOLS.map((t) => `| \`${t.name}\` | ${t.description.replace(/\|/g, '\\|')} | ${t.level} |`).join('\n')}`
  return ''
}

export function toAgentMarkdown(source: string): string {
  const out: string[] = []
  let inCode = false
  let inCards = false
  let step = 0
  let inSteps = false
  for (const line of source.split('\n')) {
    if (line.startsWith('```')) inCode = !inCode
    if (inCode || line.startsWith('```')) {
      out.push(line)
      continue
    }
    if (line.startsWith(':::steps')) {
      inSteps = true
      step = 0
      continue
    }
    if (line.startsWith(':::cards')) {
      inCards = true
      continue
    }
    const details = line.match(/^:::details (.+)$/)
    if (details) {
      out.push(`#### ${details[1]}`)
      continue
    }
    if (line.trim() === ':::') {
      inCards = false
      inSteps = false
      continue
    }
    if (inCards) {
      const m = line.match(/^- \[([^\]]+)\]\(([^)]+)\)\s*(?:—|-)?\s*(.*?)\s*(\{[^}]*\})?\s*$/)
      if (m) out.push(`- [${m[1]}](${absolute(m[2])}): ${m[3]}`)
      continue
    }
    if (inSteps && line.startsWith('### ')) {
      out.push(`### Step ${++step}: ${line.slice(4)}`)
      continue
    }
    const image = line.match(/^::image\{(.*)\}\s*$/)
    if (image) {
      const a = Object.fromEntries([...image[1].matchAll(/(\w+)="([^"]*)"/g)].map((m) => [m[1], m[2]]))
      out.push(`![${a.alt ?? ''}](${absolute(a.src)})${a.caption ? `\n\n*${a.caption}*` : ''}`)
      continue
    }
    if (/^::demo/.test(line)) continue
    const gen = line.match(/^::(languages|prompts|tools)\s*$/)
    if (gen) {
      out.push(generated(gen[1]))
      continue
    }
    out.push(line.replace(/\]\((\/[^)]*)\)/g, (_, href) => `](${absolute(href)})`))
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

export function pageAgentMarkdown(page: { path: string; meta: { title: string; description: string }; source: string; api?: { group: ApiGroup; endpoint: Endpoint } }): string {
  const url = `${SITE}/docs-demo${page.path ? '/' + page.path : ''}`
  const body = page.api ? toAgentMarkdown(apiPageMarkdown(page.api.group, page.api.endpoint)) : toAgentMarkdown(page.source)
  return `# ${page.meta.title}\n\n> ${page.meta.description}\n\n${body}\n\n---\n\nSource: ${url}\nAll docs for agents: ${SITE}/docs-demo/llms.txt · Full text: ${SITE}/docs-demo/llms-full.txt · Search them over MCP: ${SITE}/docs-demo/mcp\n`
}
