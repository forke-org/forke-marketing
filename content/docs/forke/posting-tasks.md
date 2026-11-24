---
title: Writing a great task
description: How to scope a task, write acceptance criteria the review can check, and pick a file scope, so the first submission is the one you approve.
---

The quality of what you get back depends mostly on what you post. A tight task gets claimed faster, reviewed more accurately and approved the first time.

## The right size

A good task takes a developer at the required level **30 minutes to about 4 hours**. If it's bigger, split it into tasks that each deliver something you can check on its own.

| Too big | Better as |
| --- | --- |
| "Build our onboarding" | "Add the welcome step form", "Save step progress", "Send the completion email" |
| "Fix the dashboard bugs" | One task per bug, each with steps to reproduce |

## Acceptance criteria

The AI review scores the work against your criteria, and you approve against them, so make each one something you can check.

- **Describe what you'll see**, not how to build it: "the form shows an inline error under the email field when the address is invalid".
- **One outcome per line**, each checkable on its own.
- **Say what must not change**: "no changes to the authentication logic".
- **Include how to reproduce** for bugs: steps, expected result, actual result.

```markdown
- Each field shows an inline error when it loses focus with an invalid value
- The submit button stays disabled until every field is valid
- Errors are announced to screen readers (aria-describedby)
- No changes to the API or to authentication
```

> [!TIP]
> Vague criteria produce vague verdicts. "Make it better" can't be scored; "loads in under 1 second on the product page" can.

## File scope

List the files and folders the task may touch. Everything else is rejected automatically, so the developer can't drift and nothing sensitive gets changed by accident.

- Be as narrow as the task allows: `src/components/signup/**` rather than `src/**`.
- Leave out secrets, auth and payments unless they are the task.

## Skill tags

Add up to 5 tags. They decide who can see the task: the highest tier among them sets the minimum skill tier. Tag what the task really needs, not everything in your stack. See [Skill tracks](/docs-demo/forke/skill-tracks).

## Budget and estimate

Price it for the time a capable developer needs. Bigger budgets also award more XP, which attracts more experienced developers.

## Next steps

:::cards
- [Escrow & payments](/docs-demo/forke/escrow) — Funding the task. {icon=Vault}
- [Reading the verdict card](/docs-demo/forke/verdict-card) — Reviewing what comes back. {icon=ClipboardCheck}
:::
