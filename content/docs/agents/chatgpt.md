---
title: ChatGPT
description: Add Forke Mail to ChatGPT as a custom connector with OAuth sign-in.
---

:::steps

### Turn on custom connectors

Open **Settings → Connectors**. Depending on your plan, you may need to turn on **developer mode** under advanced settings before you can create custom connectors.

### Create the connector

Choose **Create**, then:

| Field | Value |
| --- | --- |
| Name | Forke Mail |
| MCP server URL | `https://mail.forke.space/mcp` |
| Authentication | OAuth |

### Sign in and allow

ChatGPT opens Forke Mail: sign in, pick a project and press **Allow**.

### Use it

In a new chat, choose Forke Mail from the tools list and ask, for example: "How did my emails do this week?"

:::

> [!NOTE]
> ChatGPT shows Forke Mail's confirmation summaries in the chat the same way as any other app: nothing real is sent until you say yes.

## Next steps

:::cards
- [Prompt library](/docs-demo/agents/prompts) — What to ask. {icon=Wand}
- [Safety & confirmations](/docs-demo/agents/safety) — What needs your yes. {icon=ShieldCheck}
:::
