---
title: Credits, limits & warm-up
description: How sending is metered, the daily and monthly limits, the 14-day warm-up for new projects, API rate limits, and what happens when you hit one.
---

## Credits

Live emails use credits. Test emails don't. Your plan, credits and usage are under **Settings**, and `GET /api/me` (or `forke-mail whoami`) returns them with your limits.

When a project runs out, sends answer `402 trial_quota_exceeded`. Nothing is lost: add credits and send again.

> [!NOTE]
> Free credits belong to a person, not a project: new projects start with none, and owners can move credits between their projects under **Settings**.

## Limits

| Limit | Error when reached |
| --- | --- |
| Daily sending limit | `429 daily_limit_reached` |
| Monthly sending limit (on some plans) | `429 monthly_limit_reached` |
| API requests per second, per key | `429 rate_limited`, with `Retry-After` |

Your exact numbers are in `GET /api/me` under `quota` and `rate_limits`. See [Rate limits](/docs-demo/mail/api/rate-limits).

## Warm-up for new projects

Inbox providers distrust new senders who suddenly send a lot. For a project's first 14 days, broadcasts have a daily cap that grows:

| Day | Broadcast cap |
| --- | --- |
| 1–2 | 200 |
| 3–4 | 500 |
| 5–7 | 1,000 |
| 8–10 | 2,000 |
| 11–14 | 5,000 |

Transactional email isn't capped by warm-up. A broadcast bigger than the day's cap continues the next day.

## What AI apps do about money

Agents never buy credits, pay, or enter payment details. Moving credits between projects always needs your yes in the chat, marked as something that can't be undone. See [Safety & confirmations](/docs-demo/agents/safety).
