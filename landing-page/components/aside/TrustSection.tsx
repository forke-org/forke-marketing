'use client'

/**
 * @fileoverview Forke Platform - Aside Trust & Reputation Section
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 */

import React from 'react'
import { ArrowRight, CheckCircle2, Shield, GitBranch, Cpu, Terminal, Users } from 'lucide-react'

export default function TrustSection() {
  const cards = [
    {
      title: 'Public Repositories',
      description: 'Ship real code directly into production GitHub repos. Every merged PR becomes an immutable proof of your engineering skill.',
      icon: GitBranch,
      tag: 'Zero Simulation',
    },
    {
      title: 'Guaranteed Escrow',
      description: 'Client startups fund 100% of the bounty before tasks go live. You never have to chase invoices or wonder if you will get paid.',
      icon: Shield,
      tag: '100% Protected',
    },
    {
      title: 'Automated CI Gates',
      description: 'Objective criteria over subjective bias. Pass the test suites, meet the PR checklist, and your work speaks for itself.',
      icon: Cpu,
      tag: 'Merit-Driven',
    },
    {
      title: 'Direct UPI Cash-out',
      description: 'No 30-day net payment terms or high foreign exchange platform fees. Real INR transferred straight to your bank account via UPI.',
      icon: Terminal,
      tag: 'Instant Payout',
    },
  ]

  return (
    <div id="reputation" className="mx-auto w-full border-b border-black/[0.08] bg-white">
      <div className="mx-auto w-full max-w-[1536px] px-4 sm:px-6 lg:px-12 xl:px-24">
        <div className="border-x border-black/[0.08] px-6 py-16 sm:px-8 sm:py-20 md:px-14 md:py-28 xl:px-36">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <p className="mb-3">
              <a 
                className="text-accent inline-flex items-center gap-1.5 text-sm font-medium decoration-accent/50 decoration-dotted decoration-2 underline-offset-4 hover:underline md:text-base group" 
                href="#reputation"
              >
                <span>Fair & Meritocratic</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </p>
            <h2 className="font-display text-[#0a0a0a] text-3xl sm:text-4xl xl:text-5xl font-bold tracking-tight leading-tight mb-4">
              No pedigree needed. <br className="hidden sm:block" />
              Your code is your credential.
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed font-normal">
              Forke evaluates you on the diff, not your college brand or resume buzzwords. Real code shipped to real startups is the only receipt that matters.
            </p>
          </div>

          {/* 4 Cards Grid (Aside Child 08 Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((c) => {
              const Icon = c.icon
              return (
                <div
                  key={c.title}
                  className="p-6 rounded-2xl bg-neutral-50/70 border border-neutral-200/80 hover:border-neutral-300 hover:shadow-sm transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="size-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                        <Icon className="size-5" />
                      </div>
                      <span className="text-[10px] font-mono text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20 font-semibold">
                        {c.tag}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-[#0a0a0a] mb-2">{c.title}</h3>
                    <p className="text-sm text-neutral-600 leading-relaxed font-normal">{c.description}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-neutral-200 text-[11px] font-mono text-neutral-400">
                    Proof on GitHub
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
