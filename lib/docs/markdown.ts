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
 * The docs markdown dialect. Plain CommonMark-style markdown plus a few readable directives:
 *
 *   > [!NOTE] / [!TIP] / [!WARNING] / [!IMPORTANT]    callouts (GitHub syntax)
 *   ```ts title-or-filename                         fenced code; consecutive titled fences become tabs
 *   :::steps … :::                                   numbered steps, one per ### heading inside
 *   :::cards … :::                                   "- [Title](/href) — text {icon=Name}" lines become a card grid
 *   :::details Question … :::                       an expandable section
 *   ::demo{name="…" caption="…"}                     a live product demo
 *   ::image{src="…" alt="…" caption="…" prompt="…"}  a framed screenshot or illustration
 *   ::languages  ::prompts  ::tools                  generated blocks
 *
 * One parser feeds both the React renderer and the clean markdown served to agents.
 */

export type Inline = string

export type Block =
  | { type: 'heading'; depth: 2 | 3 | 4; text: string; id: string }
  | { type: 'paragraph'; text: Inline }
  | { type: 'list'; ordered: boolean; items: { text: Inline; children?: Block[] }[] }
  | { type: 'code'; tabs: { title: string; lang: string; code: string }[]; filename?: string }
  | { type: 'table'; head: string[]; rows: string[][] }
  | { type: 'callout'; kind: 'note' | 'tip' | 'warning' | 'important'; blocks: Block[] }
  | { type: 'quote'; blocks: Block[] }
  | { type: 'steps'; steps: { title: string; id: string; blocks: Block[] }[] }
  | { type: 'cards'; cols: number; cards: { title: string; href: string; text: string; icon?: string; image?: string }[] }
  | { type: 'details'; title: string; blocks: Block[] }
  | { type: 'demo'; name: string; caption?: string }
  | { type: 'image'; src: string; alt: string; caption?: string; prompt?: string; ratio?: string }
  | { type: 'generated'; name: 'languages' | 'prompts' | 'tools' }
  | { type: 'hr' }

export type Frontmatter = { title: string; description: string; [k: string]: string }

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/`/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

export function frontmatter(source: string): { meta: Frontmatter; body: string } {
  const m = source.match(/^---\n([\s\S]*?)\n---\n?/)
  const meta: Frontmatter = { title: '', description: '' }
  if (!m) return { meta, body: source }
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':')
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, '')
  }
  return { meta, body: source.slice(m[0].length) }
}

function attrs(text: string): Record<string, string> {
  const out: Record<string, string> = {}
  for (const m of text.matchAll(/(\w+)="([^"]*)"/g)) out[m[1]] = m[2]
  return out
}

const LANG_NAMES: Record<string, string> = {
  ts: 'TypeScript', tsx: 'TypeScript', js: 'JavaScript', jsx: 'JavaScript', bash: 'Terminal', sh: 'Terminal', shell: 'Terminal', python: 'Python', py: 'Python', go: 'Go', rust: 'Rust', ruby: 'Ruby', php: 'PHP', java: 'Java', csharp: 'C#', json: 'JSON', text: 'Text', html: 'HTML', yaml: 'YAML', toml: 'TOML', sql: 'SQL', http: 'HTTP',
}
export const langName = (lang: string) => LANG_NAMES[lang] ?? lang.toUpperCase()

export function parse(source: string): Block[] {
  const lines = source.replace(/\r\n/g, '\n').split('\n')
  return parseLines(lines)
}

function parseLines(lines: string[]): Block[] {
  const blocks: Block[] = []
  let i = 0
  const isBlockStart = (l: string) =>
    l.startsWith('```') || /^#{2,4} /.test(l) || l.startsWith('>') || l.startsWith(':::') || l.startsWith('::') || l.startsWith('|') || /^\s*([-*]|\d+\.) /.test(l) || /^---+$/.test(l.trim())

  while (i < lines.length) {
    const line = lines[i]

    if (!line.trim()) {
      i++
      continue
    }

    if (line.startsWith('```')) {
      const tabs: { title: string; lang: string; code: string }[] = []
      let filename: string | undefined
      let titled = false
      while (i < lines.length && lines[i].startsWith('```')) {
        const meta = lines[i].slice(3).trim()
        const [lang = 'text', ...rest] = meta.split(/\s+/)
        const title = rest.join(' ').replace(/^title="|"$/g, '')
        const code: string[] = []
        i++
        while (i < lines.length && !lines[i].startsWith('```')) code.push(lines[i++])
        i++
        tabs.push({ title: title || langName(lang), lang: lang || 'text', code: code.join('\n') })
        if (title) titled = true
        if (tabs.length === 1 && title && /[./]/.test(title) && !/\s/.test(title)) filename = title
        let j = i
        while (j < lines.length && !lines[j].trim()) j++
        if (!(titled && j < lines.length && /^```\w+ \S/.test(lines[j]) && j - i <= 1)) break
        i = j
      }
      blocks.push(tabs.length > 1 ? { type: 'code', tabs } : { type: 'code', tabs, filename })
      continue
    }

    const h = line.match(/^(#{2,4}) (.+)$/)
    if (h) {
      const text = h[2].trim()
      blocks.push({ type: 'heading', depth: h[1].length as 2 | 3 | 4, text, id: slugify(text) })
      i++
      continue
    }

    if (/^---+$/.test(line.trim())) {
      blocks.push({ type: 'hr' })
      i++
      continue
    }

    if (line.startsWith('>')) {
      const inner: string[] = []
      while (i < lines.length && lines[i].startsWith('>')) inner.push(lines[i++].replace(/^> ?/, ''))
      const kind = inner[0]?.match(/^\[!(NOTE|TIP|WARNING|IMPORTANT)\]\s*$/i)
      if (kind) blocks.push({ type: 'callout', kind: kind[1].toLowerCase() as 'note', blocks: parseLines(inner.slice(1)) })
      else blocks.push({ type: 'quote', blocks: parseLines(inner) })
      continue
    }

    if (line.startsWith(':::')) {
      const head = line.slice(3).trim()
      const [name, ...rest] = head.split(/\s+/)
      const inner: string[] = []
      let depth = 1
      i++
      while (i < lines.length) {
        const l = lines[i]
        if (/^:::\w/.test(l)) depth++
        else if (l.trim() === ':::') {
          depth--
          if (depth === 0) break
        }
        inner.push(l)
        i++
      }
      i++
      if (name === 'steps') {
        const steps: { title: string; id: string; blocks: Block[] }[] = []
        let cur: { title: string; lines: string[] } | null = null
        for (const l of inner) {
          const m = l.match(/^### (.+)$/)
          if (m) {
            if (cur) steps.push({ title: cur.title, id: slugify(cur.title), blocks: parseLines(cur.lines) })
            cur = { title: m[1].trim(), lines: [] }
          } else cur?.lines.push(l)
        }
        if (cur) steps.push({ title: cur.title, id: slugify(cur.title), blocks: parseLines(cur.lines) })
        blocks.push({ type: 'steps', steps })
      } else if (name === 'cards') {
        const cols = Number(attrs(rest.join(' ')).cols ?? (rest[0]?.match(/^cols=(\d)/)?.[1] ?? '2'))
        const cards = inner
          .filter((l) => l.startsWith('- '))
          .map((l) => {
            const m = l.match(/^- \[([^\]]+)\]\(([^)]+)\)\s*(?:—|-)?\s*(.*?)\s*(\{[^}]*\})?\s*$/)
            if (!m) return null
            const a = Object.fromEntries((m[4] ?? '').replace(/[{}]/g, '').split(/\s+/).filter(Boolean).map((kv) => kv.split('=')))
            return { title: m[1], href: m[2], text: m[3], icon: a.icon, image: a.image }
          })
          .filter(Boolean) as { title: string; href: string; text: string; icon?: string; image?: string }[]
        blocks.push({ type: 'cards', cols, cards })
      } else if (name === 'details') {
        blocks.push({ type: 'details', title: rest.join(' '), blocks: parseLines(inner) })
      } else {
        blocks.push(...parseLines(inner))
      }
      continue
    }

    const directive = line.match(/^::(\w+)(\{.*\})?\s*$/)
    if (directive) {
      const a = attrs(directive[2] ?? '')
      if (directive[1] === 'demo') blocks.push({ type: 'demo', name: a.name, caption: a.caption })
      else if (directive[1] === 'image') blocks.push({ type: 'image', src: a.src, alt: a.alt ?? '', caption: a.caption, prompt: a.prompt, ratio: a.ratio })
      else if (['languages', 'prompts', 'tools'].includes(directive[1])) blocks.push({ type: 'generated', name: directive[1] as 'languages' })
      i++
      continue
    }

    if (line.startsWith('|')) {
      const rows: string[][] = []
      while (i < lines.length && lines[i].startsWith('|')) {
        const cells = splitRow(lines[i++])
        if (!cells.every((c) => /^:?-+:?$/.test(c))) rows.push(cells)
      }
      const [head, ...body] = rows
      blocks.push({ type: 'table', head, rows: body })
      continue
    }

    const li = line.match(/^(\s*)([-*]|\d+\.) (.*)$/)
    if (li) {
      const ordered = /\d/.test(li[2])
      const items: { text: string; children?: Block[] }[] = []
      while (i < lines.length) {
        const m = lines[i].match(/^([-*]|\d+\.) (.*)$/)
        if (m && /\d/.test(m[1]) === ordered) {
          items.push({ text: m[2] })
          i++
          const sub: string[] = []
          while (i < lines.length && (/^ {2,}\S/.test(lines[i]) || (lines[i].trim() === '' && /^ {2,}\S/.test(lines[i + 1] ?? '')))) sub.push(lines[i++].replace(/^ {2,4}/, ''))
          if (sub.length) {
            const nested = parseLines(sub)
            if (nested.length === 1 && nested[0].type === 'paragraph') items[items.length - 1].text += ' ' + nested[0].text
            else items[items.length - 1].children = nested
          }
          continue
        }
        break
      }
      blocks.push({ type: 'list', ordered, items })
      continue
    }

    const para: string[] = []
    while (i < lines.length && lines[i].trim() && !(para.length && isBlockStart(lines[i]))) para.push(lines[i++].trim())
    blocks.push({ type: 'paragraph', text: para.join(' ') })
  }
  return blocks
}

function splitRow(line: string): string[] {
  const cells: string[] = []
  let cur = ''
  let code = false
  const body = line.trim().replace(/^\|/, '').replace(/\|$/, '')
  for (let k = 0; k < body.length; k++) {
    const c = body[k]
    if (c === '`') code = !code
    if (c === '\\' && body[k + 1] === '|') {
      cur += '|'
      k++
      continue
    }
    if (c === '|' && !code) {
      cells.push(cur.trim())
      cur = ''
    } else cur += c
  }
  cells.push(cur.trim())
  return cells
}

export type TocEntry = { id: string; text: string; depth: 2 | 3 }

export function toc(blocks: Block[]): TocEntry[] {
  const out: TocEntry[] = []
  for (const b of blocks) {
    if (b.type === 'heading' && b.depth <= 3) out.push({ id: b.id, text: stripInline(b.text), depth: b.depth as 2 | 3 })
    if (b.type === 'steps') for (const s of b.steps) out.push({ id: s.id, text: stripInline(s.title), depth: 3 })
  }
  return out
}

export const stripInline = (text: string) =>
  text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/<[^>]+>/g, '')

/** Plain text for the search index. */
export function plainText(blocks: Block[]): string {
  const out: string[] = []
  const walk = (bs: Block[]) => {
    for (const b of bs) {
      if (b.type === 'paragraph' || b.type === 'heading') out.push(stripInline(b.text))
      else if (b.type === 'list') b.items.forEach((it) => out.push(stripInline(it.text)))
      else if (b.type === 'callout' || b.type === 'quote' || b.type === 'details') walk(b.blocks)
      else if (b.type === 'steps') b.steps.forEach((s) => (out.push(s.title), walk(s.blocks)))
      else if (b.type === 'table') b.rows.forEach((r) => out.push(r.map(stripInline).join(' ')))
      else if (b.type === 'cards') b.cards.forEach((c) => out.push(`${c.title} ${c.text}`))
    }
  }
  walk(blocks)
  return out.join(' ')
}
