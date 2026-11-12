'use client'

import { useEffect } from 'react'
import StatusPage from '@/components/shared/StatusPage'
import { GhostButton } from '@/components/landing/primitives'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <StatusPage
      code="500"
      label="Something broke"
      status="Being repaired"
      title="That didn't"
      muted="go as planned."
      actions={
        <>
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-[10px] border border-transparent bg-accent px-4 text-[15px] font-medium leading-none text-[#1a0a00] shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_8px_24px_-8px_rgba(255,122,0,0.55)] transition-colors hover:bg-accent-hover"
          >
            Try again
          </button>
          <GhostButton href="/">Back to home</GhostButton>
        </>
      }
    >
      Something went wrong on our side while loading this page. Try again, and if it keeps happening, let us know.
      {error.digest && <span className="mt-2 block font-mono text-[11.5px] text-white/35">ref {error.digest}</span>}
    </StatusPage>
  )
}
