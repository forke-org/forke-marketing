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

import React, { useRef, useState, useEffect } from 'react'
import { Cpu, Sparkles, Gauge, UserCheck } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Section, H2 } from './primitives'
import Reveal from './Reveal'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * The review system as a 3D blueprint — an isometric scene built entirely in
 * CSS: a floating PR chip in the center, four extruded gate tiles around it,
 * dashed connectors and slow spinner rings.
 */

const GATES = [
  {
    n: '01',
    code: '01 checks',
    sub: 'ci',
    icon: Cpu,
    title: 'Machines check it',
    copy: 'Build, tests, lint, scope and a security scan run the moment you submit. Broken code never reaches a human.',
  },
  {
    n: '02',
    code: '02 ai review',
    sub: 'llm',
    icon: Sparkles,
    title: 'AI reads the diff',
    copy: 'An AI reviewer scores the work against the task spec, flags anything off, and writes a plain-English summary.',
  },
  {
    n: '03',
    code: '03 risk score',
    sub: '0–100',
    icon: Gauge,
    title: 'Risk gets scored',
    copy: 'Track record and how critical the task is decide how much extra scrutiny a submission needs.',
  },
  {
    n: '04',
    code: '04 owner approves',
    sub: '✓',
    icon: UserCheck,
    title: 'A human approves',
    copy: 'The owner reads the verdict — not the code — and clicks approve. The merge and the payout are automatic.',
  },
]

/** An extruded isometric tile: stable hit-target to prevent flicker, rich 3D lighting on hover */
function Tile({
  className = '',
  width,
  label,
  sub,
  accent = false,
  isHovered = false,
  onMouseEnter,
  onMouseLeave,
}: {
  className?: string
  width: number
  label: string
  sub?: string
  accent?: boolean
  isHovered?: boolean
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void
  onMouseLeave?: () => void
}) {
  return (
    <div
      className={`absolute cursor-pointer select-none ${className}`}
      style={{
        width,
        transformStyle: 'preserve-3d',
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* base plate (extrusion shadow) */}
      <div
        className={`absolute inset-0 rounded-lg border transition-colors duration-200 ${
          isHovered
            ? 'border-accent/50 bg-[#0a0704]'
            : 'border-white/[0.07] bg-[#050505]'
        }`}
        style={{ transform: 'translateZ(-14px)' }}
      />
      {/* top face — stationary hit area with luminous visual glow */}
      <div
        className={`relative flex items-center gap-2.5 rounded-lg border px-4 py-3 transition-all duration-200 ${
          isHovered
            ? 'border-accent bg-[#140e08] shadow-[0_0_35px_rgba(255,122,0,0.45),inset_0_0_15px_rgba(255,122,0,0.15)] scale-[1.03]'
            : accent
            ? 'border-accent/40 bg-[#0c0a08] shadow-[0_0_30px_rgba(255,122,0,0.15)]'
            : 'border-white/[0.14] bg-[#08080a] hover:border-white/30'
        }`}
        style={{ transform: isHovered ? 'translateZ(10px)' : 'translateZ(0px)' }}
      >
        <span
          className={`font-mono text-[11px] font-medium tracking-wide transition-colors duration-200 ${
            isHovered
              ? 'text-accent font-semibold'
              : accent
              ? 'text-accent'
              : 'text-white/75'
          }`}
        >
          {label}
        </span>
        {sub && (
          <span
            className={`ml-auto font-mono text-[9px] transition-colors duration-200 ${
              isHovered ? 'text-accent font-medium' : 'text-white/30'
            }`}
          >
            {sub}
          </span>
        )}
      </div>
    </div>
  )
}

/** Oval capability pill, like the reference blueprint. */
function Pill({ className = '', label }: { className?: string; label: string }) {
  return (
    <div
      className={`absolute rounded-full border border-white/[0.12] bg-[#060608]/80 px-5 py-2.5 font-mono text-[10px] tracking-[0.08em] text-white/45 ${className}`}
    >
      {label}
    </div>
  )
}

/** Dashed connector drawn on the plane. */
function Connector({ className = '', length, vertical = false }: { className?: string; length: number; vertical?: boolean }) {
  return (
    <div
      aria-hidden
      className={`absolute ${vertical ? 'ui-flow-line-v w-px' : 'ui-flow-line h-px'} ${className}`}
      style={vertical ? { height: length } : { width: length }}
    />
  )
}

/** Slow elliptical spinner ring, as seen on the reference board. */
function SpinnerRing({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute ${className}`}>
      <div className="ui-iso-spin h-9 w-9 rounded-full border-2 border-white/[0.08] border-t-accent/80" />
    </div>
  )
}

interface TooltipPosition {
  cardX: number
  cardBottomY: number
  tileX: number
  tileTopY: number
}

function BlueprintScene() {
  const sceneRef = useRef<HTMLDivElement>(null)
  const cameraRef = useRef<HTMLDivElement>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [tooltipPos, setTooltipPos] = useState<TooltipPosition | null>(null)
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Scroll-tied parallax on camera
  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      gsap.fromTo(
        cameraRef.current,
        { yPercent: 8, rotateX: 6 },
        {
          yPercent: -6,
          rotateX: -4,
          ease: 'none',
          scrollTrigger: {
            trigger: sceneRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        }
      )
    },
    { scope: sceneRef }
  )

  const handleTileEnter = (idx: number, e: React.MouseEvent<HTMLDivElement>) => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current)
      leaveTimerRef.current = null
    }
    const sceneEl = sceneRef.current
    if (sceneEl) {
      const tileRect = e.currentTarget.getBoundingClientRect()
      const sceneRect = sceneEl.getBoundingClientRect()
      const tileX = tileRect.left - sceneRect.left + tileRect.width / 2
      const tileTopY = tileRect.top - sceneRect.top

      // 32px leader string between the card bottom and button top
      const STRING_LENGTH = 32
      const cardBottomY = tileTopY - STRING_LENGTH

      // Clamp cardX to prevent the card (width ~300px) from overflowing screen bounds
      const halfWidth = 150
      const cardX = Math.max(halfWidth + 12, Math.min(sceneRect.width - halfWidth - 12, tileX))

      setTooltipPos({
        cardX,
        cardBottomY,
        tileX,
        tileTopY,
      })
    }
    setHoveredIndex(idx)
  }

  const handleTileLeave = () => {
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current)
    leaveTimerRef.current = setTimeout(() => {
      setHoveredIndex(null)
      setTooltipPos(null)
    }, 120)
  }

  useEffect(() => {
    return () => {
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current)
    }
  }, [])

  return (
    <div
      ref={sceneRef}
      className="relative mx-auto h-[360px] sm:h-[480px] md:h-[560px] lg:h-[620px] w-full max-w-5xl select-none overflow-visible"
    >
      {/* Perspective camera */}
      <div
        ref={cameraRef}
        className="absolute inset-0 will-change-transform"
        style={{ perspective: '1400px', perspectiveOrigin: '50% 30%' }}
      >
        {/* The isometric drawing plane (centered slightly lower to give ample top headroom for cards 02 & 03) */}
        <div
          className="absolute left-1/2 top-1/2 h-[680px] w-[680px] origin-center [--blueprint-scale:scale(0.65)] sm:[--blueprint-scale:scale(0.88)] md:[--blueprint-scale:scale(1.16)] lg:[--blueprint-scale:scale(1.26)]"
          style={{
            transform: 'translate(-50%, -46%) rotateX(57deg) rotateZ(-45deg) var(--blueprint-scale)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Dashed blueprint grid */}
          <div className="ui-iso-grid absolute inset-0" />

          {/* ── Center: the submission chip — stacked plates, floating ────── */}
          <div className="ui-iso-float absolute left-1/2 top-1/2" style={{ transformStyle: 'preserve-3d' }}>
            {/* deepest plate */}
            <div
              className="absolute -left-[110px] -top-[110px] h-[220px] w-[220px] rounded-xl border border-white/[0.09] bg-[#050505]"
              style={{ transform: 'translateZ(0px)' }}
            />
            {/* middle plate with edge details */}
            <div
              className="absolute -left-[96px] -top-[96px] h-[192px] w-[192px] rounded-xl border border-white/[0.13] bg-[#070708]"
              style={{ transform: 'translateZ(26px)' }}
            />
            {/* top plate with the wordmark */}
            <div
              className="absolute -left-[80px] -top-[80px] flex h-[160px] w-[160px] items-center justify-center rounded-xl border border-accent/50 bg-[#0a0806] shadow-[0_0_60px_rgba(255,122,0,0.25)]"
              style={{ transform: 'translateZ(52px)' }}
            >
              <span className="text-4xl font-semibold tracking-[-0.04em] text-white">
                forke<span className="text-accent">*</span>
              </span>
            </div>
            {/* glow pool under the stack */}
            <div
              className="absolute -left-[130px] -top-[130px] h-[260px] w-[260px] rounded-full bg-accent/[0.08] blur-[40px]"
              style={{ transform: 'translateZ(-6px)' }}
            />
          </div>

          {/* ── Connectors from the chip to the gates ─────────────────────── */}
          <Connector className="left-[150px] top-[339px]" length={120} />
          <Connector className="right-[150px] top-[339px]" length={120} />
          <Connector className="left-[339px] top-[140px]" length={130} vertical />
          <Connector className="left-[339px] bottom-[140px]" length={130} vertical />

          {/* ── Gate tiles (extruded & interactive) ───────────────────────── */}
          <Tile
            className="left-[10px] top-[316px]"
            width={150}
            label="01 checks"
            sub="ci"
            isHovered={hoveredIndex === 0}
            onMouseEnter={(e) => handleTileEnter(0, e)}
            onMouseLeave={handleTileLeave}
          />
          <Tile
            className="left-[262px] top-[60px]"
            width={160}
            label="02 ai review"
            sub="llm"
            accent
            isHovered={hoveredIndex === 1}
            onMouseEnter={(e) => handleTileEnter(1, e)}
            onMouseLeave={handleTileLeave}
          />
          <Tile
            className="right-[0px] top-[316px]"
            width={150}
            label="03 risk score"
            sub="0–100"
            isHovered={hoveredIndex === 2}
            onMouseEnter={(e) => handleTileEnter(2, e)}
            onMouseLeave={handleTileLeave}
          />
          <Tile
            className="left-[256px] bottom-[58px]"
            width={170}
            label="04 owner approves"
            sub="✓"
            accent
            isHovered={hoveredIndex === 3}
            onMouseEnter={(e) => handleTileEnter(3, e)}
            onMouseLeave={handleTileLeave}
          />

          {/* ── Capability pills around the board ─────────────────────────── */}
          <Pill className="left-[30px] top-[140px]" label="build · tests · lint" />
          <Pill className="right-[16px] top-[150px]" label="escrow locked" />
          <Pill className="left-[60px] bottom-[120px]" label="scope guard" />
          <Pill className="right-[40px] bottom-[110px]" label="verdict card" />

          {/* ── Spinner rings — work in progress on the board ─────────────── */}
          <SpinnerRing className="left-[210px] top-[235px]" />
          <SpinnerRing className="right-[205px] bottom-[230px]" />
        </div>
      </div>

      {/* Soft vignette so the scene melts into the page (pointer-events-none to let hover through) */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 65% 60% at 50% 50%, transparent 60%, #050505 98%)',
        }}
      />

      {/* Dotted String Connector + Anchor Pin in Glowing Orange */}
      {hoveredIndex !== null && tooltipPos && (
        <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible z-40">
          <defs>
            <filter id="orange-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#FF7A00" floodOpacity="0.85" />
            </filter>
          </defs>
          {/* Orange Dotted String Leader Line */}
          <line
            x1={tooltipPos.cardX}
            y1={tooltipPos.cardBottomY}
            x2={tooltipPos.tileX}
            y2={tooltipPos.tileTopY}
            stroke="#FF7A00"
            strokeWidth="2"
            strokeDasharray="4 3"
            strokeLinecap="round"
            filter="url(#orange-glow)"
          />
          {/* Top connection bead at card bottom */}
          <circle cx={tooltipPos.cardX} cy={tooltipPos.cardBottomY} r="2.5" fill="#FF7A00" />
          {/* Bottom anchor pin bead resting on the button */}
          <circle cx={tooltipPos.tileX} cy={tooltipPos.tileTopY} r="4" fill="#FF7A00" filter="url(#orange-glow)" />
          <circle cx={tooltipPos.tileX} cy={tooltipPos.tileTopY} r="1.5" fill="#FFFFFF" />
        </svg>
      )}

      {/* 2D Native HD Hover Card — Always shows ABOVE button, zero blur, zero flicker */}
      {hoveredIndex !== null && tooltipPos && (
        <div
          className="pointer-events-none absolute z-50 transition-all duration-200 ease-out animate-in fade-in zoom-in-95"
          style={{
            left: `${tooltipPos.cardX}px`,
            top: `${tooltipPos.cardBottomY}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="w-[280px] sm:w-[320px] rounded-xl border border-accent/50 bg-[#090806]/95 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.85),0_0_30px_rgba(255,122,0,0.25)] backdrop-blur-md">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-accent/20 text-accent font-mono text-[10.5px] font-bold">
                {GATES[hoveredIndex].n}
              </span>
              <h4 className="text-[13.5px] font-semibold text-white tracking-tight">
                {GATES[hoveredIndex].title}
              </h4>
            </div>
            <p className="text-[12px] leading-relaxed text-white/75 font-normal">
              {GATES[hoveredIndex].copy}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ReviewSystem({ n }: { n?: string } = {}) {
  return (
    <Section id="review" className="relative overflow-hidden px-5 pt-16 pb-20 md:px-10 md:pt-24 md:pb-28">
      <div className="relative">
        <Reveal className="text-center">
          <H2 accent="payout." className="mt-0 text-center">
            Four gates before every
          </H2>
        </Reveal>

        {/* The blueprint — scaled up for prominent visibility with HD interactive hover tooltips */}
        <Reveal delay={150}>
          <div className="mt-12 md:mt-16">
            <BlueprintScene />
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
