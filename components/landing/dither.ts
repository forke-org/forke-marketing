/**
 * @fileoverview Forke Platform
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

/** Ordered (Bayer 8×8) dithering into the site's four-colour palette, shared by the navbar's image bentos. */

export const DITHER_PALETTE: [number, number, number][] = [
  [21, 20, 20], // #151414
  [74, 32, 10], // ember
  [255, 122, 0], // #ff7a00
  [240, 227, 222], // cream
]
export const BAYER = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
]
/**
 * Ordered-dither whatever is drawn into `src` (w × h) onto `out`, in the site's palette. Levels are stretched per
 * image first (its own 2nd–99th percentile of brightness), so dark paintings still use the whole palette; pass
 * `stretch = false` for scenes whose brightness is already exact (the globe).
 */
export function dither(src: CanvasRenderingContext2D, out: HTMLCanvasElement, w: number, h: number, stretch = true) {
  const data = src.getImageData(0, 0, w, h)
  const px = data.data
  const n = DITHER_PALETTE.length - 1
  const lum = new Float32Array(w * h)
  const hist = new Uint32Array(256)
  for (let k = 0; k < w * h; k++) {
    const l = (0.2126 * px[k * 4] + 0.7152 * px[k * 4 + 1] + 0.0722 * px[k * 4 + 2]) / 255
    lum[k] = l
    hist[Math.min(255, Math.round(l * 255))]++
  }
  const pct = (q: number) => {
    let acc = 0
    for (let v = 0; v < 256; v++) if ((acc += hist[v]) >= q * w * h) return v / 255
    return 1
  }
  const lo = stretch ? pct(0.02) : 0
  const hi = stretch ? Math.max(lo + 0.05, pct(0.99)) : 1
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const k = y * w + x
      const v = Math.pow(Math.min(1, Math.max(0, (lum[k] - lo) / (hi - lo))), 0.8) * n
      const base = Math.floor(v)
      const level = Math.min(n, base + (v - base > (BAYER[y % 8][x % 8] + 0.5) / 64 ? 1 : 0))
      const [r, g, b] = DITHER_PALETTE[level]
      px[k * 4] = r
      px[k * 4 + 1] = g
      px[k * 4 + 2] = b
      px[k * 4 + 3] = 255
    }
  }
  out.width = w
  out.height = h
  out.getContext('2d')?.putImageData(data, 0, 0)
}

