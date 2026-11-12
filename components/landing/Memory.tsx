'use client'

import { BadgeCheck, GitMerge, ShieldCheck, Trophy } from 'lucide-react'
import { RiGithubFill } from '@remixicon/react'
import { BlurWords, CountUp, Painting, Reveal, Section, cn, useInView } from './primitives'

/*
 * DEV ID: every merge lands on a public, verified Forke profile. Shown the same
 * way as the rest of the page: a cropped app window resting on a painting.
 */

const WEEKS = 26
// deterministic "activity" so server and client render the same heatmap
const level = (w: number, d: number) => {
  const v = Math.sin(w * 12.9898 + d * 78.233) * 43758.5453
  const r = v - Math.floor(v)
  const ramp = 0.35 + (w / WEEKS) * 0.65 // busier lately
  const x = r * ramp
  return x > 0.5 ? 4 : x > 0.36 ? 3 : x > 0.24 ? 2 : x > 0.14 ? 1 : 0
}
const SHADES = ['rgba(240,227,222,0.06)', 'rgba(255,122,0,0.25)', 'rgba(255,122,0,0.45)', 'rgba(255,122,0,0.7)', '#FF7A00']

const SHIPPED = [
  { title: 'Rate limiter for /v1 routes', repo: 'ledgerly/core', amount: '₹4,500', when: '2d ago' },
  { title: 'Cursor pagination for invoices', repo: 'acme/api', amount: '₹3,200', when: '5d ago' },
  { title: 'Dark mode toggle in settings', repo: 'notely/app', amount: '₹1,800', when: '1w ago' },
]

function Heatmap({ on }: { on: boolean }) {
  return (
    <div className="grid grid-flow-col grid-rows-7 gap-[3px]">
      {Array.from({ length: WEEKS * 7 }, (_, i) => {
        const w = Math.floor(i / 7)
        const d = i % 7
        return (
          <span
            key={i}
            className="h-[11px] w-[11px] rounded-[2px] transition-[background-color] duration-500"
            style={{ backgroundColor: on ? SHADES[level(w, d)] : SHADES[0], transitionDelay: on ? `${w * 35 + d * 8}ms` : '0ms' }}
          />
        )
      })}
    </div>
  )
}

function Profile() {
  const [ref, on] = useInView<HTMLDivElement>(0.3)
  return (
    <div ref={ref} className="pb-10 pr-10">
      {/* browser chrome */}
      <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-2.5">
        <span className="flex gap-1.5">
          <i className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <i className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <i className="h-2.5 w-2.5 rounded-full bg-white/15" />
        </span>
        <span className="truncate rounded-md bg-white/[0.05] px-3 py-1 font-mono text-[11.5px] text-white/50">forke.space/@riya</span>
      </div>

      <div className="grid grid-cols-[1fr_230px] gap-6 p-7">
        <div className="min-w-0">
          {/* identity */}
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#FFB25C] to-accent text-[22px] font-semibold text-black">
              R
            </span>
            <div>
              <p className="flex items-center gap-1.5 text-[17px] font-medium text-white">
                Riya Sharma <BadgeCheck className="h-4 w-4 text-accent" />
              </p>
              <p className="text-[12.5px] text-white/45">@riya · Bengaluru · on Forke since 2026</p>
            </div>
            <div className="ml-auto flex flex-wrap gap-1.5">
              <span className="flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-1 text-[11.5px] font-medium text-accent-text">
                <Trophy className="h-3 w-3" /> Level 4 · Expert
              </span>
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11.5px] text-emerald-300">
                <ShieldCheck className="h-3 w-3" /> Trust 96
              </span>
            </div>
          </div>

          {/* activity */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-[11.5px] text-white/45">
              <span>38 merged tasks in the last 6 months</span>
              <span className="flex items-center gap-1">
                less
                {SHADES.map((c) => (
                  <i key={c} className="h-2.5 w-2.5 rounded-[2px]" style={{ background: c }} />
                ))}
                more
              </span>
            </div>
            <div className="no-scrollbar mt-2.5 overflow-x-auto">
              <Heatmap on={on} />
            </div>
          </div>

          {/* shipped work */}
          <div className="mt-6 space-y-1.5">
            {SHIPPED.map((s, i) => (
              <div
                key={s.title}
                className="flex items-center gap-3 rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2.5 text-[12.5px] transition-all duration-500"
                style={{ opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(6px)', transitionDelay: `${600 + i * 120}ms` }}
              >
                <GitMerge className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                <span className="min-w-0 flex-1 truncate text-white/85">{s.title}</span>
                <span className="flex shrink-0 items-center gap-1 text-white/35">
                  <RiGithubFill className="h-3 w-3" />
                  {s.repo}
                </span>
                <span className="shrink-0 font-mono text-accent-text">{s.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* earnings + stack */}
        <div className="space-y-3">
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4">
            <p className="text-[11px] uppercase tracking-[0.12em] text-white/40">Earned on Forke</p>
            <p className="mt-1.5 text-[28px] font-semibold tracking-tight text-white">
              {on ? <CountUp to={124500} prefix="₹" /> : '₹0'}
            </p>
            <p className="mt-1 text-[11.5px] text-emerald-300/80">All paid out to UPI</p>
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4">
            <p className="text-[11px] uppercase tracking-[0.12em] text-white/40">Stack</p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {['Go', 'TypeScript', 'Postgres', 'React', 'Redis'].map((t) => (
                <span key={t} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[11px] text-white/65">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Memory() {
  return (
    <Section>
      <div className="px-6 pt-16 sm:px-12 sm:pt-24">
        <h2 className="text-[34px] font-medium leading-[1.08] tracking-[-0.03em] sm:text-[44px]">
          <BlurWords text="A profile that proves" className="block text-ink" />
          <BlurWords text="what you've shipped." className="block text-white/40" delay={200} />
        </h2>
        <Reveal className="mt-6 max-w-[560px] text-[17px] leading-7 text-white/50">
          Every merge lands on your DEV ID: a public, verified record of your level, trust score, stack and paid work.
          It&rsquo;s the portfolio that gets you bigger bounties, so no more cover letters.
        </Reveal>
      </div>

      <div className="px-4 pb-16 pt-12 sm:px-6 sm:pb-24">
        <Painting src="/paintings/golden-path.jpg" position="center 70%" className="rounded-[22px] border border-white/[0.06] pl-4 pt-10 sm:pl-8 sm:pt-14 lg:pl-[5%]">
          {/* the window bleeds off the right and bottom edges, like a cropped screenshot; on phones
              and tablets it keeps its desktop layout at a fixed width and runs off the right edge */}
          <div
            className={cn(
              'float-layer -mb-10 -mr-10 w-[1040px] max-w-none overflow-hidden rounded-xl border border-white/15 bg-[#0e0e10]/94 lg:w-auto',
              'shadow-[0_30px_80px_-10px_rgba(0,0,0,0.7)] backdrop-blur-md',
            )}
          >
            <Profile />
          </div>
        </Painting>
      </div>
    </Section>
  )
}
