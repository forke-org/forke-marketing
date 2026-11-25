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
import Link from 'next/link'
import React from 'react'
import { ArrowUpRight, ChevronRight, CircleAlert, Info, Lightbulb, TriangleAlert } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { highlight } from '@/lib/docs/highlight'
import type { Block } from '@/lib/docs/markdown'
import { LANGUAGE_GUIDES } from '@/lib/docs/languages'
import { PROMPTS, TOOLS } from '@/lib/docs/agent-markdown'
import { CodeGroup, type CodeTab } from './CodeGroup'
import { DocIcon } from './Icon'
import { LangLogo } from './LangLogo'
import { Demo } from './demos'
import { PromptGrid } from './PromptGrid'

/** Inline markdown: `code`, **bold**, *italic*, [links](/docs-demo/…) and <kbd>keys</kbd>. */
export function Inline({ text }: { text: string }) {
  const out: React.ReactNode[] = []
  const re = /`([^`]+)`|\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)|<kbd>(.+?)<\/kbd>|(?<![\w*])\*([^*\s][^*]*?)\*(?!\w)/g
  let last = 0
  let m: RegExpExecArray | null
  let k = 0
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index))
    if (m[1] !== undefined) out.push(<code key={k++} className="docs-inline-code">{m[1]}</code>)
    else if (m[2] !== undefined) out.push(<strong key={k++} className="font-semibold text-white"><Inline text={m[2]} /></strong>)
    else if (m[3] !== undefined) out.push(<DocLink key={k++} href={m[4]}><Inline text={m[3]} /></DocLink>)
    else if (m[5] !== undefined) out.push(<kbd key={k++} className="docs-kbd">{m[5]}</kbd>)
    else out.push(<em key={k++} className="text-white/80">{m[6]}</em>)
    last = m.index + m[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  return <>{out}</>
}

export function DocLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  const external = /^https?:\/\//.test(href) && !href.startsWith('https://www.forke.space/docs-demo')
  const cls = cn('docs-link', className)
  if (external)
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
        <ArrowUpRight className="ml-0.5 inline h-3 w-3 -translate-y-px opacity-60" />
      </a>
    )
  if (href.startsWith('mailto:')) return <a href={href} className={cls}>{children}</a>
  return <Link href={href} className={cls}>{children}</Link>
}

const CALLOUTS = {
  note: { icon: Info, label: 'Note', cls: 'border-sky-400/20 bg-sky-400/[0.04]', ic: 'text-sky-300' },
  tip: { icon: Lightbulb, label: 'Tip', cls: 'border-emerald-400/20 bg-emerald-400/[0.04]', ic: 'text-emerald-300' },
  warning: { icon: TriangleAlert, label: 'Warning', cls: 'border-amber-400/25 bg-amber-400/[0.05]', ic: 'text-amber-300' },
  important: { icon: CircleAlert, label: 'Important', cls: 'border-accent/30 bg-accent/[0.06]', ic: 'text-accent' },
}

const publicFile = (src: string) => src.startsWith('/') && fs.existsSync(path.join(process.cwd(), 'public', src))

export async function codeTabs(tabs: { title: string; lang: string; code: string }[]): Promise<CodeTab[]> {
  return Promise.all(tabs.map(async (t) => ({ ...t, html: await highlight(t.code, t.lang) })))
}

export async function Blocks({ blocks }: { blocks: Block[] }) {
  const rendered = await Promise.all(blocks.map((b, i) => BlockView({ block: b, index: i })))
  return <>{rendered}</>
}

async function BlockView({ block: b, index }: { block: Block; index: number }): Promise<React.ReactNode> {
  switch (b.type) {
    case 'heading': {
      const Tag = (`h${b.depth}` as 'h2' | 'h3' | 'h4')
      return (
        <Tag key={index} id={b.id} className={cn('docs-heading group/h scroll-mt-32', `docs-h${b.depth}`)}>
          <a href={`#${b.id}`} className="absolute -left-5 top-0 hidden pr-1 text-white/25 opacity-0 transition-opacity group-hover/h:opacity-100 lg:block" aria-label="Link to this section">#</a>
          <Inline text={b.text} />
        </Tag>
      )
    }
    case 'paragraph':
      return <p key={index}><Inline text={b.text} /></p>
    case 'hr':
      return <hr key={index} className="my-10 border-white/[0.06]" />
    case 'list': {
      const L = b.ordered ? 'ol' : 'ul'
      const items = await Promise.all(
        b.items.map(async (it, n) => (
          <li key={n}>
            <Inline text={it.text} />
            {it.children ? <Blocks blocks={it.children} /> : null}
          </li>
        )),
      )
      return <L key={index} className={b.ordered ? 'docs-ol' : 'docs-ul'}>{items}</L>
    }
    case 'code':
      return <div key={index} className="my-6"><CodeGroup tabs={await codeTabs(b.tabs)} filename={b.filename} /></div>
    case 'table':
      return (
        <div key={index} className="docs-table docs-scroll-x not-prose my-6 overflow-x-auto rounded-xl border border-white/[0.07]">
          <table className="w-full border-collapse text-left text-[13.5px]">
            <thead>
              <tr className="border-b border-white/[0.07] bg-white/[0.02]">
                {b.head.map((h, i) => <th key={i} className="px-4 py-2.5 font-medium whitespace-nowrap text-white/60"><Inline text={h} /></th>)}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((r, ri) => (
                <tr key={ri} className="border-b border-white/[0.05] last:border-0">
                  {r.map((c, ci) => <td key={ci} className={cn('px-4 py-3 align-top leading-relaxed text-white/70', ci === 0 && 'text-white/85')}><Inline text={c} /></td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case 'callout': {
      const c = CALLOUTS[b.kind]
      return (
        <div key={index} className={cn('not-prose my-6 flex gap-3 rounded-xl border px-4 py-3.5 text-[14.5px] leading-relaxed text-white/75', c.cls)}>
          <c.icon className={cn('mt-[3px] h-4 w-4 shrink-0', c.ic)} />
          <div className="docs-callout min-w-0 flex-1"><Blocks blocks={b.blocks} /></div>
        </div>
      )
    }
    case 'quote':
      return <blockquote key={index} className="my-6 border-l-2 border-white/15 pl-4 text-white/60"><Blocks blocks={b.blocks} /></blockquote>
    case 'steps':
      return (
        <ol key={index} className="docs-steps not-prose relative my-8 ml-1">
          {await Promise.all(
            b.steps.map(async (s, n) => (
              <li key={n} className="relative pb-8 pl-11 last:pb-2">
                <span aria-hidden className="absolute top-8 bottom-0 left-[13px] w-px bg-gradient-to-b from-white/[0.12] to-white/[0.03]" />
                <span className="absolute top-0 left-0 flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.12] bg-[#1c1b1a] font-mono text-[12px] font-medium text-white/80">{n + 1}</span>
                <h3 id={s.id} className="scroll-mt-32 pt-0.5 text-[17px] font-medium tracking-[-0.01em] text-white"><Inline text={s.title} /></h3>
                <div className="docs-step-body mt-2"><Blocks blocks={s.blocks} /></div>
              </li>
            )),
          )}
        </ol>
      )
    case 'cards':
      return (
        <div key={index} className={cn('not-prose my-6 grid gap-3', b.cols >= 3 ? 'sm:grid-cols-2 xl:grid-cols-3' : 'sm:grid-cols-2')}>
          {b.cards.map((c, n) => (
            <Link key={n} href={c.href} className="group/card relative flex flex-col overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.015] transition-all duration-200 hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-white/[0.03]">
              {c.image ? <CardImage src={c.image} alt={c.title} /> : null}
              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-[14.5px] font-medium text-white">{c.title}</span>
                  <ChevronRight className="ml-auto h-4 w-4 text-white/25 transition-all group-hover/card:translate-x-0.5 group-hover/card:text-white/60" />
                </div>
                {c.text ? <p className="mt-2 text-[13.5px] leading-relaxed text-white/50"><Inline text={c.text} /></p> : null}
              </div>
            </Link>
          ))}
        </div>
      )
    case 'details':
      return (
        <details key={index} className="docs-details group/d not-prose my-3 rounded-xl border border-white/[0.07] bg-white/[0.015] open:bg-white/[0.025]">
          <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-[14.5px] font-medium text-white/85 select-none">
            <ChevronRight className="h-4 w-4 text-white/35 transition-transform group-open/d:rotate-90" />
            <Inline text={b.title} />
          </summary>
          <div className="docs-prose border-t border-white/[0.05] px-4 pt-1 pb-4 pl-10 text-[14.5px]"><Blocks blocks={b.blocks} /></div>
        </details>
      )
    case 'demo':
      return (
        <figure key={index} className="not-prose my-8">
          <Demo name={b.name} />
          {b.caption ? <figcaption className="mt-3 text-center text-[12.5px] text-white/40">{b.caption}</figcaption> : null}
        </figure>
      )
    case 'image':
      return (
        <figure key={index} className="not-prose my-8">
          <Frame src={b.src} alt={b.alt} prompt={b.prompt} ratio={b.ratio} />
          {b.caption ? <figcaption className="mt-3 text-center text-[12.5px] text-white/40">{b.caption}</figcaption> : null}
        </figure>
      )
    case 'generated':
      if (b.name === 'languages') {
        const languages = LANGUAGE_GUIDES.filter((g) => g.kind === 'language' && g.id !== 'curl')
        const frameworksAndHttp = LANGUAGE_GUIDES.filter((g) => g.kind === 'framework' || g.id === 'curl')
        const renderCard = (g: (typeof LANGUAGE_GUIDES)[number]) => (
          <Link
            key={g.id}
            href={`/docs-demo/mail/send-with-${g.id}`}
            className="group/l flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.015] px-3.5 py-3 transition-all hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-white/[0.035]"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-[#121111]">
              <LangLogo name={g.id} className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[13.5px] font-medium text-white">{g.name}</span>
              <span className="block text-[11.5px] text-white/35">
                {g.id === 'curl' ? 'HTTP' : g.kind === 'framework' ? 'Framework' : 'Language'}
              </span>
            </span>
          </Link>
        )
        return (
          <div key={index} className="not-prose my-6 space-y-6">
            <div>
              <p className="mb-2.5 text-[12px] font-medium tracking-[0.04em] text-white/40 uppercase">Languages</p>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">{languages.map(renderCard)}</div>
            </div>
            <div>
              <p className="mb-2.5 text-[12px] font-medium tracking-[0.04em] text-white/40 uppercase">Frameworks &amp; HTTP</p>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">{frameworksAndHttp.map(renderCard)}</div>
            </div>
          </div>
        )
      }
      if (b.name === 'prompts') return <div key={index} className="not-prose my-6"><PromptGrid prompts={PROMPTS} /></div>
      return (
        <div key={index} className="docs-table docs-scroll-x not-prose my-6 overflow-x-auto rounded-xl border border-white/[0.07]">
          <table className="w-full text-left text-[13.5px]">
            <thead>
              <tr className="border-b border-white/[0.07] bg-white/[0.02] text-white/55">
                <th className="px-4 py-2.5 font-medium whitespace-nowrap">Tool</th>
                <th className="px-4 py-2.5 font-medium">What it does</th>
                <th className="px-4 py-2.5 font-medium whitespace-nowrap">Safety</th>
              </tr>
            </thead>
            <tbody>
              {TOOLS.map((t) => (
                <tr key={t.name} id={`tool-${t.name}`} className="scroll-mt-32 border-b border-white/[0.05] last:border-0">
                  <td className="px-4 py-3 align-top whitespace-nowrap"><code className="docs-inline-code">{t.name}</code></td>
                  <td className="px-4 py-3 align-top leading-relaxed text-white/65"><Inline text={t.description} /></td>
                  <td className="w-[210px] px-4 py-3 align-top"><LevelBadge level={t.level} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
  }
}

export function LevelBadge({ level }: { level: string }) {
  const tone = level.includes("can't be undone") ? 'border-red-400/25 bg-red-400/[0.07] text-red-300' : level.startsWith('Asks') ? 'border-amber-400/25 bg-amber-400/[0.07] text-amber-200' : level.startsWith('Never') ? 'border-white/15 bg-white/[0.04] text-white/50' : 'border-emerald-400/25 bg-emerald-400/[0.07] text-emerald-300'
  return <span className={cn('inline-block rounded-lg border px-2.5 py-0.5 text-[11.5px] leading-snug font-medium', tone)}>{level}</span>
}

function CardImage({ src, alt }: { src: string; alt: string }) {
  if (publicFile(src)) return <img src={src} alt={alt} className="aspect-[16/8] w-full border-b border-white/[0.06] object-cover" loading="lazy" />
  return <Placeholder label={alt} className="aspect-[16/8] border-b border-white/[0.06]" />
}

export function Frame({ src, alt, prompt, ratio }: { src: string; alt: string; prompt?: string; ratio?: string }) {
  const style = { aspectRatio: ratio ?? '16 / 9' }
  if (publicFile(src))
    return (
      <div className="docs-frame overflow-hidden rounded-2xl border border-white/[0.08] bg-[#121111] p-1.5 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)]">
        <img src={src} alt={alt} className="w-full rounded-xl" loading="lazy" style={style} />
      </div>
    )
  return (
    <div className="docs-frame overflow-hidden rounded-2xl border border-white/[0.08] bg-[#121111] p-1.5">
      <Placeholder label={alt} prompt={prompt} className="rounded-xl" style={style} />
    </div>
  )
}

function Placeholder({ label, prompt, className, style }: { label: string; prompt?: string; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={cn('docs-placeholder relative flex w-full items-center justify-center overflow-hidden', className)} style={style}>
      <div className="relative z-10 flex flex-col items-center gap-1.5 px-6 text-center">
        <span className="font-mono text-[10.5px] tracking-[0.14em] text-white/30 uppercase">{prompt ? `Image ${prompt}` : 'Illustration'}</span>
        <span className="max-w-sm text-[13px] text-white/45">{label}</span>
      </div>
    </div>
  )
}
