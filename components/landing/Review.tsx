import { Check, GitBranch, KeyRound, X } from 'lucide-react'
import { RiGithubFill } from '@remixicon/react'
import { Caption, Eyebrow, Painting, Reveal, ScrambleText, Section } from './primitives'
import type { ReactNode } from 'react'

function Card({ src, children }: { src: string; children: ReactNode }) {
  return (
    <Painting src={src} shade={0.25} className="aspect-[33/32] rounded-2xl border border-white/[0.06]">
      {children}
    </Painting>
  )
}

function IsolationVisual() {
  return (
    <Card src="/paintings/ember-shore.jpg">
      <div className="float-layer absolute left-[-8%] top-[22%] flex w-[96%] items-center justify-between rounded-2xl border border-white/10 bg-[#141417]/90 py-3 pl-[14%] pr-3 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur">
        <span className="font-mono text-[30px] leading-none tracking-[0.25em] text-white/30">******</span>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white/80">
          <KeyRound className="h-5 w-5" />
        </span>
      </div>
      <div className="float-layer absolute -bottom-4 left-[-4%] right-[8%] top-[52%] rounded-tr-2xl border border-white/10 bg-[#111114]/90 backdrop-blur">
        {[
          ['forke/fix-auth-4821', 'Isolated branch'],
          ['forke/dark-mode-311', 'Isolated branch'],
        ].map(([b, s], i) => (
          <div key={b} className={`px-[12%] py-3 ${i ? 'border-t border-white/[0.06]' : ''}`}>
            <p className="flex items-center gap-2 text-[17px] text-white/90">
              <GitBranch className="h-4 w-4 text-accent" /> {b}
            </p>
            <p className="text-[12px] text-white/40">{s}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}

function ApprovalVisual() {
  return (
    <Card src="/paintings/cloud-sea.jpg">
      <div className="float-layer absolute left-[10%] -right-[6%] top-[10%] rounded-xl border border-white/10 bg-[#121215] p-3 pr-[calc(6%+12px)] text-[11px]">
        <p className="flex items-center gap-1.5 text-white/40">
          <RiGithubFill className="h-3.5 w-3.5" /> Pull request · acme/api
        </p>
        <div className="mt-2.5 flex gap-2">
          <span className="h-6 w-6 shrink-0 rounded-full bg-gradient-to-br from-amber-300 to-accent" />
          <div>
            <p className="font-medium text-white/85">
              Maya Chen <span className="font-normal text-white/35">· maintainer</span>
            </p>
            <p className="text-white/50">Looks good, can you double-check the retry cap?</p>
          </div>
        </div>
      </div>
      <div className="float-layer absolute left-[6%] -right-[10%] top-[44%] rounded-xl border border-white/10 bg-[#17171a] p-3 pr-[calc(10%+12px)] shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
        <p className="text-[12.5px] font-medium text-white/90">All checks passed on #482</p>
        <p className="mt-1 text-[11px] leading-4 text-white/45">
          Build, tests and AI review are green. Merge and release the ₹4,500 escrow to the contributor?
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
          <span className="rounded-md bg-accent px-2 py-1 font-medium text-black">Merge &amp; pay</span>
          <span className="rounded-md bg-white/[0.07] px-2 py-1 text-white/80">Request changes</span>
          <span className="px-1 py-1 text-white/40">Custom reply</span>
        </div>
      </div>
    </Card>
  )
}

function AuditVisual() {
  const rows: [string, string, boolean][] = [
    ['build', '26-10-09 12:14', true],
    ['unit-tests', '26-10-09 12:19', true],
    ['lint', '26-10-09 12:19', false],
    ['ai-review', '26-10-10 15:36', true],
    ['security', '26-10-11 09:01', true],
  ]
  return (
    <Card src="/paintings/ember-field.jpg">
      <div className="float-layer absolute -bottom-6 left-[8%] -right-[12%] top-[9%] overflow-hidden rounded-xl border border-white/10 bg-[#101012]/95 pr-[12%] font-mono text-[11.5px]">
        <div className="grid grid-cols-[1fr_1fr_20px] gap-2 bg-white/[0.04] px-3 py-2 text-[10px] text-white/40">
          <span className="pl-7">Check</span>
          <span>Datetime</span>
          <span />
        </div>
        {rows.map(([name, at, ok]) => (
          <div key={name} className="grid grid-cols-[1fr_1fr_20px] items-center gap-2 border-t border-white/[0.05] px-3 py-2.5">
            <span className="flex items-center gap-2 text-white/85">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-white/[0.07] text-[9px] text-white/60">
                {name[0].toUpperCase()}
              </span>
              {name}
            </span>
            <span className="text-white/55">{at}</span>
            {ok ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <X className="h-3.5 w-3.5 text-red-400" />}
          </div>
        ))}
      </div>
    </Card>
  )
}

export default function Review() {
  return (
    <Section>
      <div className="px-6 pt-16 sm:pt-24 md:px-[144px]">
        <Eyebrow>Code review</Eyebrow>
        <h2 className="mt-5 text-[32px] font-[450] leading-[1.1] tracking-[-0.01em] text-ink sm:text-[44px] sm:leading-[48px]">
          Reviews that <ScrambleText text="never sleep" />.
        </h2>
        <p className="mt-6 text-base leading-6 text-white/45">
          Most marketplaces leave pull requests sitting in a queue for days.
          <br className="max-md:hidden" /> Forke runs checks and an AI review first, without exposing private code to
          anyone.
        </p>
      </div>

      <div className="grid gap-8 px-6 pb-16 pt-16 sm:pb-24 md:grid-cols-3 md:gap-4">
        <Reveal>
          <IsolationVisual />
          <Caption title="Secrets stay out of reach">
            Contributors work in isolated Forke branches, never on the owner&rsquo;s repo.
          </Caption>
        </Reveal>
        <Reveal delay={100}>
          <ApprovalVisual />
          <Caption title="Maintainer approval at the edge">
            Merges and payouts always wait for the repo owner&rsquo;s confirmation.
          </Caption>
        </Reveal>
        <Reveal delay={200}>
          <AuditVisual />
          <Caption title="A record of every check">
            Every build, test and review is logged, so you know exactly what ran.
          </Caption>
        </Reveal>
      </div>
    </Section>
  )
}
