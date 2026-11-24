---
title: How Forke Mail works
description: The building blocks (projects, keys, domains, contacts) and what happens to an email from the moment you send it until it lands.
---

## The building blocks

| Concept | What it is |
| --- | --- |
| **Project** | Everything lives in a project: keys, domains, contacts, templates, emails. One account can have several projects, for example one per app. |
| **API key** | A secret that acts on one project. Test keys never deliver; live keys do. Each key has *sending access* or *full access*. See [API keys](/docs-demo/mail/api-keys). |
| **Domain** | A domain you send from, proven with DNS records. Live emails must come from a verified domain. |
| **Contact** | A person you email, with a name, tags, custom data and a status. Created by imports, events or sends. |
| **Template** | A saved email with `{{variables}}`, sent by name. |
| **Event** | Something a person did in your app, like `user.signed_up`. Events update contacts and start workflows. |
| **Suppression** | An address that's never emailed again, because it bounced, complained or was added by you. |

## Two kinds of email

| | Transactional | Broadcast |
| --- | --- | --- |
| **Who it's for** | One person | A segment or tag |
| **Triggered by** | Your code, the moment something happens | You, when you launch it |
| **Examples** | Receipts, sign-in codes, alerts | Newsletters, announcements |
| **Unsubscribed people** | Still receive it | Skipped |
| **Unsubscribe link** | Not required | Required |
| **Priority** | Sent first, always | Paced to protect deliverability |

Transactional emails always jump ahead of broadcasts, so a big newsletter never delays a sign-in code.

## What happens when you send

::demo{name="lifecycle"}

:::steps

### Accepted

Your request is checked: valid addresses, a verified sender domain, a recipient who isn't suppressed, credits and limits. If an `Idempotency-Key` was used before, the first email is returned instead of sending again. The email is stored with status `queued` and you get `202 Accepted`.

### Sent

A worker picks it up within a second and hands it to Amazon SES. Status becomes `sent`. Network problems and SES throttling are retried automatically.

### Delivered, or not

SES reports back: **delivered**, **bounced** (a permanent bounce suppresses the address), **complained** (marked as spam, which also suppresses it) or **delayed**.

### Opened and clicked

If you turned on [tracking](/docs-demo/mail/tracking), opens and clicks are recorded too.

:::

Every step is recorded on the email's timeline, shown in **Deliveries**, returned by [Get an email](/docs-demo/mail/api/emails/get) and sent to your [webhooks](/docs-demo/mail/webhooks).

## Protection that's always on

- **Suppressions** stop sends to addresses that bounced or complained. A hard bounce is blocked across every project, not just yours.
- **Reputation guard**: if a project's bounce or complaint rate gets too high, sending pauses before it can hurt everyone's deliverability. See [Reputation & alerts](/docs-demo/mail/reputation).
- **Warm-up**: new projects start with a small daily broadcast cap that grows over 14 days. See [Credits, limits & warm-up](/docs-demo/mail/limits-and-credits).

## Next steps

:::cards
- [Test mode & live mode](/docs-demo/mail/test-mode) — Build safely before you go live. {icon=FlaskConical}
- [Add & verify a domain](/docs-demo/mail/domains) — Send from your own address. {icon=Globe}
:::
