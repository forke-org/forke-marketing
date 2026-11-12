import type { Metadata } from 'next'
import { ArrowRight } from 'lucide-react'
import StatusPage from '@/components/shared/StatusPage'
import { GhostButton, WaitlistButton } from '@/components/landing/primitives'

export const metadata: Metadata = { title: 'Page not found', robots: { index: false } }

export default function NotFound() {
  return (
    <StatusPage
      code="404"
      label="Route not found"
      status="Not built yet"
      title="This page is still"
      muted="on the drawing board."
      redirectAfter={10}
      actions={
        <>
          <WaitlistButton label="Back to home" href="/" />
          <GhostButton href="/blogs">
            Read the blog
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </GhostButton>
        </>
      }
    >
      The link is broken, the page has moved, or we haven&rsquo;t built it yet. Everything else is open for business.
    </StatusPage>
  )
}
