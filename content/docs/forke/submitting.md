---
title: Submitting a pull request
description: Fill in FORKE_SUBMISSION.md, open your pull request, and follow it through review. What to write and what fails automatically.
---

A submission is more than code. It's a pull request with a short, structured write-up that the review pipeline and the founder both read.

## Fill in FORKE_SUBMISSION.md

Forke adds this file to your branch. Fill it in before you open the pull request.

| Section | Required | What to write |
| --- | --- | --- |
| **What I changed** | Yes, at least two points | The concrete changes, in plain words. |
| **Why I made these choices** | Yes | The decisions a reviewer might question. |
| **Testing performed** | Yes | How you know it works. |
| **Known limitations** | No, but encouraged | What it doesn't do, or edge cases you left. |
| **Screenshots / demo** | No, strongly encouraged for UI | What it looks like now. |

```markdown FORKE_SUBMISSION.md
## What I changed
- Added Zod schemas for the signup form fields
- Show an inline error under each field as soon as it loses focus

## Why I made these choices
Zod was already used for the API, so the form shares the same rules.

## Testing performed
Unit tests for the schema; checked in Chrome and Safari, keyboard only.

## Known limitations
Doesn't check whether the email is already registered; that needs an API call.
```

> [!IMPORTANT]
> A missing or empty required section fails the automated checks straight away, before any AI review runs.

This write-up does three jobs: it makes you think through what you built, it gives the AI reviewer context, and it becomes part of your portfolio entry.

## Open the pull request

Open it from your branch against the task branch. The pipeline starts the moment it opens:

1. **Automated validation**: build, tests, lint, type check, security scan, file-scope check, write-up check
2. **Context assembly**: the task, its acceptance criteria, your diff and the repository's patterns
3. **AI review**: a structured verdict with scores, issues and positives
4. **Risk scoring**: decides who looks at it next

If the automated layer fails, you see exactly why, and you can push a fix.

## Follow it

[My Submissions](https://dashboard.forke.space/submissions) groups your work into Active, Completed and Revision requested.

## Next steps

:::cards
- [The review pipeline](/docs-demo/forke/review-pipeline) — Each layer in detail. {icon=ScanSearch}
- [Earning XP](/docs-demo/forke/xp) — What you earn when it's approved. {icon=Zap}
:::
