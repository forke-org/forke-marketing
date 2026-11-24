---
title: Tools reference
description: Every tool the Forke Mail MCP server and CLI offer, what it does and its safety level.
---

These are the tools agents can use. Every tool that changes something also accepts `confirm_token`, which agents fill in after you confirm in the chat. See [Safety & confirmations](/docs-demo/agents/safety).

::tools

## Anything else: call_api

`call_api` reaches any `/api` endpoint the other tools don't cover: workflows, topics, suppressions, team, webhooks, settings. Reading is free; risky changes ask you first, exactly like the named tools. Every endpoint is in the [API reference](/docs-demo/mail/api).

## From the terminal

The CLI runs the same tools:

```bash
forke-mail tools
forke-mail call list_domains
forke-mail call save_template '{"name":"welcome","kind":"transactional","subject":"Hi {{name}}","html":"<p>Hi {{name}}</p>"}'
```
