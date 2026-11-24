---
title: Reputation & alerts
description: How Forke Mail watches bounce and complaint rates, when it warns you, when it pauses sending, and how to get back on track.
---

Inbox providers judge senders by how many emails bounce and how many people mark them as spam. Forke Mail watches the same numbers for each project and acts before a problem hurts your deliverability.

## The thresholds

Rates are measured over the last 30 days, across transactional email and broadcasts.

| | Bounce rate | Complaint rate | What happens |
| --- | --- | --- | --- |
| **Warning** | 2% | 0.05% | An alert by email (and Slack, if set up) and a `workspace.reputation_warning` webhook. At most once a day. |
| **Pause** | 5% | 0.1% | Sending stops for the project. Broadcasts in progress pause. A `workspace.sending_paused` webhook is sent. |

While paused, sends answer `409 workspace_sending_paused`.

## Alerts

Under **Settings → Alerts**, choose who gets alert emails and add a Slack incoming-webhook URL to get them in a channel too.

## If sending is paused

1. Find the cause in [Deliveries](/docs-demo/mail/deliveries) with the `problems` filter: usually one import or one broadcast to an old list.
2. Clean the list: remove addresses that never engaged and anything bought or scraped.
3. Contact [support@forke.space](mailto:support@forke.space) to resume. A person reviews the cause with you.

## Platform-wide protection

Forke Mail also watches bounce and complaint rates across all projects. If they rise, sending is held for projects that are still warming up or have little history, so one bad sender can't harm everyone's deliverability.

## Next steps

:::cards
- [Deliverability](/docs-demo/mail/deliverability) — Keep the rates low. {icon=Inbox}
- [Webhooks](/docs-demo/mail/webhooks) — Get the warning and pause events. {icon=Webhook}
:::
