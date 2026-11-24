'use client'

import { BlurWords, Reveal, Section } from '../primitives'

/**
 * Meet Forky: an introduction to the mascot, and to what he stands for: while you write code, he runs the review
 * pipeline. It sits right above "Reviews that never sleep", which then shows that pipeline step by step.
 * The picture is a plain image at /forky/forky-intro.webp (4:3); swap the file to change it.
 */

const JOBS: [string, string][] = [
  ['Runs your PR in a sandbox', 'Build, tests and security checks on an isolated copy of the repo.'],
  ['Holds it to the baseline', 'Only problems your change introduced count against you.'],
  ['Reads the diff and writes the verdict', 'A plain-English summary the owner can act on in a minute.'],
  ['Gets it to the right person', 'Then pings you the moment it merges and the bounty lands.'],
]

export default function ForkySection() {
  return (
    <Section id="forky">
      <div className="grid items-center gap-12 px-6 py-20 sm:px-12 sm:py-28 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <div>
          <h2 className="text-[34px] font-medium leading-[1.08] tracking-[-0.03em] sm:text-[44px]">
            <BlurWords text="Meet Forky." className="block text-ink" />
            <BlurWords text="He reviews while you code." className="block text-white/40" delay={200} />
          </h2>
          <Reveal className="mt-5 max-w-[440px] text-[16px] leading-7 text-white/50">
            Forky is Forke&rsquo;s mascot and the reviewer that never clocks out. The moment you open a pull request
            he&rsquo;s on it, so you can keep building.
          </Reveal>
          <ol className="mt-8 max-w-[460px] space-y-5">
            {JOBS.map(([title, body], i) => (
              <li key={title} className="flex gap-4">
                <span className="mt-0.5 font-mono text-[11px] text-accent-text">{String(i + 1).padStart(2, '0')}</span>
                <p className="text-[15px] leading-6 text-white/45">
                  <span className="font-medium text-ink">{title}.</span> {body}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <div className="overflow-hidden rounded-[18px] border border-white/[0.06] bg-[#121111]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/forky/forky-intro.webp"
            alt="Forky, the Forke mascot, reviewing pull requests"
            width={1600}
            height={1200}
            loading="lazy"
            className="block aspect-[4/3] h-auto w-full object-cover"
          />
        </div>
      </div>
    </Section>
  )
}
