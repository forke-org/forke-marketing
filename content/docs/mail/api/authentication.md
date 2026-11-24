---
title: Authentication
description: Authenticate every request with an API key as a bearer token. Key modes, access levels and what each can call.
---

Send your API key in the `Authorization` header on every request:

```bash
curl "https://mail.forke.space/api/me" \
  -H "Authorization: Bearer fm_live_…"
```

Requests without a valid key get `401 unauthorized`.

## Key modes

| Prefix | Mode | Email is delivered |
| --- | --- | --- |
| `fm_test_` | Test | Never. Everything else behaves the same. |
| `fm_live_` | Live | Yes |

## Access levels

| Access | Can call |
| --- | --- |
| **Sending access** | Endpoints marked *Any API key*: sending, getting an email, tracking events, importing contacts, reading templates and `GET /api/me`. |
| **Full access** | Every endpoint, including domains, webhooks, suppressions, segments, broadcasts and workflows. |

Calling an endpoint the key can't use returns `403 insufficient_scope`. Each endpoint page shows the access it needs.

## Keep keys secret

- Only call the API from your server. A key in browser code is a public key.
- Keep keys in environment variables or a secret manager, never in a repository.
- If one leaks, rotate it under **API keys**.

See [API keys](/docs-demo/mail/api-keys) for creating, rotating and revoking keys.

## AI apps

AI apps connected through the [MCP server](/docs-demo/agents) sign in with OAuth instead of a key, and those tokens only work at `/mcp`. To give an agent framework or CI job access, send an API key as a bearer token to `/mcp` instead. See [Servers, CI & frameworks](/docs-demo/agents/servers-and-ci).
