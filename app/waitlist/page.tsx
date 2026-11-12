import { Suspense } from 'react'
import { GeistMono } from 'geist/font/mono'
import WaitlistPage from '@/components/waitlist/WaitlistPage'

export default function Page() {
  // useSearchParams (for ?email= and ?source=) needs a Suspense boundary
  return (
    <Suspense fallback={<div className="min-h-[100svh] bg-[#0b0604]" />}>
      <WaitlistPage monoFont={GeistMono.style.fontFamily} />
    </Suspense>
  )
}
