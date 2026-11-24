---
title: Finding tasks
description: How the task feed decides what you see, how to filter it, and how to read everything on a task card before you claim.
---

The [task feed](https://dashboard.forke.space/tasks) only shows tasks you can actually claim. You never scroll past locked work.

## What decides what you see

A task appears in your feed when you meet all three of its gates:

| Gate | Example requirement |
| --- | --- |
| Level | Level 4 or higher |
| Skill tier | Frontend tier 2 or higher |
| Trust score | 70% or higher |

The skill requirement comes from the task's tags: the **highest tier among its tags** sets the bar. A task tagged `Next.js` + `Database` needs more than one tagged `HTML/CSS`. See [Skill tracks](/docs-demo/forke/skill-tracks).

## Filtering

Filter by skill tag and budget. Filters live in the page address, so you can bookmark or share a filtered feed.

## Reading a task card

| On the card | What it tells you |
| --- | --- |
| **Domain** | The track: Frontend, Backend, Fullstack, Mobile or AI/ML. |
| **Skill tier** | How deep the work goes, from 1 (beginner) up. |
| **Estimated time** | How long a developer at the required level should take. |
| **Risk** | Low, Medium or High: how much could break. |
| **Criticality** | Personal, Startup or Production: how much it matters if it does. |
| **XP reward** | What you'll earn on approval, before bonuses. |
| **Budget** | What you'll be paid, in full. |

> [!NOTE]
> Criticality changes how strictly the work is reviewed. A Production task touching auth or payments gets stricter risk scoring than a Personal one.

## Before you claim

1. Read the description and every acceptance criterion.
2. Check the file scope: is everything you'd need to change inside it?
3. Make sure you can start in the next 20 minutes and finish well inside the estimate.

## Next steps

:::cards
- [Claiming a task](/docs-demo/forke/claiming) — Reservations, activation and deadlines. {icon=Hand}
- [Skill tracks](/docs-demo/forke/skill-tracks) — How tags map to tiers. {icon=Layers}
:::
