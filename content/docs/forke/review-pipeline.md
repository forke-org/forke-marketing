---
title: The review pipeline
description: The four layers every pull request goes through before a founder sees it. Automated validation, context assembly, AI review and risk scoring.
---

Every pull request goes through the same four layers before a founder sees it. The aim is simple: catch everything a machine can catch, explain the rest in plain English, and leave the decision to a person.

::demo{name="pipeline"}

> [!NOTE]
> The AI is a context generator, not a judge. It summarises, flags concerns with evidence and scores against the task, but it never approves or rejects work on its own. The founder decides.

## Layer 1: automated validation

Runs in a sandboxed container in about 30 seconds:

- Build
- Tests
- Lint and type check
- Security scan (Semgrep)
- File-scope check
- `FORKE_SUBMISSION.md` completeness

Any failure rejects the submission automatically, with the exact reason shown to the developer. No AI runs, so a broken build costs nothing.

## Layer 2: context assembly

Forke builds the AI's input from exactly what matters, and nothing else:

- The task description and acceptance criteria
- The diff: only changed files, never the whole repository
- Patterns detected in the repository when the mirror was made
- The automated results from layer 1
- The developer's trust score and history

## Layer 3: AI review

Claude reads the assembled context and returns a strict, structured verdict:

| Field | Range |
| --- | --- |
| Task completion | 0–10 |
| Code quality | 0–10 |
| Architecture fit | 0–10 |
| Security | Pass or concerns |
| Issues | Up to 5, each with evidence |
| Positives | Up to 3 |
| Summary | Plain English |
| Recommendation and confidence | |

Low confidence sends the submission to a person regardless of the scores.

## Layer 4: risk scoring

A 0–100 score combines the AI verdict, the task's criticality and the developer's history, and decides the route:

| Risk score | Route |
| --- | --- |
| 0–30 | Eligible for auto-approval (low-risk, simple tasks) |
| 31–70 | Founder review with the verdict card |
| 71–100 | A trusted reviewer first, then the founder |

> [!NOTE]
> Auto-approval is off for now. It will only be turned on once the scoring has been checked against 500+ real tasks.

## Next steps

:::cards
- [Reading the verdict card](/docs-demo/forke/verdict-card) — What founders see. {icon=ClipboardCheck}
- [Writing a great task](/docs-demo/forke/posting-tasks) — Criteria the review can check. {icon=PenLine}
:::
