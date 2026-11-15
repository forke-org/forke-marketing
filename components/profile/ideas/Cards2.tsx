// TEMPORARY: second round of lanyard card ideas (380×536). Backs are a permanent Forky QR. Not for commit.
import { BadgeCheck } from 'lucide-react'
import { DEMO } from './demo'
import ForkyQR from './ForkyQR'

const W = 380
const H = 536
const sans = 'var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif'
const mono = 'var(--font-geist-mono), ui-monospace, monospace'
const url = `forke.space/${DEMO.username}`
const link = `https://www.${url}`

function Face({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div style={{ width: W, height: H, fontFamily: sans, ...style }} className={`relative flex select-none flex-col overflow-hidden rounded-[28px] shadow-[0_30px_70px_rgba(0,0,0,0.6)] ${className}`}>
      <div className="absolute left-1/2 top-3 z-30 h-[9px] w-[54px] -translate-x-1/2 rounded-full bg-[#050403] shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]" />
      {children}
    </div>
  )
}

function Mark({ className = '' }: { className?: string }) {
  return (
    <span className={`text-[19px] font-semibold tracking-[-0.04em] ${className}`}>
      forke<span className="text-[#FF7A00]">*</span>
    </span>
  )
}

const M = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <span className={className} style={{ fontFamily: mono }}>
    {children}
  </span>
)

/* ───────────── 4 · Sideways: full-bleed portrait, name running up the edge ───────────── */

export function SideFront() {
  return (
    <Face className="bg-[#0d0b0a]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={DEMO.avatarUrl} alt="" className="absolute inset-0 h-full w-full object-cover grayscale contrast-125" />
      <div className="absolute inset-0 bg-[#FF7A00] mix-blend-multiply" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,11,10,0.75)_0%,transparent_26%,transparent_52%,rgba(13,11,10,0.96)_86%)]" />
      <div className="relative flex items-center justify-between px-6 pt-8">
        <Mark className="text-white" />
        <M className="text-[10px] uppercase tracking-[0.16em] text-white/70">{DEMO.id}</M>
      </div>
      <p
        className="absolute right-[-6px] top-[60px] origin-top-right text-[86px] font-semibold leading-none tracking-[-0.06em] text-white/95"
        style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
      >
        RIYA
      </p>
      <div className="relative mt-auto px-6 pb-7">
        <M className="text-[11px] uppercase tracking-[0.18em] text-[#FFA347]">Level {DEMO.level} · {DEMO.levelTitle}</M>
        <h2 className="mt-1.5 text-[34px] font-medium leading-none tracking-[-0.04em] text-white">Riya Sharma</h2>
        <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-3 text-[13px]">
          <span className="text-white/75">@{DEMO.username}</span>
          <span className="flex items-center gap-1 text-white/75">
            <BadgeCheck className="h-4 w-4 text-[#FF7A00]" /> Verified builder
          </span>
        </div>
      </div>
    </Face>
  )
}

export function SideBack() {
  return (
    <Face className="bg-[#FF7A00]">
      <div className="flex items-center justify-between px-6 pt-8 text-[#1a0a00]">
        <span className="text-[19px] font-semibold tracking-[-0.04em]">forke*</span>
        <M className="text-[10px] uppercase tracking-[0.16em]">Scan me</M>
      </div>
      <div className="mx-auto mt-7 rounded-[26px] bg-[#0d0b0a] p-5">
        <ForkyQR value={link} size={236} />
      </div>
      <div className="mt-auto px-6 pb-7 text-[#1a0a00]">
        <p className="text-[40px] font-semibold leading-[0.95] tracking-[-0.05em]">
          Real work.
          <br />
          Verified.
        </p>
        <M className="mt-3 block text-[12px]">{url}</M>
      </div>
    </Face>
  )
}

/* ───────────── 5 · Terminal: whoami ───────────── */

export function TermFront() {
  const rows: [string, string][] = [
    ['name', 'Riya Sharma'],
    ['handle', `@${DEMO.username}`],
    ['level', `${String(DEMO.level).padStart(2, '0')} · ${DEMO.levelTitle}`],
    ['shipped', `${DEMO.shipped} tasks`],
    ['rating', `${DEMO.rating} / 5`],
    ['since', DEMO.joined],
  ]
  return (
    <Face className="bg-[#0b0a0a]" style={{ fontFamily: mono }}>
      <div className="mt-8 flex items-center gap-1.5 border-b border-white/10 px-5 pb-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF7A00]" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="ml-auto text-[11px] text-white/35">forke — id</span>
      </div>
      <div className="px-5 pt-4 text-[13px] leading-6">
        <p className="text-white/45">
          <span className="text-[#FF7A00]">$</span> forke whoami
        </p>
      </div>
      <div className="relative mx-5 mt-3 h-[178px] overflow-hidden rounded-[14px] border border-white/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={DEMO.avatarUrl} alt="" className="h-full w-full object-cover grayscale contrast-150" style={{ objectPosition: '50% 30%' }} />
        <div className="absolute inset-0 bg-[#FF7A00] mix-blend-multiply" />
        <div className="absolute inset-0 [background-image:repeating-linear-gradient(0deg,rgba(0,0,0,0.38)_0_1px,transparent_1px_3px)]" />
        <span className="absolute bottom-2 left-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-[#FFA347]">portrait.png · 400×400</span>
      </div>
      <dl className="mt-4 space-y-[3px] px-5 text-[13px]">
        {rows.map(([k, v]) => (
          <div key={k} className="flex gap-3">
            <dt className="w-[70px] shrink-0 text-white/35">{k}</dt>
            <dd className="truncate text-white/90">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-auto px-5 pb-6 text-[13px] text-white/45">
        <span className="text-[#FF7A00]">$</span> <span className="inline-block h-[15px] w-[8px] translate-y-[2px] bg-[#FF7A00]" />
      </p>
    </Face>
  )
}

export function TermBack() {
  return (
    <Face className="bg-[#0b0a0a]" style={{ fontFamily: mono }}>
      <div className="mt-8 flex items-center gap-1.5 border-b border-white/10 px-5 pb-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF7A00]" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="ml-auto text-[11px] text-white/35">forke — verify</span>
      </div>
      <p className="px-5 pt-4 text-[13px] text-white/45">
        <span className="text-[#FF7A00]">$</span> forke verify @{DEMO.username}
      </p>
      <div className="mx-auto mt-5">
        <ForkyQR value={link} size={262} variant="squares" frame />
      </div>
      <div className="mt-auto space-y-1 px-5 pb-6 text-[12.5px]">
        <p className="text-emerald-400">✓ identity verified</p>
        <p className="text-emerald-400">✓ {DEMO.shipped} merges reviewed</p>
        <p className="text-white/40">→ {url}</p>
      </div>
    </Face>
  )
}

/* ───────────── 6 · Foil: collectible card with a holographic frame ───────────── */

const foil = 'bg-[conic-gradient(from_210deg_at_30%_20%,#ffd9a8,#ff7a00,#ffb3c7,#a8e0ff,#d6ffb8,#ffd9a8,#ff7a00)]'

export function FoilFront() {
  const pct = Math.round((DEMO.xp / DEMO.nextXp) * 100)
  return (
    <Face className={foil}>
      <div className="absolute inset-[9px] flex flex-col overflow-hidden rounded-[20px] bg-[#0f0d0c]">
        <div className="flex items-center justify-between px-4 pb-2.5 pt-6">
          <span className="text-[19px] font-medium tracking-[-0.03em] text-white">Riya Sharma</span>
          <span className="flex items-center gap-1.5">
            <M className="text-[10px] uppercase tracking-[0.14em] text-white/45">Lvl</M>
            <span className="text-[24px] font-semibold leading-none tracking-[-0.04em] text-[#FF7A00]">{DEMO.level}</span>
          </span>
        </div>
        <div className={`mx-4 rounded-[14px] p-[3px] ${foil}`}>
          <div className="relative h-[232px] overflow-hidden rounded-[11px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/paintings/dusk-sky.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={DEMO.avatarUrl} alt="" className="absolute bottom-0 left-1/2 h-[212px] w-[212px] -translate-x-1/2 rounded-t-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_30%,rgba(255,255,255,0.22)_45%,transparent_58%)]" />
          </div>
        </div>
        <div className="mx-4 mt-2.5 flex items-center justify-between rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
          <M className="text-[10.5px] uppercase tracking-[0.14em] text-[#FFA347]">{DEMO.levelTitle} class</M>
          <M className="text-[10.5px] text-white/50">@{DEMO.username}</M>
        </div>
        <div className="mx-4 mt-3 grid grid-cols-3 gap-2 text-center">
          {[
            ['Shipped', String(DEMO.shipped)],
            ['Rating', String(DEMO.rating)],
            ['Streak', `${DEMO.streak}d`],
          ].map(([k, v]) => (
            <div key={k}>
              <p className="text-[22px] font-medium leading-none tracking-[-0.03em] text-white">{v}</p>
              <M className="mt-1 block text-[9px] uppercase tracking-[0.14em] text-white/35">{k}</M>
            </div>
          ))}
        </div>
        <div className="mx-4 mb-4 mt-auto">
          <div className="flex justify-between">
            <M className="text-[9.5px] text-white/40">XP {DEMO.xp.toLocaleString('en-IN')}</M>
            <M className="text-[9.5px] text-white/40">{DEMO.id} · 1st edition</M>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className={`h-full rounded-full ${foil}`} style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
    </Face>
  )
}

export function FoilBack() {
  return (
    <Face className={foil}>
      <div className="absolute inset-[9px] flex flex-col items-center overflow-hidden rounded-[20px] bg-[#0f0d0c]">
        <div className="flex w-full items-center justify-between px-4 pt-6">
          <Mark className="text-white" />
          <M className="text-[10px] uppercase tracking-[0.14em] text-white/40">Collect · verify</M>
        </div>
        <div className={`mt-8 rounded-[30px] p-[3px] ${foil}`}>
          <div className="rounded-[27px] bg-[#0f0d0c] p-5">
            <ForkyQR value={link} size={226} variant="pills" />
          </div>
        </div>
        <p className="mt-6 text-[26px] font-medium tracking-[-0.03em] text-white">@{DEMO.username}</p>
        <M className="mt-1 text-[10.5px] uppercase tracking-[0.2em] text-white/40">Scan for verified work</M>
        <M className="mb-5 mt-auto text-[10px] text-white/25">forke.space · {DEMO.id}</M>
      </div>
    </Face>
  )
}

/* ───────────── 7 · Mono: quiet black card, one huge numeral ───────────── */

export function MonoFront() {
  return (
    <Face className="bg-[#0c0b0b]">
      <div className="absolute inset-0 bg-[radial-gradient(120%_60%_at_100%_0%,rgba(255,122,0,0.16),transparent_60%)]" />
      <div className="relative flex items-center justify-between px-6 pt-8">
        <Mark className="text-white" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={DEMO.avatarUrl} alt="" className="h-[58px] w-[58px] rounded-full border border-white/15 object-cover grayscale" />
      </div>
      <div className="relative px-6 pt-6">
        <M className="text-[10.5px] uppercase tracking-[0.18em] text-white/40">Level</M>
        <p className="-ml-2 text-[230px] font-semibold leading-[0.8] tracking-[-0.08em] text-white">
          {String(DEMO.level).padStart(2, '0')}
        </p>
      </div>
      <div className="relative mt-auto px-6 pb-7">
        <h2 className="text-[30px] font-medium leading-none tracking-[-0.04em] text-white">Riya Sharma</h2>
        <p className="mt-2 text-[14px] text-white/50">{DEMO.levelTitle} · @{DEMO.username}</p>
        <div className="mt-4 flex justify-between border-t border-white/12 pt-3">
          <M className="text-[10.5px] uppercase tracking-[0.14em] text-white/35">{DEMO.id}</M>
          <M className="text-[10.5px] uppercase tracking-[0.14em] text-[#FFA347]">forke.space</M>
        </div>
      </div>
    </Face>
  )
}

export function MonoBack() {
  return (
    <Face className="bg-[#0c0b0b]">
      <div className="absolute inset-0 bg-[radial-gradient(120%_60%_at_0%_100%,rgba(255,122,0,0.16),transparent_60%)]" />
      <div className="relative flex items-center justify-between px-6 pt-8">
        <Mark className="text-white" />
        <M className="text-[10.5px] uppercase tracking-[0.16em] text-white/40">Verify</M>
      </div>
      <div className="relative mx-auto mt-10">
        <ForkyQR value={link} size={274} frame />
      </div>
      <div className="relative mt-auto px-6 pb-7">
        <p className="text-[15px] leading-6 text-white/55">
          Scan to see everything <span className="text-white">@{DEMO.username}</span> has shipped, reviewed and verified on Forke.
        </p>
        <div className="mt-4 flex justify-between border-t border-white/12 pt-3">
          <M className="text-[10.5px] uppercase tracking-[0.14em] text-white/35">{DEMO.id}</M>
          <M className="text-[10.5px] uppercase tracking-[0.14em] text-[#FFA347]">{url}</M>
        </div>
      </div>
    </Face>
  )
}

export const CARD_SETS_2 = [
  { key: 'side', Front: SideFront, Back: SideBack },
  { key: 'term', Front: TermFront, Back: TermBack },
  { key: 'foil', Front: FoilFront, Back: FoilBack },
  { key: 'mono', Front: MonoFront, Back: MonoBack },
]
