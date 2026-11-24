'use client'

/**
 * @fileoverview Forke Platform
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'

/** Demos by name, loaded only on the pages that use them. Markdown: ::demo{name="cli"} */

const placeholder = () => <div className="docs-demo aspect-[760/420] w-full rounded-2xl border border-white/[0.08] bg-[#121111]" />
const mail = (k: keyof typeof import('./mail')) => dynamic(() => import('./mail').then((m) => m[k] as React.ComponentType), { loading: placeholder })
const forke = (k: keyof typeof import('./forke')) => dynamic(() => import('./forke').then((m) => m[k] as React.ComponentType), { loading: placeholder })
const MailVideo = dynamic(() => import('@/components/landing/MailVideo'), { loading: placeholder })

function DashboardFilm() {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} role="img" aria-label="The Forke Mail dashboard: sending a test email, watching its timeline and verifying a domain" className="docs-demo relative aspect-[960/520] w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[#151414]">
      <MailVideo active={active} />
    </div>
  )
}

const DEMOS: Record<string, React.ComponentType> = {
  cli: mail('CliDemo'),
  'agent-confirm': mail('AgentConfirmDemo'),
  connect: mail('ConnectDemo'),
  domain: mail('DomainDemo'),
  lifecycle: mail('LifecycleDemo'),
  dashboard: DashboardFilm,
  claim: forke('ClaimDemo'),
  pipeline: forke('PipelineDemo'),
  payout: forke('PayoutDemo'),
}

export function Demo({ name }: { name: string }) {
  const D = DEMOS[name]
  return D ? <D /> : null
}
