---
title: Claude
description: Add Forke Mail to Claude on the web, desktop and mobile as a custom connector.
---

Custom connectors work in Claude on the web and in the desktop app. Once added, they're available on mobile too.

:::steps

### Add the connector

Open **Settings → Connectors → Add custom connector**. Name it **Forke Mail** and paste:

```text
https://mail.forke.space/mcp
```

### Connect

Press **Connect**. A Forke Mail window opens: sign in, pick a project and press **Allow**.

::demo{name="connect"}

### Use it in a chat

Turn Forke Mail on from the tools menu in a chat, then ask, for example: "Help me send email from my domain acme.com."

:::

## Prompts in the menu

Forke Mail's ready-made prompts show up in Claude's prompt menu. Pick one, fill in any blanks, and send. See the [prompt library](/docs-demo/agents/prompts).

## Switching projects

Claude works in the project you picked when you connected. Ask "switch to my other project" to change it, or disconnect and connect again.

## Troubleshooting

- **The connect window doesn't open:** allow pop-ups for claude.ai, then press Connect again.
- **"Can't connect":** remove the connector, add it again, and check [status.forke.space](https://status.forke.space).
