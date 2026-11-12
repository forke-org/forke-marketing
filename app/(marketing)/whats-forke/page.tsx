import type { Metadata } from 'next'
import {
  Check,
  Eye,
  GitBranch,
  GitPullRequest,
  Minus,
  MousePointerClick,
  Rocket,
  ShieldCheck,
  Target,
  Users,
  Wallet,
  Zap,
} from 'lucide-react'
import PageShell, { PageHeader, SectionHeading } from '@/components/shared/PageShell'
import CellGrid from '@/components/shared/CellGrid'
import { Painting, Reveal, Section } from '@/components/landing/primitives'

export const metadata: Metadata = {
  title: "What's Forke — Real tasks, real code, real payouts",
  description:
    'Forke is a micro-task marketplace for developers. Claim scoped coding tasks from real codebases, ship a reviewed pull request, level up and get paid by UPI the moment it merges.',
  alternates: { canonical: '/whats-forke' },
}

const STORY_POINTS = [
  ['No resumes', 'your merged PRs speak'],
  ['No interviews', 'levels are earned, not claimed'],
  ['No proposals', 'claim a task and start'],
  ['No waiting', 'UPI payout the moment it merges'],
]

const HOW_IT_WORKS = [
  {
    title: 'Claim a task',
    desc: 'Browse a feed gated to your level, skill tier and trust score. Claim one that fits and the reservation is yours.',
    icon: MousePointerClick,
  },
  {
    title: 'Build in a branch',
    desc: "Work in an isolated, Forke-managed GitHub branch, never directly on the owner's repo. Just code.",
    icon: GitBranch,
  },
  {
    title: 'Ship a pull request',
    desc: 'Open a PR with a structured submission. Automated checks and an AI review run before the owner ever sees it.',
    icon: GitPullRequest,
  },
  {
    title: 'Get paid instantly',
    desc: 'The owner approves the verdict, Forke merges upstream, and your UPI payout releases the moment it lands.',
    icon: Wallet,
  },
]

const PURPOSE = [
  {
    icon: Target,
    title: 'Our mission',
    copy: 'To make real-world experience accessible to every developer through meaningful work and fair opportunities.',
    painting: '/paintings/golden-path.jpg',
  },
  {
    icon: Eye,
    title: 'Our vision',
    copy: 'A world where developers grow by building, not just by learning, and where contribution is recognized and rewarded.',
    painting: '/paintings/cloud-sea.jpg',
  },
]

const VALUES = [
  { title: 'Impact first', desc: 'We focus on meaningful contributions that create real impact.', icon: Zap },
  { title: 'Trust & transparency', desc: 'Clear processes, open communication and fair rewards.', icon: ShieldCheck },
  { title: 'Community', desc: 'We grow together. Builders, maintainers and learners, all in one place.', icon: Users },
  { title: 'Keep building', desc: "We're always iterating, improving and pushing things forward.", icon: Rocket },
]

type Mark = 'yes' | 'no' | 'partial'
const COMPARISON: { feature: string; forke: Mark; fiverr: Mark; upwork: Mark }[] = [
  { feature: 'Bite-sized micro-tasks (30 min to 4 hr)', forke: 'yes', fiverr: 'partial', upwork: 'no' },
  { feature: 'Developer-only marketplace', forke: 'yes', fiverr: 'no', upwork: 'no' },
  { feature: 'Skill-gated task access', forke: 'yes', fiverr: 'no', upwork: 'no' },
  { feature: 'Instant UPI payouts on approval', forke: 'yes', fiverr: 'no', upwork: 'no' },
  { feature: 'Auto-built, verified GitHub portfolio', forke: 'yes', fiverr: 'no', upwork: 'no' },
  { feature: 'Git-native PR submission workflow', forke: 'yes', fiverr: 'no', upwork: 'no' },
  { feature: 'AI-assisted code review pipeline', forke: 'yes', fiverr: 'no', upwork: 'no' },
  { feature: 'Escrow held before work begins', forke: 'yes', fiverr: 'partial', upwork: 'partial' },
  { feature: 'No proposals or bidding wars', forke: 'yes', fiverr: 'partial', upwork: 'no' },
  { feature: 'India-first ₹ pricing & startups', forke: 'yes', fiverr: 'no', upwork: 'no' },
]

function MarkCell({ status, forke = false }: { status: Mark; forke?: boolean }) {
  if (status === 'yes') {
    return (
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full ${forke ? 'bg-accent text-black' : 'bg-white/[0.07] text-white/55'}`}
        aria-label="Yes"
      >
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </span>
    )
  }
  if (status === 'partial') {
    return (
      <span className="rounded-full border border-amber-400/25 bg-amber-400/[0.07] px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.08em] text-amber-300/90">
        Partly
      </span>
    )
  }
  return (
    <span className="flex h-6 w-6 items-center justify-center" aria-label="No">
      <Minus className="h-3.5 w-3.5 text-white/20" strokeWidth={2.5} />
    </span>
  )
}

export default function WhatsForkePage() {
  return (
    <PageShell cta>
      <PageHeader eyebrow="About us" title="What is" muted="Forke?">
        Forke is a gamified open-source contribution space. Claim verified coding tasks, level up your engineering
        tier, and cash out rewards instantly.
      </PageHeader>

      {/* the concept */}
      <Section>
        <div className="grid gap-12 px-6 py-20 sm:px-12 sm:py-28 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <SectionHeading title="Fake projects don't" muted="teach you to ship." />
            <Reveal className="mt-6 space-y-5 text-[16.5px] leading-7 text-white/50">
              <p>
                Forke was born from a simple realization: the traditional path for software engineers is broken.
                Building fake portfolio projects teaches you syntax, but it doesn&rsquo;t teach you how to ship.
                Bidding for freelance contracts is an endless waiting game, and early internships are heavily
                gatekept.
              </p>
              <p>
                We built Forke to change this. Startups post scoped, bite-sized coding tasks with fixed budgets. You
                claim a task, write code in an isolated GitHub branch, submit a pull request, and get paid instantly
                via UPI upon approval. Just code, growth and cash.
              </p>
            </Reveal>
            <p className="mt-6 font-mono text-[12px] text-white/30">{'//'} prove skill by shipping</p>
          </div>

          <Painting src="/paintings/dusk-sky.jpg" className="min-h-[380px] rounded-[20px] border border-white/[0.06] pl-[8%] pt-12 sm:pt-16">
            <div className="float-layer -mb-8 -mr-8 h-full overflow-hidden rounded-xl border border-white/15 bg-[#0c0c0e]/92 shadow-[0_24px_60px_rgba(0,0,0,0.6)] backdrop-blur-md">
              <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
                <span className="flex gap-1">
                  <i className="h-2 w-2 rounded-full bg-white/15" />
                  <i className="h-2 w-2 rounded-full bg-white/15" />
                  <i className="h-2 w-2 rounded-full bg-white/15" />
                </span>
                <span className="font-mono text-[11px] text-white/40">the forke way</span>
              </div>
              <ul className="space-y-1.5 p-4 pb-12 pr-12">
                {STORY_POINTS.map(([lead, rest]) => (
                  <li key={lead} className="flex items-start gap-3 rounded-lg bg-white/[0.03] px-3 py-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span className="text-[14px] leading-5 text-white/50">
                      <span className="font-medium text-white/90">{lead}.</span> {rest[0].toUpperCase() + rest.slice(1)}.
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Painting>
        </div>
      </Section>

      {/* how it works */}
      <Section>
        <div className="px-6 py-20 sm:px-12 sm:py-28">
          <SectionHeading title="Claim. Build." muted="Ship. Get paid.">
            From browsing the feed to money in your account, the whole loop is Git-native and built for speed.
          </SectionHeading>
          <Reveal className="mt-12">
            <CellGrid>
              {HOW_IT_WORKS.map((item, i) => (
                <div key={item.title} className="p-6 sm:p-7">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-accent/25 bg-accent/[0.07] text-accent">
                      <item.icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
                    </span>
                    <span className="font-mono text-[12px] text-white/25">0{i + 1}</span>
                  </div>
                  <h3 className="mt-5 text-[17px] font-medium text-ink">{item.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-6 text-white/45">{item.desc}</p>
                </div>
              ))}
            </CellGrid>
          </Reveal>
        </div>
      </Section>

      {/* mission & vision */}
      <Section>
        <div className="grid gap-4 px-3 py-3 sm:grid-cols-2 sm:px-4 sm:py-4">
          {PURPOSE.map((item, i) => (
            <Reveal key={item.title} delay={i * 120} className="h-full">
              <div className="flex h-full flex-col overflow-hidden rounded-[20px] border border-white/[0.07] bg-surface p-2">
                <Painting src={item.painting} className="h-[220px] rounded-[14px] sm:h-[260px]">
                  <span className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-[12px] border border-white/20 bg-black/35 text-white backdrop-blur-md">
                    <item.icon className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                </Painting>
                <div className="px-4 pb-6 pt-5 sm:px-5">
                  <h3 className="text-[22px] font-medium tracking-[-0.02em] text-ink">{item.title}</h3>
                  <p className="mt-2 max-w-[440px] text-[15.5px] leading-7 text-white/50">{item.copy}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* values */}
      <Section>
        <div className="px-6 py-20 sm:px-12 sm:py-28">
          <SectionHeading title="What" muted="drives us." />
          <Reveal className="mt-12">
            <CellGrid>
              {VALUES.map((v) => (
                <div key={v.title} className="p-6 sm:p-7">
                  <span className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-white/10 bg-white/[0.04] text-white/80">
                    <v.icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
                  </span>
                  <h3 className="mt-5 text-[17px] font-medium text-ink">{v.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-6 text-white/45">{v.desc}</p>
                </div>
              ))}
            </CellGrid>
          </Reveal>
        </div>
      </Section>

      {/* comparison */}
      <Section divider={false}>
        <div className="px-6 py-20 sm:px-12 sm:py-28">
          <SectionHeading title="Built different," muted="on purpose.">
            Generic freelance platforms weren&rsquo;t made for developers. Every choice here is.
          </SectionHeading>
          <Reveal className="mt-12">
            <div className="overflow-hidden rounded-[18px] border border-line">
              <div className="grid grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,0.6fr))] border-b border-line text-center sm:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))]">
                <div className="px-4 py-4 text-left text-sm text-white/40 sm:px-6">Feature</div>
                <div className="bg-accent/[0.06] px-1 py-4 text-[15px] font-semibold tracking-[-0.04em] text-white sm:text-[17px]">
                  forke<span className="text-accent">*</span>
                </div>
                <div className="px-1 py-4 text-[13px] text-white/45 sm:text-[15px]">Fiverr</div>
                <div className="px-1 py-4 text-[13px] text-white/45 sm:text-[15px]">Upwork</div>
              </div>
              {COMPARISON.map((row, i) => (
                <div
                  key={row.feature}
                  className={`grid grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,0.6fr))] items-stretch sm:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))] ${i ? 'border-t border-line' : ''}`}
                >
                  <div className="px-4 py-3.5 text-[13.5px] leading-5 text-white/75 sm:px-6 sm:py-4 sm:text-[15px]">{row.feature}</div>
                  <div className="flex items-center justify-center bg-accent/[0.06]">
                    <MarkCell status={row.forke} forke />
                  </div>
                  <div className="flex items-center justify-center">
                    <MarkCell status={row.fiverr} />
                  </div>
                  <div className="flex items-center justify-center">
                    <MarkCell status={row.upwork} />
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>
    </PageShell>
  )
}
