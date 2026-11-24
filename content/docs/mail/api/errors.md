---
title: Errors
description: Every error is JSON with a snake_case code and a matching HTTP status. What each status means and which errors to retry.
---

Errors look like this:

```json
{ "error": "from_domain_not_verified" }
```

Rate-limit errors also say how long to wait: `{"error": "rate_limited", "retry_after": 2}`.

## Status codes

| Status | Meaning | Retry? |
| --- | --- | --- |
| `200`, `201`, `202`, `204` | It worked. `202` means accepted and processing in the background. | |
| `400` | The request is malformed, like bad JSON or an invalid header. | No, fix it |
| `401` | The key is missing, wrong or revoked. | No |
| `402` | Out of credits, or the plan doesn't allow it. | After adding credits |
| `403` | The key's access or your role doesn't allow this endpoint. | No |
| `404` | Nothing with that ID in this project. | No |
| `409` | A conflict: the name is taken, the idempotency key was reused, or sending is paused. | No |
| `413` | The body or file is too large. | No, split it |
| `422` | A field is missing or invalid. | No, fix it |
| `429` | Too many requests, or a daily or monthly limit. | Yes, after `Retry-After` |
| `500`, `502`, `503` | Something went wrong on our side. | Yes, with growing waits |

## Common codes

| Code | Status | Fix |
| --- | --- | --- |
| `unauthorized` | 401 | Check the `Authorization` header and the key. |
| `insufficient_scope` | 403 | Use a key with full access. |
| `not_found` | 404 | Check the ID, and that it's in this key's project. |
| `invalid_to`, `invalid_from_address`, `invalid_subject` | 422 | Fix the field. |
| `missing_body` | 422 | Send `html`, `text` or a `template`. |
| `from_domain_not_verified` | 422 | [Verify the domain](/docs-demo/mail/domains). |
| `recipient_suppressed` | 422 | Don't retry. See [Suppressions](/docs-demo/mail/suppressions). |
| `idempotency_key_reused` | 409 | Use a new key for a different email. |
| `workspace_sending_paused` | 409 | See [Reputation & alerts](/docs-demo/mail/reputation). |
| `trial_quota_exceeded` | 402 | Add credits. |
| `daily_limit_reached`, `monthly_limit_reached` | 429 | Wait for the limit to reset. |
| `rate_limited` | 429 | Wait `Retry-After` seconds. |
| `internal_error` | 500 | Retry; contact support if it continues. |

Each endpoint page lists the errors specific to it.

> [!NOTE]
> The Resend-style endpoints (`/api/forke-mail/…`) return errors in Resend's shape: `{"statusCode", "name", "message"}`, with the code in `message`.
