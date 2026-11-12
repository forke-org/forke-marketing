'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { BlurWords, Section, cn } from './primitives'
import AskAI from './AskAI'

const QA = [
  {
    q: 'How do I get paid?',
    a: 'Every task is escrowed up front: the owner deposits the full bounty before you ever see it. Ship your PR, pass review, and the moment it merges the escrow releases straight to your UPI. No invoices, no net-30, no chasing.',
  },
  {
    q: "What if I claim a task and can't finish it?",
    a: 'Claiming gives you a 20-minute window to activate. If life happens after that, forfeit from your dashboard and the task returns to the queue. Your completion rate feeds your trust score, which gates the bigger bounties.',
  },
  {
    q: 'Do I need a resume or an interview?',
    a: 'No. Anyone can claim entry-level tasks on day one. Higher-paying work is gated by your level, skill tier and trust score, all earned by shipping.',
  },
  {
    q: 'Who reviews my code?',
    a: 'Four layers. Automated checks first: build, tests, lint, scope and a security scan. Then an AI review scores the diff against the task spec. A risk score routes the submission, and finally the owner approves a plain-English verdict.',
  },
  {
    q: 'What does Forke cost?',
    a: 'Developers keep 100% of the listed bounty: no fees, no cut. Owners pay a 10% platform fee on top, so a ₹500 task costs them ₹550 and you receive the full ₹500. Checks, AI review and escrow are included.',
  },
  {
    q: 'Does Forke touch my repository?',
    a: 'Contributors work in an isolated Forke branch with scoped access. Nothing reaches your main branch until you approve the merge.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <Section id="faq" divider={false}>
      <div className="grid gap-10 px-6 pb-12 pt-20 sm:px-12 sm:pb-16 sm:pt-28 lg:grid-cols-[1fr_1.4fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="text-[34px] font-medium leading-[1.08] tracking-[-0.03em] sm:text-[44px]">
            <BlurWords text="Questions," className="block text-ink" />
            <BlurWords text="answered." className="block text-white/40" delay={150} />
          </h2>
        </div>
        <div>
          {QA.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={item.q} className="border-b border-line">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left text-[16px] text-ink/90 transition-colors hover:text-white"
                >
                  {item.q}
                  <Plus
                    className={cn('h-4 w-4 shrink-0 text-white/45 transition-transform duration-300', isOpen && 'rotate-45 text-accent')}
                  />
                </button>
                <div
                  className="grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr', opacity: isOpen ? 1 : 0 }}
                >
                  <p className="overflow-hidden pr-10 text-[15px] leading-7 text-white/50">
                    <span className="block pb-5">{item.a}</span>
                  </p>
                </div>
              </div>
            )
          })}
          <AskAI />
        </div>
      </div>
    </Section>
  )
}
