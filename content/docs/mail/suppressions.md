---
title: Suppressions
description: Addresses Forke Mail never sends to. Why they're added, how they protect your reputation, and when it's safe to remove one.
---

A suppression is an address that won't be emailed again. Sending to addresses that bounce or complain is the fastest way to land in spam, so Forke Mail stops it for you.

## Why an address is suppressed

| Reason | Added when | Source |
| --- | --- | --- |
| `bounced` | A permanent (hard) bounce: the mailbox doesn't exist. | `ses_bounce` |
| `complained` | The person marked an email as spam. | `ses_complaint` |
| `unsubscribed` | They used an unsubscribe link. | `unsubscribe_link` |
| `manual` | You added it, for example when someone asks by reply. | `manual` or `import` |

Soft bounces (a full mailbox, a server that's briefly down) don't suppress anyone.

## What's blocked

| Reason | Broadcasts | Transactional |
| --- | --- | --- |
| `bounced`, `complained`, `manual` | Blocked | Blocked (`recipient_suppressed`) |
| `unsubscribed` | Blocked | Still delivered |

Hard bounces are also blocked across every Forke Mail project, because that mailbox doesn't exist for anyone.

## Managing suppressions

- See them under **Suppressions** or with [`GET /api/suppressions`](/docs-demo/mail/api/suppressions/list).
- Add one with [`POST /api/suppressions`](/docs-demo/mail/api/suppressions/create).
- Remove one with [`DELETE /api/suppressions/{id}`](/docs-demo/mail/api/suppressions/delete). This also makes the contact active again.

> [!WARNING]
> Only remove a suppression when you're sure the address works now, for example the person fixed a typo or asked to be added back. Sending to a bad address again hurts your reputation.

## Next steps

:::cards
- [Reputation & alerts](/docs-demo/mail/reputation) — What happens when rates get too high. {icon=Gauge}
- [Webhooks](/docs-demo/mail/webhooks) — Hear about bounces and complaints as they happen. {icon=Webhook}
:::
