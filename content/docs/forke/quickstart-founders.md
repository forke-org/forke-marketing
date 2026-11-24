---
title: Quickstart for founders
description: Post your first task. Get approved, connect your repository, scope the work, fund escrow, then approve a verdict card instead of reading a diff.
---

Need a bug fixed or a small feature built this week, without hiring a freelancer for a month? This guide gets your first task from idea to merged pull request.

By the end you'll have posted a task, had it built by a verified developer, and merged a clean pull request into your repository.

:::steps

### Apply for founder access

Choose **Post tasks** on [forke.space](https://www.forke.space/register) and fill in the short application: your name, company, LinkedIn, role and what you want to build. A person at Forke reviews every founder, which keeps the marketplace trustworthy for developers too. You'll hear back by email.

### Connect your repository

Install Forke's GitHub App on the repository the work belongs in. Forke creates a mirror and a branch for each task. Your repository is never pushed to directly: you'll get one clean pull request when you approve.

### Scope the task

Write a task a developer could finish in 30 minutes to about 4 hours:

- **Title and description**: what's wrong or what should exist, and why.
- **Acceptance criteria**: observable outcomes you can check ("the form shows an inline error on an invalid email").
- **File scope**: the files and folders the task may touch. Anything else is rejected automatically.
- **Tech stack**: up to 5 skill tags. They decide which developers can see the task.
- **Budget and time estimate**.

The tighter the scope, the faster and cleaner the result. See [Writing a great task](/docs-demo/forke/posting-tasks).

### Fund escrow

Pay the budget plus Forke's 10% through Razorpay. Forke holds the money in escrow, so developers can see it's there. You only pay out when you approve.

| Task budget | Forke's 10% | You pay | Developer receives |
| --- | --- | --- | --- |
| ₹500 | ₹50 | ₹550 | ₹500 |
| ₹1,500 | ₹150 | ₹1,650 | ₹1,500 |

### Let it get built

Eligible developers see the task in their feed and one claims it. You don't pick or interview anyone: the [three access gates](/docs-demo/forke/how-it-works#three-gates-decide-who-can-claim) already did that. You can follow progress from the task page.

### Read the verdict card and decide

When the pull request passes the automated checks, you get a **verdict card**: what changed in plain English, scores for completeness, quality and fit, and anything flagged. You're answering "does this solve my problem?", not reviewing code line by line.

- **Approve**: Forke squash-merges a clean pull request into your repository and pays the developer.
- **Request changes**: the work goes back to the same developer with your notes.

::demo{name="payout"}

:::

## Next steps

:::cards
- [Writing a great task](/docs-demo/forke/posting-tasks) — Acceptance criteria and scopes that get it right the first time. {icon=PenLine}
- [Reading the verdict card](/docs-demo/forke/verdict-card) — What every score and flag means. {icon=ClipboardCheck}
- [Escrow & payments](/docs-demo/forke/escrow) — When money moves, and when it doesn't. {icon=Vault}
- [Refunds & disputes](/docs-demo/forke/refunds-disputes) — What happens when things don't go to plan. {icon=Scale}
:::
