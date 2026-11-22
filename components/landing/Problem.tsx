/**
 * @fileoverview Forke Platform
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

import FitScale from './FitScale'
import type { ReactNode } from 'react'
import { BlurWords, Painting, Reveal, Section } from './primitives'
import { InvoiceLoop, ProposalLoop, ReviewLoop } from './ProblemLoops'

function Card({
  title,
  body,
  painting,
  position,
  children,
  delay,
}: {
  title: string
  body: string
  painting: string
  position?: string
  children: ReactNode
  delay: number
}) {
  return (
    <Reveal delay={delay} className="h-full">
      <div className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-white/[0.07] bg-[#1c1b1a] p-2 transition-transform duration-500 hover:-translate-y-1">
        <div className="px-4 pb-5 pt-4">
          <p className="text-[17px] font-medium text-ink">{title}</p>
          <p className="mt-1 text-[15px] leading-6 text-white/45">{body}</p>
        </div>
        <FitScale width={355} grow className="mt-auto">
        <Painting src={painting} position={position} className="h-[250px] rounded-[14px]">
          <div className="float-layer absolute -bottom-6 -right-10 left-7 top-9 overflow-hidden rounded-xl pointer-events-none select-none border border-white/15 bg-[#0d0d0f]/95 shadow-[0_24px_60px_rgba(0,0,0,0.6)] backdrop-blur">
            {/* pad by the 40px bleed so right-aligned content ends at the visible edge */}
            <div className="pr-10">{children}</div>
          </div>
        </Painting>
        </FitScale>
      </div>
    </Reveal>
  )
}

export default function Problem() {
  return (
    <Section id="problem">
      <div className="px-6 pt-20 sm:px-12 sm:pt-28">
        <h2 className="max-w-[640px] text-[34px] font-medium leading-[1.08] tracking-[-0.03em] sm:text-[44px]">
          <BlurWords text="Easy to start freelancing." className="block text-ink" />
          <BlurWords text="Hard to get paid after." className="block text-white/40" delay={200} />
        </h2>
        <Reveal className="mt-6 max-w-[560px] text-[17px] leading-7 text-white/50">
          You learned to code to build things. Then came the platforms. Every gig needs a proposal, every pull request
          sits unreviewed, and every payout waits on an invoice someone forgot to approve.
        </Reveal>
      </div>

      <div className="grid gap-4 px-4 pb-20 pt-14 sm:px-6 sm:pb-28 md:grid-cols-3">
        <Card
          delay={0}
          painting="/paintings/ember-field.webp"
          title="Every gig is a proposal."
          body="A two-hour fix means a cover letter, a bid war and a week of silence."
        >
          <ProposalLoop />
        </Card>

        <Card
          delay={100}
          painting="/paintings/dusk-sky.webp"
          title="“Did anyone even review this?”"
          body="Your pull request sits in a queue while the issue goes stale."
        >
          <ReviewLoop />
        </Card>

        <Card
          delay={200}
          painting="/paintings/golden-path.webp"
          title="Payouts take weeks."
          body="Net-30, then a reminder, then a currency fee nobody mentioned."
        >
          <InvoiceLoop />
        </Card>
      </div>
    </Section>
  )
}
