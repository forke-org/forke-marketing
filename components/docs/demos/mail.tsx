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

import { ArrowUp, Check, ChevronDown, CircleCheck, Loader2, Mail, MousePointerClick, Eye, Send, Server, ShieldCheck, Wrench } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Badge, Caret, MiniCursor, Stage, Window, at, show, typed, typingDone, useTimeline } from './kit'

// ---------------------------------------------------------------- CLI: install → login → init → send

const CMDS = [
  { at: 4, cps: 3, cmd: 'curl -fsSL https://mail.forke.space/install.sh | sh', out: [[0, 'Downloading forke-mail 1.1.0 for darwin/arm64…'], [4, '✓ Checksum verified'], [7, '✓ Installed /usr/local/bin/forke-mail']] },
  { at: 34, cps: 2, cmd: 'forke-mail login', out: [[2, 'Opening your browser to sign in…'], [12, '✓ Signed in as ada@acme.com · project Acme']] },
  { at: 62, cps: 2, cmd: 'forke-mail init', out: [[2, '✓ Created test key fm_test_9c2f…'], [5, '✓ Saved FORKE_MAIL_API_KEY to .env (and added .env to .gitignore)'], [8, '✓ Wrote Forke Mail notes to AGENTS.md for your coding agent']] },
  { at: 88, cps: 4, cmd: 'forke-mail send --to ada@example.com --from "Acme <hi@acme.com>" --subject "Hello" --text "It works"', out: [[3, '✓ Accepted  id 5f1c2e7a  status test  (test key: stored, not delivered)']] },
] as const

export function CliDemo() {
  const [ref, t] = useTimeline(150)
  return (
    <div ref={ref}>
      <Stage w={760} h={400} label="Terminal: installing the forke-mail CLI, signing in, setting up a project and sending a test email">
        <Window title="~/acme-app — zsh" dark className="inset-x-10 top-9 bottom-9">
          <div className="flex h-[calc(100%-36px)] flex-col justify-end overflow-hidden px-5 py-4 font-mono text-[12.5px] leading-[1.75]">
            {CMDS.map((c, i) => {
              if (t < c.at) return null
              const done = typingDone(c.cmd, c.at, c.cps)
              return (
                <div key={i}>
                  <div className="text-white/90">
                    <span className="text-accent">❯</span> <span className="text-white/40">~/acme-app</span> {typed(c.cmd, t, c.at, c.cps)}
                    {t < done ? <Caret /> : null}
                  </div>
                  {c.out.map(([d, line], k) =>
                    t >= done + d ? (
                      <div key={k} className={cn('animate-[docs-in_0.25s_ease-out]', line.startsWith('✓') ? 'text-emerald-300/90' : 'text-white/45')}>
                        {line}
                      </div>
                    ) : null,
                  )}
                </div>
              )
            })}
            {t >= typingDone(CMDS[3].cmd, CMDS[3].at, CMDS[3].cps) + 6 ? (
              <div className="text-white/90">
                <span className="text-accent">❯</span> <span className="text-white/40">~/acme-app</span> <Caret />
              </div>
            ) : null}
          </div>
        </Window>
      </Stage>
    </div>
  )
}

// ---------------------------------------------------------------- an agent asks in the chat before a real send

export function AgentConfirmDemo() {
  const [ref, t] = useTimeline(118)
  const reply = 'Yes, send it'
  const replyAt = 50
  const sentReply = t >= 62
  return (
    <div ref={ref}>
      <Stage w={760} h={470} label="An AI app asks for confirmation in the chat before Forke Mail sends a real email">
        <Window title="Your AI app" className="inset-x-14 top-7 bottom-7">
          <div className="flex h-[calc(100%-36px)] flex-col">
            <div className="flex flex-1 flex-col justify-end gap-3 overflow-hidden px-6 pt-4 pb-3 text-[13px]">
              <Bubble me on={t >= 4}>Send the welcome email to ada@example.com</Bubble>
              <div className={show(t >= 10, 'flex items-center gap-2')}>
                <ToolChip name="send_email" state={t < 18 ? 'run' : 'gate'} />
              </div>
              <div className={show(t >= 20, 'max-w-[86%]')}>
                <p className="mb-2 text-white/80">Forke Mail wants your OK before it sends a real email:</p>
                <div className="rounded-xl border border-amber-400/25 bg-amber-400/[0.05] p-3.5">
                  <div className="mb-2 flex items-center gap-1.5 font-mono text-[10.5px] tracking-[0.1em] text-amber-200/90 uppercase">
                    <ShieldCheck className="h-3.5 w-3.5" /> Confirmation needed
                  </div>
                  <dl className="grid grid-cols-[70px_1fr] gap-y-1 text-[12.5px]">
                    <dt className="text-white/40">To</dt><dd className="text-white/85">ada@example.com</dd>
                    <dt className="text-white/40">From</dt><dd className="text-white/85">Acme &lt;hi@acme.com&gt;</dd>
                    <dt className="text-white/40">Template</dt><dd className="text-white/85">welcome · “Welcome to Acme, Ada”</dd>
                  </dl>
                </div>
                <p className="mt-2 text-white/80">Should I send it?</p>
              </div>
              <Bubble me on={sentReply}>{reply}</Bubble>
              <div className={show(t >= 66, 'flex items-center gap-2')}>
                <ToolChip name="send_email" detail="confirm_token: ct_7a…" state={t < 74 ? 'run' : 'ok'} />
              </div>
              <p className={show(t >= 77, 'text-white/80')}>
                Sent <Check className="inline h-3.5 w-3.5 text-emerald-400" /> Message <span className="font-mono text-white/60">5f1c2e7a</span> is queued. I&apos;ll tell you if it bounces.
              </p>
            </div>
            <div className="border-t border-white/[0.06] p-3">
              <div className="flex items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.03] px-3.5 py-2.5 text-[13px]">
                <span className={cn('flex-1', !sentReply && t >= replyAt ? 'text-white/90' : 'text-white/30')}>
                  {!sentReply && t >= replyAt ? (
                    <>
                      {typed(reply, t, replyAt, 1.5)}
                      <Caret />
                    </>
                  ) : (
                    'Reply…'
                  )}
                </span>
                <span className={cn('flex h-7 w-7 items-center justify-center rounded-lg transition-all', t >= 58 && t < 62 ? 'scale-90 bg-accent text-black' : 'bg-white/[0.08] text-white/50')}>
                  <ArrowUp className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </div>
        </Window>
        <MiniCursor x={at([[0, 640], [56, 618]], t)} y={at([[0, 470], [56, 408]], t)} press={t >= 59 && t < 62} show={t >= 54 && t < 70} />
      </Stage>
    </div>
  )
}

function Bubble({ me, on, children }: { me?: boolean; on: boolean; children: React.ReactNode }) {
  return <div className={show(on, cn('max-w-[78%] rounded-2xl px-3.5 py-2 text-white/90', me ? 'self-end rounded-br-md bg-white/[0.08]' : 'bg-transparent'))}>{children}</div>
}

function ToolChip({ name, detail, state }: { name: string; detail?: string; state: 'run' | 'gate' | 'ok' }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 font-mono text-[11.5px] text-white/60">
      <Wrench className="h-3 w-3 text-white/35" />
      forke-mail · {name}
      {detail ? <span className="text-white/30">{detail}</span> : null}
      {state === 'run' ? <Loader2 className="h-3 w-3 animate-spin text-white/40" /> : state === 'gate' ? <span className="text-amber-200/80">needs your OK</span> : <CircleCheck className="h-3.5 w-3.5 text-emerald-400" />}
    </span>
  )
}

// ---------------------------------------------------------------- connecting an app (OAuth consent)

export function ConnectDemo() {
  const [ref, t] = useTimeline(84)
  const open = t >= 14 && t < 24
  const chosen = t >= 24
  const connected = t >= 40
  const cursor = at<[number, number]>([[0, [560, 420]], [9, [380, 205]], [19, [360, 266]], [30, [452, 357]], [44, [600, 420]]], t)
  return (
    <div ref={ref}>
      <Stage w={760} h={460} label="Connecting an AI app to Forke Mail: pick a project and press Allow">
        <Window url="mail.forke.space/oauth/authorize" className="inset-x-16 top-6 bottom-6">
          <div className="relative h-[calc(100%-36px)] overflow-hidden bg-[radial-gradient(80%_60%_at_50%_120%,rgba(255,122,0,0.18),transparent_70%)]">
            <div className={cn('absolute inset-0 flex flex-col items-center pt-9 transition-all duration-500', connected ? 'pointer-events-none -translate-y-2 opacity-0' : 'opacity-100')}>
              <p className="text-[19px] tracking-[-0.03em]"><b className="font-semibold text-white">forke<span className="text-accent">*</span></b> <span className="text-white/50">mail</span></p>
              <h4 className="mt-5 text-[20px] font-medium tracking-[-0.02em] text-white">Connect Claude</h4>
              <p className="mt-1 text-[12.5px] text-white/50">Claude wants to use Forke Mail as <b className="font-medium text-white/80">ada@acme.com</b>.</p>
              <div className="relative mt-5 w-[300px]">
                <span className="mb-1.5 block text-[11px] font-medium text-white/45">Project</span>
                <div className={cn('flex h-9 items-center justify-between rounded-lg border px-3 text-[13px] transition-colors', open ? 'border-accent/50 bg-white/[0.04]' : 'border-white/[0.1] bg-white/[0.03]')}>
                  <span className={chosen ? 'text-white' : 'text-white/40'}>{chosen ? 'Acme' : 'Select a project'}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-white/40" />
                </div>
                <div className={cn('absolute inset-x-0 top-[62px] z-10 rounded-lg border border-white/[0.1] bg-[#1c1b1a] p-1 text-[13px] shadow-2xl transition-all duration-200', open ? 'opacity-100' : 'pointer-events-none -translate-y-1 opacity-0')}>
                  {['Acme', 'Side project', '+ New project'].map((p, i) => (
                    <div key={p} className={cn('rounded-md px-2.5 py-1.5', i === 0 && t >= 20 ? 'bg-white/[0.07] text-white' : 'text-white/65', i === 2 && 'text-accent/90')}>{p}</div>
                  ))}
                </div>
              </div>
              <ul className="mt-5 w-[300px] space-y-1.5 text-[11.5px] leading-relaxed text-white/50">
                <li><b className="font-medium text-white/75">On its own:</b> read, templates, contacts, test sends.</li>
                <li><b className="font-medium text-white/75">Asks you first:</b> real sends, broadcasts, keys, deleting.</li>
              </ul>
              <div className="mt-5 flex w-[300px] gap-2">
                <span className="flex h-9 flex-1 items-center justify-center rounded-lg border border-white/[0.1] text-[13px] text-white/70">Cancel</span>
                <span className={cn('flex h-9 flex-1 items-center justify-center rounded-lg border border-accent bg-accent text-[13px] font-medium text-black transition-transform', t >= 34 && t < 38 && 'scale-95')}>Allow</span>
              </div>
            </div>
            <div className={cn('absolute inset-0 flex flex-col items-center justify-center gap-3 transition-all duration-500', connected ? 'opacity-100' : 'pointer-events-none translate-y-2 opacity-0')}>
              <span className={cn('flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300', connected && 'animate-[docs-pop_0.4s_ease-out]')}>
                <Check className="h-6 w-6" />
              </span>
              <p className="text-[17px] font-medium text-white">Claude is connected</p>
              <p className="text-[12.5px] text-white/45">Go back to Claude. It can use 23 Forke Mail tools in the project Acme.</p>
            </div>
          </div>
        </Window>
        <MiniCursor x={cursor[0]} y={cursor[1]} press={(t >= 12 && t < 14) || (t >= 22 && t < 24) || (t >= 34 && t < 38)} show={t >= 6 && t < 50} />
      </Stage>
    </div>
  )
}

// ---------------------------------------------------------------- verifying a domain

const RECORDS = [
  ['CNAME', 'abc123._domainkey', 'abc123.dkim.amazonses.com'],
  ['CNAME', 'def456._domainkey', 'def456.dkim.amazonses.com'],
  ['CNAME', 'ghi789._domainkey', 'ghi789.dkim.amazonses.com'],
  ['TXT', '@', 'v=spf1 include:amazonses.com ~all'],
  ['TXT', '_dmarc', 'v=DMARC1; p=none;'],
]

export function DomainDemo() {
  const [ref, t] = useTimeline(96)
  const found = (i: number) => t >= 16 + i * 6
  const verified = t >= 50
  return (
    <div ref={ref}>
      <Stage w={760} h={430} label="A domain's DNS records being found one by one until the domain is verified">
        <Window url="mail.forke.space/domains" className="inset-x-10 top-6 bottom-6">
          <div className="h-[calc(100%-36px)] p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[17px] font-medium text-white">acme.com</span>
                {verified ? <Badge tone="green">Verified</Badge> : <Badge tone="amber">Pending</Badge>}
              </div>
              <span className={cn('flex h-8 items-center gap-1.5 rounded-lg border border-white/[0.1] bg-white/[0.03] px-3 text-[12px] text-white/75 transition-transform', t >= 9 && t < 12 && 'scale-95')}>
                {t >= 11 && t < 46 ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}Check now
              </span>
            </div>
            <p className="mt-1.5 text-[12px] text-white/40">Add these records at your DNS provider. In Cloudflare, set them to DNS only.</p>
            <div className="mt-4 overflow-hidden rounded-lg border border-white/[0.08]">
              <div className="grid grid-cols-[70px_150px_1fr_86px] bg-white/[0.025] px-3 py-2 text-[11px] font-medium text-white/45">
                <span>Type</span><span>Name</span><span>Value</span><span>Status</span>
              </div>
              {RECORDS.map(([ty, name, value], i) => (
                <div key={i} className="grid grid-cols-[70px_150px_1fr_86px] items-center border-t border-white/[0.05] px-3 py-2.5 font-mono text-[11.5px]">
                  <span className="text-white/50">{ty}</span>
                  <span className="truncate text-white/80">{name}</span>
                  <span className="truncate pr-3 text-white/55">{value}</span>
                  <span>{found(i) ? <Badge tone="green">Found</Badge> : t >= 11 ? <Badge tone="neutral">Checking</Badge> : <Badge tone="neutral">Missing</Badge>}</span>
                </div>
              ))}
            </div>
            <div className={show(verified, 'mt-4 flex items-center gap-2.5 rounded-lg border border-emerald-400/20 bg-emerald-400/[0.06] px-3.5 py-2.5 text-[12.5px] text-emerald-200/90')}>
              <CircleCheck className="h-4 w-4" /> acme.com is verified. You can now send from any address on it, like hi@acme.com.
            </div>
          </div>
        </Window>
        <MiniCursor x={at([[0, 560], [5, 622]], t)} y={at([[0, 380], [5, 87]], t)} press={t >= 9 && t < 12} show={t >= 3 && t < 18} />
      </Stage>
    </div>
  )
}

// ---------------------------------------------------------------- an email's life, and the webhooks you get

const EVENTS = [
  { at: 4, icon: Send, label: 'Queued', time: '09:41:07.12', hook: 'email.queued' },
  { at: 12, icon: Server, label: 'Sent', time: '09:41:07.53', hook: 'email.sent' },
  { at: 22, icon: Mail, label: 'Delivered', time: '09:41:09.80', hook: 'email.delivered' },
  { at: 38, icon: Eye, label: 'Opened', time: '09:52:31', hook: 'email.opened' },
  { at: 52, icon: MousePointerClick, label: 'Clicked', time: '09:52:44', hook: 'email.clicked' },
]

export function LifecycleDemo() {
  const [ref, t] = useTimeline(90)
  const shown = EVENTS.filter((e) => t >= e.at)
  const last = shown[shown.length - 1]
  return (
    <div ref={ref}>
      <Stage w={760} h={420} label="An email moving from queued to sent, delivered, opened and clicked, with a webhook for each step">
        <Window url="mail.forke.space/transactional" className="top-7 bottom-7 left-8 w-[360px]">
          <div className="p-5">
            <p className="text-[11px] text-white/40">To ada@example.com</p>
            <p className="mt-0.5 text-[15px] font-medium text-white">Your receipt</p>
            <ol className="relative mt-5 space-y-3.5">
              <span className="absolute top-2 bottom-2 left-[13px] w-px bg-white/[0.08]" />
              {EVENTS.map((e) => (
                <li key={e.label} className={show(t >= e.at, 'relative flex items-center gap-3')}>
                  <span className="z-10 flex h-[27px] w-[27px] items-center justify-center rounded-full border border-white/[0.1] bg-[#1c1b1a] text-white/70">
                    <e.icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-[13px] text-white/85">{e.label}</span>
                  <span className="ml-auto font-mono text-[11px] text-white/35">{e.time}</span>
                </li>
              ))}
            </ol>
          </div>
        </Window>
        <Window title="Your server · POST /webhooks/forke-mail" dark className="top-7 right-8 bottom-7 w-[330px]">
          <div className="flex h-[calc(100%-36px)] flex-col p-4 font-mono text-[11px]">
            <div className="space-y-1.5">
              {shown.map((e) => (
                <div key={e.hook} className="flex animate-[docs-in_0.3s_ease-out] items-center gap-2">
                  <span className="text-sky-300/80">POST</span>
                  <span className="text-white/75">{e.hook}</span>
                  <span className="ml-auto text-emerald-300/90">200</span>
                </div>
              ))}
            </div>
            {last ? (
              <pre key={last.hook} className="mt-auto animate-[docs-in_0.3s_ease-out] overflow-hidden rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-[10.5px] leading-[1.6] text-white/55">
                {`Webhook-Signature: v1=4f9c…
{
  "type": "${last.hook}",
  "created_at": "2026-11-24T${last.time.slice(0, 8)}Z",
  "data": {
    "message_id": "5f1c2e7a…",
    "message_type": "transactional"
  }
}`}
              </pre>
            ) : null}
          </div>
        </Window>
      </Stage>
    </div>
  )
}
