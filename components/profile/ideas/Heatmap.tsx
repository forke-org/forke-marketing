/**
 * @fileoverview Forke Platform
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

// TEMPORARY: GitHub-style contribution graph in Forke ember tones. Not for commit.
import { demoHeatmap } from './demo'

export const EMBER_SCALE = ['rgba(240,227,222,0.06)', '#4a2306', '#8a4004', '#d06000', '#FF8A1F']
const MONTHS = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']

export default function Heatmap({
  cell = 11,
  gap = 3,
  weeks = 53,
  labels = true,
  legend = true,
  shape = 'square',
}: {
  cell?: number
  gap?: number
  weeks?: number
  labels?: boolean
  legend?: boolean
  shape?: 'square' | 'dot'
}) {
  const data = demoHeatmap().slice(53 - weeks)
  const step = cell + gap
  const w = weeks * step - gap
  const h = 7 * step - gap
  const left = labels ? 26 : 0
  const top = labels ? 16 : 0
  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${w + left} ${h + top}`} className="block h-auto w-full" role="img" aria-label="Contribution activity">
        {labels &&
          MONTHS.map((m, i) => (
            <text key={m} x={left + i * (w / 12)} y={10} fill="rgba(255,255,255,0.35)" fontSize={9} fontFamily="var(--font-geist-mono), monospace">
              {m}
            </text>
          ))}
        {labels &&
          ['Mon', 'Wed', 'Fri'].map((d, i) => (
            <text key={d} x={0} y={top + (1 + i * 2) * step + cell - 2} fill="rgba(255,255,255,0.3)" fontSize={9} fontFamily="var(--font-geist-mono), monospace">
              {d}
            </text>
          ))}
        {data.map((week, wi) =>
          week.map((v, di) =>
            shape === 'dot' ? (
              <circle key={`${wi}-${di}`} cx={left + wi * step + cell / 2} cy={top + di * step + cell / 2} r={cell / 2} fill={EMBER_SCALE[v]} />
            ) : (
              <rect key={`${wi}-${di}`} x={left + wi * step} y={top + di * step} width={cell} height={cell} rx={2.5} fill={EMBER_SCALE[v]} />
            ),
          ),
        )}
      </svg>
      {legend && (
        <div className="mt-3 flex items-center justify-end gap-1.5 font-mono text-[11px] text-white/35">
          Less
          {EMBER_SCALE.map((c) => (
            <span key={c} className="h-[10px] w-[10px] rounded-[2px]" style={{ background: c }} />
          ))}
          More
        </div>
      )}
    </div>
  )
}
