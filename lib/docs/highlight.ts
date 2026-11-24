/**
 * @fileoverview Forke Platform
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

import { createHighlighter, type Highlighter } from 'shiki'

/** Build-time syntax highlighting. Vesper's warm orange sits naturally next to Forke's accent. */

const LANGS = ['ts', 'tsx', 'js', 'jsx', 'bash', 'python', 'php', 'ruby', 'go', 'rust', 'java', 'csharp', 'json', 'yaml', 'toml', 'html', 'sql', 'http', 'diff', 'dotenv'] as const
const ALIAS: Record<string, string> = { sh: 'bash', shell: 'bash', zsh: 'bash', py: 'python', rb: 'ruby', cs: 'csharp', 'c#': 'csharp', env: 'dotenv', typescript: 'ts', javascript: 'js', node: 'ts' }

let highlighter: Promise<Highlighter> | null = null
const get = () => (highlighter ??= createHighlighter({ themes: ['vesper'], langs: [...LANGS] }))

export async function highlight(code: string, lang: string): Promise<string> {
  const h = await get()
  const l = ALIAS[lang] ?? lang
  const known = (LANGS as readonly string[]).includes(l)
  return h.codeToHtml(code, { lang: known ? l : 'text', theme: 'vesper' })
}
