---
title: Reading the verdict card
description: The founder's review screen. What each part means, and what happens when you approve or request changes.
---

The verdict card is where founders decide. It's designed to be read in under a minute, without reading code.

## What's on it

| Part | What it tells you |
| --- | --- |
| **Build, tests, scope** | Pass or fail badges from the automated checks. |
| **Summary** | What changed, in plain English. |
| **Task completion** | How fully the acceptance criteria are met, 0–10. |
| **Code quality** | Readability and correctness, 0–10. |
| **Architecture fit** | Whether it follows your repository's patterns, 0–10. |
| **Security** | Pass, or the concerns found. |
| **Flagged issues** | Specific problems, each with evidence. |
| **Risk score and recommendation** | How careful to be, and the suggested next step. |

You're answering one question: **does this solve my problem?**

## Approve

- The full budget is released to the developer's UPI straight away.
- Forke opens a clean, squash-merged pull request on your repository. You never see the messy intermediate commits.
- The developer gets XP, and the task goes on their profile.

## Request changes

Write what needs to change. The task goes back to the same developer as `REVISION_REQUESTED`, the escrow stays held, and they submit again. A revision before approval costs the developer 20 XP, which is why the pipeline catches most problems before you see them.

::demo{name="payout"}

## Next steps

:::cards
- [Escrow & payments](/docs-demo/forke/escrow) — What happens to the money. {icon=Vault}
- [Refunds & disputes](/docs-demo/forke/refunds-disputes) — If you can't agree. {icon=Scale}
:::
