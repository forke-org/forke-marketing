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

import { Check, CircleCheck, ClipboardCheck, Clock, GitBranch, GitMerge, Loader2, ShieldCheck, Timer, Wallet, Zap } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Badge, MiniCursor, Stage, Window, at, show, useTimeline } from './kit'

// ---------------------------------------------------------------- claim → soft reservation → activate

export function ClaimDemo() {
  const [ref, t] = useTimeline(96)
  const reserved = t >= 14 && t < 40
  const working = t >= 40
  const secs = 20 * 60 - 17 - Math.max(0, t - 14) * 3
  const clock = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`
  const cursor = at<[number, number]>([[0, [560, 400]], [7, [586, 300]], [24, [500, 365]], [46, [640, 430]]], t)
  return (
    <div ref={ref}>
      <Stage w={760} h={440} label="Claiming a Forke task: a 20-minute soft reservation, then activating it with I'm Working">
        <Window url="forke.space/tasks/1042" className="inset-x-12 top-6 bottom-6">
          <div className="h-[calc(100%-36px)] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[11px] text-white/40">
                  <span>Frontend</span>·<span>Tier 2</span>·<span>Low risk</span>·<span>Startup</span>
                </div>
                <h4 className="mt-1.5 text-[17px] font-medium tracking-[-0.01em] text-white">Add inline validation to the signup form</h4>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {['React', 'TypeScript', 'Zod'].map((s) => <span key={s} className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[11px] text-white/60">{s}</span>)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[20px] font-semibold text-white">₹800</div>
                <div className="text-[11px] text-white/40">150 XP · ~3 hours</div>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2.5 text-[11.5px]">
              {[['Level', 'LVL 4+', true], ['Skill tier', 'Frontend 2+', true], ['Trust', '70%+', true]].map(([k, v]) => (
                <div key={k as string} className="flex items-center justify-between rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2">
                  <span className="text-white/45">{k}</span>
                  <span className="flex items-center gap-1 text-emerald-300/90"><Check className="h-3 w-3" />{v}</span>
                </div>
              ))}
            </div>
            <div className="relative mt-5 h-[150px]">
              <div className={cn('absolute inset-0 flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.015] px-4 transition-all duration-500', t < 14 ? 'opacity-100' : 'pointer-events-none opacity-0')}>
                <p className="max-w-[300px] text-[12.5px] text-white/55">You meet all three gates. Claiming holds the task for you for 20 minutes.</p>
                <span className={cn('flex h-9 items-center rounded-lg bg-accent px-4 text-[13px] font-medium text-black shadow-[0_0_24px_-6px_rgba(255,122,0,0.6)] transition-transform', t >= 10 && t < 14 && 'scale-95')}>Claim task</span>
              </div>
              <div className={cn('absolute inset-0 rounded-xl border border-amber-400/25 bg-amber-400/[0.04] p-4 transition-all duration-500', reserved ? 'opacity-100' : 'pointer-events-none opacity-0')}>
                <div className="flex items-center justify-between">
                  <Badge tone="amber">Reserved</Badge>
                  <span className="flex items-center gap-1.5 font-mono text-[13px] text-amber-100"><Timer className="h-3.5 w-3.5" />{clock}</span>
                </div>
                <p className="mt-2.5 text-[12.5px] leading-relaxed text-white/60">Start within 20 minutes: create your branch, push a first commit, open a draft PR, or press <b className="font-medium text-white/85">I&apos;m Working</b>.</p>
                <span className={cn('mt-3 inline-flex h-8 items-center rounded-lg border border-white/[0.12] bg-white/[0.05] px-3 text-[12.5px] text-white transition-transform', t >= 27 && t < 31 && 'scale-95')}>I&apos;m Working</span>
              </div>
              <div className={cn('absolute inset-0 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.04] p-4 transition-all duration-500', working ? 'opacity-100' : 'pointer-events-none opacity-0')}>
                <div className="flex items-center justify-between">
                  <Badge tone="green">In progress</Badge>
                  <span className="flex items-center gap-1.5 text-[12px] text-white/55"><Clock className="h-3.5 w-3.5" />Deadline in 3h 00m</span>
                </div>
                <div className={show(t >= 48, 'mt-3 flex items-center gap-2 font-mono text-[12px] text-white/70')}>
                  <GitBranch className="h-3.5 w-3.5 text-accent" /> dev-ada/task-1042 <span className="text-white/35">from task/1042-signup-validation</span>
                </div>
                <p className={show(t >= 54, 'mt-2 text-[12px] text-white/45')}>The task is locked to you. The deadline started now, not when you claimed it.</p>
              </div>
            </div>
          </div>
        </Window>
        <div className={show(t >= 42 && t < 80, 'absolute top-12 right-16 flex items-center gap-2 rounded-xl border border-accent/30 bg-[#1f1712] px-3.5 py-2.5 text-[12.5px] text-white shadow-2xl')}>
          <Zap className="h-4 w-4 text-accent" /> +5 XP · claim activated
        </div>
        <MiniCursor x={cursor[0]} y={cursor[1]} press={(t >= 10 && t < 14) || (t >= 27 && t < 31)} show={t >= 4 && t < 52} />
      </Stage>
    </div>
  )
}

// ---------------------------------------------------------------- the four review layers and the verdict

const CHECKS = ['Build', 'Tests', 'Lint', 'Types', 'Scope', 'Secrets']
const LAYERS = [
  { name: 'Automated validation', note: 'Build, tests, lint, types, scope and secret scan in a sandbox', at: 4, done: 26 },
  { name: 'Context assembly', note: 'Task, acceptance criteria, the diff and repo patterns', at: 26, done: 34 },
  { name: 'AI review', note: 'Structured verdict with scores, issues and positives', at: 34, done: 50 },
  { name: 'Risk scoring', note: 'Decides who reviews it next', at: 50, done: 58 },
]

export function PipelineDemo() {
  const [ref, t] = useTimeline(120)
  const bar = (v: number, from: number) => Math.min(v, Math.max(0, (t - from) * 1.4))
  return (
    <div ref={ref}>
      <Stage w={760} h={470} label="A pull request passing Forke's four review layers and producing a verdict card">
        <Window url="forke.space/submissions/1042" className="top-6 bottom-6 left-8 w-[350px]">
          <div className="p-5">
            <p className="text-[11px] text-white/40">PR #1042 · dev-ada/task-1042</p>
            <p className="mt-0.5 text-[14px] font-medium text-white">Add inline validation to the signup form</p>
            <ol className="mt-4 space-y-3">
              {LAYERS.map((l, i) => {
                const state = t < l.at ? 'wait' : t < l.done ? 'run' : 'done'
                return (
                  <li key={l.name} className="flex gap-3">
                    <span className={cn('mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] transition-colors duration-300', state === 'done' ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300' : state === 'run' ? 'border-accent/40 text-accent' : 'border-white/[0.1] text-white/35')}>
                      {state === 'done' ? <Check className="h-3.5 w-3.5" /> : state === 'run' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : `L${i + 1}`}
                    </span>
                    <div className="min-w-0">
                      <p className={cn('text-[13px] transition-colors', state === 'wait' ? 'text-white/40' : 'text-white/90')}>{l.name}</p>
                      <p className="text-[11px] text-white/35">{l.note}</p>
                      {i === 0 && t >= 4 ? (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {CHECKS.map((c, k) => (
                            <span key={c} className={cn('inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10.5px] transition-colors duration-300', t >= 7 + k * 3 ? 'bg-emerald-400/10 text-emerald-300' : 'bg-white/[0.04] text-white/35')}>
                              {t >= 7 + k * 3 ? <Check className="h-2.5 w-2.5" /> : null}
                              {c}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        </Window>
        <div className={cn('absolute top-6 right-8 bottom-6 w-[330px] rounded-xl border border-white/[0.1] bg-[#151414] p-5 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)] transition-all duration-700', t >= 58 ? 'opacity-100' : 'pointer-events-none translate-x-3 opacity-0')}>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[13px] font-medium text-white"><ClipboardCheck className="h-4 w-4 text-accent" />Verdict</span>
            <Badge tone="blue">Owner review</Badge>
          </div>
          <p className="mt-3 text-[12px] leading-relaxed text-white/60">Adds Zod validation with inline errors under each field. Matches the acceptance criteria; no files outside the scope were touched.</p>
          <div className="mt-4 space-y-2.5">
            {[['Task completion', 9, 60], ['Code quality', 8, 63], ['Architecture fit', 8, 66]].map(([k, v, from]) => (
              <div key={k as string}>
                <div className="flex justify-between text-[11.5px]"><span className="text-white/55">{k}</span><span className="font-mono text-white/80">{v}/10</span></div>
                <div className="mt-1 h-1.5 rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-accent transition-[width] duration-200" style={{ width: `${bar(v as number, from as number) * 10}%` }} /></div>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-[11.5px]">
            <div className="rounded-lg border border-white/[0.07] px-2.5 py-2"><span className="block text-white/40">Security</span><span className="flex items-center gap-1 text-emerald-300"><ShieldCheck className="h-3.5 w-3.5" />Pass</span></div>
            <div className="rounded-lg border border-white/[0.07] px-2.5 py-2"><span className="block text-white/40">Risk score</span><span className="font-mono text-white/85">24 / 100</span></div>
          </div>
          <div className="mt-4 flex gap-2">
            <span className="flex h-8 flex-1 items-center justify-center rounded-lg border border-white/[0.12] text-[12px] text-white/75">Request changes</span>
            <span className="flex h-8 flex-1 items-center justify-center rounded-lg bg-accent text-[12px] font-medium text-black">Approve</span>
          </div>
        </div>
      </Stage>
    </div>
  )
}

// ---------------------------------------------------------------- approve → merge → escrow → UPI

const PAYOUT = [
  { at: 16, icon: GitMerge, text: 'Clean squash-merged PR opened on acme/web' },
  { at: 23, icon: Wallet, text: 'Escrow released: ₹800 to the developer' },
  { at: 30, icon: Zap, text: 'XP awarded: 100 + 25 speed bonus + 30 for 5 stars' },
  { at: 37, icon: CircleCheck, text: 'Task added to the developer\'s public profile' },
]

export function PayoutDemo() {
  const [ref, t] = useTimeline(90)
  const cursor = at<[number, number]>([[0, [520, 420]], [5, [459, 138]], [20, [600, 420]]], t)
  return (
    <div ref={ref}>
      <Stage w={760} h={400} label="A founder approves a submission and the developer is paid through UPI straight away">
        <Window url="forke.space/review/1042" className="top-6 bottom-6 left-10 w-[440px]">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-[14px] font-medium text-white">Add inline validation to the signup form</p>
              {t >= 13 ? <Badge tone="green">Approved</Badge> : <Badge tone="blue">Awaiting you</Badge>}
            </div>
            <div className="mt-3 flex gap-2">
              <span className="flex h-8 flex-1 items-center justify-center rounded-lg border border-white/[0.12] text-[12px] text-white/70">Request changes</span>
              <span className={cn('flex h-8 flex-1 items-center justify-center rounded-lg bg-accent text-[12px] font-medium text-black transition-transform', t >= 9 && t < 13 && 'scale-95')}>Approve & pay ₹800</span>
            </div>
            <ol className="mt-5 space-y-2.5">
              {PAYOUT.map((p) => (
                <li key={p.text} className={show(t >= p.at, 'flex items-center gap-2.5 text-[12.5px] text-white/75')}>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300"><p.icon className="h-3.5 w-3.5" /></span>
                  {p.text}
                </li>
              ))}
            </ol>
          </div>
        </Window>
        <div className={cn('absolute top-16 right-12 w-[220px] rounded-[28px] border border-white/[0.1] bg-[#0d0c0c] p-3 shadow-2xl transition-all duration-700', t >= 25 ? 'opacity-100' : 'pointer-events-none translate-y-3 opacity-0')}>
          <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-white/10" />
          <div className="rounded-2xl bg-white/[0.06] p-3">
            <div className="flex items-center gap-2 text-[10.5px] text-white/45"><Wallet className="h-3 w-3" />UPI · now</div>
            <p className="mt-1 text-[13px] font-medium text-white">₹800 received</p>
            <p className="text-[11px] text-white/50">From Forke · task #1042</p>
          </div>
          <div className="h-36" />
        </div>
        <MiniCursor x={cursor[0]} y={cursor[1]} press={t >= 9 && t < 13} show={t >= 2 && t < 20} />
      </Stage>
    </div>
  )
}
