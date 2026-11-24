---
title: Open & click tracking
description: Turn on open and click tracking per email, what counts as an open or a click, and how bots and image proxies are handled.
---

Tracking is off unless you turn it on, per email, with `track_opens` and `track_clicks`. Both need an HTML body.

```json
{
  "to": "ada@example.com",
  "from_address": "hi@acme.com",
  "subject": "Your weekly summary",
  "html": "<p>…</p>",
  "track_opens": true,
  "track_clicks": true
}
```

## How it works

| | How | Recorded as |
| --- | --- | --- |
| **Opens** | A tiny invisible image is added to the HTML. Loading it counts as an open. | `opened_at` (first), `open_count`, an `opened` event |
| **Clicks** | Links are rewritten to go through Forke Mail, which records the click and redirects at once. | `clicked_at` (first), `click_count`, a `clicked` event with the URL |

Only `http` and `https` links are tracked. Your stored HTML isn't changed: tracking is added when the email is sent.

## What counts

- **Gmail and Yahoo image proxies** fetch the image only when the person opens the email, so they count as opens (but never as clicks).
- **Security scanners and link checkers** still get the image or the redirect, so nothing breaks, but they aren't counted.

> [!NOTE]
> Opens are an estimate everywhere: Apple Mail Privacy Protection loads images ahead of time, and some people block images. Clicks are a much more reliable signal.

## When not to track

Leave tracking off for sign-in codes, password resets and security alerts. Rewritten links in those emails can look suspicious, and you don't need the numbers.

## Next steps

:::cards
- [Analytics](/docs-demo/mail/analytics) — Open and click rates over time. {icon=ChartColumn}
- [Webhooks](/docs-demo/mail/webhooks) — Get `email.opened` and `email.clicked` as they happen. {icon=Webhook}
:::
