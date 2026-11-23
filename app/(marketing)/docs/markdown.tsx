/**
 * @fileoverview Forke Platform
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

import React from 'react'
import type { TocItem } from './content'
import { CodeBlock, DocLink, H3, OL, P, Prose, Table, Tag, UL } from './primitives'

const slug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

function inline(text: string, key: string): React.ReactNode[] {
  const out: React.ReactNode[] = []
  const pattern = /`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|(https:\/\/[^\s<)]+[^\s<).,])|([\w.+-]+@forke\.space)/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = pattern.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index))
    const k = `${key}-${i++}`
    if (m[1] !== undefined) out.push(<Tag key={k}>{m[1]}</Tag>)
    else if (m[2] !== undefined) out.push(<DocLink key={k} href={m[3]}>{m[2]}</DocLink>)
    else if (m[4] !== undefined) out.push(<strong key={k} className="font-medium text-white/85">{m[4]}</strong>)
    else if (m[5] !== undefined) out.push(<DocLink key={k} href={m[5]}>{m[5].replace(/^https:\/\//, '')}</DocLink>)
    else out.push(<DocLink key={k} href={`mailto:${m[6]}`}>{m[6]}</DocLink>)
    last = m.index + m[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

const cells = (line: string) => line.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim())

export function markdownArticle(source: string): { body: React.ReactNode; toc: TocItem[] } {
  const toc: TocItem[] = []
  const blocks: React.ReactNode[] = []
  const lines = source.split('\n')
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    const key = `b${i}`
    if (line.startsWith('```')) {
      const language = line.slice(3).trim() || 'text'
      const code: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) code.push(lines[i++])
      i++
      blocks.push(<CodeBlock key={key} code={code.join('\n')} language={language} />)
      continue
    }
    if (line.startsWith('## ') || line.startsWith('### ')) {
      const sub = line.startsWith('### ')
      const text = line.replace(/^#+\s+/, '')
      const id = slug(text)
      toc.push({ id, label: text, depth: sub ? 2 : 1 })
      blocks.push(sub
        ? <h3 key={key} id={id} className="scroll-mt-28 pt-2 text-[1.15rem] font-medium tracking-[-0.01em] text-white">{text}</h3>
        : <H3 key={key} id={id}>{text}</H3>)
      i++
      continue
    }
    if (line.startsWith('|')) {
      const rows: string[][] = []
      while (i < lines.length && lines[i].startsWith('|')) {
        const row = cells(lines[i++])
        if (!/^-+$/.test(row[0])) rows.push(row)
      }
      const [head, ...body] = rows
      blocks.push(<Table key={key} head={head.map((h) => h.replace(/`/g, ''))} rows={body.map((r, ri) => r.map((c, ci) => <span key={ci}>{inline(c, `${key}-${ri}-${ci}`)}</span>))} />)
      continue
    }
    if (line.startsWith('- ') || /^\d+\. /.test(line)) {
      const ordered = /^\d+\. /.test(line)
      const items: string[] = []
      while (i < lines.length && (ordered ? /^\d+\. /.test(lines[i]) : lines[i].startsWith('- '))) items.push(lines[i++].replace(/^(- |\d+\. )/, ''))
      const lis = items.map((it, n) => <li key={n}>{inline(it, `${key}-${n}`)}</li>)
      blocks.push(ordered ? <OL key={key}>{lis}</OL> : <UL key={key}>{lis}</UL>)
      continue
    }
    if (line.trim() === '') {
      i++
      continue
    }
    blocks.push(<P key={key}>{inline(line, key)}</P>)
    i++
  }
  return { body: <Prose>{blocks}</Prose>, toc }
}
