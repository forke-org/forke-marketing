---
title: How Forke works
description: The full picture in one page. The task lifecycle, the three gates that decide who can claim what, the Git workflow and how money moves.
---

By the end of this page you'll know what happens to a task from the moment it's posted to the moment the developer is paid, and why each step is there.

## The task lifecycle

A task is always in exactly one state. The app shows it on every task card.

| State | What it means | What moves it on |
| --- | --- | --- |
| `OPEN` | Anyone eligible can claim it. | A developer claims it. |
| `RESERVED` | Held for one developer for 20 minutes. | They start work, or the 20 minutes run out. |
| `IN_PROGRESS` | Locked to that developer. The deadline is running. | They open a pull request, or the deadline passes. |
| `UNDER_REVIEW` | The pull request is going through automated checks and the AI review. | The pipeline finishes. |
| `AWAITING_OWNER` | The verdict card is ready for the founder. | The founder approves or asks for changes. |
| `REVISION_REQUESTED` | Sent back to the same developer with notes. | They submit again. |
| `COMPLETED` | Approved, merged upstream, paid and on the developer's profile. | Nothing. It's done. |
| `EXPIRED` | The deadline passed without a submission. | It goes back to `OPEN`. |

Two rules keep the marketplace moving:

- **A claim is only a reservation.** You have 20 minutes to actually start (create your branch, push a commit, open a draft pull request or press **I'm Working**). If you don't, the task goes to the next developer. See [Claiming a task](/docs-demo/forke/claiming).
- **The deadline starts when you start**, not when you claim. Expiring after you've started costs trust score, so only claim what you can start now.

## Three gates decide who can claim

Every task has three requirements, and you see a task in your feed only when you meet all three.

| Gate | What it measures | How it grows |
| --- | --- | --- |
| **Level** (1–25) | Experience and consistency on Forke | XP from approved tasks, speed and ratings. See [Earning XP](/docs-demo/forke/xp). |
| **Skill tier** | Depth in one area: frontend, backend, fullstack, mobile, AI/ML | Shipping tasks in that track. See [Skill tracks](/docs-demo/forke/skill-tracks). |
| **Trust score** | Reliability: finishing, hitting deadlines, ratings | Your real history. It can't be self-reported. See [Trust score](/docs-demo/forke/trust-score). |

A production payments task might need level 12, a fullstack tier of 3 and a trust score above 85%. A developer who meets two of the three never sees it. That's what lets a founder trust whoever claims their task.

## Code flows through Forke, not around it

Developers never touch the founder's repository. Forke keeps a mirror and gives every task its own branches:

```text
founder/repo  →  Forke mirror  →  task/1042-signup-validation  →  dev-ada/task-1042
                                                                       │
founder/repo  ←  clean squash-merge  ←  approval  ←  review  ←  pull request
```

- The developer's branch is created from the task branch, and the pull request targets the task branch, never `main`.
- Every pull request is checked against the task's **file scope**. Changes outside it are rejected automatically.
- Secrets (`.env` files, hard-coded tokens) are blocked at commit time.
- Only Forke merges, and only after the founder approves. The founder sees one clean commit.

More in [Working in your branch](/docs-demo/forke/branches).

## Review: machines check, AI explains, people decide

When a pull request opens, four layers run in order: automated validation (build, tests, lint, types, security scan, scope check), context assembly, an AI review that scores the work, and risk scoring that decides who looks next. The founder gets a **verdict card**: a plain-English summary with scores and flags, readable in a minute.

::demo{name="pipeline" caption="A pull request going through the four layers and producing a verdict card."}

Details in [The review pipeline](/docs-demo/forke/review-pipeline).

## Money: escrow first, payout on approval

1. The founder funds the budget when posting. Forke holds it in escrow, so it's visibly there before anyone starts.
2. If the work fails automated checks, nothing moves.
3. On approval, Forke releases the full budget to the developer's UPI straight away. There is no withdrawal step.

Forke charges founders a flat 10% on top: a ₹500 task costs the founder ₹550, and the developer receives the full ₹500. See [Escrow & payments](/docs-demo/forke/escrow).

## Next steps

:::cards
- [Quickstart for developers](/docs-demo/forke/quickstart-developers) — From sign-up to your first payout. {icon=Code}
- [Quickstart for founders](/docs-demo/forke/quickstart-founders) — Post your first task. {icon=Rocket}
:::
