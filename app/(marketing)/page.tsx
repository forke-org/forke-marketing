import Hero from '@/components/landing/Hero'
import { StickyNav } from '@/components/landing/Navbar'
import SupportedBy from '@/components/landing/SupportedBy'
import Problem from '@/components/landing/Problem'
import HowItWorks from '@/components/landing/HowItWorks'
import Capability from '@/components/landing/Capability'
import ForkySection from '@/components/landing/forky/ForkySection'
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
            <ForkySection />
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
