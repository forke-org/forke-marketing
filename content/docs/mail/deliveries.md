---
title: Deliveries & timelines
description: Find any email you sent, transactional or broadcast, and see exactly what happened to it and why.
---

**Deliveries** in the dashboard lists every email across transactional and broadcasts, newest first. It's the fastest way to answer "did they get it?".

## Find an email

- **Search** by address or subject.
- **Filter by status**: `problems` (everything that went wrong), `pending`, `sent`, `delivered`, `bounced`, `complained`, `failed`, `skipped` or `test`.
- **Filter by kind**: transactional or broadcast.

Or with the API: [`GET /api/deliveries?q=ada@example.com&status=problems`](/docs-demo/mail/api/insights/deliveries).

## The timeline

Open an email to see every step with its time:

| Step | Means |
| --- | --- |
| Queued | Accepted from your request. |
| Sent | Handed to Amazon SES (with how long it took). |
| Delivered | The recipient's server accepted it. |
| Delayed | The recipient's server is slow; SES is retrying. |
| Bounced / Soft bounce | Rejected for good / for now, with the reason. |
| Complained | Marked as spam. |
| Opened / Clicked | With tracking on. |

## "They didn't get it": a checklist

1. **Search Deliveries for the address.** No email? Your code didn't send it: check your logs for an error response.
2. **Status `test`?** It was sent with a test key, so it was never delivered.
3. **`failed` or `skipped`?** The reason is shown: often a suppressed address or an unverified domain.
4. **`bounced`?** The address doesn't exist or refused it. It's now suppressed.
5. **`delivered`?** It reached their server. Ask them to check spam, promotions and filters, and look at [Deliverability](/docs-demo/mail/deliverability).

> [!TIP]
> Ask your AI app "Why didn't my email to ada@example.com arrive?" and it walks through this for you with the Forke Mail tools.

## Next steps

:::cards
- [Analytics](/docs-demo/mail/analytics) — The big picture. {icon=ChartColumn}
- [Troubleshooting](/docs-demo/mail/troubleshooting) — Fixes for common errors. {icon=Wrench}
:::
