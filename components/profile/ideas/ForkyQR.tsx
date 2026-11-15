// TEMPORARY (idea preview): a QR code drawn in the Forky loader's line style. Not for commit yet.
import QRCode from 'qrcode'
import { LOADER_SHAPES } from '@/components/loader/forky-loader-data'

type Style = 'dots' | 'pills' | 'squares'

/**
 * Scannable QR with rounded modules, loader-style corner "eyes" and the line-drawn
 * Forky in the middle. Error correction is H (30%), so the centre can be cleared.
 */
export default function ForkyQR({
  value,
  size = 200,
  fg = '#f0e3de',
  accent = '#FF7A00',
  bg = 'transparent',
  variant = 'dots',
  frame = false,
}: {
  value: string
  size?: number
  fg?: string
  accent?: string
  bg?: string
  variant?: Style
  /** dashed frame with corner ticks, like the loader's drawing frame */
  frame?: boolean
}) {
  const qr = QRCode.create(value, { errorCorrectionLevel: 'H' })
  const n = qr.modules.size
  const on = (x: number, y: number) => x >= 0 && y >= 0 && x < n && y < n && qr.modules.data[y * n + x] === 1

  const inEye = (x: number, y: number) => (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7)
  // clear a centred square for the mascot (odd width so it sits on the grid)
  const hole = Math.floor(n * 0.3) | 1
  const h0 = (n - hole) / 2
  const inHole = (x: number, y: number) => x >= h0 && x < h0 + hole && y >= h0 && y < h0 + hole

  const cells: React.ReactNode[] = []
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (!on(x, y) || inEye(x, y) || inHole(x, y)) continue
      if (variant === 'pills') {
        // vertical runs merge into one rounded pill
        if (on(x, y - 1) && !inEye(x, y - 1) && !inHole(x, y - 1)) continue
        let len = 1
        while (on(x, y + len) && !inEye(x, y + len) && !inHole(x, y + len)) len++
        cells.push(<rect key={`${x}-${y}`} x={x + 0.14} y={y + 0.08} width={0.72} height={len - 0.16} rx={0.36} fill={fg} />)
      } else if (variant === 'squares') {
        cells.push(<rect key={`${x}-${y}`} x={x + 0.08} y={y + 0.08} width={0.84} height={0.84} rx={0.22} fill={fg} />)
      } else {
        cells.push(<circle key={`${x}-${y}`} cx={x + 0.5} cy={y + 0.5} r={0.4} fill={fg} />)
      }
    }
  }

  const eye = (ex: number, ey: number) => (
    <g key={`${ex}-${ey}`}>
      <rect x={ex + 0.5} y={ey + 0.5} width={6} height={6} rx={2} fill="none" stroke={fg} strokeWidth={1} />
      <rect x={ex + 2} y={ey + 2} width={3} height={3} rx={1} fill={accent} />
    </g>
  )

  const m = LOADER_SHAPES.mascot
  const pad = 0.9
  const box = hole - pad * 2
  const k = Math.min(box / m.w, box / m.h)
  const mx = h0 + (hole - m.w * k) / 2
  const my = h0 + (hole - m.h * k) / 2
  const q = frame ? 3 : 1 // quiet zone, in modules

  return (
    <svg width={size} height={size} viewBox={`${-q} ${-q} ${n + q * 2} ${n + q * 2}`} role="img" aria-label="QR code to this Forke profile" style={{ background: bg, display: 'block' }}>
      {frame && (
        <>
          <rect x={-q + 0.6} y={-q + 0.6} width={n + q * 2 - 1.2} height={n + q * 2 - 1.2} rx={2.4} fill="none" stroke="rgba(240,227,222,0.22)" strokeWidth={0.18} strokeDasharray="0.6 0.9" />
          {[
            [-q + 0.6, -q + 0.6, 1, 1],
            [n + q - 0.6, -q + 0.6, -1, 1],
            [-q + 0.6, n + q - 0.6, 1, -1],
            [n + q - 0.6, n + q - 0.6, -1, -1],
          ].map(([cx, cy, sx, sy], i) => (
            <path key={i} d={`M${cx} ${cy + sy * 3.2}V${cy + sy * 2.4}a${2.4} ${2.4} 0 0 ${sx * sy > 0 ? 1 : 0} ${sx * 2.4} ${-sy * 2.4}H${cx + sx * 3.2}`} fill="none" stroke={accent} strokeWidth={0.32} strokeLinecap="round" />
          ))}
        </>
      )}
      {cells}
      {eye(0, 0)}
      {eye(n - 7, 0)}
      {eye(0, n - 7)}
      {/* the loader's Forky, line-drawn */}
      <g transform={`translate(${mx} ${my - m.top * k}) scale(${k})`} fill="none" strokeLinecap="round" strokeLinejoin="round">
        {m.parts.map((p: { d: string; accent?: boolean }, i: number) => (
          <path key={i} d={p.d} stroke={i === 0 ? accent : fg} strokeWidth={i === 0 ? 0.42 / k : 0.3 / k} />
        ))}
      </g>
    </svg>
  )
}
