import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from './primitives'

/**
 * The Forke dashboard look, as in forke-mail/frontend: the tokens and the few pieces the landing page's filmed screens
 * are built from (badges, buttons, cards, stat strips).
 */

export const C = {
  bg: '#151414',
  surface: '#1a1919',
  surface2: '#1e1d1c',
  surface3: '#262423',
  line: 'rgba(240,227,222,0.09)',
  lineStrong: 'rgba(240,227,222,0.16)',
  ink: '#f4f4f5',
  ink2: '#c9c7c5',
  muted: '#8e8e93',
  faint: '#5f5c5a',
}

export type Tone = 'green' | 'blue' | 'amber' | 'accent' | 'neutral'
export const TONE: Record<Tone, string> = {
  green: 'bg-[rgba(74,222,128,0.1)] text-[#4ade80]',
  blue: 'bg-[rgba(96,165,250,0.1)] text-[#60a5fa]',
  amber: 'bg-[rgba(251,191,36,0.1)] text-[#fbbf24]',
  accent: 'bg-[rgba(255,122,0,0.12)] text-[#ffa347]',
  neutral: 'bg-[#262423] text-[#8e8e93]',
}

export function Badge({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span className={cn('inline-flex h-[20px] items-center gap-1.5 whitespace-nowrap rounded-[4px] px-1.5 text-[11px] font-medium', TONE[tone])}>
      <span className="h-1.5 w-1.5 rounded-[1.5px] bg-current" />
      {children}
    </span>
  )
}

export function Primary({ children, icon: Icon, k, pressed, className }: { children: ReactNode; icon?: LucideIcon; k?: string; pressed?: boolean; className?: string }) {
  return (
    <span
      data-k={k}
      className={cn(
        'inline-flex h-8 items-center justify-center gap-1.5 rounded-[6px] bg-[#ff7a00] px-3 text-[12.5px] font-medium text-[#1a0a00] shadow-[0_0_24px_-6px_rgba(255,122,0,0.6)]',
        className,
      )}
      style={{ transform: pressed ? 'scale(0.96)' : 'none', transition: 'transform 120ms' }}
    >
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {children}
    </span>
  )
}

export function Secondary({ children, icon: Icon, className }: { children: ReactNode; icon?: LucideIcon; className?: string }) {
  return (
    <span
      className={cn('inline-flex h-8 items-center justify-center gap-1.5 rounded-[6px] px-3 text-[12.5px] text-[#f4f4f5]', className)}
      style={{ background: C.surface, boxShadow: `inset 0 0 0 1px ${C.lineStrong}` }}
    >
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {children}
    </span>
  )
}

/** A mono group label with the small orange square, as above a page title. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.08em]" style={{ color: C.muted }}>
      <span className="h-1.5 w-1.5 rounded-[1.5px] bg-[#ff7a00]" />
      {children}
    </p>
  )
}

/** A row of stats sharing hairline gaps. */
export function StatStrip({ children, cols, className }: { children: ReactNode; cols: number; className?: string }) {
  return (
    <div
      className={cn('grid gap-px overflow-hidden rounded-[8px]', className)}
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, background: C.line, boxShadow: `0 0 0 1px ${C.line}` }}
    >
      {children}
    </div>
  )
}

export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5 p-3" style={{ background: C.surface }}>
      <span className="text-[11px]" style={{ color: C.muted }}>
        {label}
      </span>
      <span className="text-[20px] font-medium tabular-nums tracking-[-0.03em] text-[#f4f4f5]">{value}</span>
      {hint && (
        <span className="truncate text-[10.5px]" style={{ color: C.muted }}>
          {hint}
        </span>
      )}
    </div>
  )
}
