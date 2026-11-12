import Link from 'next/link'
import { ArrowUp, ArrowUpRight } from 'lucide-react'
import {
  RiFacebookFill,
  RiGithubFill,
  RiInstagramLine,
  RiLinkedinBoxFill,
  RiMailLine,
  RiThreadsLine,
  RiTwitterXFill,
} from '@remixicon/react'
import Blueprint from './Blueprint'

type FooterLink = { label: string; href: string; icon?: React.ReactNode }

const ic = 'h-4 w-4'

/** Social and contact links, shown as icon buttons under the brand blurb. */
const SOCIALS: { label: string; href: string; icon: React.ReactNode }[] = [
  { label: 'X', href: 'https://x.com/forkespace', icon: <RiTwitterXFill className={ic} /> },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/forke/', icon: <RiLinkedinBoxFill className={ic} /> },
  { label: 'Instagram', href: 'https://www.instagram.com/forke.space/', icon: <RiInstagramLine className={ic} /> },
  { label: 'Threads', href: 'https://www.threads.com/@forke.space', icon: <RiThreadsLine className={ic} /> },
  { label: 'Facebook', href: 'https://www.facebook.com/people/Forke/61591130679350/', icon: <RiFacebookFill className={ic} /> },
  { label: 'GitHub', href: 'https://github.com/forke-org', icon: <RiGithubFill className={ic} /> },
  { label: 'Email support@forke.space', href: 'mailto:support@forke.space', icon: <RiMailLine className={ic} /> },
]

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: 'Company',
    links: [
      { label: "What's Forke", href: '/whats-forke' },
      { label: 'Levels', href: '/levels' },
      { label: 'Contact', href: '/contact' },
      { label: 'Forke Mail', href: 'https://mail.forke.space' },
    ],
  },
  {
    title: 'Built for',
    links: [
      { label: 'Contributors', href: '/#how' },
      { label: 'Repo owners', href: '/#faq' },
      { label: 'Students', href: '/#how' },
      { label: 'Open source', href: '/#use-cases' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blogs', href: '/blogs' },
      { label: 'Changelog', href: '/changelog' },
      { label: 'Docs', href: '/docs' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Refund Policy', href: '/refund' },
    ],
  },
]

const isExternal = (href: string) => href.startsWith('http') || href.startsWith('mailto:')

function FooterAnchor({ link }: { link: FooterLink }) {
  const cls = 'group inline-flex items-center gap-2 text-sm text-ink/85 transition-colors hover:text-white'
  const body = (
    <>
      {link.icon && <span className="text-white/40 transition-colors group-hover:text-accent">{link.icon}</span>}
      {link.label}
      {!link.icon && isExternal(link.href) && <ArrowUpRight className="h-3.5 w-3.5 text-white/35" />}
    </>
  )
  if (isExternal(link.href)) {
    return (
      <a href={link.href} className={cls} {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {body}
      </a>
    )
  }
  return (
    <Link href={link.href} className={cls}>
      {body}
    </Link>
  )
}

export default function Footer() {
  return (
    <footer className="relative pt-14 sm:pt-16 xl:pt-24">
      <div className="mx-auto max-w-[1200px] px-6 min-[1232px]:px-0">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,3fr)] lg:gap-16">
          {/* brand */}
          <div>
            <Link href="/" aria-label="Forke home" className="inline-flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/forke-assets/favicon.png" alt="" className="h-8 w-8 rounded-[8px]" />
              <span className="text-[24px] font-semibold tracking-[-0.04em] text-white">
                forke<span className="text-accent">*</span>
              </span>
            </Link>
            <p className="mt-4 max-w-[300px] text-[14.5px] leading-6 text-white/50">
              The micro-task marketplace where developers ship real code and get paid the day it merges.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  title={s.label}
                  {...(s.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-white/10 bg-white/[0.03] text-white/55 transition-colors hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* link columns */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="text-sm text-white/40">{col.title}</p>
                <ul className="mt-3 space-y-[7px]">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <FooterAnchor link={l} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex items-center justify-between border-t border-line pt-6">
          <p className="text-[13px] text-white/40">© 2026 forke — all rights reserved</p>
          <a href="#" className="inline-flex items-center gap-1.5 text-[13px] text-white/40 transition-colors hover:text-white">
            Back to top <ArrowUp className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <div className="mt-14">
        <Blueprint />
      </div>
    </footer>
  )
}
