import { ArrowUpRight } from 'lucide-react'
import { AI_ICONS } from './ai-icons'

const PROMPT =
  'Tell me about Forke (forke.space), the micro-task marketplace for developers. What is it, how does it work, and who is it for?'
const q = encodeURIComponent(PROMPT)

/** Each link opens the assistant with the question already typed in. */
const ASSISTANTS = [
  { name: 'ChatGPT', href: `https://chatgpt.com/?q=${q}`, icon: AI_ICONS.chatgpt },
  { name: 'Claude', href: `https://claude.ai/new?q=${q}`, icon: AI_ICONS.claude },
  // Gemini has no official prefilled-prompt link; Google's AI Mode runs on Gemini and accepts one.
  { name: 'Gemini', href: `https://www.google.com/search?udm=50&q=${q}`, icon: AI_ICONS.gemini },
  { name: 'Perplexity', href: `https://www.perplexity.ai/search?q=${q}`, icon: AI_ICONS.perplexity },
]

/** "Still curious?" row closing the FAQ: hand the question to an AI assistant. */
export default function AskAI() {
  return (
    <div className="mt-10 rounded-[16px] border border-line bg-white/[0.015] p-5 sm:p-6">
      <p className="text-[16px] font-medium text-ink">Still curious?</p>
      <p className="mt-1 text-[14.5px] leading-6 text-white/50">Ask your favourite AI about Forke. The question is already written for you.</p>
      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {ASSISTANTS.map((a) => (
          <a
            key={a.name}
            href={a.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Ask ${a.name} about Forke`}
            className="group inline-flex h-10 items-center gap-2 rounded-[10px] border border-white/10 bg-white/[0.03] px-3 text-[13.5px] text-white/75 transition-colors hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
          >
            <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 shrink-0" fill={a.icon.hex}>
              <path d={a.icon.path} />
            </svg>
            {a.name}
            <ArrowUpRight className="ml-auto h-3.5 w-3.5 text-white/25 transition-colors group-hover:text-white/60" />
          </a>
        ))}
      </div>
    </div>
  )
}
