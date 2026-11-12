import { Section } from './primitives'

const SUPPORTERS = [
  { name: '20Rev', href: 'https://20rev.com/?source=forke.space', logo: '/partners/20rev.svg', h: 'h-7 sm:h-8' },
  { name: 'VIT University, Vellore', href: 'https://vit.ac.in/', logo: '/partners/vit.svg', h: 'h-9 sm:h-10' },
]

/**
 * Backers strip, placed straight under the hero the way most product sites show
 * social proof. Logos are flattened to one tone so they sit quietly on the dark page,
 * and brighten on hover.
 */
export default function SupportedBy() {
  return (
    <Section>
      <div className="flex flex-col items-center gap-4 px-6 py-7 sm:py-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/35">Supported by</p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {SUPPORTERS.map((s) => (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.name}
              title={s.name}
              className="opacity-50 transition-opacity duration-300 hover:opacity-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.logo} alt={s.name} className={`${s.h} w-auto brightness-0 invert`} />
            </a>
          ))}
        </div>
      </div>
    </Section>
  )
}
