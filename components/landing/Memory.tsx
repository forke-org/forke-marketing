'use client'

import { BlurWords, Reveal, Section } from './primitives'
import ProfileTour from './ProfileTour'

/*
 * DEV ID: every merge lands on a public, verified Forke profile. Shown as a looping tour of the real profile page,
 * resting on a painting like the rest of the page. The tour keeps the desktop frame at every screen size.
 */

export default function Memory() {
  return (
    <Section>
      <div className="px-6 pt-16 sm:px-12 sm:pt-24">
        <h2 className="text-[34px] font-medium leading-[1.08] tracking-[-0.03em] sm:text-[44px]">
          <BlurWords text="A profile that proves" className="block text-ink" />
          <BlurWords text="what you've shipped." className="block text-white/40" delay={200} />
        </h2>
        <Reveal className="mt-6 max-w-[560px] text-[17px] leading-7 text-white/50">
          Every merge lands on your DEV ID: a public, verified record of your level, ID card, stack, ratings and paid work.
          It&rsquo;s the portfolio that gets you bigger bounties, so no more cover letters.
        </Reveal>
      </div>

      <div className="px-4 pb-16 pt-12 sm:px-6 sm:pb-24">
        <ProfileTour />
      </div>
    </Section>
  )
}
