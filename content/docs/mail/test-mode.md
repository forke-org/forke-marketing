---
title: Test mode & live mode
description: Test keys run every request for real but never deliver email or use credits. Build your whole integration safely, then switch one environment variable.
---

Every API key is either a **test key** or a **live key**. You can tell them apart by the prefix.

| | Test key `fm_test_…` | Live key `fm_live_…` |
| --- | --- | --- |
| Requests are checked | Exactly like live | Yes |
| Email is delivered | **Never** | Yes |
| Uses credits and limits | No | Yes |
| From address | Any address works | Must be on a verified domain |
| Shows in Deliveries | Yes, with status `test` | Yes |
| Can launch broadcasts | No | Yes |
| AI apps ask before sending | No (nothing real happens) | Yes |

## Why it matters

- **Build before your domain is verified.** DNS can take a while; your code doesn't have to wait.
- **Run your tests and CI against the real API** without emailing anyone.
- **Hand a test key to an AI agent** and let it experiment freely.

## Switching to live

Nothing in your code changes. Set `FORKE_MAIL_API_KEY` to a live key in production, and keep the test key in development and CI.

```bash .env.development
FORKE_MAIL_API_KEY=fm_test_...
```

```bash .env.production
FORKE_MAIL_API_KEY=fm_live_...
```

> [!TIP]
> `GET /api/me` tells you which kind of key you're using, so you can show a "test mode" banner in your own admin pages. See [Get the account](/docs-demo/mail/api/insights/me).

## Next steps

:::cards
- [API keys](/docs-demo/mail/api-keys) — Creating, scoping and rotating keys. {icon=KeyRound}
- [Add & verify a domain](/docs-demo/mail/domains) — The last step before going live. {icon=Globe}
:::
