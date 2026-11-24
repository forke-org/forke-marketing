---
title: Claude Code
description: Add Forke Mail to Claude Code with one command, so it can set up email in the project you're working on.
---

:::steps

### Add the server

```bash
claude mcp add --transport http forke-mail https://mail.forke.space/mcp
```

Add `--scope project` to share it with everyone working on the repository (it's saved in `.mcp.json`).

### Sign in

Inside Claude Code, run:

```text
/mcp
```

Choose **forke-mail** and **Authenticate**. Your browser opens Forke Mail: sign in, pick a project and press **Allow**.

### Ask

```prompt Prompt
Set up Forke Mail in this project: create a test key, add a sendEmail helper and send one test email.
```

:::

## Make it stick with AGENTS.md

Run `forke-mail init` once in the repository. It writes notes into `AGENTS.md` (and creates a test key in `.env`), so Claude Code and other coding agents know how this project sends email, even in sessions without the connector. See [CLI](/docs-demo/agents/cli).

## Without the network: the CLI as a local server

```bash
curl -fsSL https://mail.forke.space/install.sh | sh
forke-mail login
claude mcp add forke-mail -- forke-mail mcp
```

Confirmations then appear in the chat exactly the same way.
