/**
 * @fileoverview Forke Platform
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

// TEMPORARY: lanyard card face ideas (380×536, same size as the 3D card's HTML faces). Not for commit.
import ForkyQR from './ForkyQR'
import { BadgeCheck, ScanLine } from 'lucide-react'
import { DEMO } from './demo'

const W = 380
const H = 536
const sans = 'var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif'
const mono = 'var(--font-geist-mono), ui-monospace, monospace'
const url = `forke.space/${DEMO.username}`

function Face({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      style={{ width: W, height: H, fontFamily: sans, ...style }}
      className={`relative flex select-none flex-col overflow-hidden rounded-[28px] shadow-[0_30px_70px_rgba(0,0,0,0.6)] ${className}`}
    >
      {/* slot punch for the lanyard clip */}
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

/* ─────────────────────────── 1 · Access pass ─────────────────────────── */

export function PassFront() {
  return (
    <Face className="bg-[#0d0b0a]">
      <div className="relative h-[300px] shrink-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/paintings/ember-field.webp" alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={DEMO.avatarUrl} alt="" className="absolute bottom-0 left-1/2 h-[250px] w-[250px] -translate-x-1/2 rounded-t-[125px] object-cover grayscale" style={{ maskImage: 'linear-gradient(180deg,#000 70%,transparent)', WebkitMaskImage: 'linear-gradient(180deg,#000 70%,transparent)' }} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,11,10,0.55)_0%,transparent_30%,transparent_60%,#0d0b0a_100%)]" />
        <div className="absolute inset-x-0 top-7 flex items-center justify-between px-6">
          <Mark className="text-white" />
          <span className="rounded-full border border-white/25 bg-black/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white backdrop-blur-md" style={{ fontFamily: mono }}>
            Access · Dev
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col px-6 pt-1">
        <h2 className="text-[40px] font-medium leading-[0.98] tracking-[-0.045em] text-white">
          Riya
          <br />
          <span className="text-white/45">Sharma</span>
        </h2>
        <p className="mt-2 text-[15px] text-[#FFA347]">@{DEMO.username}</p>
        <div className="mt-auto grid grid-cols-3 border-t border-white/12 py-3.5" style={{ fontFamily: mono }}>
          {[
            ['Level', String(DEMO.level).padStart(2, '0')],
            ['Rank', DEMO.levelTitle],
            ['ID', DEMO.id],
          ].map(([k, v]) => (
            <div key={k}>
              <p className="text-[9.5px] uppercase tracking-[0.14em] text-white/35">{k}</p>
              <p className="mt-0.5 text-[13px] text-white/90">{v}</p>
            </div>
          ))}
        </div>
      </div>
      {/* perforation + barcode stub */}
      <div className="relative flex items-center px-4">
        <span className="absolute -left-3 h-6 w-6 rounded-full bg-[#151414]" />
        <span className="h-px flex-1 border-t border-dashed border-white/15" />
        <span className="absolute -right-3 h-6 w-6 rounded-full bg-[#151414]" />
      </div>
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex h-8 items-stretch gap-[2px]">
          {Array.from({ length: 38 }, (_, i) => (
            <span key={i} className={i % 2 ? 'bg-transparent' : 'bg-white/75'} style={{ width: 1 + ((i * 7 + 3) % 4) }} />
          ))}
        </div>
        <span className="text-[11px] text-white/35" style={{ fontFamily: mono }}>{url}</span>
      </div>
    </Face>
  )
}

export function PassBack() {
  return (
    <Face className="bg-[#0d0b0a]">
      <div className="flex items-center justify-between px-6 pb-4 pt-8">
        <Mark className="text-white" />
        <span className="text-[11px] uppercase tracking-[0.16em] text-white/40" style={{ fontFamily: mono }}>Verify</span>
      </div>
      <div className="mx-6 flex flex-col items-center rounded-[22px] border border-white/10 bg-[radial-gradient(80%_70%_at_50%_0%,rgba(255,122,0,0.16),transparent_70%)] px-4 pb-5 pt-6">
        <ForkyQR value={`https://www.${url}`} size={250} />
        <p className="mt-4 flex items-center gap-1.5 text-[12px] text-white/55">
          <ScanLine className="h-3.5 w-3.5 text-[#FF7A00]" /> Scan to see verified work
        </p>
      </div>
      <p className="mt-6 px-6 text-[26px] font-medium tracking-[-0.03em] text-white">@{DEMO.username}</p>
      <p className="mt-auto px-6 pb-6 text-[11px] leading-4 text-white/30" style={{ fontFamily: mono }}>
        If found, it belongs to {url}
      </p>
    </Face>
  )
}

/* ─────────────────────────── 2 · Blueprint ID ─────────────────────────── */

const grid =
  '[background-image:linear-gradient(rgba(255,163,71,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,163,71,0.08)_1px,transparent_1px),linear-gradient(rgba(240,227,222,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(240,227,222,0.035)_1px,transparent_1px)] [background-size:60px_60px,60px_60px,12px_12px,12px_12px]'

function Tape({ text }: { text: string }) {
  return (
    <div className="relative mt-7 h-6 shrink-0 overflow-hidden bg-[repeating-linear-gradient(-45deg,#FF7A00_0_10px,#1a0f05_10px_20px)]">
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-[#141110] px-2 text-[10px] uppercase tracking-[0.18em] text-[#FFA347]" style={{ fontFamily: mono }}>
        {text}
      </span>
    </div>
  )
}

function TitleBlock({ rows, cols = 2 }: { rows: [string, string][]; cols?: 2 | 4 }) {
  return (
    <dl className={`grid ${cols === 4 ? 'grid-cols-4' : 'grid-cols-2'} border border-[rgba(255,163,71,0.35)] text-[10px]`} style={{ fontFamily: mono }}>
      {rows.map(([k, v], i) => (
        <div key={k} className={`px-2.5 py-1.5 ${i % cols ? 'border-l border-[rgba(255,163,71,0.35)]' : ''} ${i >= cols ? 'border-t border-[rgba(255,163,71,0.35)]' : ''}`}>
          <dt className="uppercase tracking-[0.12em] text-white/35">{k}</dt>
          <dd className="mt-0.5 text-[12px] text-[#FFA347]">{v}</dd>
        </div>
      ))}
    </dl>
  )
}

function Crop({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative p-2.5">
      {[
        'left-0 top-0',
        'right-0 top-0',
        'bottom-0 left-0',
        'bottom-0 right-0',
      ].map((c) => (
        <svg key={c} className={`absolute h-4 w-4 ${c}`} viewBox="0 0 16 16">
          <path d="M8 0V16M0 8H16" stroke="#FF7A00" strokeWidth="1.2" />
        </svg>
      ))}
      {children}
    </div>
  )
}

export function BlueprintFront() {
  return (
    <Face className={`bg-[#141110] ${grid}`}>
      <Tape text="Forke · verified builder · forke.space" />
      <svg className="pointer-events-none absolute -right-4 top-[150px]" width="240" height="210" viewBox="0 0 240 210">
        <text x="236" y="190" textAnchor="end" fill="rgba(255,122,0,0.06)" stroke="rgba(255,163,71,0.35)" strokeWidth="1.2" fontFamily="var(--font-geist-sans)" fontWeight="600" fontSize="230" letterSpacing="-12">
          {String(DEMO.level).padStart(2, '0')}
        </text>
      </svg>
      <div className="relative px-6 pt-5">
        <div className="flex items-center justify-between">
          <Mark className="text-white" />
          <span className="text-[10px] uppercase tracking-[0.16em] text-white/40" style={{ fontFamily: mono }}>Sheet 1 / 2</span>
        </div>
        <div className="mt-5 flex items-end gap-4">
          <Crop>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={DEMO.avatarUrl} alt="" className="block h-[150px] w-[150px] object-cover grayscale" />
          </Crop>
          <div className="pb-2 text-[10px] leading-4 text-white/40" style={{ fontFamily: mono }}>
            <span className="text-[#FFA347]">← 150 →</span>
            <br />
            portrait
            <br />
            scale 1:1
          </div>
        </div>
        <h2 className="mt-5 text-[34px] font-medium leading-none tracking-[-0.04em] text-white">Riya Sharma</h2>
        <p className="mt-2 text-[13px] text-white/55" style={{ fontFamily: mono }}>@{DEMO.username} · {DEMO.levelTitle}</p>
      </div>
      <div className="relative mt-auto px-6 pb-6">
        <TitleBlock rows={[['Level', String(DEMO.level).padStart(2, '0')], ['XP', DEMO.xp.toLocaleString('en-IN')], ['ID', DEMO.id], ['Issued', DEMO.joined]]} />
      </div>
    </Face>
  )
}

export function BlueprintBack() {
  return (
    <Face className={`bg-[#141110] ${grid}`}>
      <Tape text="Scan · verify · hire" />
      <div className="flex items-center justify-between px-6 pt-5">
        <Mark className="text-white" />
        <span className="text-[10px] uppercase tracking-[0.16em] text-white/40" style={{ fontFamily: mono }}>Sheet 2 / 2</span>
      </div>
      <div className="mt-6 flex flex-col items-center">
        <svg width="280" height="14" viewBox="0 0 280 14" className="mb-1">
          <path d="M2 7H278" stroke="rgba(255,163,71,0.7)" />
          <path d="M2 7l7-4v8zM278 7l-7-4v8z" fill="rgba(255,163,71,0.7)" />
        </svg>
        <Crop>
          <div className="bg-[#141110] p-2">
            <ForkyQR value={`https://www.${url}`} size={244} variant="squares" />
          </div>
        </Crop>
      </div>
      <div className="mt-auto px-6 pb-6">
        <TitleBlock rows={[['Scan to', 'verify'], ['Profile', `@${DEMO.username}`]]} />
      </div>
    </Face>
  )
}

/* ─────────────────────────── 3 · Ember holo ─────────────────────────── */

const CHARS = ' .:-=+*x#%@'
function asciiRows(cols: number, rows: number, seed = 3) {
  let s = seed
  const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
  return Array.from({ length: rows }, (_, y) =>
    Array.from({ length: cols }, () => {
      const heat = Math.max(0, (y / rows) * 1.25 - 0.25 + (r() - 0.5) * 0.5)
      return CHARS[Math.min(CHARS.length - 1, Math.floor(heat * CHARS.length))]
    }).join(''),
  )
}

function Ascii({ className = '' }: { className?: string }) {
  return (
    <pre
      aria-hidden
      className={`pointer-events-none absolute inset-0 m-0 overflow-hidden whitespace-pre text-[11px] leading-[13px] ${className}`}
      style={{
        fontFamily: mono,
        background: 'linear-gradient(180deg,#3a1404 0%,#a03a02 45%,#FF7A00 75%,#FFD9A8 100%)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
      }}
    >
      {asciiRows(56, 42).join('\n')}
    </pre>
  )
}

function Holo({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-flex items-center gap-1 overflow-hidden rounded-full px-2.5 py-1 text-[11px] font-medium text-black">
      <span className="absolute inset-0 bg-[conic-gradient(from_200deg,#ffd9a8,#ff7a00,#ffb3c7,#a8e0ff,#ffd9a8)]" />
      <span className="relative flex items-center gap-1">{children}</span>
    </span>
  )
}

export function HoloFront() {
  return (
    <Face className="bg-[#0b0604]">
      <Ascii className="opacity-80" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={DEMO.avatarUrl} alt="" className="absolute left-1/2 top-[70px] h-[300px] w-[300px] -translate-x-1/2 rounded-full object-cover grayscale" style={{ maskImage: 'radial-gradient(circle at 50% 45%, #000 52%, transparent 70%)', WebkitMaskImage: 'radial-gradient(circle at 50% 45%, #000 52%, transparent 70%)' }} />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,6,4,0.6)_0%,transparent_22%,transparent_50%,rgba(11,6,4,0.92)_78%)]" />
      <div className="relative flex items-center justify-between px-6 pt-8">
        <Mark className="text-white" />
        <Holo>
          <BadgeCheck className="h-3.5 w-3.5" /> Lvl {DEMO.level}
        </Holo>
      </div>
      <div className="relative mt-auto px-6 pb-7">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[#FFA347]" style={{ fontFamily: mono }}>{DEMO.levelTitle} · {DEMO.shipped} shipped</p>
        <h2 className="mt-2 text-[46px] font-medium leading-[0.95] tracking-[-0.05em] text-white">
          Riya
          <br />
          Sharma
        </h2>
        <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-3 text-[13px]">
          <span className="text-white/60">@{DEMO.username}</span>
          <span className="text-white/35" style={{ fontFamily: mono }}>{DEMO.id}</span>
        </div>
      </div>
    </Face>
  )
}

export function HoloBack() {
  return (
    <Face className="bg-[#0b0604]">
      <Ascii className="opacity-30 [mask-image:linear-gradient(180deg,transparent_45%,#000_90%)]" />
      <div className="relative flex items-center justify-between px-6 pt-8">
        <Mark className="text-white" />
        <Holo>
          <BadgeCheck className="h-3.5 w-3.5" /> Verified
        </Holo>
      </div>
      <div className="relative mx-auto mt-8 rounded-[26px] border border-white/15 bg-black/55 p-5 backdrop-blur-md">
        <ForkyQR value={`https://www.${url}`} size={236} fg="#ffffff" />
      </div>
      <p className="relative mt-5 text-center text-[24px] font-medium tracking-[-0.03em] text-white">@{DEMO.username}</p>
      <p className="relative mt-1 text-center text-[11px] uppercase tracking-[0.2em] text-white/45" style={{ fontFamily: mono }}>Scan for verified work</p>
    </Face>
  )
}

export const CARD_SETS = [
  { key: 'pass', name: 'Access pass', blurb: 'Painted header, a perforated stub and a barcode. Back has a framed QR, three stats and the last 26 weeks of activity.', Front: PassFront, Back: PassBack },
  { key: 'blueprint', name: 'Blueprint ID', blurb: 'The 404 drafting sheet as an ID. Hazard tape, crop marks, the level drafted huge, a title block. Back is sheet 2 with the QR and proof of work.', Front: BlueprintFront, Back: BlueprintBack },
  { key: 'holo', name: 'Ember holo', blurb: 'The hero’s ember ASCII behind a faded portrait, a holographic level chip. Back is a glass QR panel, the streak and the stack.', Front: HoloFront, Back: HoloBack },
]
