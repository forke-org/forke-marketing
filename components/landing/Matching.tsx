'use client'

/**
 * @fileoverview Forke Platform
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

import type { ReactNode } from 'react'
import { Check, EyeOff, Layers, ShieldCheck } from 'lucide-react'
import FitScale from './FitScale'
import { Caption, Painting, Reveal, Section, cn } from './primitives'
import { useLoop } from './loops'

/**
 * How a task reaches a developer: every task has three gates (level, skill tier, trust score) and only shows up in the
 * feeds of developers who pass all three. Three cards in the code-review section's format, each a short loop of the
 * real thing: XP landing and levelling up, a track's tier matching a task, the trust score unlocking the feed.
 * Numbers follow the docs (XP rules, tiers 1–3 per track, trust factors).
 */

function Card({ src, children }: { src: string; children: ReactNode }) {
  return (
    <FitScale width={373} grow>
      <Painting src={src} shade={0.25} className="aspect-[33/32] rounded-2xl border border-white/[0.06]">
        <div className="contents pointer-events-none select-none">{children}</div>
      </Painting>
    </FitScale>
  )
}

const panel = 'float-layer absolute rounded-xl border border-white/10 bg-[#121215]/95 shadow-[0_20px_40px_rgba(0,0,0,0.55)] backdrop-blur'
const mono = 'font-mono text-[10px] uppercase tracking-[0.12em] text-white/40'
const fade = (on: boolean) => cn('transition-all duration-500', on ? 'opacity-100' : 'translate-y-1 opacity-0')
const PHOTO = 'https://i.pravatar.cc/80?img=12'

// ---------------------------------------------------------------- level & XP

const XP_EVENTS = [
  { at: 6, label: 'Task merged', xp: 100 },
  { at: 13, label: 'Shipped before half the deadline', xp: 25 },
  { at: 20, label: '5★ from the owner', xp: 30 },
  { at: 27, label: 'Activated the claim in time', xp: 5 },
]
const XP_START = 2840
const XP_NEXT = 3000

function LevelVisual() {
  const [ref, t] = useLoop<HTMLDivElement>(100)
  const earned = XP_EVENTS.filter((e) => t >= e.at).reduce((a, e) => a + e.xp, 0)
  const xp = XP_START + earned
  const levelled = t >= 38
  return (
    <Card src="/paintings/golden-path.webp">
      <div ref={ref} className={cn(panel, 'left-[8%] -right-[8%] top-[9%] p-3 pr-[calc(8%+12px)]')}>
        <div className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={PHOTO} alt="" className="h-8 w-8 rounded-full object-cover ring-1 ring-white/15" />
          <div className="min-w-0 flex-1">
            <p className="text-[12.5px] font-medium text-white/90">John Doe</p>
            <p className="text-[11px] text-white/45">
              Level <span className="tabular-nums text-white/80">{levelled ? 10 : 9}</span>
              <span className={cn('ml-1.5 text-accent-text', fade(levelled))}>· level up</span>
            </p>
          </div>
          <span className="font-mono text-[11px] tabular-nums text-white/55">
            {xp.toLocaleString('en-IN')} / {XP_NEXT.toLocaleString('en-IN')} XP
          </span>
        </div>
        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent to-[#ffb25c]"
            style={{ width: `${Math.min(100, ((xp - 2000) / (XP_NEXT - 2000)) * 100)}%`, transition: 'width 600ms cubic-bezier(0.22,1,0.36,1)' }}
          />
        </div>
      </div>

      <div className={cn(panel, '-bottom-4 left-[-4%] right-[8%] top-[40%] rounded-b-none px-[8%] py-3')}>
        <p className={mono}>XP from this task</p>
        <div className="mt-2 space-y-1.5">
          {XP_EVENTS.map((e) => (
            <div key={e.label} className={cn('flex items-center justify-between text-[12px]', fade(t >= e.at))}>
              <span className="text-white/75">{e.label}</span>
              <span className="font-mono text-emerald-300">+{e.xp}</span>
            </div>
          ))}
          <div className={cn('flex items-center justify-between border-t border-white/[0.07] pt-1.5 text-[12.5px]', fade(t >= 32))}>
            <span className="font-medium text-white">Total</span>
            <span className="font-mono font-semibold text-accent-text">+{earned} XP</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

// ---------------------------------------------------------------- skill tier

const TRACKS = [
  { name: 'Frontend', tier: 2 },
  { name: 'Backend', tier: 3 },
  { name: 'Fullstack', tier: 3, match: true },
  { name: 'Mobile', tier: 1 },
]

function TierVisual() {
  const [ref, t] = useLoop<HTMLDivElement>(100)
  const lit = t >= 28
  const met = t >= 38
  return (
    <Card src="/paintings/cloud-sea.webp">
      <div ref={ref} className={cn(panel, 'left-[10%] -right-[6%] top-[9%] p-3 pr-[calc(6%+12px)]')}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[12.5px] font-medium text-white/90">Retry failed Stripe webhooks</p>
            <p className="mt-0.5 font-mono text-[10.5px] text-white/40">acme/api · ₹9,000</p>
          </div>
        </div>
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          {['Next.js', 'Database'].map((g) => (
            <span key={g} className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-white/55">
              {g}
            </span>
          ))}
          <span
            className={cn(
              'ml-auto flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10.5px] transition-colors duration-500',
              met ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300' : 'border-white/10 text-white/55',
            )}
          >
            {met ? <Check className="h-3 w-3" /> : <Layers className="h-3 w-3" />} Fullstack · Tier 3
          </span>
        </div>
      </div>

      <div className={cn(panel, '-bottom-4 left-[-4%] right-[8%] top-[42%] rounded-b-none px-[8%] py-3')}>
        <p className={mono}>Your tracks</p>
        <div className="mt-2 space-y-1">
          {TRACKS.map((tr, i) => {
            const on = t >= 4 + i * 4
            const hot = tr.match && lit
            return (
              <div
                key={tr.name}
                className={cn(
                  'flex items-center justify-between rounded-md px-2 py-1.5 text-[12px] transition-all duration-500',
                  hot ? 'bg-accent/[0.1] ring-1 ring-accent/30' : '',
                  on ? 'opacity-100' : 'opacity-0',
                )}
              >
                <span className={hot ? 'text-white' : 'text-white/70'}>{tr.name}</span>
                <span className="flex items-center gap-2">
                  <span className="flex gap-1">
                    {[1, 2, 3].map((p) => (
                      <i key={p} className={cn('h-1.5 w-4 rounded-full', p <= tr.tier ? (hot ? 'bg-accent' : 'bg-white/45') : 'bg-white/10')} />
                    ))}
                  </span>
                  <span className="w-11 text-right font-mono text-[10.5px] text-white/45">Tier {tr.tier}</span>
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}

// ---------------------------------------------------------------- trust score

const FACTORS = [
  { at: 4, label: 'Tasks completed', value: '98%' },
  { at: 10, label: 'On-time delivery', value: '95%' },
  { at: 16, label: 'Average rating', value: '4.9★' },
]
const GATES = ['Level 8+', 'Fullstack T3', 'Trust 85%+']

function TrustVisual() {
  const [ref, t] = useLoop<HTMLDivElement>(110)
  const score = Math.min(92, Math.round((t / 22) * 92))
  const gate = (i: number) => t >= 34 + i * 5
  const unlocked = t >= 50
  return (
    <Card src="/paintings/ember-field.webp">
      <div ref={ref} className={cn(panel, 'left-[8%] -right-[12%] top-[9%] flex items-center gap-3 p-3 pr-[calc(12%+12px)]')}>
        <svg viewBox="0 0 48 48" className="h-14 w-14 shrink-0 -rotate-90">
          <circle cx="24" cy="24" r="19" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
          <circle
            cx="24"
            cy="24"
            r="19"
            fill="none"
            stroke="#4ade80"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 19}
            strokeDashoffset={2 * Math.PI * 19 * (1 - score / 100)}
            style={{ transition: 'stroke-dashoffset 100ms linear' }}
          />
        </svg>
        <div className="min-w-0 flex-1">
          <p className="flex items-baseline gap-1.5">
            <span className="font-mono text-[20px] font-semibold tabular-nums text-white">{score}%</span>
            <span className="text-[11px] text-white/45">trust score</span>
          </p>
          <div className="mt-1 space-y-0.5">
            {FACTORS.map((f) => (
              <p key={f.label} className={cn('flex justify-between text-[10.5px]', fade(t >= f.at))}>
                <span className="text-white/50">{f.label}</span>
                <span className="font-mono text-white/75">{f.value}</span>
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className={cn(panel, '-bottom-4 left-[-4%] right-[8%] top-[46%] rounded-b-none px-[8%] py-3')}>
        <p className={mono}>Your feed</p>
        <div className={cn('mt-2 rounded-lg border p-2.5 transition-colors duration-500', unlocked ? 'border-emerald-400/30 bg-emerald-400/[0.05]' : 'border-white/[0.08]', fade(t >= 28))}>
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-white/85">Payment retries for checkout</span>
            <span className="font-mono text-accent-text">₹9,000</span>
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {GATES.map((g, i) => (
              <span
                key={g}
                className={cn(
                  'flex items-center gap-1 rounded-full px-1.5 py-px text-[9.5px] transition-colors duration-300',
                  gate(i) ? 'bg-emerald-400/10 text-emerald-300' : 'bg-white/[0.05] text-white/40',
                )}
              >
                {gate(i) ? <Check className="h-2.5 w-2.5" /> : <ShieldCheck className="h-2.5 w-2.5" />} {g}
              </span>
            ))}
          </div>
        </div>
        <p className={cn('mt-2 flex items-center gap-1.5 text-[11px] text-white/35', fade(t >= 56))}>
          <EyeOff className="h-3 w-3" /> Hidden · a reviewer task needs Level 15, trust 90%+
        </p>
      </div>
    </Card>
  )
}

export default function Matching() {
  return (
    <Section>
      <div className="px-6 pt-16 sm:px-12 sm:pt-24">
        <h2 id="matching" className="scroll-mt-24 text-[32px] font-[450] leading-[1.1] tracking-[-0.01em] text-ink sm:text-[44px] sm:leading-[48px]">
          Every task finds the right hands.
        </h2>
        <p className="mt-6 max-w-[640px] text-base leading-6 text-white/45">
          A task only appears in your feed when you pass all three of its gates: your level, your skill tier and your
          trust score.
          Owners get someone who can actually ship it, and you never scroll past work you
          can&rsquo;t claim.
        </p>
      </div>

      <div className="grid gap-8 px-6 pb-16 pt-16 sm:pb-24 md:grid-cols-3 md:gap-4">
        <Reveal>
          <LevelVisual />
          <Caption title="Level, earned from real work.">
            Every merged task pays XP, with bonuses for shipping early and great ratings. Your level, 1 to 25, is the first gate.
          </Caption>
        </Reveal>
        <Reveal delay={100}>
          <TierVisual />
          <Caption title="Depth in your track.">
            Frontend, Backend, Fullstack and more each have three tiers. A task&rsquo;s tags decide the tier it needs.
          </Caption>
        </Reveal>
        <Reveal delay={200}>
          <TrustVisual />
          <Caption title="Trust you can&rsquo;t fake.">
            Completion, deadlines and ratings add up to your trust score. Pass all three gates and the task shows up.
          </Caption>
        </Reveal>
      </div>
    </Section>
  )
}
