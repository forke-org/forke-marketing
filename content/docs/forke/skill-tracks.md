---
title: Skill tracks
description: How Frontend, Backend, Fullstack, Mobile and AI/ML tracks work, and how a task's tags decide the tier it needs.
---

Skill tracks measure how deep you go in one area, separately from your level. A level 20 backend developer and a level 20 frontend developer see different tasks.

## Tracks and tiers

Tracks: **Frontend**, **Backend**, **Fullstack**, **Mobile** and **AI/ML**. Each has tiers:

| Tier | Meaning |
| --- | --- |
| 1 | Beginner |
| 2 | Intermediate |
| 3 | Advanced |

You move up a track by shipping approved tasks in it.

## How tags gate a task

Every skill tag maps to a tier. A task's requirement is the **highest tier among its tags**.

| Tag | Tier |
| --- | --- |
| HTML/CSS | 1 |
| UI/UX | 2 |
| React | 3 |
| Next.js | 4 |
| Database | 5 |

So a task tagged `React` + `HTML/CSS` needs tier 3, and one tagged `Next.js` + `Database` needs tier 5. Founders can add up to 5 tags. Custom tags (like Stripe or Prisma) count as tier 1.

> [!NOTE]
> Skill tier is one of three gates. You also need the task's level and trust score. See [How Forke works](/docs-demo/forke/how-it-works#three-gates-decide-who-can-claim).

## Next steps

:::cards
- [Finding tasks](/docs-demo/forke/feed) — How the gates shape your feed. {icon=LayoutList}
- [Trust score](/docs-demo/forke/trust-score) — The third gate. {icon=ShieldCheck}
:::
