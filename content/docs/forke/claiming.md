---
title: Claiming a task
description: How a claim becomes a 20-minute reservation, how to activate it, when the deadline starts, and what happens if you don't make it.
---

Claiming is built for speed. A task shouldn't sit reserved by someone who isn't working on it, so a claim is a short reservation until you actually start.

::demo{name="claim"}

## The 20-minute reservation

When you press **Claim**, the task becomes `RESERVED` for you for 20 minutes. Other developers see it as reserved, with the time left. Twenty minutes is long enough to really start, and short enough that a claim that goes nowhere returns to the feed quickly.

## Activating

Do any one of these within the 20 minutes and the task locks to you:

- Create your branch
- Push your first commit
- Open a draft pull request
- Press **I'm Working**

You earn **+5 XP**, the task becomes `IN_PROGRESS`, and **the deadline starts now**, not when you claimed.

## If the reservation runs out

The task goes back to the feed and the next developer in line gets it. They've often been looking at the task already, so they can start within minutes. A reservation running out once isn't held against you; abandoning a task after activating is.

## While you work

Forke quietly watches for signs a task is stuck (no commits, repeated failed builds, changes outside the scope) so it can step in early instead of letting the deadline pass.

## If the deadline passes

The task becomes `EXPIRED`, goes back to the feed, and your trust score drops. If you know you can't finish, say so early through [support](/docs-demo/forke/support).

> [!IMPORTANT]
> Only claim what you can start right now. Abandoning after you've activated is the biggest single hit to your trust score.

## Next steps

:::cards
- [Working in your branch](/docs-demo/forke/branches) — Where to write your code. {icon=GitBranch}
- [Trust score](/docs-demo/forke/trust-score) — Why finishing matters so much. {icon=ShieldCheck}
:::
