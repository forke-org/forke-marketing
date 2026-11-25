/**
 * @fileoverview Forke Platform
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

import Hero from '@/components/landing/Hero'
import { StickyNav } from '@/components/landing/Navbar'
import SupportedBy from '@/components/landing/SupportedBy'
import Problem from '@/components/landing/Problem'
import HowItWorks from '@/components/landing/HowItWorks'
import Capability from '@/components/landing/Capability'
import Memory from '@/components/landing/Memory'
import Matching from '@/components/landing/Matching'
import ReviewSystem from '@/components/landing/ReviewSystem'
import FAQ from '@/components/landing/FAQ'
import FinalCTA from '@/components/landing/FinalCTA'
import Footer from '@/components/landing/Footer'
import { Rails, RailsDecor } from '@/components/landing/primitives'

export default function Home() {
  return (
    <>
      <StickyNav />
      <Hero />
      <main>
        {/* rails fade in under the hero and fade out after the FAQ */}
        <div className="relative isolate pb-10 pt-4 sm:pb-14 sm:pt-6">
          <RailsDecor />
          <Rails>
            <Problem />
            <HowItWorks />
            <Capability />
            <Memory />
            <Matching />
            <ReviewSystem />
            <FAQ />
            <SupportedBy />
          </Rails>
        </div>
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
