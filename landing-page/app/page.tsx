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
          accentColor="#FF851B"
          patternScale={1.7}
          patternDensity={0.65}
          softness={0.6}
          glow={0.5}
          twinkle={0.25}
          drift={0.35}
          hoverEffect="reveal"
          enableRipples={true}
          edgeFade={0.2}
          pixelSizeJitter={0.09}
          smoothing={0.9}
          speed={0.8}
          driftAngle={30}
          hoverRadius={160}
          rippleSpeed={0.35}
          rippleThickness={0.12}
          rippleIntensityScale={1.2}
          autoRipple={2.5}
          tiltX={0}
          tiltY={0}
          intro={true}
          lightMode={true}
          transparent={true}
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
