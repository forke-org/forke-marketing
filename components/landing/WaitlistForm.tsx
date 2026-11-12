'use client'

import { useState, type FormEvent } from 'react'
import { ArrowRight, Check, LoaderCircle } from 'lucide-react'
import { cn } from './primitives'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * Early-access sign-up. Forke is still waitlist-only, so every primary CTA on the
 * page is this form: email pill with "Join the waitlist" tucked inside.
 * `source` tags where the sign-up came from (hero, pricing, cta…).
 */
export default function WaitlistForm({
  source,
  className,
  note = 'Early access opens in batches. No spam, ever.',
  align = 'left',
  initialEmail = '',
  onSuccess,
}: {
  source: string
  className?: string
  note?: string
  align?: 'left' | 'center'
  initialEmail?: string
  onSuccess?: (message: string) => void
}) {
  const [email, setEmail] = useState(initialEmail)
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!EMAIL.test(email.trim())) {
      setState('error')
      setMessage('Please enter a valid email address.')
      return
    }
    setState('loading')
    setMessage('')
    try {
      const res = await fetch('/api/waitlist/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.success) throw new Error(data.message)
      const done = data.message || "You're on the list. We'll email you the moment Forke goes live."
      setState('done')
      setMessage(done)
      onSuccess?.(done)
    } catch (err) {
      setState('error')
      setMessage(err instanceof Error && err.message ? err.message : 'Could not join right now. Try again soon.')
    }
  }

  const center = align === 'center'

  if (state === 'done') {
    return (
      <div className={cn('w-full max-w-[460px]', center && 'mx-auto', className)}>
        <div className="flex min-h-[56px] items-center gap-3 rounded-full border border-accent/30 bg-accent/[0.1] px-5 py-3 text-left text-[14.5px] text-ink backdrop-blur-md">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-black">
            <Check className="h-4 w-4" strokeWidth={3} />
          </span>
          {message}
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className={cn('w-full max-w-[460px]', center && 'mx-auto', className)}>
      <div
        className={cn(
          'flex h-[56px] items-center rounded-full border bg-black/30 p-1.5 pl-5 backdrop-blur-md transition-colors focus-within:border-white/30',
          state === 'error' ? 'border-red-400/60' : 'border-white/[0.14]',
        )}
      >
        <input
          type="email"
          required
          autoComplete="email"
          aria-label="Email address"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (state === 'error') setState('idle')
          }}
          className="min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-white/35"
        />
        <button
          type="submit"
          disabled={state === 'loading'}
          className="group flex h-full shrink-0 items-center gap-1.5 rounded-full bg-accent px-4 text-[14.5px] font-medium text-[#1a0a00] shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_8px_24px_-8px_rgba(255,122,0,0.6)] transition-colors hover:bg-accent-hover disabled:opacity-70 sm:px-5"
        >
          {state === 'loading' ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Join the waitlist
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </div>
      <p className={cn('mt-2.5 min-h-[20px] text-[12.5px]', center ? 'text-center' : 'pl-5', state === 'error' ? 'text-red-300' : 'text-white/45')}>
        {state === 'error' ? message : note}
      </p>
    </form>
  )
}
