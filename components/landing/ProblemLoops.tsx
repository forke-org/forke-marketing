'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { Check, Clock, MessageSquare, Paperclip, Send } from 'lucide-react'
import { RiGithubFill } from '@remixicon/react'
import { cn } from './primitives'
import { MiniCursor, centreIn, useLoop } from './loops'

/**
 * The problem cards as short loops: the same windows as before, now playing out what each card says, at their
 * normal size (no camera moves).
 */

function WindowBar({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-white/[0.06] px-3 py-2">
      <span className="flex gap-1">
        <i className="h-2 w-2 rounded-full bg-white/15" />
        <i className="h-2 w-2 rounded-full bg-white/15" />
        <i className="h-2 w-2 rounded-full bg-white/15" />
      </span>
      <span className="truncate text-[10.5px] text-white/40">{label}</span>
    </div>
  )
}

const appear = (on: boolean) => cn('transition-all duration-500', on ? 'opacity-100' : 'translate-y-1 opacity-0')

// ---------------------------------------------------------------- every gig is a proposal

const LETTER = 'Hi! I have 6 years of experience and would love to help. Please find my portfolio attached…'

export function ProposalLoop() {
  const [ref, t] = useLoop<HTMLDivElement>(92)
  const typed = LETTER.slice(0, Math.max(0, Math.min(LETTER.length, Math.round((t - 3) * 3.6))))
  const sent = t >= 41
  const others = 47 + Math.min(19, Math.max(0, Math.floor((t - 44) / 2)))
  const days = Math.min(7, Math.max(0, Math.floor((t - 44) / 5)))

  const inner = useRef<HTMLDivElement>(null)
  const btn = useRef<HTMLSpanElement>(null)
  const [aim, setAim] = useState({ x: 0, y: 0 })
  useLayoutEffect(() => setAim(centreIn(btn.current, inner.current) ?? { x: 0, y: 0 }), [])
  const atButton = t >= 32 && t < 46

  return (
    <div ref={ref}>
      <WindowBar label="Proposal · Freelance site" />
        <div ref={inner} className="relative space-y-2 p-3 text-[11px]">
          <p className="font-medium text-white/85">Re: Fix checkout bug (React)</p>
          <p className="min-h-[32px] leading-4 text-white/45">
            {typed}
            {t < 30 && <span className="ml-px inline-block h-3 w-px translate-y-0.5 animate-[caret_1s_steps(1)_infinite] bg-white/60" />}
          </p>
          <div className="flex items-center justify-between">
            <p className={cn('flex items-center gap-1 text-white/35', appear(t >= 28))}>
              <Paperclip className="h-3 w-3" /> portfolio_final_v3.pdf
            </p>
            <span
              ref={btn}
              className={cn(
                'flex h-6 items-center gap-1 rounded-md px-2 text-[10.5px] font-medium transition-colors',
                sent ? 'bg-white/[0.06] text-white/50' : t === 40 ? 'bg-accent-hover text-[#1a0a00]' : 'bg-accent text-[#1a0a00]',
              )}
            >
              {sent ? <Check className="h-3 w-3" /> : <Send className="h-3 w-3" />}
              {sent ? 'Sent' : 'Send proposal'}
            </span>
          </div>
          <div className={cn('flex items-center justify-between rounded-md bg-white/[0.04] px-2 py-1.5 text-white/45', appear(t >= 44))}>
            <span>
              <span className="font-mono tabular-nums text-white/70">{others}</span> other proposals
            </span>
            <span className="text-red-300/80">Not viewed{days > 0 ? ` · ${days}d` : ''}</span>
          </div>
          <MiniCursor x={atButton ? aim.x : aim.x - 70} y={atButton ? aim.y : aim.y + 60} press={t === 40} show={t >= 26 && t < 52} />
        </div>
    </div>
  )
}

// ---------------------------------------------------------------- did anyone even review this?

const YOU = 'https://i.pravatar.cc/80?img=12' // the same face as John Doe across the site


export function ReviewLoop() {
  const [ref, t] = useLoop<HTMLDivElement>(100)
  const ago = Math.min(9, 2 + Math.floor(t / 6))
  return (
    <div ref={ref}>
      <WindowBar label="github.com · pull request" />
        <div className="space-y-2.5 p-3 text-[11px]">
          <p className="flex items-center gap-1.5 font-medium text-white/85">
            <RiGithubFill className="h-3.5 w-3.5" /> fix: handle null session on refresh #318
          </p>
          <div className="flex gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={YOU} alt="" className="h-5 w-5 shrink-0 rounded-full object-cover ring-1 ring-white/10" />
            <div>
              <p className="text-white/70">
                you <span className="text-white/35">commented {ago} days ago</span>
              </p>
              <p className="text-white/45">Friendly ping: any chance someone can take a look?</p>
            </div>
          </div>
          <div className={cn('flex gap-2', appear(t >= 48))}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={YOU} alt="" className="h-5 w-5 shrink-0 rounded-full object-cover ring-1 ring-white/10" />
            <div>
              <p className="text-white/70">
                you <span className="text-white/35">commented just now</span>
              </p>
              <p className="text-white/45">Bumping this. Happy to make any changes.</p>
            </div>
          </div>
          <p className={cn('flex items-center gap-1.5 text-white/35', appear(t >= 66))}>
            <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-white/[0.12] text-white/70">
              <RiGithubFill className="h-2.5 w-2.5" />
            </span>
            github-actions added the
            <span className="rounded-full border border-white/15 bg-white/[0.06] px-1.5 text-[10px] text-white/60">stale</span>
            label
          </p>
          <p className="flex items-center gap-1.5 text-white/35">
            <MessageSquare className="h-3 w-3" /> 0 reviews · awaiting maintainer
          </p>
        </div>
    </div>
  )
}

// ---------------------------------------------------------------- payouts take weeks


export function InvoiceLoop() {
  const [ref, t] = useLoop<HTMLDivElement>(110)
  const days = Math.min(41, Math.round((t * 41) / 64))
  const paid = t >= 68
  const rows: [string, string, boolean][] = [
    ['Invoice sent', '2 Oct', t >= 2],
    ['Reminder sent', '1 Nov', days >= 30],
    ['Second reminder', '9 Nov', days >= 38],
  ]
  return (
    <div ref={ref}>
      <WindowBar label="Invoice #2026-114" />
        <div className="space-y-2 p-3 text-[11px]">
          {rows.map(([a, b, on]) => (
            <div key={a} className={cn('flex justify-between text-white/55', appear(on))}>
              <span>{a}</span>
              <span className="text-white/35">{b}</span>
            </div>
          ))}
          <div
            className={cn(
              'flex items-center justify-between rounded-md border px-2 py-1.5 transition-colors duration-500',
              paid ? 'border-emerald-400/20 bg-emerald-400/[0.06]' : 'border-amber-400/20 bg-amber-400/[0.06]',
            )}
          >
            <span className="font-mono text-white/80">
              {t >= 74 ? (
                <>
                  <span className="mr-1.5 text-white/30 line-through">₹18,000</span>₹16,740
                </>
              ) : (
                '₹18,000'
              )}
            </span>
            <span className={cn('flex items-center gap-1', paid ? 'text-emerald-300' : 'text-amber-300')}>
              {paid ? <Check className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
              {paid ? 'Paid' : 'Pending'} · <span className="tabular-nums">{days}</span> days
            </span>
          </div>
          <div className={cn('flex justify-between text-rose-300/80', appear(t >= 74))}>
            <span>Currency conversion fee</span>
            <span className="font-mono">−₹1,260</span>
          </div>
        </div>
    </div>
  )
}
