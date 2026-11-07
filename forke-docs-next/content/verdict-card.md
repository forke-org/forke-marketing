---
title: Understanding the AI verdict card
description: How Forke translates code diffs into plain-English acceptance signals for task owners.
read: 3
---

Owners read a verdict, not a 400-line diff.

## What the card shows

| Field | Meaning |
| --- | --- |
| Risk | Low, medium or high |
| Task completion | How closely the work matches the spec, out of 10 |
| Code quality | A quality score out of 10 |
| Scope | Whether the PR stayed inside the task scope |
| Security | Number of flags found |
| Tests | Tests passed |

A short written summary explains what changed and ends with a recommendation.

## What owners can do

- **Approve and pay.** Forke merges the PR and releases escrow.
- **Request changes.** You update the PR and the pipeline runs again.

## For developers

A clear task spec and a focused PR give you a better verdict. See [Submitting a pull request](#submitting-a-pr).
