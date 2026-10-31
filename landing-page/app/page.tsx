import { Metadata } from 'next'
import Navbar from '@/components/shared/Navbar'
import Hero from '@/components/shared/Hero'
import FirstMerge from '@/components/shared/FirstMerge'
import LevelSystem from '@/components/shared/LevelSystem'
import FAQ from '@/components/shared/FAQ'
import CTA from '@/components/shared/CTA'
import SupportedBy from '@/components/landing/SupportedBy'
import Footer from '@/components/shared/Footer'
import Stats from '@/components/landing/Stats'
import Pipeline from '@/components/landing/Pipeline'
import Session from '@/components/landing/Session'
import Verdict from '@/components/landing/Verdict'
import Proof from '@/components/landing/Proof'
import ReviewSystem from '@/components/landing/ReviewSystem'
import { Rails, Section } from '@/components/landing/primitives'
import Aurora from './Aurora'

export const metadata: Metadata = {
  title: 'Forke — Ship Real Work, Get Paid',
  description: 'The premier micro-task marketplace for developers. Complete coding bounties, level up your engineering skills, and earn rewards for your contributions.',
}

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#050505] overflow-x-hidden">
      {/* Background Aurora */}
      <div 
        className="pointer-events-none overflow-hidden"
        style={{ width: '100%', height: '600px', position: 'absolute', top: 0, left: 0, zIndex: 0 }}
      >
        <Aurora
          colorStops={["#f97316","#f97316","#f97316"]}
          amplitude={1.4}
          blend={0.5}
          height={0.45}
          speed={0.6}
          glow={1.2}
          layers={3}
          mouseInteraction={false}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          {/* Full-bleed cover — hero with Forky + ticker */}
          <Hero />

          {/* Ledger block one — rails dissolve before the video */}
          <Rails fadeBottom>
            <Stats />
            <Pipeline />
            <Session n="002" />
          </Rails>

          {/* Full-bleed brand moment — the video carries its own edge fades */}
          <FirstMerge />

          {/* Ledger block two — rails fade back in, then dissolve before the CTA */}
          <Rails fadeTop fadeBottom>
            <Verdict n="003" flush />
            <Proof n="004" />
            <Section>
              <LevelSystem />
            </Section>
            <ReviewSystem n="006" />
            <FAQ n="007" />
          </Rails>

          <SupportedBy />
          <CTA />
        </main>
        <Footer />
      </div>
    </div>
  )
}
