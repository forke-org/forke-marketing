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

import React, { useRef, useState } from 'react'
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
 * dashed connectors and slow spinner rings. Labels stay on-plane like a real
 * isometric technical drawing.
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

/** An extruded isometric tile: a dim base plate with a raised top face. */
function Tile({
  className = '',
  width,
  label,
  sub,
  accent = false,
  gate,
  isHovered = false,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: {
  className?: string
  width: number
  label: string
  sub?: string
  accent?: boolean
  gate?: (typeof GATES)[0]
  isHovered?: boolean
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  onClick?: () => void
}) {
  return (
    <div
      className={`absolute cursor-pointer transition-transform duration-300 ${className}`}
      style={{
        width,
        transformStyle: 'preserve-3d',
        transform: isHovered ? 'translateZ(14px)' : 'translateZ(0px)',
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {/* base plate (extrusion shadow) */}
      <div
        className={`absolute inset-0 rounded-lg border transition-colors duration-300 ${
          isHovered
            ? 'border-accent/40 bg-[#080503]'
            : 'border-white/[0.07] bg-[#050505]'
        }`}
        style={{ transform: 'translateZ(-14px)' }}
      />
      {/* top face */}
      <div
        className={`relative flex items-center gap-2.5 rounded-lg border px-4 py-3 transition-all duration-300 ${
          isHovered
            ? 'border-accent bg-[#120d08] shadow-[0_0_35px_rgba(255,122,0,0.35)]'
            : accent
            ? 'border-accent/40 bg-[#0c0a08] shadow-[0_0_30px_rgba(255,122,0,0.15)]'
            : 'border-white/[0.14] bg-[#08080a] hover:border-white/30'
        }`}
      >
        <span
          className={`font-mono text-[11px] font-medium tracking-wide transition-colors duration-300 ${
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
            className={`ml-auto font-mono text-[9px] transition-colors duration-300 ${
              isHovered ? 'text-accent/80' : 'text-white/30'
            }`}
          >
            {sub}
          </span>
        )}
      </div>

      {/* 3D Billboard Floating Tooltip on Hover */}
      {isHovered && gate && (
        <div
          className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-[260px] sm:w-[280px] rounded-xl border border-accent/50 bg-[#0a0806]/95 p-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.85),0_0_30px_rgba(255,122,0,0.25)] backdrop-blur-md z-50 text-left"
          style={{
            transform: 'rotateZ(45deg) rotateX(-57deg) translateZ(35px)',
            transformOrigin: 'bottom center',
          }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-accent/20 text-accent font-mono text-[10px] font-bold">
              {gate.n}
            </span>
            <h4 className="text-[12px] font-semibold text-white tracking-tight truncate">
              {gate.title}
            </h4>
          </div>
          <p className="text-[11px] leading-relaxed text-white/70 font-normal">
            {gate.copy}
          </p>
        </div>
      )}
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

function BlueprintScene({
  hoveredIndex,
  onHoverGate,
  onClickGate,
}: {
  hoveredIndex: number | null
  onHoverGate: (index: number | null) => void
  onClickGate: (index: number) => void
}) {
  const sceneRef = useRef<HTMLDivElement>(null)
  const cameraRef = useRef<HTMLDivElement>(null)

  // Scroll-tied parallax: the blueprint board lifts and tilts toward you as the
  // section scrolls through, so the static iso scene gains depth on scroll. Only
  // the camera wrapper moves — the intricate board transform below is untouched.
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

  return (
    <div
      ref={sceneRef}
      className="relative mx-auto h-[340px] sm:h-[460px] md:h-[540px] lg:h-[600px] w-full max-w-5xl select-none"
    >
      {/* Perspective camera */}
      <div ref={cameraRef} className="absolute inset-0 will-change-transform" style={{ perspective: '1400px', perspectiveOrigin: '50% 30%' }}>
        {/* The isometric drawing plane */}
        <div
          className="absolute left-1/2 top-1/2 h-[680px] w-[680px] origin-center [--blueprint-scale:scale(0.65)] sm:[--blueprint-scale:scale(0.88)] md:[--blueprint-scale:scale(1.16)] lg:[--blueprint-scale:scale(1.26)]"
          style={{
            transform: 'translate(-50%, -54%) rotateX(57deg) rotateZ(-45deg) var(--blueprint-scale)',
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
            gate={GATES[0]}
            isHovered={hoveredIndex === 0}
            onMouseEnter={() => onHoverGate(0)}
            onMouseLeave={() => onHoverGate(null)}
            onClick={() => onClickGate(0)}
          />
          <Tile
            className="left-[262px] top-[60px]"
            width={160}
            label="02 ai review"
            sub="llm"
            accent
            gate={GATES[1]}
            isHovered={hoveredIndex === 1}
            onMouseEnter={() => onHoverGate(1)}
            onMouseLeave={() => onHoverGate(null)}
            onClick={() => onClickGate(1)}
          />
          <Tile
            className="right-[0px] top-[316px]"
            width={150}
            label="03 risk score"
            sub="0–100"
            gate={GATES[2]}
            isHovered={hoveredIndex === 2}
            onMouseEnter={() => onHoverGate(2)}
            onMouseLeave={() => onHoverGate(null)}
            onClick={() => onClickGate(2)}
          />
          <Tile
            className="left-[256px] bottom-[58px]"
            width={170}
            label="04 owner approves"
            sub="✓"
            accent
            gate={GATES[3]}
            isHovered={hoveredIndex === 3}
            onMouseEnter={() => onHoverGate(3)}
            onMouseLeave={() => onHoverGate(null)}
            onClick={() => onClickGate(3)}
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
    </div>
  )
}

export default function ReviewSystem({ n }: { n?: string } = {}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const activeGate = GATES[hoveredIndex !== null ? hoveredIndex : activeIndex]

  return (
    <Section id="review" className="relative overflow-hidden px-5 pt-16 pb-20 md:px-10 md:pt-24 md:pb-28">
      <div className="relative">
        <Reveal className="text-center">
          <H2 accent="payout." className="mt-0 text-center">
            Four gates before every
          </H2>
        </Reveal>

        {/* The blueprint — scaled up for prominent visibility */}
        <Reveal delay={150}>
          <div className="mt-8 md:mt-12">
            <BlueprintScene
              hoveredIndex={hoveredIndex}
              onHoverGate={setHoveredIndex}
              onClickGate={setActiveIndex}
            />
          </div>
        </Reveal>

        {/* Interactive Gate Inspection HUD Card */}
        <Reveal delay={250} className="mt-6 md:mt-8 flex justify-center">
          <div className="w-full max-w-2xl rounded-2xl border border-white/[0.08] bg-[#08080a]/90 p-5 sm:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-md">
            {/* Gate selector pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 pb-4 border-b border-white/[0.06]">
              {GATES.map((gate, i) => {
                const isCurrent = (hoveredIndex !== null ? hoveredIndex : activeIndex) === i
                return (
                  <button
                    key={gate.n}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    onMouseEnter={() => {
                      setHoveredIndex(i)
                      setActiveIndex(i)
                    }}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-[11px] sm:text-[11.5px] transition-all duration-200 cursor-pointer ${
                      isCurrent
                        ? 'border border-accent/50 bg-accent/15 text-accent shadow-[0_0_15px_rgba(255,122,0,0.18)] font-medium scale-[1.02]'
                        : 'border border-white/[0.08] bg-white/[0.03] text-white/55 hover:text-white/90 hover:bg-white/[0.06]'
                    }`}
                  >
                    <gate.icon className="w-3.5 h-3.5" />
                    <span>{gate.code}</span>
                  </button>
                )
              })}
            </div>

            {/* Gate details display */}
            <div className="pt-4 flex flex-col sm:flex-row sm:items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/[0.08] text-accent shadow-[0_0_20px_rgba(255,122,0,0.12)]">
                {React.createElement(activeGate.icon, { className: 'h-5 w-5', strokeWidth: 1.8 })}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10.5px] uppercase tracking-wider text-accent font-medium">
                    Gate {activeGate.n}
                  </span>
                  <span className="text-white/20">·</span>
                  <span className="font-mono text-[10.5px] text-white/40 uppercase">
                    {activeGate.sub}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight mt-0.5">
                  {activeGate.title}
                </h3>
                <p className="mt-1 text-[13px] sm:text-[13.5px] text-white/60 leading-relaxed font-normal">
                  {activeGate.copy}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
