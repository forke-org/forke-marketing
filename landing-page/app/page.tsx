import { Metadata } from 'next'
import HeroCard from '@/components/aside/HeroCard'
import StickyNav from '@/components/aside/StickyNav'
import ManifestoSection from '@/components/aside/ManifestoSection'
import PillarsSection from '@/components/aside/PillarsSection'
import SettlementSection from '@/components/aside/SettlementSection'
import TrustSection from '@/components/aside/TrustSection'
import BottomCta from '@/components/aside/BottomCta'
import AsideFooter from '@/components/aside/AsideFooter'
import PixelBlast from '@/components/ui/PixelBlast'

export const metadata: Metadata = {
  title: 'Forke — Ship Real Work, Get Paid',
  description: 'The micro-task marketplace where Indian developers earn real money by shipping real code.',
}

export default function LandingPage() {
  return (
    <div className="relative flex flex-col min-h-screen bg-white text-[#0a0a0a] selection:bg-[#FF7A00] selection:text-white">
      {/* Interactive WebGL PixelBlast Background covering the whole white parts of the website */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 w-full h-full"
        style={{ width: '100%', height: '100%', position: 'fixed' }}
        aria-hidden="true"
      >
        <PixelBlast
          variant="cross"
          pixelSize={3}
          color="#f97316"
          patternScale={1.7}
          patternDensity={0.65}
          softness={0.6}
          glow={0.4}
          twinkle={0.2}
          drift={0.2}
          hoverEffect="none"
          enableRipples
          edgeFade={0.25}
          accentColor="#000000"
          pixelSizeJitter={0.09}
          smoothing={1}
          speed={0.6}
          driftAngle={30}
          hoverRadius={140}
          rippleSpeed={0.3}
          rippleThickness={0.1}
          rippleIntensityScale={1}
          autoRipple={0}
          tiltX={0}
          tiltY={0}
          intro
          lightMode={false}
        />
      </div>

      {/* Sticky Navigation that appears on scroll */}
      <StickyNav />

      <main className="relative z-10 flex-grow w-full">
        {/* Top Hero Container with Background Image & Product Stage */}
        <HeroCard />

        {/* Aside Tuck-Under Spacer: pulls the section border-x up behind the hero mockup */}
        <div className="-mb-20 sm:-mb-24" aria-hidden="true" />

        {/* Section 1: Introducing Forke / Manifesto */}
        <ManifestoSection />

        {/* Section 2: Proof of Work & Core Pillars */}
        <PillarsSection />

        {/* Section 3: Instant Settlement & Escrow Vault */}
        <SettlementSection />

        {/* Section 4: Fair & Meritocratic Reputation */}
        <TrustSection />

        {/* Section 5: Bottom CTA Banner */}
        <BottomCta />
      </main>

      {/* Global Footer */}
      <AsideFooter />
    </div>
  )
}
