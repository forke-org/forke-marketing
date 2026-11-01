import { Metadata } from 'next'
import Navbar from '@/components/shared/Navbar'
import Hero from '@/components/shared/Hero'
import LevelSystem from '@/components/shared/LevelSystem'
import FAQ from '@/components/shared/FAQ'
import CTA from '@/components/shared/CTA'
import Footer from '@/components/shared/Footer'
import Pipeline from '@/components/landing/Pipeline'
import Session from '@/components/landing/Session'
import Verdict from '@/components/landing/Verdict'
import Proof from '@/components/landing/Proof'
import ReviewSystem from '@/components/landing/ReviewSystem'
import { Rails } from '@/components/landing/primitives'
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
        tint="transparent"
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

        {/* Continuous layout container without vertical border rails */}
        <Rails>
          <Pipeline />
          <Session />
          <ReviewSystem n="006" />
          <Verdict />
          <Proof n="004" />
          <LevelSystem />
          <FAQ n="007" />
          <CTA />
        </Rails>
      </main>
      <Footer />
    </div>
  )
}
