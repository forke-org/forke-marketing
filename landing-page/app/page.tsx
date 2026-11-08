import { Metadata } from 'next'
import HeroCard from '@/components/aside/HeroCard'
import StickyNav from '@/components/aside/StickyNav'
import GradualBlur from '@/components/ui/GradualBlur'
import ManifestoSection from '@/components/aside/ManifestoSection'
import SupportedStacksSection from '@/components/aside/SupportedStacksSection'
import FeaturesPipelineSection from '@/components/aside/FeaturesPipelineSection'
import SettlementSection from '@/components/aside/SettlementSection'
import TrustSection from '@/components/aside/TrustSection'
import BottomCta from '@/components/aside/BottomCta'
import AsideFooter from '@/components/aside/AsideFooter'

export const metadata: Metadata = {
  title: 'Forke — Ship Real Work, Get Paid',
  description: 'The micro-task marketplace where Indian developers earn real money by shipping real code.',
}

export default function LandingPage() {
  return (
    <div className="relative flex flex-col min-h-screen bg-white text-[#0a0a0a] selection:bg-[#FF7A00] selection:text-white">
      {/* Top gradual blur falloff at the top edge ("in the up") */}
      <GradualBlur
        position="top"
        target="page"
        height="6rem"
        strength={2}
        layers={8}
        curve="bezier"
        exponential
        tint="transparent"
        autoHide
        zIndex={40}
      />

      {/* Sticky Navigation that appears on scroll */}
      <StickyNav />

      <main className="flex-grow w-full">
        {/* Top Hero Container with Background Image & Product Stage */}
        <HeroCard />

        {/* Aside Tuck-Under Spacer: pulls the section border-x up behind the hero mockup */}
        <div className="-mb-20 sm:-mb-24" aria-hidden="true" />

        {/* Section 1: Introducing Forke / Manifesto */}
        <ManifestoSection />

        {/* Section 2: Supported Tech Stacks (Aside 3D App Perspective Grid) */}
        <SupportedStacksSection />

        {/* Section 2.5: The Pipeline / Features (Calendly-style Interactive Showcase with Orange Gradient) */}
        <FeaturesPipelineSection />

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
