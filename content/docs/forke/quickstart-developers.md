---
title: Quickstart for developers
description: From sign-up to your first payout. Connect GitHub, set up UPI, claim a task, ship it as a pull request and get paid.
---

This guide takes you through your first task end to end. It takes about ten minutes to set up, then however long the task takes.

By the end you'll have:

1. A Forke account with GitHub connected and a starting level
2. A UPI ID ready for payouts
3. Your first task claimed, shipped and paid

:::steps

### Sign up as a developer

Go to [forke.space](https://www.forke.space/register) and choose **Do tasks**. Sign up with GitHub or Google. The developer path is open: there's no application and no interview.

### Connect GitHub

If you signed up with Google, connect GitHub from the banner in the app (you have 7 days). Forke looks at your public GitHub activity once to set your **starting level** (1 to 3), then a 60-second skill check tunes your feed.

> [!NOTE]
> Forke never asks for access to your private repositories. Founders install Forke's GitHub App on their own repositories; you only ever work in Forke's mirror. See [Connecting GitHub](/docs-demo/forke/github).

### Add your UPI ID

Open [Settings](https://dashboard.forke.space/settings) and add your UPI ID. This is where money lands the moment a founder approves your work, so do it before your first submission.

### Find a task you can finish

Open the [task feed](https://dashboard.forke.space/tasks). You only see tasks you're eligible for: your level, skill tier and trust score all meet the task's gates. Read the description and acceptance criteria first, and pick something you can start right now.

> [!TIP]
> For your first task, pick one inside your strongest skill and well under your available time. A clean first submission raises your trust score, which opens up better tasks.

### Claim it, then start within 20 minutes

Press **Claim**. The task is reserved for you for 20 minutes. Start work in that window and it locks to you: create your branch, push a first commit, open a draft pull request, or press **I'm Working**. You earn 5 XP, and the deadline starts now.

::demo{name="claim"}

### Build in your Forke branch

Your branch is `dev-<you>/task-<id>` in Forke's mirror of the founder's repository. Stay inside the task's file scope: anything outside it is rejected automatically. See [Working in your branch](/docs-demo/forke/branches).

### Open a pull request

Fill in the `FORKE_SUBMISSION.md` file Forke adds to your branch (what you changed, why, and how you tested it), then open a pull request against the task branch. Automated checks and the AI review start straight away. See [Submitting a pull request](/docs-demo/forke/submitting).

### Get paid

When the founder approves, Forke merges your work upstream, releases the budget to your UPI and adds XP. The task appears on your public profile, linked to the merged pull request.

::demo{name="payout"}

:::

## Make the most of it

- **Submit before half the deadline** for a 25 XP speed bonus.
- **Read the acceptance criteria twice.** They are exactly what the AI review and the founder check against.
- **Don't claim what you can't start.** Abandoning a task after you've started is the biggest hit to your trust score.
- **Keep the write-up honest.** "Known limitations" is a strength, not a weakness: it builds trust with founders.

## Next steps

:::cards
- [Finding tasks](/docs-demo/forke/feed) — How the feed is filtered and how to read a task card. {icon=LayoutList}
- [Earning XP](/docs-demo/forke/xp) — Every way to earn and lose XP, with a worked example. {icon=Zap}
- [The review pipeline](/docs-demo/forke/review-pipeline) — What your pull request goes through. {icon=ScanSearch}
- [Trust score](/docs-demo/forke/trust-score) — What raises it and what hurts it. {icon=ShieldCheck}
:::
