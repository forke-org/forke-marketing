'use client'

import { useEffect, useState, type ReactNode } from 'react'
import {
  BookOpen,
  Check,
  FolderGit2,
  GitPullRequest,
  LayoutGrid,
  Lock,
  Search,
  ShieldCheck,
  Timer,
  Trophy,
  UserRound,
  Wallet,
} from 'lucide-react'
import { RiGithubFill } from '@remixicon/react'
import { ForkeMark, cn } from './primitives'

/*
 * Product preview for the hero: the Forke bounty board as a contributor sees it.
 * Scoped, escrowed tasks from real repos, a level gate on each, and the 20-minute
 * claim window ticking on the task you just picked up. Click "Claim" to try it.
 */

type Bounty = {
  id: number
  repo: string
  title: string
  tags: string[]
  amount: string
  level: number
  posted: string
  state?: 'review'
}

const BOUNTIES: Bounty[] = [
  { id: 1, repo: 'acme/api', title: 'Retry logic for the webhook sender', tags: ['Go', 'backend'], amount: '₹2,400', level: 2, posted: '12m ago' },
  { id: 2, repo: 'shopkit/web', title: 'Fix cart badge overflow on mobile', tags: ['React', 'bug fix'], amount: '₹1,200', level: 1, posted: '26m ago' },
  { id: 3, repo: 'notely/app', title: 'Dark mode toggle in settings', tags: ['Next.js', 'Tailwind'], amount: '₹1,800', level: 1, posted: '1h ago', state: 'review' },
  { id: 4, repo: 'acme/api', title: 'CSV export for invoices', tags: ['TypeScript', 'backend'], amount: '₹3,000', level: 3, posted: '2h ago' },
  { id: 5, repo: 'ledgerly/core', title: 'Rate limiter for /v1 routes', tags: ['Rust', 'infra'], amount: '₹4,500', level: 4, posted: '3h ago' },
  { id: 6, repo: 'docsite/docs', title: 'Rewrite the auth quickstart', tags: ['Markdown', 'docs'], amount: '₹900', level: 1, posted: '5h ago' },
]

const MY_LEVEL = 3

function NavItem({ icon, label, count, active }: { icon: ReactNode; label: string; count?: string; active?: boolean }) {
  return (
    <div
      className={cn(
        'flex h-[32px] items-center gap-2.5 rounded-lg px-2.5 text-[13px]',
        active ? 'bg-white/[0.07] text-white' : 'text-white/55',
      )}
    >
      <span className="flex h-4 w-4 items-center justify-center">{icon}</span>
      {label}
      {count && <span className="ml-auto font-mono text-[11px] text-white/35">{count}</span>}
    </div>
  )
}

function Sidebar() {
  return (
    <aside className="flex w-[220px] shrink-0 flex-col border-r border-white/[0.06] bg-[#0b0b0d] p-3">
      <div className="flex items-center gap-2 px-2 pb-4 pt-1">
        <ForkeMark className="h-6 w-6 rounded-md" />
        <span className="text-[16px] font-semibold tracking-[-0.03em] text-white">
          forke<span className="text-accent">*</span>
        </span>
      </div>
      <div className="space-y-0.5">
        <NavItem icon={<LayoutGrid className="h-3.5 w-3.5" />} label="Bounties" count="128" active />
        <NavItem icon={<FolderGit2 className="h-3.5 w-3.5" />} label="My tasks" count="1" />
        <NavItem icon={<GitPullRequest className="h-3.5 w-3.5" />} label="Submissions" />
        <NavItem icon={<Wallet className="h-3.5 w-3.5" />} label="Ledger" />
        <NavItem icon={<Trophy className="h-3.5 w-3.5" />} label="Levels" />
        <NavItem icon={<UserRound className="h-3.5 w-3.5" />} label="DEV ID" />
      </div>

      <div className="mt-auto rounded-xl border border-white/[0.07] bg-white/[0.03] p-3">
        <div className="flex items-center justify-between text-[11.5px]">
          <span className="text-white/45">Level {MY_LEVEL} · Builder</span>
          <span className="font-mono text-accent-text">72%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
          <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-accent to-[#FFB25C]" />
        </div>
        <div className="mt-3 flex items-center justify-between text-[11.5px]">
          <span className="flex items-center gap-1.5 text-white/45">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Trust score
          </span>
          <span className="font-mono text-white/80">96</span>
        </div>
      </div>
    </aside>
  )
}

function ClaimBanner({ bounty, left }: { bounty: Bounty; left: number }) {
  const mm = String(Math.floor(left / 60)).padStart(2, '0')
  const ss = String(left % 60).padStart(2, '0')
  return (
    <div className="flex items-center gap-3 rounded-xl border border-accent/30 bg-accent/[0.08] px-3.5 py-2.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/20 text-accent">
        <Timer className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[12.5px] font-medium text-white/90">Claimed · {bounty.title}</p>
        <p className="truncate text-[11px] text-white/45">
          {bounty.repo} · start within the claim window or it returns to the queue
        </p>
      </div>
      <span className="font-mono text-[15px] font-semibold tabular-nums text-accent">
        {mm}:{ss}
      </span>
      <span className="block rounded-lg bg-accent px-3 py-1.5 text-[12px] font-semibold text-black">Open branch</span>
    </div>
  )
}

function BountyCard({
  b,
  claimed,
  onClaim,
}: {
  b: Bounty
  claimed: boolean
  onClaim: () => void
}) {
  const locked = b.level > MY_LEVEL
  return (
    <div
      className={cn(
        'flex min-w-0 flex-col rounded-xl border bg-[#0f0f12] p-3 transition-colors',
        claimed ? 'border-accent/40' : 'border-white/[0.07] hover:border-white/[0.14]',
      )}
    >
      <div className="flex items-center justify-between text-[11px] text-white/40">
        <span className="flex min-w-0 items-center gap-1.5">
          <RiGithubFill className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{b.repo}</span>
        </span>
        <span className="shrink-0">{b.posted}</span>
      </div>
      <p className="mt-1.5 line-clamp-2 min-h-[34px] text-[13px] font-medium leading-[17px] text-white/90">{b.title}</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {b.tags.map((t) => (
          <span key={t} className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-white/50">
            {t}
          </span>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/[0.06] pt-2.5">
        <div className="min-w-0">
          <p className="font-mono text-[14px] font-semibold text-accent">{b.amount}</p>
          <p className="flex items-center gap-1 text-[10.5px] text-emerald-300/80">
            <Check className="h-3 w-3" /> escrowed
          </p>
        </div>
        {b.state === 'review' ? (
          <span className="flex items-center gap-1 rounded-md bg-sky-400/10 px-2 py-1 text-[11px] text-sky-300">
            <BookOpen className="h-3 w-3" /> In review
          </span>
        ) : locked ? (
          <span className="flex items-center gap-1 rounded-md bg-white/[0.05] px-2 py-1 text-[11px] text-white/45">
            <Lock className="h-3 w-3" /> Level {b.level}+
          </span>
        ) : claimed ? (
          <span className="flex items-center gap-1 rounded-md bg-accent/15 px-2 py-1 text-[11px] font-medium text-accent">
            <Check className="h-3 w-3" /> Claimed
          </span>
        ) : (
          <button
            type="button"
            onClick={onClaim}
            className="rounded-md bg-white px-2.5 py-1 text-[11.5px] font-semibold text-black transition-colors hover:bg-accent"
          >
            Claim
          </button>
        )}
      </div>
    </div>
  )
}

const FILTERS = ['All', 'Frontend', 'Backend', 'Bug fix', 'Docs']

export default function AppMockup() {
  const [claimedId, setClaimedId] = useState(1)
  const [left, setLeft] = useState(19 * 60 + 42)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    const id = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 20 * 60)), 1000)
    return () => clearInterval(id)
  }, [])

  const claim = (id: number) => {
    setClaimedId(id)
    setLeft(20 * 60)
  }

  const claimed = BOUNTIES.find((b) => b.id === claimedId)!
  const visible = BOUNTIES.filter((b) => {
    if (filter === 'All') return true
    if (filter === 'Frontend') return b.tags.some((t) => ['React', 'Next.js', 'Tailwind'].includes(t))
    if (filter === 'Backend') return b.tags.includes('backend') || b.tags.includes('infra')
    if (filter === 'Bug fix') return b.tags.includes('bug fix')
    return b.tags.includes('docs')
  })

  return (
    <div className="relative flex h-[580px] w-[1068px] max-w-none overflow-hidden rounded-2xl lg:mx-auto lg:w-full border border-white/10 bg-[#09090b]/95 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9),0_0_0_1px_rgba(0,0,0,0.5),0_0_80px_-10px_rgba(255,122,0,0.25)] backdrop-blur-xl">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        {/* window bar */}
        <div className="flex h-11 items-center gap-3 border-b border-white/[0.05] px-3">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-1.5 text-[12px] text-white/40">
            <Search className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Search bounties by stack, repo or label</span>
          </div>
          <span className="shrink-0 rounded-md border border-accent/30 bg-accent/10 px-2 py-0.5 font-mono text-[10.5px] text-accent-text">
            Preview
          </span>
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto p-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[17px] font-medium tracking-[-0.01em] text-white">Bounties</p>
              <p className="text-[12px] text-white/45">Scoped, escrowed tasks from real repos</p>
            </div>
            <p className="font-mono text-[11px] text-white/35">sorted by newest</p>
          </div>

          <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={cn(
                  'shrink-0 rounded-full border px-3 py-1 text-[12px] transition-colors',
                  filter === f ? 'border-white/20 bg-white/10 text-white' : 'border-white/[0.07] text-white/50 hover:text-white/80',
                )}
              >
                {f}
              </button>
            ))}
            <span className="shrink-0 rounded-full border border-white/[0.07] px-3 py-1 text-[12px] text-white/50">≤ Level {MY_LEVEL}</span>
          </div>

          <div className="mt-3">
            <ClaimBanner bounty={claimed} left={left} />
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2.5">
            {visible.map((b) => (
              <BountyCard key={b.id} b={b} claimed={b.id === claimedId} onClaim={() => claim(b.id)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
