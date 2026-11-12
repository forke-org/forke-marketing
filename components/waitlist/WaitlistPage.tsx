'use client'

import { ArrowLeft, LoaderCircle } from 'lucide-react'
import GradientASCII from '@/components/landing/GradientASCII'
import WaitlistForm from '@/components/landing/WaitlistForm'
import { BlurWords, Logo } from '@/components/landing/primitives'
import { useWaitlistState } from './useWaitlistState'

const EMBER = ['#0d0503', '#3a1404', '#a03a02', '#FF7A00', '#FFA347', '#FFD9A8']

/** Waitlist: one centred screen, the landing hero's ember horizon rising behind the form. */
export default function WaitlistPage({ monoFont }: { monoFont: string }) {
  const { emailParam, source, count, verifying, joined, onJoined } = useWaitlistState()

  return (
    <div className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[#0b0604]">
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
        flow={0.6}
        speed={0.9}
        gradientOpacity={0.85}
        grain={0.07}
        scrambleRadius={0.09}
        clickEffect="wave"
        fontFamily={monoFont}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(75%_55%_at_50%_40%,rgba(11,6,4,0.92),transparent_80%)]" />

      <nav className="relative z-10 flex h-16 items-center justify-between px-5 sm:px-8">
        <Logo />
        <a href="/" className="group flex items-center gap-1.5 text-[13.5px] text-white/60 transition-colors hover:text-white">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          <span className="hidden sm:inline">Back to forke.space</span>
          <span className="sm:hidden">Back</span>
        </a>
      </nav>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 pb-28 pt-4 text-center sm:pb-32">
        <p className="animate-fade-up font-mono text-[11.5px] uppercase tracking-[0.16em] text-accent-text sm:text-[12px]">
          Early access waitlist
        </p>
        <h1 className="mt-5 max-w-[820px] text-[min(8.6vw,40px)] font-medium leading-[1.05] tracking-[-0.035em] sm:text-[64px] sm:leading-[1.02] lg:text-[72px]">
          <BlurWords text="Be the first to ship." className="block text-balance text-white" />
          <BlurWords text="Get paid from day one." className="mt-1 block text-balance text-white/45 sm:mt-0" delay={200} />
        </h1>
        <p
          className="animate-fade-up mt-5 max-w-[340px] text-balance text-[15px] leading-6 text-white/60 sm:mt-6 sm:max-w-[500px] sm:text-[16.5px] sm:leading-7"
          style={{ animationDelay: '380ms' }}
        >
          Forke turns real codebases into scoped, escrowed tasks. Drop your email and we&rsquo;ll send your invite the
          moment your batch opens.
        </p>

        <div className="animate-fade-up mt-8 w-full max-w-[480px] sm:mt-9" style={{ animationDelay: '480ms' }}>
          {verifying ? (
            <div className="mx-auto flex h-[56px] items-center justify-center gap-3 rounded-full border border-white/[0.12] bg-black/30 px-5 text-[14.5px] text-white/70 backdrop-blur-md">
              <LoaderCircle className="h-4 w-4 animate-spin text-accent" />
              Verifying your early access email…
            </div>
          ) : (
            <WaitlistForm source={source} initialEmail={emailParam} onSuccess={onJoined} align="center" note="No spam. Just your invite and the occasional update." />
          )}
        </div>

        <p className="animate-fade-up mt-3 text-[13.5px] text-white/55" style={{ animationDelay: '560ms' }}>
          {joined ? (
            <span className="text-accent-text">You&rsquo;re in. Welcome to the batch.</span>
          ) : count && count > 0 ? (
            <>
              <span className="font-medium text-white">{count.toLocaleString('en-IN')}</span> developers already waiting
            </>
          ) : (
            'Be among the first on the list'
          )}
        </p>
      </main>
    </div>
  )
}
