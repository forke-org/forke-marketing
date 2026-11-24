---
title: Migrate to Forke Mail
description: Move from Resend, SendGrid, Postmark, Mailgun or Amazon SES. A checklist, field mappings, and a prompt that lets your coding agent do the work.
---

Moving is mostly swapping one HTTP call for another. Plan for an hour, plus the time your DNS takes.

## Let your agent do it

Connect Forke Mail to your coding agent ([how](/docs-demo/agents/quickstart)) and paste:

```prompt Prompt
Move this codebase from my current provider to Forke Mail.
Find every place that sends email, list them for me first, then replace them with calls to POST https://mail.forke.space/api/transactional (or templates where the same email repeats). Keep the same from addresses, add idempotency keys, and use a test key until I confirm.
```

## The checklist

:::steps

### Verify your domain

Add it under **Domains** and add the DKIM, SPF and DMARC records. Keep your old provider's records until you've switched: a domain can have DKIM for several providers, but only one SPF record, so add `include:amazonses.com` to it. See [Add & verify a domain](/docs-demo/mail/domains).

### Move templates

Recreate repeated emails as [templates](/docs-demo/mail/templates). Change the placeholder syntax to `{{name}}` (escaped) or `{{{html}}}` (raw).

### Swap the send calls

Use a **test key** first. Every send becomes `POST /api/transactional`, with an `Idempotency-Key`.

### Bring your suppressions

Export bounces, complaints and unsubscribes from the old provider and import them under **Suppressions**, so you don't email them again.

### Move webhooks

Point your handlers at Forke Mail's [events](/docs-demo/mail/webhooks) and update the signature check.

### Go live

Switch to a live key, watch [Deliveries](/docs-demo/mail/deliveries) for a day, then remove the old provider.

:::

## Field mapping

| Resend / SendGrid / Postmark | Forke Mail |
| --- | --- |
| `from: "Acme <hi@acme.com>"` | `from_name: "Acme"`, `from_address: "hi@acme.com"` |
| `to: ["ada@example.com"]` | `to: "ada@example.com"` (one per request) |
| `reply_to` / `ReplyTo` | `reply_to` |
| `html` / `HtmlBody` / `content[type=text/html]` | `html` |
| `text` / `TextBody` | `text` |
| `tags` / `Metadata` / `custom_args` | `tags` (up to 10 key/value pairs) |
| Template ID + variables | `template` (name) + `data` |

### Already on Resend's request shape?

`POST /api/forke-mail/emails` accepts Resend's body (`from` with a name, `to` as a list, `tags` as `{name, value}`), so the only change is the URL and the key. See [Send (Resend-style)](/docs-demo/mail/api/emails/send-resend-style).

## What's different

- **One recipient per request.** Send a separate request per person; there's no `cc` or `bcc`.
- **No attachments.** Link to the file instead.
- **No scheduled sends.** Send when it's due, or use a [workflow](/docs-demo/mail/workflows) wait step.
