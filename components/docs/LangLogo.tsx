/**
 * @fileoverview Forke Platform
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

import { RiJavaFill, RiNextjsFill, RiNodejsFill, RiPhpFill, RiTerminalBoxFill, RiClaudeFill, RiOpenaiFill, RiCursorAiFill, RiGithubFill, RiJavascriptFill } from '@remixicon/react'
import { SIMPLE_ICONS } from '@/components/landing/simple-icons'
import { cn } from '@/lib/utils/cn'
import { ClaudeCodeMark } from './ClaudeCodeMark'

/** Brand marks for languages, frameworks and AI apps, by display name or guide id. */

type Mark = { kind: 'remix'; Icon: React.ComponentType<{ className?: string }>; color: string } | { kind: 'simple'; path: string; color: string } | { kind: 'mono'; text: string; color: string }

const MARKS: Record<string, Mark> = {
  node: { kind: 'remix', Icon: RiNodejsFill, color: '#5FA04E' },
  nextjs: { kind: 'remix', Icon: RiNextjsFill, color: '#ffffff' },
  js: { kind: 'remix', Icon: RiJavascriptFill, color: '#F7DF1E' },
  ts: { kind: 'simple', path: SIMPLE_ICONS.typescript.path, color: '#3178C6' },
  python: { kind: 'simple', path: SIMPLE_ICONS.python.path, color: '#5A9FD4' },
  go: { kind: 'simple', path: SIMPLE_ICONS.go.path, color: '#00ADD8' },
  rust: { kind: 'simple', path: SIMPLE_ICONS.rust.path, color: '#F0B191' },
  php: { kind: 'remix', Icon: RiPhpFill, color: '#8892BF' },
  java: { kind: 'remix', Icon: RiJavaFill, color: '#F89820' },
  terminal: { kind: 'remix', Icon: RiTerminalBoxFill, color: '#d4d4d4' },
  ruby: { kind: 'mono', text: 'rb', color: '#E0475B' },
  dotnet: { kind: 'mono', text: '.N', color: '#9B7BE0' },
  laravel: { kind: 'mono', text: 'L', color: '#FF2D20' },
  claude: { kind: 'remix', Icon: RiClaudeFill, color: '#D97757' },
  openai: { kind: 'remix', Icon: RiOpenaiFill, color: '#ffffff' },
  cursor: { kind: 'remix', Icon: RiCursorAiFill, color: '#ffffff' },
  github: { kind: 'remix', Icon: RiGithubFill, color: '#ffffff' },
  json: { kind: 'mono', text: '{}', color: '#a3a3a3' },
}

const NAMES: Record<string, string> = {
  'Node.js': 'node', Express: 'node', JavaScript: 'js', TypeScript: 'ts', 'Next.js': 'nextjs', Python: 'python', Django: 'python', Go: 'go', Rust: 'rust', PHP: 'php', Laravel: 'laravel', Java: 'java', Ruby: 'ruby', Rails: 'ruby', '.NET': 'dotnet', 'C#': 'dotnet', cURL: 'terminal', Terminal: 'terminal', CLI: 'terminal', JSON: 'json',
  nodejs: 'node', express: 'node', django: 'python', rails: 'ruby', curl: 'terminal',
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
  if (mark.kind === 'simple')
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cn('shrink-0', className)} fill={mark.color}>
        <path d={mark.path} />
      </svg>
    )
  return (
    <span aria-hidden className={cn('inline-flex shrink-0 items-center justify-center rounded-[3px] font-mono text-[8px] leading-none font-bold', className)} style={{ background: mark.color + '26', color: mark.color }}>
      {mark.text}
    </span>
  )
}

export const hasLogo = (name: string) => name === 'claudecode' || Boolean(MARKS[NAMES[name] ?? name])
