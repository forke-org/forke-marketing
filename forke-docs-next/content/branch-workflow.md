---
title: Forke branch workflow
description: How Forke creates dedicated working branches and why developers never push directly to main.
read: 4
---

Forke creates a dedicated working branch for every claimed task. You never work on, or push to, the owner's main branch.

## Why branches

- The owner's repository stays safe until they approve
- Every submission is isolated and reviewable
- PRs map cleanly to a single task

## Working in your branch

```bash
git fetch origin
git checkout forke/task-2841
# make your changes
git add .
git commit -m "fix: navbar overflow on small screens"
git push origin forke/task-2841
```

## Stay in scope

Each task has a defined scope. Changes outside it can fail the scope check in the [review pipeline](#review-pipeline).

## Next step

Open your PR: [Submitting a pull request](#submitting-a-pr).
