---
title: Working in your branch
description: Where your code lives, which branch your pull request targets, and the file-scope rule that keeps every change focused and safe.
---

Once you activate a task, you get an isolated branch in Forke's mirror of the founder's repository. You just write code.

## Your branches

| Branch | Who makes it | What it's for |
| --- | --- | --- |
| `task/<id>-<slug>` | Forke | The task branch, made from the founder's repository. Your pull request targets this. |
| `dev-<username>/task-<id>` | You (or Forke, when you activate) | Your working branch, made from the task branch. |

```bash
git fetch origin
git switch dev-ada/task-1042
# … make your changes …
git commit -m "Add inline validation to the signup form"
git push
```

> [!WARNING]
> Pull requests must target the task branch. A pull request aimed at `main` (or anything else) is rejected automatically.

## Stay inside the file scope

Every task lists the files and folders it may change. Forke checks every pull request against that list and rejects anything that:

- changes a file outside the allowed paths, or
- touches an excluded path, such as `.env`, auth code or secrets.

This is the most important safety check in the whole pipeline. It protects the founder, and it protects you: a focused change is easier to review and approve.

If you're sure the task can't be done inside its scope, ask through [support](/docs-demo/forke/support) before changing anything else.

## Three rules

1. **Never ZIP files or pasted code.** Every submission is a pull request.
2. **Forke is the middle layer.** You never touch the founder's repository.
3. **AI assists, people decide.** The AI review explains your work; the founder makes the call.

## After the task

Task branches are deleted within 24 hours of a task finishing. The record of your work stays on your profile.

## Next steps

:::cards
- [Submitting a pull request](/docs-demo/forke/submitting) — The write-up and what happens next. {icon=GitPullRequest}
- [The review pipeline](/docs-demo/forke/review-pipeline) — The checks your pull request goes through. {icon=ScanSearch}
:::
