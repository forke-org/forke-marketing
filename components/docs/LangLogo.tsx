/**
 * @fileoverview Forke Platform
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

import { RiJavaFill, RiTerminalBoxFill, RiClaudeFill, RiOpenaiFill, RiCursorAiFill, RiGithubFill } from '@remixicon/react'
import { siCurl, siDjango, siDotnet, siExpress, siGo, siHomebrew, siLaravel, siNextdotjs, siNodedotjs, siPhp, siPython, siRuby, siRubyonrails, siRust, siTypescript, siJavascript } from 'simple-icons'
import { cn } from '@/lib/utils/cn'
import { ClaudeCodeMark } from './ClaudeCodeMark'

/** Real brand marks for languages, frameworks and AI apps (Simple Icons, CC0; Remix Icon), by display name or guide id. */

type Mark = { kind: 'remix'; Icon: React.ComponentType<{ className?: string }>; color: string } | { kind: 'simple'; path: string; color: string }

const si = (icon: { path: string; hex: string }, color?: string): Mark => ({ kind: 'simple', path: icon.path, color: color ?? `#${icon.hex}` })

const MARKS: Record<string, Mark> = {
  node: si(siNodedotjs),
  express: si(siExpress, '#e8e2dd'),
  nextjs: si(siNextdotjs, '#ffffff'),
  js: si(siJavascript),
  ts: si(siTypescript),
  python: si(siPython, '#4B8BBE'),
  django: si(siDjango, '#44B78B'),
  php: si(siPhp, '#8892BF'),
  laravel: si(siLaravel),
  ruby: si(siRuby, '#E0475B'),
  rails: si(siRubyonrails, '#E3242B'),
  go: si(siGo),
  rust: si(siRust, '#e8e2dd'),
  dotnet: si(siDotnet, '#8E6BF0'),
  curl: si(siCurl, '#5FA8E0'),
  homebrew: si(siHomebrew, '#FBB040'),
  java: { kind: 'remix', Icon: RiJavaFill, color: '#F89820' },
  terminal: { kind: 'remix', Icon: RiTerminalBoxFill, color: '#d4d4d4' },
  claude: { kind: 'remix', Icon: RiClaudeFill, color: '#D97757' },
  openai: { kind: 'remix', Icon: RiOpenaiFill, color: '#ffffff' },
  cursor: { kind: 'remix', Icon: RiCursorAiFill, color: '#ffffff' },
  github: { kind: 'remix', Icon: RiGithubFill, color: '#ffffff' },
}

const NAMES: Record<string, string> = {
  'Node.js': 'node', nodejs: 'node', Express: 'express', JavaScript: 'js', TypeScript: 'ts', 'Next.js': 'nextjs', Python: 'python', Django: 'django', Go: 'go', Rust: 'rust', PHP: 'php', Laravel: 'laravel', Java: 'java', Ruby: 'ruby', Rails: 'rails', '.NET': 'dotnet', 'C#': 'dotnet', cURL: 'curl', Terminal: 'terminal', CLI: 'terminal', 'macOS & Linux': 'terminal', 'Install script': 'terminal', Homebrew: 'homebrew', 'Debian & Ubuntu': 'terminal', Windows: 'terminal',
}

export function LangLogo({ name, className }: { name: string; className?: string }) {
  if (name === 'claudecode' || name === 'Claude Code') return <ClaudeCodeMark className={cn('shrink-0', className)} />
  const mark = MARKS[NAMES[name] ?? name]
  if (!mark) return null
  if (mark.kind === 'remix')
    return (
      <span aria-hidden className={cn('inline-flex shrink-0 [&>svg]:h-full [&>svg]:w-full', className)} style={{ color: mark.color }}>
        <mark.Icon />
      </span>
    )
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn('shrink-0', className)} fill={mark.color}>
      <path d={mark.path} />
    </svg>
  )
}

export const hasLogo = (name: string) => name === 'claudecode' || Boolean(MARKS[NAMES[name] ?? name])
