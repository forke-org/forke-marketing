import type { ReactNode } from 'react'
import { Clock, MessageSquare, Paperclip } from 'lucide-react'
import { RiGithubFill } from '@remixicon/react'
import { BlurWords, Painting, Reveal, Section } from './primitives'

function Card({
  title,
  body,
  painting,
  position,
  children,
  delay,
}: {
  title: string
  body: string
  painting: string
  position?: string
  children: ReactNode
  delay: number
}) {
  return (
    <Reveal delay={delay} className="h-full">
      <div className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-white/[0.07] bg-[#1c1b1a] p-2 transition-transform duration-500 hover:-translate-y-1">
        <div className="px-4 pb-5 pt-4">
          <p className="text-[17px] font-medium text-ink">{title}</p>
          <p className="mt-1 text-[15px] leading-6 text-white/45">{body}</p>
        </div>
        <Painting src={painting} position={position} className="mt-auto h-[250px] rounded-[14px]">
          <div className="float-layer absolute -bottom-6 -right-10 left-7 top-9 overflow-hidden rounded-xl border border-white/15 bg-[#0d0d0f]/95 shadow-[0_24px_60px_rgba(0,0,0,0.6)] backdrop-blur">
            {/* pad by the 40px bleed so right-aligned content ends at the visible edge */}
            <div className="pr-10">{children}</div>
          </div>
        </Painting>
      </div>
    </Reveal>
  )
}

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

export default function Problem() {
  return (
    <Section id="problem" corners={false}>
      <div className="px-6 pt-20 sm:px-12 sm:pt-28">
        <h2 className="max-w-[640px] text-[34px] font-medium leading-[1.08] tracking-[-0.03em] sm:text-[44px]">
          <BlurWords text="Easy to start freelancing." className="block text-ink" />
          <BlurWords text="Hard to get paid after." className="block text-white/40" delay={200} />
        </h2>
        <Reveal className="mt-6 max-w-[560px] text-[17px] leading-7 text-white/50">
          You learned to code to build things. Then came the platforms. Every gig needs a proposal, every pull request
          sits unreviewed, and every payout waits on an invoice someone forgot to approve.
        </Reveal>
      </div>

      <div className="grid gap-4 px-4 pb-20 pt-14 sm:px-6 sm:pb-28 md:grid-cols-3">
        <Card
          delay={0}
          painting="/paintings/ember-field.jpg"
          title="Every gig is a proposal."
          body="A two-hour fix means a cover letter, a bid war and a week of silence."
        >
          <WindowBar label="Proposal · Freelance site" />
          <div className="space-y-2 p-3 text-[11px]">
            <p className="font-medium text-white/85">Re: Fix checkout bug (React)</p>
            <p className="leading-4 text-white/45">
              Hi! I have 6 years of experience and would love to help. Please find my portfolio attached…
            </p>
            <p className="flex items-center gap-1 text-white/35">
              <Paperclip className="h-3 w-3" /> portfolio_final_v3.pdf
            </p>
            <div className="flex items-center justify-between rounded-md bg-white/[0.04] px-2 py-1.5 text-white/45">
              <span>47 other proposals</span>
              <span className="text-red-300/80">Not viewed</span>
            </div>
          </div>
        </Card>

        <Card
          delay={100}
          painting="/paintings/dusk-sky.jpg"
          title="“Did anyone even review this?”"
          body="Your pull request sits in a queue while the issue goes stale."
        >
          <WindowBar label="github.com · pull request" />
          <div className="space-y-2.5 p-3 text-[11px]">
            <p className="flex items-center gap-1.5 font-medium text-white/85">
              <RiGithubFill className="h-3.5 w-3.5" /> fix: handle null session on refresh #318
            </p>
            <div className="flex gap-2">
              <span className="h-5 w-5 shrink-0 rounded-full bg-gradient-to-br from-amber-300 to-accent" />
              <div>
                <p className="text-white/70">
                  you <span className="text-white/35">commented 9 days ago</span>
                </p>
                <p className="text-white/45">Friendly ping — any chance someone can take a look?</p>
              </div>
            </div>
            <p className="flex items-center gap-1.5 text-white/35">
              <MessageSquare className="h-3 w-3" /> 0 reviews · awaiting maintainer
            </p>
          </div>
        </Card>

        <Card
          delay={200}
          painting="/paintings/golden-path.jpg"
          title="Payouts take weeks."
          body="Net-30, then a reminder, then a currency fee nobody mentioned."
        >
          <WindowBar label="Invoice #2026-114" />
          <div className="space-y-2 p-3 text-[11px]">
            {[
              ['Invoice sent', '2 Oct'],
              ['Reminder sent', '1 Nov'],
              ['Second reminder', '9 Nov'],
            ].map(([a, b]) => (
              <div key={a} className="flex justify-between text-white/55">
                <span>{a}</span>
                <span className="text-white/35">{b}</span>
              </div>
            ))}
            <div className="flex items-center justify-between rounded-md border border-amber-400/20 bg-amber-400/[0.06] px-2 py-1.5">
              <span className="font-mono text-white/80">₹18,000</span>
              <span className="flex items-center gap-1 text-amber-300">
                <Clock className="h-3 w-3" /> Pending · 38 days
              </span>
            </div>
          </div>
        </Card>
      </div>
    </Section>
  )
}
