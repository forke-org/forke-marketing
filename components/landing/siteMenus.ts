/**
 * The site's menus. The footer shows SITE_MENUS as columns; the sticky navbar shows NAV_MENUS as dropdowns (the same
 * first three, with Contact in place of Legal), each with a coded bento beside its links.
 */
/**
 * `desc` is the one-line hint the navbar shows under a link (the footer shows just the label). `soon` marks something not
 * launched yet: it shows the shiny Soon tag and is not a link (its href stays empty).
 */
export type SiteLink = { label: string; href: string; desc?: string; soon?: boolean }
/** `bento` names the coded panel the navbar shows beside the links. */
export type SiteMenu = { title: string; links: SiteLink[]; bento?: 'mail' | 'builtFor' | 'blogs' | 'contact' }

export const SITE_MENUS: SiteMenu[] = [
  {
    title: 'Company',
    links: [
      { label: "What's Forke", href: '/whats-forke', desc: 'How the marketplace works, end to end' },
      { label: 'Levels', href: '/levels', desc: 'Apprentice to Architect, and the perks' },
      { label: 'Contact', href: '/contact' },
      { label: 'Forke Mail', href: '', desc: 'Email API for developers', soon: true },
    ],
  },
  {
    title: 'Built for',
    links: [
      { label: 'Contributors', href: '/#how', desc: 'Ship scoped tasks, get paid on merge' },
      { label: 'Repo owners', href: '/#faq', desc: 'Post work, review it, pay on approval' },
      { label: 'Students', href: '/#how', desc: 'Real merged work on your profile' },
      { label: 'Open source', href: '/#use-cases', desc: 'Fund the issues that matter' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blogs', href: '/blogs', desc: 'Engineering notes and deep-dives' },
      { label: 'Changelog', href: '/changelog', desc: 'Everything we ship, newest first' },
      { label: 'Docs', href: '/docs', desc: 'Guides for contributors and repo owners' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Refund Policy', href: '/refund' },
    ],
  },
]

export const isExternal = (href: string) => href.startsWith('http') || href.startsWith('mailto:')

const [company, builtFor, resources] = SITE_MENUS

/** The navbar's dropdowns. Contact gets its own menu there, so it leaves Company. */
export const NAV_MENUS: SiteMenu[] = [
  { ...company, links: company.links.filter((l) => l.href !== '/contact'), bento: 'mail' },
  { ...builtFor, bento: 'builtFor' },
  { ...resources, bento: 'blogs' },
  {
    title: 'Contact',
    bento: 'contact',
    links: [
      { label: 'Contact us', href: '/contact', desc: 'Talk to the team' },
      { label: 'Email support', href: 'mailto:support@forke.space', desc: 'support@forke.space' },
      { label: 'Instagram', href: 'https://www.instagram.com/forke.space/', desc: '@forke.space' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/company/forke/', desc: 'Forke on LinkedIn' },
      { label: 'GitHub', href: 'https://github.com/forke-org', desc: 'forke-org' },
    ],
  },
]
