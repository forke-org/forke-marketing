---
title: Safety & confirmations
description: How Forke Mail decides what an agent may do on its own, what needs your yes in the chat, what it must call out as permanent, and what's never allowed.
---

AI apps make mistakes: they misread a request, pick the wrong recipient, or get talked into things by text on a web page. Forke Mail assumes that and puts the safety checks on its own server, where an agent can't skip them.

## Four levels

| Level | What happens | Examples |
| --- | --- | --- |
| **Runs directly** | The tool just runs. | Reading anything, adding a domain, saving templates and segments, drafting broadcasts, tracking events, sending with a test key |
| **Asks you in the chat** | The tool answers `CONFIRMATION NEEDED` with a summary. The agent must show it to you and wait for your yes. | Sending a real email, creating API keys, importing contacts, creating or changing workflows and webhooks, changing settings, deleting templates, contacts or segments |
| **Asks you, marked can't be undone** | The same, starting `CONFIRMATION NEEDED (can't be undone)`. The agent must tell you so. | Launching a broadcast, deleting a domain, resetting or deleting a project, revoking or rotating keys, changing roles or removing members, moving credits, removing suppressions |
| **Never through agents** | The tool refuses and points you to the dashboard. | Passwords, signing in or out, platform administration |

## How a confirmation works

::demo{name="agent-confirm"}

1. The agent calls a tool, for example `send_email` to `ada@example.com`.
2. Forke Mail doesn't send. It answers with a summary and a one-time `confirm_token`.
3. The agent shows you the summary and asks.
4. Only after you say yes does it call the same tool again, with the token.

```text
You:    Send the welcome email to ada@example.com
Agent:  Forke Mail wants confirmation: send a real email to ada@example.com
        from hi@acme.com with subject "Welcome to Acme". Should I send it?
You:    Yes
Agent:  Sent. Message ID 5f1c…, status queued.
```

## Why it can't be skipped

- The token only works for **the exact same tool and arguments**, for 10 minutes. Change the recipient or the subject and it needs a new yes.
- The token is tied to **your connection**. Another agent or user can't use it.
- The check runs **on Forke Mail's server**, so calling the API differently doesn't get around it.

## Money

Agents never buy credits, pay, or enter payment details. Anything involving credits is always marked can't be undone and needs your yes.

## Your role still applies

An app acts with your role in the project. If your role can't do something, neither can the app. See [Projects & team](/docs-demo/mail/projects-and-team).

## Disconnecting

See every connected app under **Connectors** in the dashboard and disconnect any of them. It takes effect immediately.
