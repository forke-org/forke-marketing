---
title: Quickstart
description: Connect your AI app to Forke Mail and have it add email to your project, in about three minutes.
---

By the end of this page your AI app will be connected to Forke Mail and will have added email to a project: a test key in `.env`, a small send helper, and a first test email.

:::steps

### Add the connector

Pick your app. Every app uses the same address: `https://mail.forke.space/mcp`.

| App | Where |
| --- | --- |
| [Claude](/docs-demo/agents/claude) | Settings → Connectors → Add custom connector |
| [ChatGPT](/docs-demo/agents/chatgpt) | Settings → Connectors → Create |
| [Claude Code](/docs-demo/agents/claude-code) | `claude mcp add --transport http forke-mail https://mail.forke.space/mcp` |
| [Cursor, VS Code, Windsurf…](/docs-demo/agents/cursor) | `"forke-mail": { "url": "https://mail.forke.space/mcp" }` in the MCP settings |

### Sign in and allow

A Forke Mail window opens. Sign in, choose the project the app should use (or create one), and press **Allow**.

::demo{name="connect"}

### Paste the setup prompt

```text
Set up Forke Mail in this web project.
1. Call get_account to see my project, verified domains and limits.
2. Create a test API key with create_api_key (mode "test") and add it to .env as FORKE_MAIL_API_KEY. Make sure .env is in .gitignore.
3. Add a small sendEmail helper that calls POST https://mail.forke.space/api/transactional with the key from the environment and an Idempotency-Key header.
4. Send one test email through the helper and show me the result.
5. Tell me what I need to switch to live sending (verified domain and a live key).
```

The app asks you once, in the chat, before creating the key. The test email is stored, not delivered, so nothing goes out.

### Go live when you're ready

Ask: "Help me send email from my domain." It adds the domain, shows you the DNS records, and checks them until they pass. Then it creates a live key, after asking you.

:::

## Next steps

:::cards
- [Prompt library](/docs-demo/agents/prompts) — Nine prompts for common jobs. {icon=Wand}
- [Safety & confirmations](/docs-demo/agents/safety) — What needs your yes, and why. {icon=ShieldCheck}
:::
