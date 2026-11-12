import { Award, Flame, Sparkles, Trophy, Zap } from 'lucide-react'

/** The 25 levels in 5 tiers, XP rules and prestige ranks (same numbers as the live /levels page). */

export const TIERS = [
  {
    id: 'early',
    label: 'Early game',
    range: 'LVL 1–5',
    icon: Flame,
    painting: '/paintings/meadow.jpg',
    levels: [
      { lvl: 1, title: 'Newcomer', xp: '0 XP', unlock: 'Basic bounties' },
      { lvl: 2, title: 'Script Kiddie', xp: '200 XP', unlock: 'Base developer access' },
      { lvl: 3, title: 'Bug Chaser', xp: '500 XP', unlock: 'Custom public profile URL' },
      { lvl: 4, title: 'Commit Rookie', xp: '1,000 XP', unlock: 'Early-stage bounty feed' },
      { lvl: 5, title: 'Stack Explorer', xp: '1,800 XP', unlock: 'Team task applications' },
    ],
  },
  {
    id: 'mid',
    label: 'Mid game',
    range: 'LVL 6–10',
    icon: Zap,
    painting: '/paintings/dusk-hill.jpg',
    levels: [
      { lvl: 6, title: 'Code Runner', xp: '2,800 XP', unlock: 'Advanced search & filters' },
      { lvl: 7, title: 'Patch Hunter', xp: '4,000 XP', unlock: 'Intermediate payout tiers' },
      { lvl: 8, title: 'API Tinkerer', xp: '5,500 XP', unlock: 'Exclusive Discord access' },
      { lvl: 9, title: 'Build Operator', xp: '7,200 XP', unlock: 'Beta feature testing' },
      { lvl: 10, title: 'Sprint Soldier', xp: '9,200 XP', unlock: 'XP streak multipliers (+1.2x)' },
    ],
  },
  {
    id: 'skilled',
    label: 'Skilled tier',
    range: 'LVL 11–15',
    icon: Award,
    painting: '/paintings/lantern-orchard.jpg',
    levels: [
      { lvl: 11, title: 'Merge Specialist', xp: '11,500 XP', unlock: 'Auto-claim standby queue' },
      { lvl: 12, title: 'System Crafter', xp: '14,200 XP', unlock: 'Priority task reservation queue' },
      { lvl: 13, title: 'Bug Assassin', xp: '17,500 XP', unlock: 'Reviewer shadow-mode access' },
      { lvl: 14, title: 'Code Mercenary', xp: '21,500 XP', unlock: 'Higher concurrent task limits' },
      { lvl: 15, title: 'Feature Shipper', xp: '26,000 XP', unlock: 'Elite bounty access + reviewer role eligibility' },
    ],
  },
  {
    id: 'elite',
    label: 'Elite tier',
    range: 'LVL 16–20',
    icon: Sparkles,
    painting: '/paintings/ember-shore.jpg',
    levels: [
      { lvl: 16, title: 'Runtime Knight', xp: '31,500 XP', unlock: 'Evolved profile card frames' },
      { lvl: 17, title: 'Deployment Ninja', xp: '38,000 XP', unlock: 'Custom XP sound FX' },
      { lvl: 18, title: 'Stack Commander', xp: '45,500 XP', unlock: 'Team lead eligibility' },
      { lvl: 19, title: 'Velocity Hacker', xp: '54,000 XP', unlock: 'Fast-track dispute resolution' },
      { lvl: 20, title: 'Production Slayer', xp: '63,500 XP', unlock: 'Direct mentor & advisory roles' },
    ],
  },
  {
    id: 'legend',
    label: 'Legend tier',
    range: 'LVL 21–25',
    icon: Trophy,
    painting: '/paintings/night-haze.jpg',
    levels: [
      { lvl: 21, title: 'Silicon Phantom', xp: '74,000 XP', unlock: 'Exclusive dev merchandise store' },
      { lvl: 22, title: 'Commit Warlord', xp: '86,000 XP', unlock: 'Sneak-peek beta access' },
      { lvl: 23, title: 'Bug Executioner', xp: '99,500 XP', unlock: 'Custom user theme accents' },
      { lvl: 24, title: 'System Overlord', xp: '1,15,000 XP', unlock: 'Direct Slack workspace with founders' },
      { lvl: 25, title: 'Forke Legend', xp: '1,32,000 XP', unlock: 'Private invite-only enterprise projects' },
    ],
  },
] as const

export const ALL_LEVELS = TIERS.flatMap((tier, t) => tier.levels.map((l) => ({ ...l, tier: t })))

export const XP_RULES: {
  title: string
  desc: string
  value?: string
  penalty?: boolean
  details?: { label: string; value: string }[]
}[] = [
  {
    title: 'Completing bounties',
    desc: 'Base XP awarded when a task is approved, based on the budget size.',
    details: [
      { label: '₹100 – ₹399 task', value: '+50 XP' },
      { label: '₹400 – ₹899 task', value: '+100 XP' },
      { label: '₹900 – ₹2,499 task', value: '+200 XP' },
      { label: '₹2,500+ task', value: '+350 XP' },
    ],
  },
  {
    title: 'Star ratings',
    desc: 'Outstanding client feedback boosts your experience curve directly.',
    details: [
      { label: '5★ review', value: '+30 XP' },
      { label: '4★ review', value: '+10 XP' },
    ],
  },
  {
    title: 'Speed bonus',
    desc: 'For delivering before 50% of the allocated deadline has elapsed.',
    value: '+25 XP',
  },
  {
    title: 'Login streaks',
    desc: 'Consistency is rewarded. Claiming daily XP milestones grants compounding returns.',
    value: '+5 to +100 XP',
  },
  {
    title: 'Revision penalties',
    desc: 'Sloppy, untested work that needs a request for changes costs XP.',
    value: '-20 XP',
    penalty: true,
  },
]

export const PRESTIGE = [
  { rank: 'I', title: 'Ascended Developer', perk: 'Animated profile border cosmetics', color: '#D97706' },
  { rank: 'II', title: 'Ghost in Production', perk: 'Glowing neon profile card themes', color: '#ff0055' },
  { rank: 'III', title: 'Legendary Shipper', perk: 'Mythical profile custom accents & themes', color: '#8b5cf6' },
  { rank: 'IV', title: 'Kernel Lord', perk: 'Direct access to private beta bounty lists', color: '#3b82f6' },
  { rank: 'V', title: 'Architect of Chaos', perk: 'Elite leaderboards + custom legend badge', color: '#10b981' },
]
