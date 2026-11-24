---
title: Introduction
description: Forke Mail is an email API for developers and AI agents. Transactional email, templates, contacts, events, workflows and broadcasts on Amazon SES.
---

Forke Mail sends the email your product needs: sign-in codes, receipts and notifications the moment something happens, plus newsletters and automated series for the people who signed up. It runs on Amazon SES, and you can use it three ways.

:::cards cols=3
- [HTTP API](/docs-demo/mail/quickstart) — Plain JSON over HTTPS, with a guide for every language. {icon=Braces}
- [AI agents](/docs-demo/agents/quickstart) — Connect Claude, ChatGPT or Cursor and ask it to set things up. {icon=Bot}
- [CLI](/docs-demo/agents/cli) — One binary for macOS, Linux and Windows. {icon=Terminal}
:::

::demo{name="dashboard" caption="The dashboard: sending a test email, watching its timeline, then verifying a domain."}

## What you can build

| Feature | What it's for |
| --- | --- |
| [Transactional email](/docs-demo/mail/sending) | One email to one person, triggered by your app: receipts, codes, alerts. |
| [Templates](/docs-demo/mail/templates) | Save an email once with `{{variables}}`, send it by name from anywhere. |
| [Events](/docs-demo/mail/events) | Tell Forke Mail what people do (`user.signed_up`). It keeps contacts up to date. |
| [Workflows](/docs-demo/mail/workflows) | Start a series of emails when an event happens: wait, send, repeat. |
| [Segments](/docs-demo/mail/segments) | Audiences built from rules that stay up to date on their own. |
| [Broadcasts](/docs-demo/mail/broadcasts) | Newsletters and announcements to a segment, with one-click unsubscribe. |
| [Webhooks](/docs-demo/mail/webhooks) | Signed HTTPS calls when an email is delivered, bounces, is opened or clicked. |

## Built to be safe by default

- **Test keys** (`fm_test_…`) run every request for real but never deliver email or use credits. Build your whole integration before your domain is verified. See [Test mode & live mode](/docs-demo/mail/test-mode).
- **Idempotency keys** make retries safe: the same request never sends twice. See [Retries & idempotency](/docs-demo/mail/idempotency).
- **Suppressions are automatic.** Addresses that hard-bounce or complain are never emailed again.
- **Agents ask first.** When an AI app is about to send a real email or delete something, it has to ask you in the chat. The server enforces it. See [Safety & confirmations](/docs-demo/agents/safety).

## Start here

:::cards
- [Quickstart](/docs-demo/mail/quickstart) — Send your first email in about five minutes. {icon=Rocket}
- [How Forke Mail works](/docs-demo/mail/concepts) — Projects, keys, domains and what happens to a send. {icon=Workflow}
- [Pick your language](/docs-demo/mail/languages) — Node.js, Python, Go, PHP, Ruby, Rust, Java, .NET and more. {icon=Languages}
- [API reference](/docs-demo/mail/api) — Every endpoint with examples in nine languages. {icon=Braces}
:::
