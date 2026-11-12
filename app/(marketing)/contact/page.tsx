import type { Metadata } from 'next'
import { ArrowUpRight, Clock, FileText, Mail, Receipt, UserCheck } from 'lucide-react'
import { RiGithubFill, RiInstagramLine, RiLinkedinBoxFill, RiTwitterXFill } from '@remixicon/react'
import PageShell, { PageHeader, SectionHeading } from '@/components/shared/PageShell'
import Accordion from '@/components/shared/Accordion'
import { Painting, Reveal, Section } from '@/components/landing/primitives'

export const metadata: Metadata = {
  title: 'Contact — Get in touch with Forke',
  description:
    'Questions about your account, payouts or contributing to Forke? Email support@forke.space, find us on GitHub, or follow along on social. We reply within 24–48 hours.',
  alternates: { canonical: '/contact' },
}

const SOCIALS = [
  { label: 'X', href: 'https://x.com/forkespace', Icon: RiTwitterXFill },
  { label: 'Instagram', href: 'https://www.instagram.com/forke.space/', Icon: RiInstagramLine },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/forke/', Icon: RiLinkedinBoxFill },
]

const EXPEDITE = [
  { icon: FileText, title: 'Task disputes', body: 'Provide the task ID, candidate username and PR link.' },
  { icon: Receipt, title: 'Payout queries', body: 'Provide the settlement date, transaction ID and UPI reference.' },
  { icon: UserCheck, title: 'Account recovery', body: 'Write from the registered address linked to your GitHub or Google account.' },
]

const FAQS = [
  {
    q: 'How long does payout validation take?',
    a: 'Bounty verification and payout are automated. Once a pull request is merged, the escrowed bounty is released instantly to your registered UPI ID. Validation typically finishes within seconds of the merge.',
  },
  {
    q: 'How do task disputes work?',
    a: 'If your submission is rejected, you can raise a dispute by emailing support. A senior auditor will review the task specification against your PR, tests and diff to issue a neutral verdict.',
  },
  {
    q: 'Can I claim multiple tasks at the same time?',
    a: 'To prevent hoarding, developers can only claim one active task at a time. Completing tasks successfully builds your trust score, which eventually unlocks parallel claims.',
  },
  {
    q: 'What if I miss the 20-minute activation window?',
    a: 'If you claim a task but do not start working within 20 minutes, the claim expires and the task returns to the public queue. This keeps the platform fast and fair.',
  },
]

const card = 'group flex h-full flex-col overflow-hidden rounded-[20px] border border-white/[0.07] bg-surface p-2 transition-transform duration-500 hover:-translate-y-1'

export default function ContactPage() {
  return (
    <PageShell>
      <PageHeader eyebrow="Contact" title="Get in touch" muted="with Forke.">
        Have questions about your account, payouts, or want to contribute? Reach out directly through our official
        channels below.
      </PageHeader>

      {/* channels */}
      <Section>
        <div className="grid gap-4 px-3 py-3 sm:px-4 sm:py-4 md:grid-cols-3">
          <Reveal className="h-full">
            <a href="mailto:support@forke.space" className={card}>
              <Painting src="/paintings/ember-field.jpg" className="h-[150px] rounded-[14px]">
                <span className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-[12px] border border-white/20 bg-black/35 text-white backdrop-blur-md">
                  <Mail className="h-5 w-5" strokeWidth={1.5} />
                </span>
              </Painting>
              <div className="flex flex-1 flex-col px-4 pb-5 pt-5">
                <h2 className="text-[19px] font-medium text-ink">Email support</h2>
                <p className="mt-1.5 text-[14.5px] leading-6 text-white/45">General questions, payout disputes and account recovery.</p>
                <p className="mt-auto flex items-center gap-1 pt-5 text-[15px] text-accent-text">
                  support@forke.space
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </p>
              </div>
            </a>
          </Reveal>

          <Reveal delay={100} className="h-full">
            <a href="https://github.com/forke-org" target="_blank" rel="noopener noreferrer" className={card}>
              <Painting src="/paintings/dusk-hill.jpg" className="h-[150px] rounded-[14px]">
                <span className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-[12px] border border-white/20 bg-black/35 text-white backdrop-blur-md">
                  <RiGithubFill className="h-5 w-5" />
                </span>
              </Painting>
              <div className="flex flex-1 flex-col px-4 pb-5 pt-5">
                <h2 className="text-[19px] font-medium text-ink">GitHub</h2>
                <p className="mt-1.5 text-[14.5px] leading-6 text-white/45">Inspect our open source projects and merged contributions.</p>
                <p className="mt-auto flex items-center gap-1 pt-5 text-[15px] text-accent-text">
                  github.com/forke-org
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </p>
              </div>
            </a>
          </Reveal>

          <Reveal delay={200} className="h-full">
            <div className={card}>
              <Painting src="/paintings/cloud-sea.jpg" className="h-[150px] rounded-[14px]">
                <span className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-[12px] border border-white/20 bg-black/35 text-white backdrop-blur-md">
                  <RiTwitterXFill className="h-5 w-5" />
                </span>
              </Painting>
              <div className="flex flex-1 flex-col px-4 pb-5 pt-5">
                <h2 className="text-[19px] font-medium text-ink">Social</h2>
                <p className="mt-1.5 text-[14.5px] leading-6 text-white/45">Follow along for updates and Forky moments.</p>
                <div className="mt-auto flex gap-2 pt-5">
                  {SOCIALS.map(({ label, href, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      title={label}
                      className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-white/10 bg-white/[0.03] text-white/60 transition-colors hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                    >
                      <Icon className="h-[18px] w-[18px]" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* response time + what to include */}
      <Section>
        <div className="grid gap-12 px-6 py-20 sm:px-12 sm:py-28 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <SectionHeading title="A reply within" muted="24 to 48 hours.">
              Our operations run Monday to Friday, 10 AM to 6 PM IST. We investigate every query promptly.
            </SectionHeading>
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[12px] text-white/60">
              <Clock className="h-3.5 w-3.5 text-accent" /> Mon–Fri · 10:00–18:00 IST
            </p>
          </div>
          <Reveal>
            <p className="text-sm text-white/40">To get a faster answer, include</p>
            <ul className="mt-4 overflow-hidden rounded-[18px] border border-line">
              {EXPEDITE.map((e, i) => (
                <li key={e.title} className={`flex items-start gap-4 px-5 py-5 ${i ? 'border-t border-line' : ''}`}>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-accent/25 bg-accent/[0.07] text-accent">
                    <e.icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
                  </span>
                  <span>
                    <span className="block text-[16px] font-medium text-ink">{e.title}</span>
                    <span className="mt-0.5 block text-[14.5px] leading-6 text-white/45">{e.body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      {/* faq */}
      <Section divider={false}>
        <div className="grid gap-10 px-6 py-20 sm:px-12 sm:py-28 lg:grid-cols-[1fr_1.4fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading title="Frequently asked" muted="questions." />
          </div>
          <Accordion items={FAQS} />
        </div>
      </Section>
    </PageShell>
  )
}
