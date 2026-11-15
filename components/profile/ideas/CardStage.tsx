// TEMPORARY (idea preview): the live 3D ID card plus the owner's colour / photo choices. Not for commit.
'use client'

import { useEffect, useState } from 'react'
import Lanyard from './Lanyard3'
import { DEMO } from './demo'
import { WAYS, paintBack, paintFoilMask, paintFront, paintStrap, type CardColor, type CardData, type PhotoFilter } from './blockPaint'

const DATA: CardData = {
  first: 'Riya',
  full: DEMO.name,
  username: DEMO.username,
  level: DEMO.level,
  title: DEMO.levelTitle,
  shipped: DEMO.shipped,
  rating: DEMO.rating,
  id: DEMO.id,
  issued: DEMO.joined,
  quote: ['Ships it.', 'Verified.'],
  avatarUrl: DEMO.avatarUrl,
}

const COLORS: { key: CardColor; swatch: string }[] = [
  { key: 'black', swatch: '#151414' },
  { key: 'white', swatch: '#F7EFE9' },
  { key: 'orange', swatch: '#FF7A00' },
]
const FILTERS: { key: PhotoFilter; label: string }[] = [
  { key: 'orange', label: 'Orange' },
  { key: 'bw', label: 'B&W' },
  { key: 'normal', label: 'Original' },
]

type Detector = { detect: (src: CanvasImageSource) => Promise<{ rawValue: string }[]> }

export default function CardStage({
  editable = true,
  height = 470,
  initialColor = 'black',
  initialFilter = 'orange',
}: {
  /** show the colour and photo choices (the profile's owner only) */
  editable?: boolean
  height?: number
  initialColor?: CardColor
  initialFilter?: PhotoFilter
}) {
  const [color, setColor] = useState<CardColor>(initialColor)
  const [filter, setFilter] = useState<PhotoFilter>(initialFilter)
  const [img, setImg] = useState<{ front: string; back: string; strap: string; foil: string } | null>(null)
  const way = WAYS[color]

  useEffect(() => {
    let alive = true
    ;(async () => {
      const [front, back] = await Promise.all([paintFront(way, DATA, filter), paintBack(way, DATA)])
      if (!alive) return
      setImg({
        front: front.toDataURL('image/png'),
        back: back.toDataURL('image/png'),
        strap: paintStrap(way).toDataURL('image/png'),
        foil: paintFoilMask().toDataURL('image/png'),
      })
      // dev self-check: read the QR back off the painted card, full size and phone-photo size
      const BD = (window as unknown as { BarcodeDetector?: new (o: { formats: string[] }) => Detector }).BarcodeDetector
      if (!BD) return
      try {
        const det = new BD({ formats: ['qr_code'] })
        const small = document.createElement('canvas')
        small.width = 260
        small.height = Math.round((260 * back.height) / back.width)
        small.getContext('2d')?.drawImage(back, 0, 0, small.width, small.height)
        const [a, b] = await Promise.all([det.detect(back), det.detect(small)])
        document.documentElement.dataset.qrCheck = `${color}: full=${a[0]?.rawValue ?? 'NOT READ'} small=${b[0]?.rawValue ?? 'NOT READ'}`
      } catch {
        /* detector not available */
      }
    })()
    return () => {
      alive = false
    }
  }, [way, filter, color])

  const chip = 'inline-flex h-8 items-center justify-center rounded-full border px-3 text-[12.5px] transition-colors'
  return (
    <div>
      <div className="relative mx-auto w-full max-w-[340px]" style={{ height }}>
        {img && (
          <Lanyard
            frontImage={img.front}
            backImage={img.back}
            strapImage={img.strap}
            foilImage={img.foil}
            cardColor={way.base}
            strapColor={way.base}
            strapWidth={0.8}
            finish="holographic"
            cornerRadius={0.22}
            size={0.72}
            strapLength={0.3}
            breeze={0.25}
            metal="silver"
          />
        )}
      </div>
      <p className="text-center font-mono text-[11px] text-white/30">drag it · tap to flip</p>
      {editable && (
        <div className="mx-auto mt-4 max-w-[340px] rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3.5 text-left">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[12.5px] text-white/45">Card</span>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  aria-label={`${c.key} card`}
                  aria-pressed={color === c.key}
                  onClick={() => setColor(c.key)}
                  className={`h-8 w-8 rounded-full border-2 transition-shadow ${color === c.key ? 'border-accent shadow-[0_0_0_3px_rgba(255,122,0,0.25)]' : 'border-white/20'}`}
                  style={{ background: c.swatch }}
                />
              ))}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-[12.5px] text-white/45">Photo</span>
            <div className="flex gap-1.5">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  aria-pressed={filter === f.key}
                  onClick={() => setFilter(f.key)}
                  className={`${chip} ${filter === f.key ? 'border-accent bg-accent/15 text-white' : 'border-white/12 text-white/55 hover:text-white'}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
