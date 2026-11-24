---
title: Rate limits
description: How many requests per second each key can make, the headers that tell you where you stand, and how to back off.
---

Each API key has a request rate limit, so one runaway loop can't take a project down.

| Plan | Requests per second | Burst |
| --- | --- | --- |
| Paid | 20 | 40 |
| Trial | 2 | 5 |

The burst lets short spikes through; over time you can make the per-second number. Your project's exact limits are in `GET /api/me` under `rate_limits`.

## Headers

Every response includes:

| Header | Meaning |
| --- | --- |
| `X-RateLimit-Limit` | Requests per second for this key. |
| `X-RateLimit-Remaining` | Requests left in the current burst. |

When you go over, you get `429` with `Retry-After` (seconds) and `{"error": "rate_limited", "retry_after": 2}`.

## Backing off

```ts
async function send(body: object, key: string) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch('https://mail.forke.space/api/transactional', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.FORKE_MAIL_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': key },
      body: JSON.stringify(body),
    })
    if (res.status !== 429 && res.status < 500) return res
    const wait = Number(res.headers.get('Retry-After') ?? 2 ** attempt)
    await new Promise((r) => setTimeout(r, wait * 1000))
  }
  throw new Error('Forke Mail: gave up after 5 attempts')
}
```

The `Idempotency-Key` makes the retries safe: the email is only sent once.

## Sending lots of email

Request limits and sending limits are separate. For many recipients at once, use a [broadcast](/docs-demo/mail/broadcasts) instead of a loop of sends: it's one request and Forke Mail paces delivery for you.

Daily and monthly sending limits are covered in [Credits, limits & warm-up](/docs-demo/mail/limits-and-credits).
