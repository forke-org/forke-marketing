import { Metadata } from 'next'
import Navbar from '@/components/shared/Navbar'
import Hero from '@/components/shared/Hero'
import FirstMerge from '@/components/shared/FirstMerge'
import LevelSystem from '@/components/shared/LevelSystem'
import FAQ from '@/components/shared/FAQ'
import CTA from '@/components/shared/CTA'
import SupportedBy from '@/components/landing/SupportedBy'
import Footer from '@/components/shared/Footer'
import Pipeline from '@/components/landing/Pipeline'
import Session from '@/components/landing/Session'
import Verdict from '@/components/landing/Verdict'
import Proof from '@/components/landing/Proof'
import ReviewSystem from '@/components/landing/ReviewSystem'
import { Rails, Section } from '@/components/landing/primitives'
import GradualBlur from './GradualBlur'

export const metadata: Metadata = {
  title: 'Forke — Ship Real Work, Get Paid',
  description: 'The premier micro-task marketplace for developers. Complete coding bounties, level up your engineering skills, and earn rewards for your contributions.',
}

export default function LandingPage() {
  return (
    <div className="relative flex flex-col min-h-screen bg-[#050505]">
      {/* Top upside gradual blur */}
      <GradualBlur
        position="top"
        height="6rem"
        strength={2}
        layers={8}
        curve="linear"
        exponential
        tint="rgba(18, 15, 23, 0.6)"
        autoHide
        target="parent"
        opacity={1}
        saturation={1}
        hoverIntensity={1}
      />

      <Navbar />
      <main className="flex-grow">
        {/* Full-bleed cover — hero with Forky + ticker */}
        <Hero />

        {/* Ledger block one — rails dissolve before the video */}
        <Rails fadeBottom>
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
  )
}
