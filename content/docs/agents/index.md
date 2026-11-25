---
title: Agents & CLI
description: Let Claude, ChatGPT, Cursor or your coding agent set up and send email with Forke Mail, with the server asking you before anything risky.
---

Forke Mail has an MCP server, so any AI app that supports the Model Context Protocol can use it: add your domain, write templates, wire email into your code, send, and find out why an email didn't arrive. You stay in charge: anything risky needs your yes in the chat.

::image{src="/docs-demo/img/agents-hero.webp" alt="AI assistants including ChatGPT, Claude, Gemini and Cursor streaming amber light filaments into a Forke relay hub" prompt="P5" ratio="21 / 9"}

## Three ways in

| | Best for | Address |
| --- | --- | --- |
| **MCP server** | Claude, ChatGPT, Cursor, VS Code, Windsurf and other AI apps | `https://mail.forke.space/mcp` |
| **CLI** | Your terminal, scripts, and AI apps that only run local servers | `forke-mail` |
| **HTTP API** | Your own code and agent frameworks | `https://mail.forke.space/api` |

## Connect in one step

Add `https://mail.forke.space/mcp` as a connector, sign in to Forke Mail in the window that opens, pick a project and press **Allow**. You never paste a key into a chat.

::demo{name="connect"}

## What you can ask

- "Set up Forke Mail for my Next.js app"
- "Add my domain acme.com and tell me which DNS records to add"
- "Write a welcome email template that matches my landing page"
- "Build a three-email welcome series for new sign-ups"
- "Why did the email to ada@example.com bounce?"
- "How did my emails do this week?"

More in the [prompt library](/docs-demo/agents/prompts).

## Safe by default

::demo{name="agent-confirm" caption="Before a real send, the agent has to show you what it's about to do and wait for your yes."}

Every action is sorted by risk, **on Forke Mail's server**, so a confused agent can't skip it:

- **Reading** anything and **building** (templates, segments, drafts, test sends) runs directly.
- **Real sends, new keys, deletes and settings** need your yes in the chat.
- **Things that can't be undone** (launching a broadcast, deleting a domain, anything about credits) say so clearly before you answer.
- **Passwords, signing in or out and payments** are never available to agents.

See [Safety & confirmations](/docs-demo/agents/safety).

## Next steps

:::cards
- [Quickstart](/docs-demo/agents/quickstart) — Connect your app and run your first prompt. {icon=Rocket}
- [Prompt library](/docs-demo/agents/prompts) — Ready-made requests that work well. {icon=Wand}
- [Tools reference](/docs-demo/agents/tools) — Everything an agent can do. {icon=Hammer}
- [CLI](/docs-demo/agents/cli) — Install and sign in. {icon=Terminal}
:::
