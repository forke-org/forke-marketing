---
title: Transactional email
description: Send one email to one person from your code. Every option, what's checked before it sends, and the statuses an email moves through.
---

Transactional email is anything your app sends to one person because of something they did: a sign-in code, a receipt, a password reset, an alert.

## A complete send

```json
{
  "to": "ada@example.com",
  "from_name": "Acme",
  "from_address": "hi@acme.com",
  "reply_to": "support@acme.com",
  "subject": "Your receipt for order A1042",
  "html": "<p>Thanks for your order, Ada.</p>",
  "text": "Thanks for your order, Ada.",
  "tags": { "order": "A1042", "flow": "checkout" },
  "track_opens": true,
  "track_clicks": true
}
```

Send it to `POST /api/transactional` with your key and an `Idempotency-Key` header. Every field is described in the [API reference](/docs-demo/mail/api/emails/send).

## Content: inline or a template

Send `html` and/or `text`, or send a saved [template](/docs-demo/mail/templates) with `data`:

```json
{
  "to": "ada@example.com",
  "from_address": "hi@acme.com",
  "from_name": "Acme",
  "template": "receipt",
  "data": { "name": "Ada", "order": "A1042", "total": "₹1,240" }
}
```

> [!TIP]
> Always send a plain-text version too. Some people read it, and spam filters like seeing both.

## What's checked before it's accepted

| Check | Error if it fails |
| --- | --- |
| `to`, `from_address` and `reply_to` are valid addresses | `invalid_to`, `invalid_from_address`, `invalid_reply_to` |
| The subject is there, under 300 characters, on one line | `invalid_subject` |
| There's `html`, `text` or a template, each under 256 KB | `missing_body`, `body_too_large` |
| The sender is on a verified domain (live keys) | `from_domain_not_verified` |
| The recipient isn't suppressed | `recipient_suppressed` |
| The project isn't paused and has credits | `workspace_sending_paused`, `trial_quota_exceeded` |
| The daily limit isn't reached | `daily_limit_reached` |

> [!NOTE]
> People who **unsubscribed** from your newsletters still get transactional email: a password reset must always arrive. Only bounced, complained and manually suppressed addresses are blocked.

## Statuses

| Status | Meaning |
| --- | --- |
| `queued` | Accepted and waiting for a worker (usually under a second). |
| `sending` | Being handed to Amazon SES. |
| `sent` | SES accepted it. Delivery is reported next. |
| `failed` | It couldn't be sent. `last_error` says why. |
| `test` | Sent with a test key: stored, never delivered. |

On top of the status, an email gets `delivered_at`, `bounced_at` (with `bounce_type`), `complained_at`, `opened_at` and `clicked_at` as they happen.

## Retries

Temporary problems (network errors, SES throttling) are retried automatically with growing waits, up to 5 attempts. Emails that can't be sent within an hour fail as `expired`, so a stale sign-in code is never delivered late.

## Duplicates

- With an `Idempotency-Key`, a repeat returns the first email for 24 hours. See [Retries & idempotency](/docs-demo/mail/idempotency).
- Without one, an identical email to the same person within 60 seconds is only sent once.

## Tags

Add up to 10 `tags` of your own, such as `{"order": "A1042"}`. They're stored on the email and returned by [Get an email](/docs-demo/mail/api/emails/get). Webhooks carry the email's `message_id`, so you can look its tags up, or keep your own mapping from the `id` you got when sending.

## Next steps

:::cards
- [Templates](/docs-demo/mail/templates) — Variables and raw HTML blocks. {icon=LayoutTemplate}
- [Webhooks](/docs-demo/mail/webhooks) — Know when it's delivered or bounces. {icon=Webhook}
- [Send an email (API)](/docs-demo/mail/api/emails/send) — Every field, in nine languages. {icon=Braces}
:::
