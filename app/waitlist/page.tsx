/**
 * @fileoverview Forke Platform
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

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
