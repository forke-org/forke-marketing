---
title: Retries & idempotency
description: Retry any send as often as you like without sending twice. How Idempotency-Key works, how to choose keys, and what happens without one.
---

Networks fail. A request can time out after Forke Mail already accepted it, and if you retry you might send the same receipt twice. An `Idempotency-Key` makes retries safe.

## How it works

Send a header with a key that's unique to *this email*:

```bash
curl -X POST "https://mail.forke.space/api/transactional" \
  -H "Authorization: Bearer $FORKE_MAIL_API_KEY" \
  -H "Idempotency-Key: receipt/A1042" \
  -H "Content-Type: application/json" \
  -d '{"to":"ada@example.com","from_address":"hi@acme.com","subject":"Your receipt","text":"Thanks!"}'
```

| You send | Forke Mail answers |
| --- | --- |
| A new key | Sends the email. `202 Accepted`. |
| The same key and the same body, within 24 hours | Doesn't send again. Returns the first email with `200`, the header `Idempotent-Replayed: true` and `"replayed"` in the body. |
| The same key with a **different** body | `409 idempotency_key_reused`. Nothing is sent. |

## Choosing keys

Build the key from what the email is *about*, so the same event always produces the same key:

| Email | Good key |
| --- | --- |
| Welcome | `welcome/<user id>` |
| Receipt | `receipt/<order id>` |
| Password reset | `password-reset/<reset token id>` |
| Daily digest | `digest/<user id>/<date>` |

Keys can be up to 256 printable characters, with no spaces.

> [!WARNING]
> Don't use a random UUID made at send time: a retry makes a new UUID and sends again. The key must be the same on every retry.

## Without a key

As a safety net, an identical email (same recipient, sender, subject and content) sent within 60 seconds is only sent once. If you really want two identical emails, give them different keys.

## Retrying well

- Retry on network errors, `429` and `5xx`, with growing waits. Honour the `Retry-After` header on `429`.
- Don't retry other `4xx` errors: they need a fix, not a retry.

## Next steps

:::cards
- [Errors](/docs-demo/mail/api/errors) — Which errors to retry. {icon=TriangleAlert}
- [Rate limits](/docs-demo/mail/api/rate-limits) — How fast you can call the API. {icon=Timer}
:::
