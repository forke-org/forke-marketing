/**
 * @fileoverview Forke Platform
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, BookOpen, ChevronRight, FileText, Mail, Plug, Wand } from 'lucide-react'
import { RiClaudeFill, RiOpenaiFill, RiCursorAiFill } from '@remixicon/react'
import { CodeGroup } from '@/components/docs/CodeGroup'
import { CopyText } from '@/components/docs/CopyText'
import { DocIcon } from '@/components/docs/Icon'
import { LangLogo } from '@/components/docs/LangLogo'
import { codeTabs, Frame } from '@/components/docs/Blocks'
import { LANGUAGE_GUIDES } from '@/lib/docs/languages'
import { PROMPTS } from '@/lib/docs/agent-markdown'
import { snippet } from '@/lib/docs/snippets'

export const metadata: Metadata = { title: { absolute: 'Forke Docs' }, alternates: { canonical: '/docs-demo' } }

const PATHS = [
  {
    title: 'Forke',
    text: 'Claim scoped coding tasks, ship them as pull requests and get paid by UPI. Or post tasks and review a plain-English verdict.',
    href: '/docs-demo/forke',
    icon: 'ForkeMark',
    image: '/docs-demo/img/path-forke.webp',
    prompt: 'P1',
    links: [
      ['Quickstart for developers', '/docs-demo/forke/quickstart-developers', 'Code'],
      ['Quickstart for founders', '/docs-demo/forke/quickstart-founders', 'Rocket'],
      ['The review pipeline', '/docs-demo/forke/review-pipeline', 'ScanSearch'],
    ],
  },
  {
    title: 'Forke Mail',
    text: 'Transactional email, templates, contacts, workflows and broadcasts on Amazon SES, from any language.',
    href: '/docs-demo/mail',
    icon: 'Mail',
    image: '/docs-demo/img/path-mail.webp',
    prompt: 'P2',
    links: [
      ['Quickstart', '/docs-demo/mail/quickstart', 'Rocket'],
      ['Verify a domain', '/docs-demo/mail/domains', 'Globe'],
      ['API reference', '/docs-demo/mail/api', 'Braces'],
    ],
  },
  {
    title: 'Agents & CLI',
    text: 'Let Claude, ChatGPT, Cursor or your coding agent set up and send email for you, safely.',
    href: '/docs-demo/agents',
    icon: 'Plug',
    image: '/docs-demo/img/path-agents.webp',
    prompt: 'P3',
    links: [
      ['Connect your AI app', '/docs-demo/agents/quickstart', 'Plug'],
      ['Prompt library', '/docs-demo/agents/prompts', 'Wand'],
      ['The CLI', '/docs-demo/agents/cli', 'Terminal'],
    ],
  },
] as const

const EXPLORE = [
  {
    title: 'Doing tasks on Forke',
    links: [
      ['Finding tasks', '/docs-demo/forke/feed'],
      ['Claiming a task', '/docs-demo/forke/claiming'],
      ['Submitting a pull request', '/docs-demo/forke/submitting'],
      ['Earning XP', '/docs-demo/forke/xp'],
      ['Trust score', '/docs-demo/forke/trust-score'],
    ],
  },
  {
    title: 'Posting tasks',
    links: [
      ['Writing a great task', '/docs-demo/forke/posting-tasks'],
      ['Reading the verdict card', '/docs-demo/forke/verdict-card'],
      ['Escrow & payments', '/docs-demo/forke/escrow'],
      ['Refunds & disputes', '/docs-demo/forke/refunds-disputes'],
    ],
  },
  {
    title: 'Sending with Forke Mail',
    links: [
      ['Transactional email', '/docs-demo/mail/sending'],
      ['Templates', '/docs-demo/mail/templates'],
      ['Webhooks', '/docs-demo/mail/webhooks'],
      ['Workflows', '/docs-demo/mail/workflows'],
      ['Broadcasts', '/docs-demo/mail/broadcasts'],
    ],
  },
  {
    title: 'API reference',
    links: [
      ['Send an email', '/docs-demo/mail/api/emails/send'],
      ['Track an event', '/docs-demo/mail/api/events/track'],
      ['Add a domain', '/docs-demo/mail/api/domains/create'],
      ['Create a webhook', '/docs-demo/mail/api/webhooks/create'],
      ['Errors', '/docs-demo/mail/api/errors'],
    ],
  },
] as const

export default async function DocsHome() {
  const setup = PROMPTS.find((p) => p.name === 'setup-app')!
  const hero = await codeTabs([
    { title: 'Setup prompt', lang: 'prompt', code: setup.text },
    { title: 'cURL', lang: 'bash', code: snippet('curl', { method: 'POST', path: '/api/transactional', body: { to: 'ada@example.com', from_address: 'hi@acme.com', subject: 'Hello', text: 'It works' } }) },
    { title: 'Node.js', lang: 'ts', code: snippet('node', { method: 'POST', path: '/api/transactional', body: { to: 'ada@example.com', from_address: 'hi@acme.com', subject: 'Hello', text: 'It works' } }) },
  ])

  return (
    <div className="px-5 pb-28 sm:px-10">
      <section className="mx-auto grid max-w-[1180px] items-center gap-12 pt-14 pb-20 lg:grid-cols-[1fr_520px] lg:pt-20">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[12px] text-white/55">
            <BookOpen className="h-3.5 w-3.5 text-accent" /> Docs for people and their AI agents
          </p>
          <h1 className="text-[40px] leading-[1.05] font-semibold tracking-[-0.04em] text-white sm:text-[54px]">
            Ship real work.
            <br />
            <span className="text-white/45">Send email from anywhere.</span>
          </h1>
          <p className="mt-5 max-w-[520px] text-[17px] leading-relaxed text-white/55">
            Everything about <b className="font-medium text-white/85">Forke</b>, where developers earn by shipping scoped tasks, and <b className="font-medium text-white/85">Forke Mail</b>, the email API you can use from any language or hand to your AI agent.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <CopyText text={setup.text} label="Copy the setup prompt" done="Paste it into your AI app" className="bg-accent text-black shadow-[0_0_30px_-8px_rgba(255,122,0,0.7)] hover:bg-[#ff8a1f]" />
            <Link href="/docs-demo/mail/quickstart" className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-white/[0.12] px-4 text-[14px] text-white/85 transition-colors hover:bg-white/[0.05]">
              Read the quickstart <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-white/40">
            Or connect
            <Link href="/docs-demo/agents/claude" className="flex items-center gap-1.5 text-white/65 hover:text-white"><RiClaudeFill className="h-4 w-4 text-[#D97757]" />Claude</Link>
            <Link href="/docs-demo/agents/chatgpt" className="flex items-center gap-1.5 text-white/65 hover:text-white"><RiOpenaiFill className="h-4 w-4" />ChatGPT</Link>
            <Link href="/docs-demo/agents/cursor" className="flex items-center gap-1.5 text-white/65 hover:text-white"><RiCursorAiFill className="h-4 w-4" />Cursor</Link>
            <Link href="/docs-demo/agents/claude-code" className="flex items-center gap-1.5 text-white/65 hover:text-white"><LangLogo name="claudecode" className="h-4 w-4" />Claude Code</Link>
          </div>
        </div>
        <div className="relative">
          <div aria-hidden className="absolute -inset-10 -z-10 bg-[radial-gradient(closest-side,rgba(255,122,0,0.14),transparent)]" />
          <CodeGroup tabs={hero} panel />
        </div>
      </section>

      <section className="mx-auto max-w-[1180px]">
        <p className="text-[12.5px] font-medium text-accent/90">Products</p>
        <h2 className="mt-1.5 text-[28px] font-semibold tracking-[-0.03em] text-white">Choose where to start</h2>
        <p className="mt-2 text-[15px] text-white/50">Pick the path that fits what you&apos;re doing today.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {PATHS.map((p) => (
            <div key={p.title} className="group flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.015] transition-colors hover:border-white/[0.14]">
              <Link href={p.href} className="block border-b border-white/[0.06] [&_.docs-frame]:rounded-none [&_.docs-frame]:border-0 [&_.docs-frame]:p-0 [&_.docs-frame_*]:rounded-none">
                <Frame src={p.image} alt={`${p.title} illustration`} prompt={p.prompt} ratio="16 / 9" />
              </Link>
              <div className="flex flex-1 flex-col p-5">
                <Link href={p.href} className="flex items-center gap-2 text-[17px] font-medium text-white">
                  <DocIcon name={p.icon} className="h-4 w-4 text-accent" />
                  {p.title}
                  <ArrowRight className="ml-auto h-4 w-4 text-white/30 transition-transform group-hover:translate-x-0.5 group-hover:text-white/70" />
                </Link>
                <p className="mt-2 text-[13.5px] leading-relaxed text-white/50">{p.text}</p>
                <ul className="mt-4 space-y-1">
                  {p.links.map(([label, href, icon]) => (
                    <li key={href}>
                      <Link href={href} className="flex items-center gap-2.5 rounded-lg py-1.5 text-[13.5px] text-white/65 transition-colors hover:text-white">
                        <DocIcon name={icon} className="h-3.5 w-3.5 text-white/35" />
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-[1180px]">
        <p className="text-[12.5px] font-medium text-accent/90">Guides</p>
        <h2 className="mt-1.5 text-[28px] font-semibold tracking-[-0.03em] text-white">Explore the docs</h2>
        <div className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {EXPLORE.map((g) => (
            <div key={g.title}>
              <p className="mb-3 text-[13px] font-medium text-white/85">{g.title}</p>
              <ul className="space-y-0.5 border-l border-white/[0.07]">
                {g.links.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="-ml-px flex items-center gap-1 border-l border-transparent py-1.5 pl-3.5 text-[13.5px] text-white/50 transition-colors hover:border-accent hover:text-white">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-[1180px]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[12.5px] font-medium text-accent/90">Forke Mail</p>
            <h2 className="mt-1.5 text-[28px] font-semibold tracking-[-0.03em] text-white">Send from your stack</h2>
            <p className="mt-2 max-w-[560px] text-[15px] text-white/50">One plain HTTP API, with a copy-and-run guide for every language and framework. No SDK to install or keep up to date.</p>
          </div>
          <Link href="/docs-demo/mail/languages" className="flex items-center gap-1 text-[13.5px] text-white/60 hover:text-white">All languages <ChevronRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-7">
          {LANGUAGE_GUIDES.map((g) => (
            <Link key={g.id} href={`/docs-demo/mail/send-with-${g.id}`} className="group flex flex-col items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.015] px-3 py-4 transition-all hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-white/[0.03]">
              <LangLogo name={g.id === 'nodejs' ? 'node' : g.id === 'curl' ? 'terminal' : g.id === 'laravel' ? 'laravel' : g.icon} className="h-6 w-6" />
              <span className="text-[12.5px] text-white/70 group-hover:text-white">{g.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-[1180px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[radial-gradient(90%_140%_at_100%_0%,rgba(255,122,0,0.10),transparent_60%)]">
        <div className="grid gap-10 p-8 sm:p-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="text-[12.5px] font-medium text-accent/90">For AI agents</p>
            <h2 className="mt-1.5 text-[28px] font-semibold tracking-[-0.03em] text-white">Docs your agent can read</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-white/55">Every page is also clean markdown, the whole site fits in one file, and agents can search it over MCP. Point your coding agent here and it has everything it needs.</p>
            <Link href="/docs-demo/agents/docs-for-agents" className="mt-6 inline-flex items-center gap-1.5 text-[14px] text-white hover:text-accent">How agents read these docs <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {[
              [FileText, 'llms.txt', 'An index of every page', '/docs-demo/llms.txt'],
              [FileText, 'llms-full.txt', 'All docs in one file', '/docs-demo/llms-full.txt'],
              [Plug, 'Docs MCP server', 'Search and read pages as tools', '/docs-demo/agents/docs-for-agents'],
              [Wand, 'Agent skill', 'A ready-made SKILL.md', '/docs-demo/skill.md'],
            ].map(([Icon, title, text, href]) => {
              const I = Icon as typeof FileText
              return (
                <a key={title as string} href={href as string} className="group rounded-xl border border-white/[0.08] bg-[#121111]/70 p-4 transition-colors hover:border-white/[0.16]">
                  <I className="h-4 w-4 text-white/50 group-hover:text-accent" />
                  <span className="mt-3 flex items-center gap-1 font-mono text-[13px] text-white">{title as string}<ArrowUpRight className="h-3 w-3 text-white/30" /></span>
                  <span className="mt-1 block text-[12.5px] text-white/45">{text as string}</span>
                </a>
              )
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 grid max-w-[1180px] gap-3 text-[13.5px] sm:grid-cols-3">
        {[
          ['System status', 'Live status for Forke and Forke Mail', 'https://status.forke.space'],
          ['Changelog', 'What shipped recently', '/changelog'],
          ['Support', 'support@forke.space, a person answers', 'mailto:support@forke.space'],
        ].map(([t, d, h]) => (
          <a key={t} href={h} className="flex items-center justify-between rounded-xl border border-white/[0.07] px-4 py-3.5 transition-colors hover:border-white/[0.14] hover:bg-white/[0.02]">
            <span>
              <span className="block text-white/85">{t}</span>
              <span className="block text-[12.5px] text-white/40">{d}</span>
            </span>
            <ArrowUpRight className="h-4 w-4 text-white/30" />
          </a>
        ))}
      </section>
    </div>
  )
}
