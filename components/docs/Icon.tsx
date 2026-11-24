/**
 * @fileoverview Forke Platform
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

import {
  Activity, ArrowRightLeft, Ban, BellOff, BookA, BookOpen, Bot, Braces, Building2, ChartColumn, ClipboardCheck, Code, Coins, Compass, Download, FileCode, Filter, FlaskConical,
  Gauge, Gavel, GitBranch, GitFork, GitMerge, GitPullRequest, Globe, Hammer, Hand, IdCard, Inbox, KeyRound, Languages, Layers, LayoutList, LayoutTemplate, LifeBuoy, ListChecks,
  ListOrdered, Mail, Megaphone, MessageCircle, MessagesSquare, MousePointer2, MousePointerClick, PenLine, Plug, RefreshCw, Rocket, Scale, ScanSearch, Send, Server, ShieldCheck,
  Sparkles, SquareTerminal, Terminal, Timer, TrendingUp, TriangleAlert, Users, Vault, Wallet, Wand, Webhook, Workflow, Wrench, Zap, Brain, Trophy, Lock, Eye, Plane, Cable, type LucideIcon,
} from 'lucide-react'
import { RiGithubFill } from '@remixicon/react'
import { LangLogo, hasLogo } from './LangLogo'

const ICONS: Record<string, LucideIcon | React.ComponentType<{ className?: string }>> = {
  Activity, ArrowRightLeft, Ban, BellOff, BookA, BookOpen, Bot, Braces, Building2, ChartColumn, ClipboardCheck, Code, Coins, Compass, Download, FileCode, Filter, FlaskConical,
  Gauge, Gavel, GitBranch, GitFork, GitMerge, GitPullRequest, Globe, Hammer, Hand, IdCard, Inbox, KeyRound, Languages, Layers, LayoutList, LayoutTemplate, LifeBuoy, ListChecks,
  ListOrdered, Mail, Megaphone, MessageCircle, MessagesSquare, MousePointer2, MousePointerClick, PenLine, Plug, RefreshCw, Rocket, Scale, ScanSearch, Send, Server, ShieldCheck,
  Sparkles, SquareTerminal, Terminal, Timer, TrendingUp, TriangleAlert, Users, Vault, Wallet, Wand, Webhook, Workflow, Wrench, Zap, Brain, Trophy, Lock, Eye, Plane, Cable,
  Github: RiGithubFill,
}

export function DocIcon({ name, className }: { name?: string; className?: string }) {
  if (!name) return null
  const I = ICONS[name]
  if (I) return <I className={className} />
  if (hasLogo(name)) return <LangLogo name={name} className={className} />
  return null
}
