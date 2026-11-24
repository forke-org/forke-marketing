/**
 * @fileoverview Forke Platform
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

import fs from 'node:fs'
import path from 'node:path'
import { cache } from 'react'
import { ALL_ITEMS, TABS, tabFor } from './nav'
import { findEndpoint, type ApiGroup, type Endpoint } from './api-spec'
import { LANGUAGE_GUIDES, languageGuideMarkdown } from './languages'
import { frontmatter, parse, plainText, toc, type Block, type Frontmatter, type TocEntry } from './markdown'
import { apiPageMarkdown } from './agent-markdown'

const ROOT = path.join(process.cwd(), 'content', 'docs')

export type DocPage = {
  path: string
  meta: Frontmatter
  source: string
  blocks: Block[]
  toc: TocEntry[]
  api?: { group: ApiGroup; endpoint: Endpoint }
  updated?: string
}

function fileFor(p: string): string | null {
  for (const f of [path.join(ROOT, `${p}.md`), path.join(ROOT, p, 'index.md')]) if (fs.existsSync(f)) return f
  return null
}

function sourceFor(p: string): { source: string; api?: { group: ApiGroup; endpoint: Endpoint }; file?: string } | null {
  const file = fileFor(p || 'index')
  if (file) return { source: fs.readFileSync(file, 'utf8'), file }
  const lang = p.match(/^mail\/send-with-([\w-]+)$/)
  if (lang) {
    const g = LANGUAGE_GUIDES.find((x) => x.id === lang[1])
    if (g) return { source: languageGuideMarkdown(g) }
  }
  const api = p.match(/^mail\/api\/([\w-]+)\/([\w-]+)$/)
  if (api) {
    const found = findEndpoint(api[1], api[2])
    if (found) return { source: apiPageMarkdown(found.group, found.endpoint, { frontmatter: true }), api: found }
  }
  return null
}

export const getPage = cache((p: string): DocPage | null => {
  const clean = p.replace(/^\/+|\/+$/g, '').replace(/^docs-demo\/?/, '')
  const found = sourceFor(clean)
  if (!found) return null
  const { meta, body } = frontmatter(found.source)
  const blocks = found.api ? [] : parse(body)
  const updated = found.file ? fs.statSync(found.file).mtime.toISOString().slice(0, 10) : undefined
  return { path: clean, meta, source: body, blocks, toc: found.api ? [] : toc(blocks), api: found.api, updated }
})

/** Every page path, the docs home included. */
export function allPaths(): string[] {
  return ['', ...ALL_ITEMS.map((i) => i.path)]
}

export type SearchEntry = { path: string; title: string; description: string; tab: string; group: string; headings: string[]; text: string; method?: string }

export const searchIndex = cache((): SearchEntry[] =>
  ALL_ITEMS.map((item) => {
    const page = getPage(item.path)
    const tab = TABS.find((t) => t.id === item.tab)!
    return {
      path: item.path,
      title: page?.meta.title || item.title,
      description: page?.meta.description ?? '',
      tab: tab.title,
      group: item.group,
      headings: page?.toc.map((t) => t.text) ?? [],
      text: page ? (page.api ? `${page.api.endpoint.method} ${page.api.endpoint.path} ${page.api.endpoint.summary}` : plainText(page.blocks)).slice(0, 1200) : '',
      method: item.badge,
    }
  }),
)

export { tabFor }
