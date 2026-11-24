---
title: API reference
description: The Forke Mail HTTP API. Plain JSON over HTTPS, with every endpoint shown in cURL, Node.js, Python, PHP, Ruby, Go, Rust, Java and .NET.
---

The Forke Mail API is plain JSON over HTTPS. There's no SDK to install: every example on these pages uses the language's standard HTTP client, and you can pick your language once for the whole site.

::image{src="/docs-demo/img/api-hero.webp" alt="Lanterns along a pier, lit one after another in perfect sequence" ratio="21 / 9"}

## Base URL

```text
https://mail.forke.space
```

All endpoints live under `/api`.

## A first request

```bash
curl "https://mail.forke.space/api/me" \
  -H "Authorization: Bearer $FORKE_MAIL_API_KEY"
```

This returns your project, plan, limits, verified domains and the key's own access. It's the cheapest way to check a key works.

## Conventions

| | |
| --- | --- |
| **Authentication** | `Authorization: Bearer <key>` on every request. See [Authentication](/docs-demo/mail/api/authentication). |
| **Bodies** | JSON with `Content-Type: application/json` (contact imports are multipart). Unknown fields are rejected. |
| **IDs** | UUIDs, returned when you create something. |
| **Times** | ISO 8601 in UTC, like `2026-11-24T09:41:07Z`. |
| **Errors** | `{"error": "snake_case_code"}` with a matching status. See [Errors](/docs-demo/mail/api/errors). |
| **Lists** | `limit` and `offset`. See [Pagination](/docs-demo/mail/api/pagination). |
| **Retries** | Send `Idempotency-Key` on sends. See [Retries & idempotency](/docs-demo/mail/idempotency). |

## Endpoints

| Group | What it covers |
| --- | --- |
| [Emails](/docs-demo/mail/api/emails/send) | Send one email, look it up, list and stats |
| [Templates](/docs-demo/mail/api/templates/list) | Saved emails with variables |
| [Domains](/docs-demo/mail/api/domains/list) | Sending domains and their DNS records |
| [Contacts](/docs-demo/mail/api/contacts/list) | People, imports and tags |
| [Events](/docs-demo/mail/api/events/track) | Track what people do; start workflows |
| [Segments](/docs-demo/mail/api/segments/list) | Audiences from rules |
| [Broadcasts](/docs-demo/mail/api/broadcasts/create) | Newsletters and announcements |
| [Workflows](/docs-demo/mail/api/workflows/list) | Automated series |
| [Webhooks](/docs-demo/mail/api/webhooks/list) | Real-time events to your server |
| [Suppressions](/docs-demo/mail/api/suppressions/list) | Addresses never emailed |
| [Insights](/docs-demo/mail/api/insights/analytics) | Analytics, deliveries, topics and the account |

> [!TIP]
> AI agents can use the whole API through the [MCP server](/docs-demo/agents) instead, with confirmations before anything risky. Each endpoint page names the matching agent tool.
