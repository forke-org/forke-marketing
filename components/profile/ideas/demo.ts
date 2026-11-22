/**
 * @fileoverview Forke Platform
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

// TEMPORARY demo data for the profile redesign previews. Not for commit.

export type Work = {
  id: string
  repo: string
  owner: string
  title: string
  bounty: number
  rating: number
  add: number
  del: number
  tags: string[]
  date: string
  pr: number
  reviewer: string
  note: string
}

export const DEMO = {
  name: 'Riya Sharma',
  username: 'riyabuilds',
  headline: 'Backend engineer. Fixes the queries nobody else wants to touch.',
  bio: 'Third year CS at RVCE. I mostly do Postgres, Node and the boring infra that keeps things up. Two years of freelancing taught me that the hard part is never the code, it is reading someone else’s codebase without crying. Currently obsessed with query plans.',
  location: 'Bengaluru, KA',
  college: 'RV College of Engineering',
  avatarUrl: 'https://i.pravatar.cc/400?img=47',
  level: 7,
  levelTitle: 'Shipper',
  xp: 2840,
  nextXp: 3400,
  earned: 48500,
  shipped: 23,
  rating: 4.9,
  completion: 96,
  streak: 12,
  longest: 31,
  joined: 'Mar 2026',
  id: 'FK-0721',
  github: 'riyabuilds',
  stack: ['Postgres', 'Node.js', 'TypeScript', 'Redis', 'Docker', 'Go'],
}

export const WORK: Work[] = [
  { id: '1', repo: 'paysure/api', owner: 'Paysure', title: 'Fix N+1 query on invoice list endpoint', bounty: 6500, rating: 5, add: 84, del: 212, tags: ['Postgres', 'Node.js'], date: 'Nov 9', pr: 412, reviewer: 'arjun', note: 'Cut p95 from 2.4s to 180ms. Clean PR, great description.' },
  { id: '2', repo: 'kiranakart/web', owner: 'KiranaKart', title: 'Add idempotency keys to checkout', bounty: 9000, rating: 5, add: 196, del: 31, tags: ['TypeScript', 'Redis'], date: 'Oct 28', pr: 88, reviewer: 'meera', note: 'No more double charges. Tests covered every race we could think of.' },
  { id: '3', repo: 'studyhall/backend', owner: 'StudyHall', title: 'Migrate cron jobs to a queue worker', bounty: 7200, rating: 4.8, add: 341, del: 158, tags: ['Node.js', 'Docker'], date: 'Oct 14', pr: 203, reviewer: 'dev', note: 'Shipped behind a flag, rolled out with zero downtime.' },
  { id: '4', repo: 'ledgerly/core', owner: 'Ledgerly', title: 'Index audit_log by tenant and created_at', bounty: 3500, rating: 5, add: 22, del: 4, tags: ['Postgres'], date: 'Sep 30', pr: 57, reviewer: 'sana', note: 'Tiny diff, huge win. Exactly what we asked for.' },
  { id: '5', repo: 'tripnest/services', owner: 'TripNest', title: 'Rate limit the public search API', bounty: 5800, rating: 4.9, add: 128, del: 12, tags: ['Go', 'Redis'], date: 'Sep 18', pr: 141, reviewer: 'kabir', note: 'Sliding window done right, docs included.' },
  { id: '6', repo: 'mediq/portal', owner: 'MediQ', title: 'Fix timezone bug in appointment slots', bounty: 4200, rating: 4.7, add: 46, del: 39, tags: ['TypeScript'], date: 'Sep 2', pr: 76, reviewer: 'nidhi', note: 'Found the root cause in the date library config, not just the symptom.' },
]

export const ACHIEVEMENTS = [
  { label: 'First merge', desc: 'Shipped your first bounty', unlocked: true },
  { label: 'On fire', desc: '7 day streak', unlocked: true },
  { label: 'Boss fight', desc: 'Closed a hard task', unlocked: true },
  { label: 'Untouchable', desc: '10 five star reviews', unlocked: true },
  { label: 'Sprinter', desc: 'Merged within 24h', unlocked: true },
  { label: 'Night owl', desc: 'Shipped after 2am', unlocked: true },
  { label: 'Loot', desc: 'Earned ₹50,000', unlocked: false },
  { label: 'Legend', desc: 'Reach level 10', unlocked: false },
]

/** 53 weeks × 7 days of deterministic, believable activity (0..4 intensity). */
export function demoHeatmap(seed = 7): number[][] {
  let s = seed
  const rand = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
  const weeks: number[][] = []
  for (let w = 0; w < 53; w++) {
    const ramp = Math.min(1, w / 30) // quieter at the start of the year
    const week: number[] = []
    for (let d = 0; d < 7; d++) {
      const weekend = d === 0 || d === 6
      const r = rand() * ramp * (weekend ? 0.7 : 1.15)
      week.push(r < 0.18 ? 0 : r < 0.38 ? 1 : r < 0.6 ? 2 : r < 0.8 ? 3 : 4)
    }
    weeks.push(week)
  }
  // a current streak at the end
  for (let i = 0; i < 12; i++) {
    const w = 52 - Math.floor(i / 7)
    const d = 6 - (i % 7)
    weeks[w][d] = Math.max(weeks[w][d], 2)
  }
  return weeks
}

export const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`

export const REVIEWS = [
  ...WORK.map((w, i) => ({ id: `w${w.id}`, who: w.reviewer, company: w.owner, task: w.title, rating: w.rating, text: w.note, date: w.date, tag: i % 2 ? 'Clear PR' : 'Fast turnaround' })),
  { id: 'r7', who: 'tanvi', company: 'Bookly', task: 'Paginate the orders export', rating: 5, text: 'Asked the right questions before writing a single line. Zero back and forth after.', date: 'Aug 21', tag: 'Great communication' },
  { id: 'r8', who: 'rohan', company: 'Quizly', task: 'Cache leaderboard reads', rating: 4.6, text: 'Solid fix. One round of review comments, handled the same evening.', date: 'Aug 9', tag: 'Responsive' },
]

/** Achievements with progress, for the Achievements tab. */
export const ACHIEVEMENT_TRACK = [
  { label: 'First merge', desc: 'Ship your first bounty', group: 'Shipping', have: 1, need: 1, when: 'Mar 14' },
  { label: 'Ten down', desc: 'Ship 10 bounties', group: 'Shipping', have: 10, need: 10, when: 'Aug 2' },
  { label: 'Fifty club', desc: 'Ship 50 bounties', group: 'Shipping', have: 23, need: 50 },
  { label: 'On fire', desc: 'Keep a 7 day streak', group: 'Consistency', have: 7, need: 7, when: 'Apr 3' },
  { label: 'Monthly', desc: 'Keep a 30 day streak', group: 'Consistency', have: 31, need: 30, when: 'Jul 18' },
  { label: 'Night owl', desc: 'Merge after 2am', group: 'Consistency', have: 1, need: 1, when: 'May 9' },
  { label: 'Untouchable', desc: '10 five-star reviews', group: 'Quality', have: 10, need: 10, when: 'Sep 30' },
  { label: 'Sprinter', desc: 'Merge within 24h of claiming', group: 'Quality', have: 1, need: 1, when: 'Jun 2' },
  { label: 'Boss fight', desc: 'Close a hard task', group: 'Quality', have: 1, need: 1, when: 'Oct 14' },
  { label: 'Legend', desc: 'Reach level 10', group: 'Levels', have: 7, need: 10 },
  { label: 'Polyglot', desc: 'Ship in 5 languages', group: 'Range', have: 3, need: 5 },
  { label: 'Repo hopper', desc: 'Ship for 10 different owners', group: 'Range', have: 8, need: 10 },
]
