import type { ReactNode } from 'react'
import { Check, ChevronDown, Cloud, Folder, FolderOpen, Laptop, Plus, ShieldCheck, ShieldHalf, BookLock, MousePointer2 } from 'lucide-react'
import {
  RiClaudeFill,
  RiGeminiFill,
  RiGithubFill,
  RiGitlabFill,
  RiOpenaiFill,
  RiDeepseekFill,
  RiVercelFill,
  RiSlackFill,
} from '@remixicon/react'
import { Caption, Eyebrow, ForkeMark, Reveal, ScrambleText, Section } from './primitives'

function Tile({ children }: { children: ReactNode }) {
  return (
    <div className="relative aspect-[24/21] overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0d0d0f]">{children}</div>
  )
}

export function WorkspaceVisual() {
  return (
    <Tile>
      <div className="absolute left-4 right-[-20px] top-[24%] flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.03] px-2.5 py-1.5 text-[11px] text-white/35">
        <Plus className="h-3 w-3" /> Search bounties by stack or repo
      </div>
      <div className="absolute left-4 top-[42%] flex gap-2 text-[10.5px]">
        <span className="flex items-center gap-1 rounded-md bg-white/[0.07] px-1.5 py-0.5 text-white/80">
          <Laptop className="h-3 w-3" /> Sandbox <ChevronDown className="h-3 w-3" />
        </span>
        <span className="flex items-center gap-1 px-1 py-0.5 text-white/40">
          <ShieldCheck className="h-3 w-3" /> Scoped <ChevronDown className="h-3 w-3" />
        </span>
      </div>
      <div className="absolute left-4 top-[54%] w-[78%] rounded-lg border border-white/10 bg-[#151518] p-1 shadow-[0_12px_30px_rgba(0,0,0,0.6)]">
        <div className="flex items-start gap-2 rounded-md bg-white/[0.06] px-2 py-1.5">
          <Laptop className="mt-0.5 h-3.5 w-3.5 text-white/80" />
          <div className="flex-1">
            <p className="text-[11.5px] text-white/90">Sandbox</p>
            <p className="text-[9.5px] text-white/40">Isolated container per task</p>
          </div>
          <Check className="h-3.5 w-3.5 text-white/80" />
        </div>
        <div className="flex items-start gap-2 px-2 py-1.5">
          <Cloud className="mt-0.5 h-3.5 w-3.5 text-white/50" />
          <div>
            <p className="text-[11.5px] text-white/70">Your machine</p>
            <p className="text-[9.5px] text-white/35">Clone the branch locally</p>
          </div>
        </div>
      </div>
    </Tile>
  )
}

export function VaultVisual() {
  // Isometric stack of plates — the encrypted vault.
  return (
    <Tile>
      <div className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d]">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 h-[120px] w-[120px] border border-white/15"
            style={{
              transform: `translate(-50%, calc(-50% + ${(i - 1) * 26}px)) rotateX(60deg) rotateZ(45deg)`,
              background:
                i === 0
                  ? 'repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0 2px, transparent 2px 7px), #141417'
                  : 'repeating-linear-gradient(45deg, rgba(255,255,255,0.035) 0 2px, transparent 2px 7px), #101012',
              zIndex: 3 - i,
            }}
          >
            {i === 0 && (
              <div className="flex h-full items-center justify-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/60">
                  <BookLock className="h-5 w-5 -rotate-45" />
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="absolute bottom-[14%] right-[10%] -rotate-[26deg] font-mono text-[9px] tracking-[0.15em] text-white/35">
        AES-256 · VAULT
      </p>
      <p className="absolute left-[8%] top-[52%] rotate-[26deg] font-mono text-[8px] tracking-[0.1em] text-white/20">
        X9MCH2B8POLY1185
      </p>
    </Tile>
  )
}

export function PermissionVisual() {
  return (
    <Tile>
      <div className="absolute left-4 top-3 flex items-center gap-1 rounded-md bg-white/[0.07] px-1.5 py-0.5 text-[10.5px] text-white/80">
        <ShieldCheck className="h-3 w-3" /> Scoped <ChevronDown className="h-3 w-3" />
      </div>
      <div className="absolute right-3 top-2 w-[52%] rounded-md border border-white/10 bg-[#18181b] p-1.5 text-[8.5px] leading-[11px] text-white/60 shadow-lg">
        Can read this repo and push to its Forke branch. Asks before touching other branches.
      </div>
      <div className="absolute left-4 right-6 top-[24%] rounded-lg border border-white/10 bg-[#141417] p-1 text-[11px] shadow-[0_12px_30px_rgba(0,0,0,0.6)]">
        <p className="px-2 pb-0.5 pt-1 text-[9.5px] text-white/35">Repo access</p>
        <p className="flex items-center gap-2 px-2 py-1 text-white/55">
          <BookLock className="h-3 w-3" /> Read only
        </p>
        <p className="relative flex items-center gap-2 rounded-md bg-white/[0.07] px-2 py-1 text-white/90">
          <ShieldCheck className="h-3 w-3" /> Scoped
          <Check className="ml-auto h-3 w-3" />
          <MousePointer2 className="absolute right-6 top-2 h-4 w-4 fill-white text-black" />
        </p>
        <p className="flex items-center gap-2 px-2 py-1 text-white/55">
          <ShieldHalf className="h-3 w-3" /> Full access
        </p>
        <p className="border-t border-white/[0.06] px-2 pb-0.5 pt-1.5 text-[9.5px] text-white/35">Branch</p>
        <p className="flex items-center gap-2 px-2 py-1 text-white/75">
          <FolderOpen className="h-3 w-3" /> Forke branch <Check className="ml-auto h-3 w-3" />
        </p>
        <p className="flex items-center gap-2 px-2 py-1 text-white/55">
          <Folder className="h-3 w-3" /> Choose a branch
        </p>
        <p className="flex items-center gap-2 border-t border-white/[0.06] px-2 py-1.5 text-white/75">
          <ShieldCheck className="h-3 w-3" /> Owner approval
          <span className="ml-auto flex h-3.5 w-6 items-center rounded-full bg-accent p-0.5">
            <span className="ml-auto h-2.5 w-2.5 rounded-full bg-white" />
          </span>
        </p>
      </div>
    </Tile>
  )
}

const ORBIT = [
  <RiGithubFill key="a" className="h-7 w-7" />,
  <RiOpenaiFill key="b" className="h-7 w-7" />,
  <RiGitlabFill key="c" className="h-7 w-7" />,
  <RiClaudeFill key="d" className="h-7 w-7" />,
  <RiVercelFill key="e" className="h-6 w-6" />,
  <RiGeminiFill key="f" className="h-7 w-7" />,
  <RiDeepseekFill key="g" className="h-7 w-7" />,
  <RiSlackFill key="h" className="h-7 w-7" />,
]

export function OrbitVisual() {
  return (
    <Tile>
      <div className="absolute left-1/2 top-1/2 h-[180px] w-[180px] -translate-x-1/2 -translate-y-1/2">
        <div className="absolute inset-0 rounded-full border border-dashed border-white/15" />
        <div className="animate-orbit absolute inset-0">
          {ORBIT.map((icon, i) => {
            const a = (i / ORBIT.length) * Math.PI * 2
            return (
              <div
                key={i}
                className="absolute left-1/2 top-1/2 text-white/45"
                style={{ transform: `translate(-50%,-50%) translate(${Math.cos(a) * 90}px, ${Math.sin(a) * 90}px)` }}
              >
                <div className="animate-orbit-rev">{icon}</div>
              </div>
            )
          })}
        </div>
        <ForkeMark className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-2xl shadow-[0_0_40px_rgba(255,122,0,0.35)]" />
      </div>
    </Tile>
  )
}

export default function Privacy() {
  return (
    <Section className="bg-[linear-gradient(180deg,rgba(255,255,255,0.025),transparent_60%)]">
      <div id="resources" className="px-6 pt-16 text-center sm:pt-24">
        <Eyebrow>Privacy and control</Eyebrow>
        <h2 className="mt-5 text-[32px] font-[450] leading-[1.1] tracking-[-0.01em] text-ink sm:text-[44px] sm:leading-[48px]">
          <ScrambleText text="Private" /> enough to ship real code.
        </h2>
        <p className="mx-auto mt-6 max-w-[540px] text-base leading-7 text-white/45">
          Forke isolates every task, keeps repo secrets protected, and gates merges and payouts for the owner&rsquo;s
          review.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 px-6 pb-24 pt-16 sm:grid-cols-2 sm:pb-40 lg:grid-cols-4 lg:gap-6">
        <Reveal>
          <WorkspaceVisual />
          <Caption title="Isolated by default">
            Every task runs in its own sandbox. Nothing leaks to other contributors.
          </Caption>
        </Reveal>
        <Reveal delay={80}>
          <VaultVisual />
          <Caption title="Encrypted secrets">
            Env vars and tokens are encrypted at rest and never shown to contributors.
          </Caption>
        </Reveal>
        <Reveal delay={160}>
          <PermissionVisual />
          <Caption title="Sandbox with guardrails">
            Forke scopes repo and network access to help keep owners&rsquo; code protected.
          </Caption>
        </Reveal>
        <Reveal delay={240}>
          <OrbitVisual />
          <Caption title="Bring your own stack">
            Work with GitHub or GitLab, and plug in your own AI tools or API keys.
          </Caption>
        </Reveal>
      </div>
    </Section>
  )
}
