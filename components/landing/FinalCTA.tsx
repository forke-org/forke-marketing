import { ArrowRight } from 'lucide-react'
import { GeistMono } from 'geist/font/mono'
import GradientASCII from './GradientASCII'
import { BlurWords, GhostButton, WaitlistButton } from './primitives'

export default function FinalCTA() {
  return (
    <div id="cta" className="relative mx-auto w-full max-w-[1480px] px-3 min-[1504px]:px-0">
      <div className="relative isolate overflow-hidden rounded-[16px] border border-white/[0.07] bg-[#0b0604]">
        <GradientASCII
          className="!absolute inset-0 -z-10"
          colors={['#120703', '#6b2604', '#FF7A00', '#FFB25C', '#FFF1DC']}
          shape="horizon"
          flipY
          characters=" .:-=+*#"
          cellSize={14}
          density={0.8}
          glow={0.3}
          flicker={0.2}
          flow={0.5}
          speed={0.8}
          gradientOpacity={0.8}
          grain={0.06}
          clickEffect="burst"
          fontFamily={GeistMono.style.fontFamily}
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_55%_at_50%_42%,rgba(11,6,4,0.85),transparent_75%)]" />

        <div className="flex flex-col items-center px-6 py-24 text-center sm:py-32">
          <h2 className="text-[34px] font-medium leading-[1.06] tracking-[-0.03em] sm:text-[52px]">
            <BlurWords text="Day one, you claim it." className="block text-white" />
            <BlurWords text="Day two, you're paid." className="block text-white/50" delay={220} />
          </h2>
          <p className="mt-5 max-w-[440px] text-[16px] leading-7 text-white/60">
            Forke opens to developers in batches. Get on the list and we&rsquo;ll email you the moment your spot opens.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <WaitlistButton />
            <GhostButton href="#how" className="bg-black/30 hover:bg-black/50">
              How it works
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </GhostButton>
          </div>
        </div>
      </div>
    </div>
  )
}
