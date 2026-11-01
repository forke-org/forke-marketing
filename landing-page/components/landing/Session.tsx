/**
 * @fileoverview Forke Platform
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

import React from 'react'
import { Section, Eyebrow, H2 } from './primitives'
import Terminal from './Terminal'
import Reveal from './Reveal'

/**
 * The whole product in one typed terminal session — claim → checks → merge →
 * UPI payout. Sits on the blueprint grid so the artifact reads like a spec.
 */
export default function Session({ n = '002' }: { n?: string }) {
  return (
    <Section className="relative overflow-hidden px-5 pt-16 pb-20 md:px-10 md:pt-24 md:pb-28 lg:pb-32">
      <div aria-hidden className="ui-grid-soft absolute inset-0" />

      <div className="relative mx-auto w-full flex flex-col items-center">
        <Reveal>
          <div className="flex justify-center">
            <Eyebrow n={n} label="one session" />
          </div>
          <H2 accent="merges." className="text-center">
            Money moves when code
          </H2>
        </Reveal>

        <Reveal delay={140} className="mt-12 w-full flex justify-center">
          {/* Proportional Scaling Wrapper for all screen widths */}
          <div 
            style={{ 
              width: `calc(672px * var(--term-scale))`, 
              height: `calc(365px * var(--term-scale))` 
            }} 
            className="relative overflow-hidden shrink-0"
          >
            <div 
              style={{ 
                transform: `scale(var(--term-scale))`, 
                transformOrigin: 'top left',
                width: '672px',
                height: '365px'
              }}
              className="absolute left-0 top-0"
            >
              <Terminal />
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
