/**
 * @fileoverview Forke Platform
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

import { API_GROUPS } from './api-spec'
import { LANGUAGE_GUIDES } from './languages'

/**
 * The docs information architecture: product tabs → sidebar groups → pages.
 * Every page lives at /docs-demo/<path> and its markdown at /docs-demo/<path>.md.
 * Pages without a file in content/docs are generated (API reference, language guides).
 */

export type NavItem = { title: string; path: string; icon?: string; badge?: string }
export type NavGroup = { title: string; items: NavItem[] }
export type Tab = { id: string; title: string; icon: string; root: string; description: string; groups: NavGroup[] }

const item = (path: string, title: string, icon?: string, badge?: string): NavItem => ({ path, title, icon, badge })

export const TABS: Tab[] = [
  {
    id: 'overview',
    title: 'Overview',
    icon: 'Compass',
    root: '',
    description: 'Start here',
    groups: [],
  },
  {
    id: 'forke',
    title: 'Forke',
    icon: 'GitFork',
    root: 'forke',
    description: 'The developer task marketplace',
    groups: [
      {
        title: 'Get started',
        items: [
          item('forke', 'What is Forke?', 'Sparkles'),
          item('forke/how-it-works', 'How Forke works', 'Workflow'),
          item('forke/quickstart-developers', 'Quickstart for developers', 'Code'),
          item('forke/quickstart-founders', 'Quickstart for founders', 'Rocket'),
          item('forke/glossary', 'Glossary', 'BookA'),
        ],
      },
      {
        title: 'Your account',
        items: [
          item('forke/profile', 'Profile & proof of work', 'IdCard'),
          item('forke/github', 'Connecting GitHub', 'Github'),
          item('forke/payouts', 'UPI payouts & settings', 'Wallet'),
        ],
      },
      {
        title: 'Doing tasks',
        items: [
          item('forke/feed', 'Finding tasks', 'LayoutList'),
          item('forke/claiming', 'Claiming a task', 'Hand'),
          item('forke/branches', 'Working in your branch', 'GitBranch'),
          item('forke/submitting', 'Submitting a pull request', 'GitPullRequest'),
        ],
      },
      {
        title: 'Review',
        items: [
          item('forke/review-pipeline', 'The review pipeline', 'ScanSearch'),
          item('forke/verdict-card', 'Reading the verdict card', 'ClipboardCheck'),
        ],
      },
      {
        title: 'Posting tasks',
        items: [
          item('forke/posting-tasks', 'Writing a great task', 'PenLine'),
          item('forke/escrow', 'Escrow & payments', 'Vault'),
          item('forke/refunds-disputes', 'Refunds & disputes', 'Scale'),
        ],
      },
      {
        title: 'Progression',
        items: [
          item('forke/xp', 'Earning XP', 'Zap'),
          item('forke/levels', 'Levels & unlocks', 'TrendingUp'),
          item('forke/skill-tracks', 'Skill tracks', 'Layers'),
          item('forke/trust-score', 'Trust score', 'ShieldCheck'),
        ],
      },
      {
        title: 'Help',
        items: [
          item('forke/policies', 'Rules & trust and safety', 'Gavel'),
          item('forke/support', 'Getting support', 'LifeBuoy'),
        ],
      },
    ],
  },
  {
    id: 'mail',
    title: 'Forke Mail',
    icon: 'Mail',
    root: 'mail',
    description: 'Email API for developers and agents',
    groups: [
      {
        title: 'Get started',
        items: [
          item('mail', 'Introduction', 'Sparkles'),
          item('mail/quickstart', 'Quickstart', 'Rocket'),
          item('mail/concepts', 'How Forke Mail works', 'Workflow'),
          item('mail/test-mode', 'Test mode & live mode', 'FlaskConical'),
        ],
      },
      {
        title: 'Send with your stack',
        items: [item('mail/languages', 'All languages', 'Languages'), ...LANGUAGE_GUIDES.map((l) => item(`mail/send-with-${l.id}`, l.name, l.icon))],
      },
      {
        title: 'Domains',
        items: [
          item('mail/domains', 'Add & verify a domain', 'Globe'),
          item('mail/dns-providers', 'DNS provider guides', 'Server'),
          item('mail/deliverability', 'Deliverability', 'Inbox'),
        ],
      },
      {
        title: 'Sending',
        items: [
          item('mail/sending', 'Transactional email', 'Send'),
          item('mail/templates', 'Templates', 'LayoutTemplate'),
          item('mail/idempotency', 'Retries & idempotency', 'RefreshCw'),
          item('mail/tracking', 'Open & click tracking', 'MousePointerClick'),
        ],
      },
      {
        title: 'Audience',
        items: [
          item('mail/contacts', 'Contacts & import', 'Users'),
          item('mail/events', 'Events', 'Activity'),
          item('mail/segments', 'Segments', 'Filter'),
          item('mail/topics', 'Topics & unsubscribes', 'BellOff'),
          item('mail/suppressions', 'Suppressions', 'Ban'),
        ],
      },
      {
        title: 'Marketing',
        items: [
          item('mail/broadcasts', 'Broadcasts', 'Megaphone'),
          item('mail/workflows', 'Workflows', 'GitMerge'),
        ],
      },
      {
        title: 'Monitor',
        items: [
          item('mail/deliveries', 'Deliveries & timelines', 'ListChecks'),
          item('mail/analytics', 'Analytics', 'ChartColumn'),
          item('mail/webhooks', 'Webhooks', 'Webhook'),
          item('mail/reputation', 'Reputation & alerts', 'Gauge'),
        ],
      },
      {
        title: 'Account',
        items: [
          item('mail/projects-and-team', 'Projects & team', 'Building2'),
          item('mail/api-keys', 'API keys', 'KeyRound'),
          item('mail/limits-and-credits', 'Credits, limits & warm-up', 'Coins'),
          item('mail/migrate', 'Migrate to Forke Mail', 'ArrowRightLeft'),
          item('mail/troubleshooting', 'Troubleshooting', 'Wrench'),
        ],
      },
    ],
  },
  {
    id: 'api',
    title: 'Mail API',
    icon: 'Braces',
    root: 'mail/api',
    description: 'HTTP API reference',
    groups: [
      {
        title: 'Using the API',
        items: [
          item('mail/api', 'Introduction', 'BookOpen'),
          item('mail/api/authentication', 'Authentication', 'KeyRound'),
          item('mail/api/errors', 'Errors', 'TriangleAlert'),
          item('mail/api/rate-limits', 'Rate limits', 'Timer'),
          item('mail/api/pagination', 'Pagination', 'ListOrdered'),
        ],
      },
      ...API_GROUPS.map((g) => ({
        title: g.title,
        items: g.endpoints.map((e) => item(`mail/api/${g.id}/${e.id}`, e.title, undefined, e.method)),
      })),
    ],
  },
  {
    id: 'agents',
    title: 'Agents & CLI',
    icon: 'Bot',
    root: 'agents',
    description: 'MCP server, CLI and prompts',
    groups: [
      {
        title: 'Get started',
        items: [
          item('agents', 'Overview', 'Sparkles'),
          item('agents/quickstart', 'Quickstart', 'Rocket'),
          item('agents/safety', 'Safety & confirmations', 'ShieldCheck'),
        ],
      },
      {
        title: 'Connect your app',
        items: [
          item('agents/claude', 'Claude', 'MessageCircle'),
          item('agents/chatgpt', 'ChatGPT', 'MessagesSquare'),
          item('agents/claude-code', 'Claude Code', 'SquareTerminal'),
          item('agents/cursor', 'Cursor, VS Code & others', 'MousePointer2'),
          item('agents/servers-and-ci', 'Servers, CI & frameworks', 'Server'),
        ],
      },
      {
        title: 'Use it',
        items: [
          item('agents/prompts', 'Prompt library', 'Wand'),
          item('agents/tools', 'Tools reference', 'Hammer'),
        ],
      },
      {
        title: 'CLI',
        items: [
          item('agents/cli', 'Install & sign in', 'Download'),
          item('agents/cli-commands', 'Commands', 'Terminal'),
        ],
      },
      {
        title: 'Advanced',
        items: [
          item('agents/build-a-client', 'Build your own MCP client', 'Plug'),
          item('agents/docs-for-agents', 'These docs, for agents', 'FileCode'),
        ],
      },
    ],
  },
]

export const ALL_ITEMS: (NavItem & { tab: string; group: string })[] = TABS.flatMap((t) => t.groups.flatMap((g) => g.items.map((i) => ({ ...i, tab: t.id, group: g.title }))))

/** The tab that owns a path: the longest matching root wins, so mail/api beats mail. */
export function tabFor(path: string): Tab {
  let best = TABS[0]
  for (const t of TABS) {
    if (!t.root) continue
    if ((path === t.root || path.startsWith(t.root + '/')) && t.root.length > best.root.length) best = t
  }
  return best
}

export function neighbours(path: string) {
  const tab = tabFor(path)
  const list = ALL_ITEMS.filter((i) => i.tab === tab.id)
  const at = list.findIndex((i) => i.path === path)
  return { prev: at > 0 ? list[at - 1] : null, next: at >= 0 && at < list.length - 1 ? list[at + 1] : null, group: at >= 0 ? list[at].group : null }
}

/** Old article slugs (before the docs remake) → new paths. */
export const LEGACY: Record<string, string> = {
  welcome: 'forke',
  'core-concepts': 'forke/glossary',
  'for-developers': 'forke/quickstart-developers',
  'for-founders': 'forke/quickstart-founders',
  profile: 'forke/profile',
  'github-connection': 'forke/github',
  'account-settings': 'forke/payouts',
  'browsing-the-feed': 'forke/feed',
  'claiming-a-task': 'forke/claiming',
  'branch-workflow': 'forke/branches',
  'submitting-a-pr': 'forke/submitting',
  'review-pipeline': 'forke/review-pipeline',
  'verdict-card': 'forke/verdict-card',
  'acceptance-criteria': 'forke/posting-tasks',
  'xp-system': 'forke/xp',
  'levels-and-unlocks': 'forke/levels',
  'skill-tracks': 'forke/skill-tracks',
  'trust-score': 'forke/trust-score',
  'escrow-system': 'forke/escrow',
  'refunds-and-disputes': 'forke/refunds-disputes',
  'platform-policies': 'forke/policies',
  'getting-support': 'forke/support',
  'forke-mail': 'mail',
  'forke-mail-connect': 'agents/quickstart',
  'forke-mail-safety': 'agents/safety',
  'forke-mail-tools': 'agents/tools',
  'forke-mail-cli': 'agents/cli',
  'forke-mail-api': 'mail/api',
}
