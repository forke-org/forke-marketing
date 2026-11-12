import type { ReactNode } from 'react'
import { StickyNav } from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import FinalCTA from '@/components/landing/FinalCTA'
import { BlurWords, Rails, RailsDecor, Section } from '@/components/landing/primitives'

/**
 * Frame for every inner page (changelog, blogs, legal…): the always-on nav,
 * the dashed rails behind a 1200px column, and the footer.
 * `ascii` adds the hero-style ASCII texture to the outer gutters; reading pages leave it off.
 * `cta` closes the page with the landing page's "Day one, you claim it" panel.
 */
export default function PageShell({ children, ascii = false, cta = false }: { children: ReactNode; ascii?: boolean; cta?: boolean }) {
  return (
    <>
      <StickyNav always />
      <main>
        <div className={`relative isolate pt-14 ${cta ? 'pb-10 sm:pb-14' : 'pb-32'}`}>
          <RailsDecor ascii={ascii} />
          <Rails>{children}</Rails>
        </div>
        {cta && <FinalCTA />}
      </main>
      <Footer />
    </>
  )
}

/** Big page header: mono eyebrow, two-tone title (white + muted) and an optional lede. */
export function PageHeader({
  eyebrow,
  title,
  muted,
  children,
  aside,
}: {
  eyebrow: string
  title: string
  muted?: string
  children?: ReactNode
  /** right-hand slot on wide screens (counts, buttons…) */
  aside?: ReactNode
}) {
  return (
    <Section>
      <header className="flex flex-col gap-8 px-6 pb-14 pt-20 sm:px-12 sm:pb-16 sm:pt-28 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-[720px]">
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-accent-text">{eyebrow}</p>
          <h1 className="mt-5 text-[38px] font-medium leading-[1.05] tracking-[-0.035em] sm:text-[56px]">
            <span className="text-white">{title}</span>
            {muted && <span className="text-white/40"> {muted}</span>}
          </h1>
          {children && <div className="mt-6 text-[17px] leading-7 text-white/55">{children}</div>}
        </div>
        {aside && <div className="shrink-0">{aside}</div>}
      </header>
    </Section>
  )
}

/** Section heading in the landing style: a white line and a muted line, revealed word by word. */
export function SectionHeading({ title, muted, children, className = '' }: { title: string; muted?: string; children?: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <h2 className="max-w-[640px] text-[32px] font-medium leading-[1.08] tracking-[-0.03em] sm:text-[44px]">
        <BlurWords text={title} className="block text-ink" />
        {muted && <BlurWords text={muted} className="block text-white/40" delay={180} />}
      </h2>
      {children && <p className="mt-5 max-w-[560px] text-[16.5px] leading-7 text-white/50">{children}</p>}
    </div>
  )
}
