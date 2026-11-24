---
title: API keys
description: Create test and live keys, choose sending or full access, store them safely, and rotate or revoke them without downtime.
---

An API key lets your app act on one project. Send it as a bearer token on every request:

```bash
curl "https://mail.forke.space/api/me" -H "Authorization: Bearer $FORKE_MAIL_API_KEY"
```

## Two choices when you create a key

**Mode**: what happens to email.

| Mode | Prefix | Delivers email |
| --- | --- | --- |
| Test | `fm_test_` | Never. See [Test mode](/docs-demo/mail/test-mode). |
| Live | `fm_live_` | Yes |

**Access**: what the key can do.

| Access | Can |
| --- | --- |
| **Sending access** | Send transactional email, look up emails, track events, import contacts and read templates. The right choice for most apps. |
| **Full access** | Everything the API offers, including domains, webhooks, suppressions, segments, broadcasts and workflows. |

Each endpoint in the [API reference](/docs-demo/mail/api) says which access it needs. Trial projects can create sending-access keys only.

## Creating keys

Only project **owners** can create keys, under **API keys**, after confirming their password. A key is shown **once**: copy it into your secret store straight away.

You can also run `forke-mail init` in a project folder, or ask a connected AI app to create one (it asks you in the chat first).

## Keeping keys safe

- Keep them in environment variables or a secret manager. Never in code, never in the browser, never committed.
- Use a different key per app and environment, so you can revoke one without touching the others.
- Give apps sending access unless they really need more.

> [!WARNING]
> If a key leaks (in a commit, a log or a screenshot), rotate it straight away.

## Rotating and revoking

- **Rotate** makes a new secret for the same key. Update your environment, then the old secret stops working.
- **Revoke** turns a key off for good. Requests with it get `401 unauthorized` immediately. You can't revoke the last full-access key.

## Next steps

:::cards
- [Authentication](/docs-demo/mail/api/authentication) — How requests are authenticated. {icon=KeyRound}
- [Projects & team](/docs-demo/mail/projects-and-team) — Who can manage keys. {icon=Building2}
:::
