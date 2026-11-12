import { ArrowRight } from 'lucide-react'
import { GeistMono } from 'geist/font/mono'
import { HeroNav } from './Navbar'
import { BlurWords, GhostButton, WaitlistButton } from './primitives'
import AppMockup from './AppMockup'
import GradientASCII from './GradientASCII'
import HeroFrame from './HeroFrame'

// Ember ramp: night → coal → Forke orange → amber → cream highlight.
const EMBER = ['#0d0503', '#3a1404', '#a03a02', '#FF7A00', '#FFA347', '#FFD9A8']

export default function Hero() {
  return (
    <div>
      <HeroFrame>
        <GradientASCII
          className="!absolute inset-0 -z-10"
          colors={EMBER}
          shape="horizon"
          flipY
          characters=" .:-=+*x#%@"
          cellSize={15}
          density={0.85}
          glyphOpacity={0.9}
          glow={0.45}
          flicker={0.25}
          softness={0.75}
          scale={1}
          flow={0.6}
          speed={0.9}
          gradientOpacity={0.85}
          grain={0.07}
          scrambleRadius={0.09}
          clickEffect="wave"
          fontFamily={GeistMono.style.fontFamily}
        />
        {/* keep the top quiet so the nav and headline read cleanly */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[45%] bg-gradient-to-b from-[#0b0604]/80 to-transparent" />

        <HeroNav />

        <header className="relative px-6 pb-14 pt-14 text-center sm:pb-16 sm:pt-20">

          <h1 className="mx-auto max-w-[880px] text-[40px] font-medium leading-[1.04] tracking-[-0.035em] sm:text-[64px]">
            <BlurWords text="Ship real work." className="block text-white" />
            <BlurWords text="Get paid the day it merges." className="block text-white/45" delay={220} />
          </h1>

          <p
            className="animate-fade-up mx-auto mt-6 max-w-[560px] text-[16px] leading-7 text-white/60 sm:text-[17px]"
            style={{ animationDelay: '420ms' }}
          >
            Pick up a scoped task from a real codebase. Forke checks and reviews your pull request, the owner approves
            it, and the escrowed bounty lands in your UPI.
          </p>

          <div
            className="animate-fade-up mt-9 flex flex-wrap items-center justify-center gap-3"
            style={{ animationDelay: '520ms' }}
          >
            <WaitlistButton />
            <GhostButton href="#how">
              See how it works
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </GhostButton>
          </div>

          <p
            className="animate-fade-up mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[13px] text-white/45"
            style={{ animationDelay: '620ms' }}
          >
            <span>Free for developers</span>
            <span className="text-white/20">·</span>
            <span>Keep 100% of every bounty</span>
          </p>
        </header>

        {/* the preview sits inside the frame and is cropped by its bottom edge; on phones and
            tablets it keeps its desktop layout and runs off the right edge (like a cropped screenshot) */}
        <div
          aria-hidden
          inert
          className="animate-fade-up pointer-events-none relative mx-auto h-[420px] max-w-[1180px] select-none pl-4 [clip-path:inset(-200px_-200px_0_-200px)] sm:h-[480px] sm:pl-10 lg:h-[500px] lg:px-14"
          style={{ animationDelay: '700ms' }}
        >
          <AppMockup />
        </div>
      </HeroFrame>
    </div>
  )
}
