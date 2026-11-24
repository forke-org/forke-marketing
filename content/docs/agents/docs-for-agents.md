---
title: These docs, for agents
description: Every page as markdown, the whole site in one file, a docs MCP server and a ready-made skill, so your AI agent can read these docs as easily as you can.
---

These docs are written for people and for the AI agents working with them. Everything here is available as clean text.

| What | Address | Use it for |
| --- | --- | --- |
| **Any page as markdown** | Add `.md` to the address: [/docs-demo/mail/quickstart.md](/docs-demo/mail/quickstart.md) | Giving an agent one page |
| **Index** | [/docs-demo/llms.txt](/docs-demo/llms.txt) | Letting an agent find the right page |
| **Everything** | [/docs-demo/llms-full.txt](/docs-demo/llms-full.txt) | Loading all docs into context at once |
| **Docs MCP server** | `https://www.forke.space/docs-demo/mcp` | Search and read pages as tools, on demand |
| **Agent skill** | [/docs-demo/skill.md](/docs-demo/skill.md) | A `SKILL.md` that teaches an agent to send email with Forke Mail |

Agents that ask for `text/markdown` (or identify as an AI agent) get markdown from the normal page addresses too, so pasting a docs link into a chat just works.

## The docs MCP server

A read-only MCP server with three tools: `search_docs`, `read_page` and `list_pages`. No sign-in. Add it like any remote server:

```bash Claude Code
claude mcp add --transport http forke-docs https://www.forke.space/docs-demo/mcp
```

```json Cursor
{
  "mcpServers": {
    "forke-docs": { "url": "https://www.forke.space/docs-demo/mcp" }
  }
}
```

> [!NOTE]
> The docs server only reads documentation. To act on your Forke Mail account (send, add domains, write templates), connect the product server `https://mail.forke.space/mcp`. See [Quickstart](/docs-demo/agents/quickstart).

## The skill

[`/docs-demo/skill.md`](/docs-demo/skill.md) is an agent skill: a short `SKILL.md` with the rules and code an agent needs to send email with Forke Mail correctly (keys in the environment, idempotency keys, error handling, templates). Save it into your agent's skills folder, for example:

```bash
mkdir -p .claude/skills/forke-mail
curl -fsSL https://www.forke.space/docs-demo/skill.md -o .claude/skills/forke-mail/SKILL.md
```

## On every page

Every page has **Copy page** (markdown, ready to paste), **View as markdown**, **Open in Claude** and **Open in ChatGPT**.
