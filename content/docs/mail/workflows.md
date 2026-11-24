---
title: Workflows
description: Send a series of emails automatically when someone does something. Trigger events, wait and send steps, exit events and re-entry.
---

A workflow is a series that runs for each person on its own: when they sign up, send a welcome email, wait two days, send a tips email, and stop if they upgrade.

## How a workflow is built

| Part | What it does | Example |
| --- | --- | --- |
| **Trigger event** | Starts the workflow for a person when this [event](/docs-demo/mail/events) is tracked. | `user.signed_up` |
| **Steps** | Run in order: `wait` a number of minutes, or `send` a template. | Send `welcome`, wait 2 days, send `tips` |
| **Exit event** (optional) | Takes the person out early when it happens. | `user.upgraded` |
| **Re-entry** (optional) | Lets someone go through it again if the trigger happens again. | Off for onboarding, on for "abandoned cart" |

## An example: a welcome series

```json
{
  "name": "Welcome series",
  "trigger_event": "user.signed_up",
  "exit_event": "user.upgraded",
  "enabled": true,
  "allow_reentry": false,
  "steps": [
    { "type": "send", "template_id": "<welcome template id>", "from_address": "hi@acme.com", "from_name": "Acme" },
    { "type": "wait", "minutes": 2880 },
    { "type": "send", "template_id": "<tips template id>", "from_address": "hi@acme.com", "from_name": "Acme" },
    { "type": "wait", "minutes": 4320 },
    { "type": "send", "template_id": "<upgrade template id>", "from_address": "hi@acme.com", "from_name": "Acme" }
  ]
}
```

| Wait | Minutes |
| --- | --- |
| 1 hour | 60 |
| 1 day | 1440 |
| 2 days | 2880 |
| 1 week | 10080 |

Then, from your app:

```bash
curl -X POST "https://mail.forke.space/api/events" \
  -H "Authorization: Bearer $FORKE_MAIL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email": "ada@example.com", "event": "user.signed_up"}'
```

## Following runs

Each person in a workflow is a **run**. [List runs](/docs-demo/mail/api/workflows/runs) shows which step each person is on and when the next step happens. The workflow list shows how many are running and how many finished.

## Good to know

- Workflows are created **off**. Check the steps, then turn it on.
- Each send uses the same checks as any transactional email, and is never sent twice for the same step, even if something retries.
- Editing a workflow doesn't restart people already in it: they continue from their current step.
- Use `marketing` templates for promotional series, so people who unsubscribed are skipped.

> [!TIP]
> Ask an AI app: "Build a welcome series that starts when the user.signed_up event is tracked." It drafts the templates, shows you the plan and creates the workflow after you confirm. See the [prompt library](/docs-demo/agents/prompts).

## Next steps

:::cards
- [Events](/docs-demo/mail/events) — The triggers. {icon=Activity}
- [Workflows API](/docs-demo/mail/api/workflows/create) — Every field. {icon=Braces}
:::
