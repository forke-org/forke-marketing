import type { Metadata } from 'next'
import PageShell, { PageHeader, SectionHeading } from '@/components/shared/PageShell'
import CellGrid from '@/components/shared/CellGrid'
import { Reveal, Section } from '@/components/landing/primitives'
import LevelExplorer from './LevelExplorer'
import { PRESTIGE, XP_RULES } from './data'

export const metadata: Metadata = {
  title: 'Levels — 25 milestones, 5 tiers, earned by shipping',
  description:
    'How levels work on Forke: earn XP by shipping quality code, keeping streaks and delivering early. 25 levels across 5 tiers unlock bigger bounties, perks and prestige ranks.',
  alternates: { canonical: '/levels' },
}

export default function LevelsPage() {
  return (
    <PageShell cta>
      <PageHeader
        eyebrow="Progression"
        title="The level"
        muted="system."
        aside={
          <div className="grid grid-cols-3 gap-x-8 font-mono text-[12px] lg:text-right">
            {[
              ['Levels', '25'],
              ['Tiers', '5'],
              ['Prestige ranks', '5'],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="text-white/35">{k}</p>
                <p className="mt-1 text-[15px] text-ink">{v}</p>
              </div>
            ))}
          </div>
        }
      >
        Levels measure platform experience, contribution volume and consistency, not raw domain skill. Earn XP by
        shipping high-quality code, level up your tier, and unlock premium access.
      </PageHeader>

      {/* explorer */}
      <Section>
        <div className="px-6 py-16 sm:px-12 sm:py-20">
          <SectionHeading title="Choose your" muted="tier.">
            25 milestones in 5 tiers. Each one unlocks something real: bigger bounties, reviewer roles, private
            enterprise projects.
          </SectionHeading>
          <div className="mt-10">
            <LevelExplorer />
          </div>
        </div>
      </Section>

      {/* earning XP */}
      <Section>
        <div className="px-6 py-20 sm:px-12 sm:py-28">
          <SectionHeading title="How to" muted="earn XP.">
            XP rewards consistency, fast execution and spotless client reviews.
          </SectionHeading>
          <Reveal className="mt-12">
            <CellGrid cols={3}>
              {XP_RULES.map((r) => (
                <div key={r.title} className="flex flex-col p-6 sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-[17px] font-medium text-ink">{r.title}</h3>
                    {r.value && (
                      <span
                        className={`shrink-0 rounded-full border px-2.5 py-0.5 font-mono text-[12px] ${
                          r.penalty ? 'border-rose-400/25 bg-rose-400/[0.07] text-rose-300' : 'border-accent/30 bg-accent/[0.08] text-accent-text'
                        }`}
                      >
                        {r.value}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-[14.5px] leading-6 text-white/45">{r.desc}</p>
                  {r.details && (
                    <ul className="mt-5 space-y-1.5">
                      {r.details.map((d) => (
                        <li key={d.label} className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2 text-[13.5px]">
                          <span className="text-white/60">{d.label}</span>
                          <span className="font-mono text-[12.5px] text-accent-text">{d.value}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
              <div className="flex flex-col justify-end p-6 sm:p-7">
                <p className="font-mono text-[12px] text-white/30">{'//'} good to know</p>
                <p className="mt-3 text-[14.5px] leading-6 text-white/45">
                  Your level is one of three gates on the task feed, next to your skill tier and trust score. Higher
                  levels open bigger bounties.
                </p>
              </div>
            </CellGrid>
          </Reveal>
        </div>
      </Section>

      {/* prestige */}
      <Section divider={false}>
        <div className="grid gap-12 px-6 py-20 sm:px-12 sm:py-28 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading title="The prestige" muted="system.">
              Reaching Level 25 unlocks the option to Prestige. Reset your level progression to claim permanent
              cosmetic titles and high-value platform perks.
            </SectionHeading>
          </div>
          <Reveal>
            <ol className="overflow-hidden rounded-[18px] border border-line">
              {PRESTIGE.map((p, i) => (
                <li key={p.rank} className={`flex items-center gap-5 px-5 py-5 sm:px-6 ${i ? 'border-t border-line' : ''}`}>
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] border font-serif text-[18px]"
                    style={{ color: p.color, borderColor: `${p.color}55`, backgroundColor: `${p.color}14` }}
                  >
                    {p.rank}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[17px] font-medium text-ink">{p.title}</span>
                    <span className="mt-0.5 block text-[14px] text-white/45">{p.perk}</span>
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </Section>
    </PageShell>
  )
}
