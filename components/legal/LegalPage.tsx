import Link from 'next/link'
import type { ReactNode } from 'react'
import { Mail } from 'lucide-react'
import PageShell from '@/components/shared/PageShell'
import clsx from 'clsx'
import { Section } from '@/components/landing/primitives'
import LegalToc from './LegalToc'

export type LegalSection = { id: string; title: string; body: ReactNode }

const OTHER_PAGES = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/refund', label: 'Refund Policy' },
]

/** Shared shell for the legal pages: header, sticky contents, numbered sections, contact card. */
export default function LegalPage({
  path,
  eyebrow,
  title,
  accent,
  intro,
  sections,
  contact,
}: {
  path: string
  eyebrow: string
  title: string
  /** second half of the title, shown muted like the landing headings */
  accent: string
  intro: ReactNode
  sections: LegalSection[]
  contact: string
}) {
  return (
    <PageShell>
          <Section>
            <header className="px-6 pb-14 pt-20 sm:px-12 sm:pb-16 sm:pt-28">
              <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-accent-text">{eyebrow}</p>
              <h1 className="mt-5 text-[38px] font-medium leading-[1.05] tracking-[-0.035em] sm:text-[56px]">
                <span className="text-white">{title}</span> <span className="text-white/40">{accent}</span>
              </h1>
              <p className="mt-5 font-mono text-[12.5px] text-white/35">Last updated June 2026 · Applies globally</p>
              <div className="mt-8 max-w-[680px] text-[17px] leading-7 text-white/55">{intro}</div>
              <div className="mt-8 flex flex-wrap gap-2">
                {OTHER_PAGES.map((p) => (
                  <Link
                    key={p.href}
                    href={p.href}
                    aria-current={p.href === path ? 'page' : undefined}
                    className={clsx(
                      'rounded-full border px-3 py-1 text-[13px] transition-colors',
                      p.href === path
                        ? 'border-accent/40 bg-accent/10 text-accent-text'
                        : 'border-white/10 text-white/50 hover:border-white/20 hover:text-white/80',
                    )}
                  >
                    {p.label}
                  </Link>
                ))}
              </div>
            </header>
          </Section>

          <Section>
            <div className="grid gap-12 px-6 py-16 sm:px-12 sm:py-20 lg:grid-cols-[220px_1fr] lg:gap-16">
              <LegalToc items={sections.map(({ id, title }) => ({ id, title }))} />
              <div className="min-w-0 max-w-[720px] space-y-14">
                {sections.map((s, i) => (
                  <section key={s.id} id={s.id} className="scroll-mt-24">
                    <h2 className="flex items-baseline gap-3 text-[22px] font-medium tracking-[-0.02em] text-ink">
                      <span className="font-mono text-[13px] text-accent/70">{String(i + 1).padStart(2, '0')}</span>
                      {s.title}
                    </h2>
                    <div className="mt-4 space-y-4 text-[15px] leading-7 text-white/55 [&_strong]:font-medium [&_strong]:text-white/85">
                      {s.body}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </Section>

          <Section divider={false}>
            <div className="flex flex-col items-start justify-between gap-6 px-6 py-14 sm:flex-row sm:items-center sm:px-12">
              <div>
                <p className="text-[20px] font-medium tracking-[-0.02em] text-ink">Questions about this policy?</p>
                <p className="mt-1.5 text-[15px] text-white/50">{contact}</p>
              </div>
              <a
                href="mailto:support@forke.space"
                className="inline-flex h-10 shrink-0 items-center gap-2 rounded-[10px] border border-transparent bg-accent px-4 text-[15px] font-medium leading-none text-[#1a0a00] shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_8px_24px_-8px_rgba(255,122,0,0.55)] transition-colors hover:bg-accent-hover"
              >
                <Mail className="h-4 w-4" />
                support@forke.space
              </a>
            </div>
          </Section>
    </PageShell>
  )
}

/* ---- content pieces ---- */

export function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-[11px] h-1 w-1 shrink-0 rounded-full bg-accent" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

/** Numbered sub-clause, e.g. 5.1 */
export function Clause({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <div className="border-l border-line pl-5">
      <p className="text-[15px] font-medium text-white/85">
        <span className="mr-2 font-mono text-[12.5px] text-white/35">{n}</span>
        {title}
      </p>
      <div className="mt-1.5">{children}</div>
    </div>
  )
}

/** Callout card. `tone="warn"` for things that are not allowed. */
export function Note({ label, tone = 'default', children }: { label: string; tone?: 'default' | 'warn' | 'accent'; children: ReactNode }) {
  return (
    <div
      className={clsx(
        'rounded-[14px] border p-5',
        tone === 'warn' && 'border-red-400/15 bg-red-500/[0.04]',
        tone === 'accent' && 'border-accent/20 bg-accent/[0.05]',
        tone === 'default' && 'border-white/[0.07] bg-white/[0.02]',
      )}
    >
      <p
        className={clsx(
          'font-mono text-[11px] uppercase tracking-[0.14em]',
          tone === 'warn' ? 'text-red-300/80' : tone === 'accent' ? 'text-accent-text' : 'text-white/40',
        )}
      >
        {label}
      </p>
      <div className="mt-2 text-[14.5px] leading-6 text-white/55">{children}</div>
    </div>
  )
}

/** Two titled bullet lists side by side. */
export function Columns({ cols }: { cols: { title: string; items: ReactNode[] }[] }) {
  return (
    <div className="grid gap-8 sm:grid-cols-2">
      {cols.map((c) => (
        <div key={c.title}>
          <p className="mb-3 text-sm text-white/40">{c.title}</p>
          <List items={c.items} />
        </div>
      ))}
    </div>
  )
}
