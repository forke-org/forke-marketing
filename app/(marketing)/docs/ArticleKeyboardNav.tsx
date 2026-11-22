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

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface ArticleKeyboardNavProps {
  prevSlug?: string
  nextSlug?: string
}

export default function ArticleKeyboardNav({
  prevSlug,
  nextSlug,
}: ArticleKeyboardNavProps) {
  const router = useRouter()

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // Ignore if typing inside inputs
      const target = e.target as HTMLElement | null
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return
      }

      if ((e.key === '[' || (e.altKey && e.key === 'ArrowLeft')) && prevSlug) {
        e.preventDefault()
        router.push(`/docs/${prevSlug}`)
      } else if ((e.key === ']' || (e.altKey && e.key === 'ArrowRight')) && nextSlug) {
        e.preventDefault()
        router.push(`/docs/${nextSlug}`)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [prevSlug, nextSlug, router])

  return null
}
