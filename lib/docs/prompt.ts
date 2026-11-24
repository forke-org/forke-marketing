/**
 * @fileoverview Forke Platform
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

/**
 * Prompts for AI apps, shown as a readable card: the opening line as a heading, numbered steps as a list, and
 * the things an agent acts on (tool names, environment variables, files, URLs, quoted values) as chips.
 * The text copied to the clipboard stays exactly the prompt.
 */

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const TOKEN = new RegExp(
  [
    /(https?:\/\/[^\s)]+[^\s).,])/.source, // urls
    /(\{\{\{?[a-z_]+\}?\}\})/.source, // template variables
    /("[^"\n]{1,40}")/.source, // quoted values
    /(\b(?:GET|POST|PUT|PATCH|DELETE)\b)/.source, // http methods
    /(\b[A-Z][A-Z0-9]*_[A-Z0-9_]+\b)/.source, // ENV_VARS
    /(\b[a-z]+(?:_[a-z]+)+\b)/.source, // tool_names
    /((?:^|(?<=\s))\.[a-z]+\b|\b[A-Z]+\.md\b|\b[A-Z][a-z]+(?:-[A-Z][a-z]+)+\b)/.source, // .env, AGENTS.md, Idempotency-Key
  ].join('|'),
  'g',
)

function inline(text: string): string {
  let out = ''
  let last = 0
  for (const m of text.matchAll(TOKEN)) {
    out += esc(text.slice(last, m.index))
    const [tok] = m
    const cls = m[1] ? 'url' : m[2] ? 'var' : m[3] ? 'str' : m[4] ? 'method' : m[5] ? 'env' : m[6] ? 'tool' : 'file'
    out += `<span class="pt-${cls}">${esc(tok)}</span>`
    last = (m.index ?? 0) + tok.length
  }
  return out + esc(text.slice(last))
}

export function promptHtml(text: string): string {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)
  const parts: string[] = []
  let list: string[] = []
  const flush = () => {
    if (list.length) parts.push(`<ol class="pt-steps">${list.map((l) => `<li>${inline(l)}</li>`).join('')}</ol>`)
    list = []
  }
  lines.forEach((line, i) => {
    const step = line.match(/^\d+[.)]\s+(.*)$/)
    if (step) list.push(step[1])
    else {
      flush()
      parts.push(i === 0 ? `<p class="pt-lead">${inline(line)}</p>` : `<p>${inline(line)}</p>`)
    }
  })
  flush()
  return `<div class="docs-prompt">${parts.join('')}</div>`
}
