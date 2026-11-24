/**
 * @fileoverview Forke Platform
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

import Link from 'next/link'
import { ArrowLeft, ArrowRight, ChevronRight, KeyRound, Terminal, Wrench } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { DocPage } from '@/lib/docs/load'
import { neighbours, tabFor } from '@/lib/docs/nav'
import { parse } from '@/lib/docs/markdown'
import type { Field } from '@/lib/docs/api-spec'
import { allSnippets, BASE_URL, jsonText } from '@/lib/docs/snippets'
import { Blocks, Inline, codeTabs } from './Blocks'
import { CodeGroup } from './CodeGroup'
import { MethodBadge } from './DocsShell'
import { PageActions } from './PageActions'
import { Toc } from './Toc'

function Header({ page }: { page: DocPage }) {
  const tab = tabFor(page.path)
  const { group } = neighbours(page.path)
  return (
    <header className="mb-8">
      <div className="mb-3 flex items-center gap-1.5 text-[12.5px] text-white/40">
        <span className="text-accent/90">{tab.title}</span>
        {group ? (
          <>
            <ChevronRight className="h-3 w-3" />
            <span>{group}</span>
          </>
        ) : null}
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <h1 className="text-[30px] leading-[1.15] font-semibold tracking-[-0.03em] text-white sm:text-[34px]">{page.meta.title}</h1>
        <PageActions path={page.path} />
      </div>
      {page.meta.description ? <p className="mt-3 max-w-[680px] text-[16.5px] leading-relaxed text-white/55">{page.meta.description}</p> : null}
    </header>
  )
}

function PrevNext({ path, updated }: { path: string; updated?: string }) {
  const { prev, next } = neighbours(path)
  return (
    <footer className="mt-16 border-t border-white/[0.06] pt-8">
      <div className="grid gap-3 sm:grid-cols-2">
        {prev ? (
          <Link href={`/docs-demo/${prev.path}`} className="group rounded-xl border border-white/[0.07] px-4 py-3.5 transition-colors hover:border-white/[0.14] hover:bg-white/[0.02]">
            <span className="flex items-center gap-1.5 text-[12px] text-white/40"><ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />Previous</span>
            <span className="mt-1 block text-[14px] font-medium text-white/90">{prev.title}</span>
          </Link>
        ) : <span />}
        {next ? (
          <Link href={`/docs-demo/${next.path}`} className="group rounded-xl border border-white/[0.07] px-4 py-3.5 text-right transition-colors hover:border-white/[0.14] hover:bg-white/[0.02]">
            <span className="flex items-center justify-end gap-1.5 text-[12px] text-white/40">Next<ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></span>
            <span className="mt-1 block text-[14px] font-medium text-white/90">{next.title}</span>
          </Link>
        ) : null}
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 text-[12px] text-white/30">
        <span>{updated ? `Last updated ${new Date(updated).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}` : 'Generated from the Forke Mail API'}</span>
        <span>
          Questions? <a href="mailto:support@forke.space" className="text-white/55 hover:text-white">support@forke.space</a>
        </span>
      </div>
    </footer>
  )
}

export async function ArticleView({ page }: { page: DocPage }) {
  return (
    <div className="flex">
      <article className="min-w-0 flex-1 px-5 pt-10 pb-24 sm:px-10 xl:px-14">
        <div className="mx-auto max-w-[760px]">
          <Header page={page} />
          {page.toc.length > 2 ? (
            <details className="group/t mb-8 rounded-xl border border-white/[0.07] bg-white/[0.015] xl:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-[13.5px] font-medium text-white/75 select-none">
                On this page
                <ChevronRight className="h-4 w-4 text-white/35 transition-transform group-open/t:rotate-90" />
              </summary>
              <ul className="border-t border-white/[0.06] px-4 py-2.5">
                {page.toc.map((t) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`} className={cn('block py-1.5 text-[13.5px] text-white/50 hover:text-white', t.depth === 3 && 'pl-4')}>{t.text}</a>
                  </li>
                ))}
              </ul>
            </details>
          ) : null}
          <div className="docs-prose">
            <Blocks blocks={page.blocks} />
          </div>
          <PrevNext path={page.path} updated={page.updated} />
        </div>
      </article>
      <aside className="docs-scroll sticky top-[100px] hidden h-[calc(100vh-100px)] w-[240px] shrink-0 overflow-y-auto py-10 pr-6 xl:block">
        <Toc items={page.toc} />
        <div className="mt-8 rounded-xl border border-white/[0.06] bg-white/[0.015] p-3.5 text-[12px] leading-relaxed text-white/45">
          <span className="font-medium text-white/70">Using an AI agent?</span> Every page is also plain markdown: add <code className="docs-inline-code">.md</code> to the address, or connect the <Link href="/docs-demo/agents/docs-for-agents" className="docs-link">docs MCP server</Link>.
        </div>
      </aside>
    </div>
  )
}

function FieldList({ title, fields, kind }: { title: string; fields: Field[]; kind?: string }) {
  return (
    <section className="mt-10">
      <h2 className="flex items-baseline gap-2 border-b border-white/[0.07] pb-3 text-[17px] font-medium text-white" id={title.toLowerCase().replace(/[^a-z]+/g, '-')}>
        {title}
        {kind ? <span className="font-mono text-[11.5px] font-normal text-white/35">{kind}</span> : null}
      </h2>
      <ul>
        {fields.map((f) => <FieldRow key={f.name} f={f} />)}
      </ul>
    </section>
  )
}

function FieldRow({ f, nested }: { f: Field; nested?: boolean }) {
  return (
    <li className={cn('border-b border-white/[0.05] py-4 last:border-0', nested && 'py-3')}>
      <div className="flex flex-wrap items-center gap-2">
        <code className="font-mono text-[13px] font-medium text-white">{f.name}</code>
        <span className="font-mono text-[11.5px] text-white/40">{f.type}</span>
        {f.required ? <span className="rounded bg-accent/10 px-1.5 py-px text-[10.5px] font-medium text-[#ffa347]">required</span> : null}
      </div>
      <p className="mt-1.5 text-[14px] leading-relaxed text-white/60"><Inline text={f.description} /></p>
      {f.children ? (
        <details className="group/c mt-3 rounded-lg border border-white/[0.07]">
          <summary className="flex cursor-pointer list-none items-center gap-1.5 px-3 py-2 text-[12.5px] text-white/55 select-none hover:text-white/80">
            <ChevronRight className="h-3.5 w-3.5 transition-transform group-open/c:rotate-90" /> Show {f.children.length} child fields
          </summary>
          <ul className="border-t border-white/[0.06] px-4">
            {f.children.map((c) => <FieldRow key={c.name} f={c} nested />)}
          </ul>
        </details>
      ) : null}
    </li>
  )
}

export async function ApiView({ page }: { page: DocPage }) {
  const { endpoint: e } = page.api!
  const request = await codeTabs(allSnippets(e.example).map((s) => ({ title: s.name, lang: s.shiki, code: s.code })))
  const response = e.response.body === null ? null : await codeTabs([{ title: `${e.response.status}`, lang: 'json', code: jsonText(e.response.body) }])
  const details = e.details ? parse(e.details) : []
  return (
    <div className="px-5 pt-10 pb-24 sm:px-10 xl:px-14">
      <div className="mx-auto grid max-w-[1180px] gap-10 xl:grid-cols-[minmax(0,1fr)_480px]">
        <div className="min-w-0">
          <Header page={page} />
          <div className="flex items-center gap-2 overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2.5 font-mono text-[13px]">
            <MethodBadge method={e.method} className="w-auto px-1.5 py-0.5 text-[11px]" />
            <span className="truncate text-white/40">{BASE_URL}</span>
            <span className="-ml-2 truncate text-white">{e.path}</span>
          </div>
          {details.length ? <div className="docs-prose mt-6"><Blocks blocks={details} /></div> : null}
          <div className="mt-6 flex flex-wrap gap-2 text-[12px]">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] px-2.5 py-1 text-white/55">
              <KeyRound className="h-3 w-3" />{e.access === 'any' ? 'Any API key' : 'Full-access API key'}
            </span>
            {e.tool ? (
              <Link href={`/docs-demo/agents/tools#tool-${e.tool}`} className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] px-2.5 py-1 text-white/55 hover:border-white/[0.16] hover:text-white">
                <Wrench className="h-3 w-3" />Agent tool <code className="font-mono text-white/80">{e.tool}</code>
              </Link>
            ) : null}
            {e.cli ? (
              <Link href="/docs-demo/agents/cli-commands" className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] px-2.5 py-1 text-white/55 hover:border-white/[0.16] hover:text-white">
                <Terminal className="h-3 w-3" />CLI
              </Link>
            ) : null}
          </div>
          {e.pathParams?.length ? <FieldList title="Path parameters" fields={e.pathParams} /> : null}
          {e.query?.length ? <FieldList title="Query parameters" fields={e.query} /> : null}
          {e.headers?.length ? <FieldList title="Headers" fields={e.headers} /> : null}
          {e.body?.length ? <FieldList title="Body" fields={e.body} kind={e.bodyKind === 'multipart' ? 'multipart/form-data' : 'application/json'} /> : null}
          {e.response.note ? (
            <section className="mt-10">
              <h2 className="border-b border-white/[0.07] pb-3 text-[17px] font-medium text-white">Response</h2>
              <p className="mt-4 text-[14px] leading-relaxed text-white/60"><Inline text={`\`${e.response.status}\` ${e.response.note}`} /></p>
            </section>
          ) : null}
          {e.errors?.length ? (
            <section className="mt-10">
              <h2 id="errors" className="border-b border-white/[0.07] pb-3 text-[17px] font-medium text-white">Errors</h2>
              <ul>
                {e.errors.map((x) => (
                  <li key={x.code} className="flex gap-4 border-b border-white/[0.05] py-3.5 last:border-0">
                    <span className={cn('h-fit shrink-0 rounded px-1.5 py-0.5 font-mono text-[11.5px]', x.status >= 500 ? 'bg-red-400/10 text-red-300' : 'bg-amber-400/10 text-amber-200')}>{x.status}</span>
                    <span className="min-w-0">
                      <code className="font-mono text-[13px] text-white">{x.code}</code>
                      <span className="mt-1 block text-[13.5px] text-white/55"><Inline text={x.meaning} /></span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[12.5px] text-white/40">Any endpoint can also answer <code className="docs-inline-code">401 unauthorized</code>, <code className="docs-inline-code">403 insufficient_scope</code> or <code className="docs-inline-code">429 rate_limited</code>. See <Link href="/docs-demo/mail/api/errors" className="docs-link">Errors</Link>.</p>
            </section>
          ) : null}
          <PrevNext path={page.path} />
        </div>
        <aside className="min-w-0 xl:sticky xl:top-[124px] xl:h-fit">
          <p className="mb-2 text-[12px] font-medium text-white/45">Request</p>
          <CodeGroup tabs={request} panel />
          {response ? (
            <>
              <p className="mt-5 mb-2 flex items-center gap-2 text-[12px] font-medium text-white/45">
                Response <span className={cn('rounded px-1.5 py-px font-mono text-[10.5px]', 'bg-emerald-400/10 text-emerald-300')}>{e.response.status}</span>
              </p>
              <CodeGroup tabs={response.map((r) => ({ ...r, title: 'JSON' }))} panel />
            </>
          ) : (
            <p className="mt-5 rounded-lg border border-white/[0.07] px-3 py-2.5 text-[12.5px] text-white/50">
              Answers <code className="docs-inline-code">{e.response.status} No Content</code> on success.
            </p>
          )}
        </aside>
      </div>
    </div>
  )
}
