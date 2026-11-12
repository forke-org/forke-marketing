'use client'

/**
 * Full-screen "construction drawing" status page (404, error…).
 *
 * The page is laid out like an architect's sheet: a drafting grid, hazard tape across
 * the top, the status code drafted in outline with guide lines and dimension marks
 * (it draws itself in), and a title block in the corner. No mascot art.
 * `redirectAfter` counts down and sends the visitor home (used by the 404 page).
 */
import { useEffect, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/landing/primitives'

const TAPE = 'UNDER CONSTRUCTION · '

function HazardTape({ label }: { label: string }) {
  const text = `${label} · ${TAPE}`.repeat(8)
  return (
    <div className="relative h-8 overflow-hidden border-y border-black/40 bg-[repeating-linear-gradient(-45deg,#FF7A00_0_14px,#1a0f05_14px_28px)]">
      <div className="absolute inset-y-0 left-0 flex items-center">
        <div className="animate-marquee flex shrink-0 whitespace-nowrap">
          {[0, 1].map((k) => (
            <span key={k} className="mx-0 bg-[#151414] px-3 py-0.5 font-mono text-[11px] uppercase tracking-[0.18em] text-accent-text">
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/** The status code drafted in outline, with guide lines, dimension marks and crosses. */
function DraftedCode({ code }: { code: string }) {
  // start drawing only once the Forky boot loader has left, so the visitor sees it happen
  const [draw, setDraw] = useState(false)
  useEffect(() => {
    let id: ReturnType<typeof setInterval> | undefined
    const check = () => {
      if (document.querySelector('.boot-loader')) return
      setDraw(true)
      clearInterval(id)
    }
    id = setInterval(check, 100)
    check()
    return () => clearInterval(id)
  }, [])
  const W = 1040
  const H = 462
  const base = 432 // baseline y
  const cap = 96 // cap height y (Geist caps ≈ 0.71em at 470px)
  const left = 64
  const right = 976
  const cross = (x: number, y: number, k: number) => (
    <path key={k} d={`M${x - 9} ${y}H${x + 9}M${x} ${y - 9}V${y + 9}`} stroke="#FF7A00" strokeWidth={1.2} vectorEffect="non-scaling-stroke" />
  )
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" className="block h-full w-full" role="img" aria-label={code}>
      <defs>
        <marker id="dim-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10z" fill="rgba(255,163,71,0.7)" />
        </marker>
      </defs>

      {/* guide lines: cap height + baseline, overshooting the glyphs */}
      <g stroke="rgba(240,227,222,0.18)" strokeDasharray="4 6" vectorEffect="non-scaling-stroke">
        <line x1="0" y1={cap} x2={W} y2={cap} />
        <line x1="0" y1={base} x2={W} y2={base} />
        <line x1={left} y1="0" x2={left} y2={H} />
        <line x1={right} y1="0" x2={right} y2={H} />
      </g>
      <g fill="rgba(240,227,222,0.35)" fontFamily="var(--font-geist-mono), monospace" fontSize="14">
        <text x={left + 10} y={cap - 8}>cap height</text>
        <text x={left + 10} y={base - 8}>baseline</text>
      </g>

      {/* dimension line across the top */}
      <line x1={left} y1="44" x2={right} y2="44" stroke="rgba(255,163,71,0.7)" strokeWidth="1" markerStart="url(#dim-arrow)" markerEnd="url(#dim-arrow)" vectorEffect="non-scaling-stroke" />
      <rect x={W / 2 - 70} y="31" width="140" height="26" fill="#151414" />
      <text x={W / 2} y="50" textAnchor="middle" fill="#FFA347" fontFamily="var(--font-geist-mono), monospace" fontSize="16">
        route · {code}
      </text>

      {/* the code itself, drawn in */}
      <text
        x={W / 2}
        y={base}
        textAnchor="middle"
        className={draw ? 'drafted-code drawing' : 'drafted-code'}
        fill="none"
        stroke="#f0e3de"
        strokeWidth="2"
        fontFamily="var(--font-geist-sans), sans-serif"
        fontWeight="600"
        fontSize="470"
        letterSpacing="-16"
        vectorEffect="non-scaling-stroke"
      >
        {code}
      </text>

      {/* registration crosses on the guide intersections */}
      {[
        [left, cap],
        [right, cap],
        [left, base],
        [right, base],
      ].map(([x, y], i) => cross(x, y, i))}
    </svg>
  )
}

export default function StatusPage({
  code,
  label,
  title,
  muted,
  children,
  actions,
  status,
  redirectAfter,
}: {
  /** the big drafted code, e.g. "404" */
  code: string
  /** text on the hazard tape */
  label: string
  title: string
  muted?: string
  children?: ReactNode
  actions?: ReactNode
  /** value of the STATUS row in the title block */
  status: string
  redirectAfter?: number
}) {
  const router = useRouter()
  const [left, setLeft] = useState(redirectAfter ?? 0)
  const [paused, setPaused] = useState(false)
  const [today, setToday] = useState('')

  useEffect(() => {
    setToday(new Date().toISOString().slice(0, 10))
  }, [])

  useEffect(() => {
    if (!redirectAfter || paused) return undefined
    if (left <= 0) {
      router.push('/')
      return undefined
    }
    const id = setTimeout(() => setLeft((n) => n - 1), 1000)
    return () => clearTimeout(id)
  }, [left, paused, redirectAfter, router])

  const sheet = [
    ['Project', 'forke.space'],
    ['Sheet', code],
    ['Status', status],
    ['Drawn', 'forke*'],
    ['Date', today || '—'],
    ['Scale', '1 : 1'],
  ]

  return (
    // exactly one screen tall, edge to edge, never scrolls
    <div className="relative isolate flex h-[100svh] flex-col overflow-hidden bg-[#151414]">
      {/* drafting grid: fine 16px + bold 80px, fading out at the edges */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [background-image:linear-gradient(rgba(255,163,71,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,163,71,0.07)_1px,transparent_1px),linear-gradient(rgba(240,227,222,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(240,227,222,0.035)_1px,transparent_1px)] [background-size:80px_80px,80px_80px,16px_16px,16px_16px] [mask-image:radial-gradient(130%_100%_at_50%_45%,#000_50%,transparent)]"
      />

      <HazardTape label={label} />

      <nav className="flex h-14 shrink-0 items-center justify-between px-5 sm:h-16 sm:px-8">
        <Logo />
        <span className="hidden font-mono text-[11.5px] text-white/35 sm:block">{'//'} sheet {code} of the forke.space drawings</span>
      </nav>

      {/* the drawing takes every pixel left between the nav and the bottom bar */}
      <div className="flex min-h-0 flex-1 items-center justify-center px-2 sm:px-6">
        <DraftedCode code={code} />
      </div>

      {/* bottom bar: message + actions on the left, the sheet's title block on the right */}
      <div className="flex shrink-0 flex-col gap-5 border-t border-[rgba(255,163,71,0.18)] bg-[#151414]/80 px-5 py-5 backdrop-blur-sm sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:gap-10 lg:py-6">
        <div className="min-w-0">
          <h1 className="text-[26px] font-medium leading-[1.1] tracking-[-0.03em] sm:text-[34px]">
            <span className="text-white">{title}</span>
            {muted && <span className="text-white/40"> {muted}</span>}
          </h1>
          {children && <div className="mt-2 max-w-[560px] text-[14.5px] leading-6 text-white/55 sm:text-[15.5px]">{children}</div>}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {actions}
            {redirectAfter ? (
              paused ? (
                <span className="text-[13px] text-white/40">Staying here.</span>
              ) : (
                <span className="flex items-center gap-2.5 text-[13px] text-white/45">
                  <span className="relative h-1 w-16 overflow-hidden rounded-full bg-white/[0.08]">
                    <span
                      className="absolute inset-y-0 left-0 rounded-full bg-accent transition-[width] duration-1000 ease-linear"
                      style={{ width: `${(left / redirectAfter) * 100}%` }}
                    />
                  </span>
                  Home in <span className="font-mono tabular-nums text-accent-text">{left}s</span>
                  <button type="button" onClick={() => setPaused(true)} className="underline underline-offset-2 hover:text-white">
                    Stay
                  </button>
                </span>
              )
            ) : null}
          </div>
        </div>

        {/* title block, like the corner of an architectural drawing */}
        <dl className="hidden shrink-0 grid-cols-3 border border-[rgba(255,163,71,0.3)] font-mono text-[10.5px] sm:grid sm:w-[380px]">
          {sheet.map(([k, v], i) => (
            <div key={k} className={`px-3 py-2 ${i % 3 ? 'border-l border-[rgba(255,163,71,0.3)]' : ''} ${i > 2 ? 'border-t border-[rgba(255,163,71,0.3)]' : ''}`}>
              <dt className="uppercase tracking-[0.12em] text-white/35">{k === 'Project' ? 'Help' : k}</dt>
              <dd className="mt-0.5 truncate text-[11.5px] text-accent-text">
                {k === 'Project' ? (
                  <Link href="/contact" className="underline underline-offset-2 hover:text-white">
                    contact
                  </Link>
                ) : (
                  v
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
