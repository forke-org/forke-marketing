'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check, Flame, GitMerge, IndianRupee, LoaderCircle, Timer } from 'lucide-react'
import { RiGithubFill } from '@remixicon/react'
import GradientASCII from '@/components/landing/GradientASCII'
import WaitlistForm from '@/components/landing/WaitlistForm'
import { BlurWords, Logo, Painting, cn } from '@/components/landing/primitives'

const EMBER = ['#0d0503', '#3a1404', '#a03a02', '#FF7A00', '#FFA347', '#FFD9A8']

const PERKS = [
  'Early access, rolled out in batches',
  'Real tasks from real codebases',
  'Verified contributions on your DEV ID',
  'Escrowed bounties, fast UPI payouts',
]

function setJoinedCookie() {
  document.cookie = 'waitlist_joined=true; path=/; max-age=31536000; SameSite=Lax'
}

/* ── the claim → merge → payout loop, as cropped windows on a painting ────── */

function Floating({ children, className, delay }: { children: ReactNode; className: string; delay: number }) {
  return (
    <div
      className={cn('animate-fade-up absolute', className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="animate-float" style={{ animationDelay: `${delay * 2}ms` }}>
        {children}
      </div>
    </div>
  )
}

function Preview() {
  return (
    <Painting src="/paintings/dusk-hill.jpg" className="relative h-[460px] rounded-[24px] border border-white/[0.08] sm:h-[540px]">
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />

      {/* a task you can claim */}
      <Floating className="left-[7%] top-[8%] w-[78%] max-w-[340px]" delay={500}>
        <div className="float-layer rounded-2xl border border-white/12 bg-[#101012]/92 p-4 shadow-[0_24px_60px_rgba(0,0,0,0.6)] backdrop-blur-md">
          <div className="flex items-center justify-between text-[11px] text-white/45">
            <span className="flex items-center gap-1.5">
              <RiGithubFill className="h-3.5 w-3.5" /> shopkit/web
            </span>
            <span className="flex items-center gap-1 text-accent-text">
              <Timer className="h-3 w-3" /> 20 min to claim
            </span>
          </div>
          <p className="mt-2 font-mono text-[14px] text-white/90">fix-navbar-overflow</p>
          <div className="mt-2.5 flex items-center gap-1.5">
            {['bug fix', '~1h', 'React'].map((t) => (
              <span key={t} className="rounded border border-white/10 bg-white/[0.05] px-1.5 py-0.5 font-mono text-[10.5px] text-white/55">
                {t}
              </span>
            ))}
          </div>
          <div className="mt-3.5 flex items-center justify-between border-t border-white/[0.07] pt-3">
            <span className="font-mono text-[18px] font-semibold text-accent">₹300</span>
            <span className="rounded-lg bg-accent px-3.5 py-1.5 text-[12.5px] font-semibold text-black">Claim</span>
          </div>
        </div>
      </Floating>

      {/* it merges, and the payout goes out */}
      <Floating className="right-[6%] top-[42%] w-[74%] max-w-[320px]" delay={900}>
        <div className="float-layer rounded-2xl border border-white/12 bg-[#101012]/92 p-4 shadow-[0_24px_60px_rgba(0,0,0,0.6)] backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
              <GitMerge className="h-4.5 w-4.5" />
            </span>
            <div>
              <p className="text-[13.5px] font-medium text-white/90">PR #42 merged</p>
              <p className="text-[11.5px] text-white/45">Approved by the repo owner</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between rounded-xl bg-emerald-500/[0.08] px-3 py-2.5">
            <span className="flex items-center gap-1.5 text-[12px] text-emerald-300">
              <IndianRupee className="h-3.5 w-3.5" /> Payout sent to UPI
            </span>
            <span className="font-mono text-[15px] font-semibold text-white">₹800</span>
          </div>
        </div>
      </Floating>

      {/* and you level up */}
      <Floating className="bottom-[7%] left-[9%] w-[64%] max-w-[270px]" delay={1300}>
        <div className="float-layer rounded-2xl border border-white/12 bg-[#101012]/92 p-4 shadow-[0_24px_60px_rgba(0,0,0,0.6)] backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-[13px] font-medium text-white/90">
              <Flame className="h-4 w-4 text-accent" /> 7-day streak
            </span>
            <span className="font-mono text-[12px] text-accent-text">+250 XP</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
            <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-accent to-[#FFB25C]" />
          </div>
          <p className="mt-2 text-[11px] text-white/40">Level 3 · Builder · 68% to Expert</p>
        </div>
      </Floating>
    </Painting>
  )
}

/* ── page ──────────────────────────────────────────────────────────────────── */

export default function WaitlistPage({ monoFont }: { monoFont: string }) {
  const params = useSearchParams()
  const emailParam = params.get('email') || ''
  // marketing channel, same convention as forke-marketing (?source= or ?utm_source=)
  const source = params.get('source') || params.get('utm_source') || 'waitlist'

  const [count, setCount] = useState<number | null>(null)
  const [verifying, setVerifying] = useState(Boolean(emailParam))
  const [joined, setJoined] = useState(false)

  // live "N developers waiting"
  useEffect(() => {
    fetch('/api/waitlist/count')
      .then((r) => r.json())
      .then((d) => d?.success && setCount(d.count))
      .catch(() => {})
  }, [])

  // ?email= links (from emails/invites): if already on the list, go straight to the site
  useEffect(() => {
    if (!emailParam) return
    fetch(`/api/waitlist/check?email=${encodeURIComponent(emailParam)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d?.joined) {
          setJoinedCookie()
          window.location.href = '/'
          return
        }
        setVerifying(false)
      })
      .catch(() => setVerifying(false))
  }, [emailParam])

  const onJoined = () => {
    setJoinedCookie()
    setJoined(true)
    setCount((c) => (c !== null ? c + 1 : c))
  }

  return (
    <div className="relative isolate min-h-[100svh] overflow-hidden bg-[#0b0604]">
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
      {/* keep the left column readable over the ember field */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_70%_at_25%_40%,rgba(11,6,4,0.85),transparent_75%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(11,6,4,0.9)_0%,rgba(11,6,4,0.7)_42%,transparent_68%)] max-lg:bg-[linear-gradient(180deg,rgba(11,6,4,0.75)_0%,rgba(11,6,4,0.55)_60%,rgba(11,6,4,0.3)_100%)]" />

      <nav className="relative z-10 mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 sm:px-8">
        <Logo />
        <a href="/" className="group flex items-center gap-1.5 text-[13.5px] text-white/60 transition-colors hover:text-white">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to forke.space
        </a>
      </nav>

      <main className="relative z-10 mx-auto grid max-w-[1200px] items-center gap-14 px-5 pb-16 pt-8 sm:px-8 lg:min-h-[calc(100svh-128px)] lg:grid-cols-[1.05fr_1fr] lg:pb-10 lg:pt-0">
        <div>
          <h1 className="text-[42px] font-medium leading-[1.03] tracking-[-0.04em] sm:text-[58px]">
            <BlurWords text="Be the first to ship." className="block text-white" />
            <BlurWords text="Get paid from day one." className="block text-white/45" delay={200} />
          </h1>

          <p className="animate-fade-up mt-6 max-w-[460px] text-[16.5px] leading-7 text-white/60" style={{ animationDelay: '380ms' }}>
            Forke turns real codebases into scoped, escrowed tasks. Drop your email to join early access and product
            updates. We&rsquo;ll notify you the moment Forke goes live.
          </p>

          <div className="animate-fade-up mt-8" style={{ animationDelay: '480ms' }}>
            {verifying ? (
              <div className="flex h-[56px] max-w-[460px] items-center gap-3 rounded-full border border-white/[0.12] bg-black/30 px-5 text-[14.5px] text-white/70 backdrop-blur-md">
                <LoaderCircle className="h-4 w-4 animate-spin text-accent" />
                Verifying your early access email…
              </div>
            ) : (
              <WaitlistForm
                source={source}
                initialEmail={emailParam}
                onSuccess={onJoined}
                note="No spam. Just your invite and the occasional product update."
              />
            )}
          </div>

          <div className="animate-fade-up mt-5 flex items-center gap-3" style={{ animationDelay: '560ms' }}>
            <div className="flex -space-x-2">
              {['#FF7A00', '#FFB25C', '#e85d3a', '#c2410c'].map((c, i) => (
                <span
                  key={c}
                  className="h-7 w-7 rounded-full border-2 border-[#0b0604]"
                  style={{ background: `linear-gradient(140deg, ${c}, #3a1404)`, zIndex: 4 - i }}
                />
              ))}
            </div>
            <p className="text-[13.5px] text-white/55">
              {joined ? (
                <span className="text-accent-text">You&rsquo;re in. Welcome to the batch.</span>
              ) : count && count > 0 ? (
                <>
                  Join <span className="font-medium text-white">{count.toLocaleString('en-IN')}</span> developers already
                  waiting
                </>
              ) : (
                'Be among the first on the waitlist'
              )}
            </p>
          </div>

          <ul className="mt-9 grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {PERKS.map((p, i) => (
              <li
                key={p}
                className="animate-fade-up flex items-center gap-2.5 text-[14px] text-white/70"
                style={{ animationDelay: `${640 + i * 70}ms` }}
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                {p}
              </li>
            ))}
          </ul>

          {joined && (
            <a
              href="/"
              className="group animate-fade-up mt-9 inline-flex items-center gap-1.5 text-[14.5px] text-white/80 underline decoration-white/25 underline-offset-4 hover:text-white"
            >
              Explore how Forke works
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          )}
        </div>

        <div className="animate-fade-up" style={{ animationDelay: '300ms' }}>
          <Preview />
        </div>
      </main>

      <footer className="relative z-10 mx-auto flex max-w-[1200px] flex-col gap-2 px-5 pb-6 text-[12.5px] text-white/40 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>© 2026 forke — all rights reserved</p>
        <div className="flex gap-5">
          <a href="/privacy" className="hover:text-white/80">Privacy</a>
          <a href="/terms" className="hover:text-white/80">Terms</a>
          <a href="mailto:support@forke.space" className="hover:text-white/80">support@forke.space</a>
        </div>
      </footer>
    </div>
  )
}
