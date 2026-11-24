---
title: Events
description: Tell Forke Mail what people do in your app. One call creates or updates the contact, records the event and starts any workflow listening for it.
---

Events are the bridge between your app and your email. When something happens (someone signs up, pays, invites a teammate) you send one event. Forke Mail keeps the contact up to date, records what happened, and starts any [workflow](/docs-demo/mail/workflows) waiting for it.

## Track an event

```bash
curl -X POST "https://mail.forke.space/api/events" \
  -H "Authorization: Bearer $FORKE_MAIL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ada@example.com",
    "event": "user.signed_up",
    "data": { "plan": "pro", "source": "landing" },
    "tags": ["trial"],
    "contact": { "first_name": "Ada", "last_name": "Lovelace", "data": { "company": "Analytical Engines" } }
  }'
```

```json
{ "contact_id": "3c8e1a9b-…", "event_id": "8812", "contact_created": true, "workflows_started": 1 }
```

In one call this:

1. Creates the contact if they're new, or updates their name, tags and custom data.
2. Records `user.signed_up` with its `data`.
3. Starts every enabled workflow whose trigger is `user.signed_up`.

## Naming events

Use `noun.verb` names in the past tense, so they read well in workflows and segments:

| Good | Avoid |
| --- | --- |
| `user.signed_up` | `signup` |
| `order.paid` | `Payment Success` |
| `trial.ending` | `trialEnding2` |
| `project.created` | `new` |

## Where to send them from

Send events from your **backend**, at the moment the thing happens, with the same key you send email with. Never from browser code: the key would be public.

## Using events

| Where | How |
| --- | --- |
| [Workflows](/docs-demo/mail/workflows) | `trigger_event: "user.signed_up"` starts a series; `exit_event: "user.upgraded"` stops it. |
| [Segments](/docs-demo/mail/segments) | `{"field": "event", "op": "performed", "value": "order.paid", "days": 30}` |
| Contact data | `data.plan` and other fields can be used in segments. |

See every event name and field seen so far with [`GET /api/data`](/docs-demo/mail/api/events/schema).

## Next steps

:::cards
- [Workflows](/docs-demo/mail/workflows) — Send a series when an event happens. {icon=GitMerge}
- [Track an event (API)](/docs-demo/mail/api/events/track) — Every field. {icon=Braces}
:::
