---
title: Writing clear acceptance criteria
description: Best practices for founders writing task specs that AI reviewers and developers can test against.
read: 4
---

Good acceptance criteria make tasks easy to claim, easy to review and easy to approve.

## Principles

- **Name the outcome.** Say what should be true when the work is done.
- **Be testable.** Each criterion should be something a test or a reviewer can check.
- **Set the scope.** List the files or area of the codebase in scope.
- **Stay small.** Aim for 30 minutes to 4 hours of work.

## Example

```md
Title: Fix OAuth redirect loop
Stack: React
Scope: src/auth/callback.tsx
Done when:
- After login the user lands on /dashboard
- Two regression tests cover the redirect
- No files outside scope are changed
```

## Common mistakes

| Mistake | Better |
| --- | --- |
| "Make login better" | "Redirect to /dashboard after login" |
| No scope given | List the files in scope |
| Several unrelated fixes | One task per outcome |

The AI reviewer checks the submission against these criteria. See [The 4-layer review pipeline](#review-pipeline).
