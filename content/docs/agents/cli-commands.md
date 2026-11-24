---
title: Commands
description: Every forke-mail command, option and environment variable.
---

| Command | What it does |
| --- | --- |
| `forke-mail login` | Sign in through your browser. |
| `forke-mail logout` | Revoke this device and remove the stored credentials. |
| `forke-mail whoami` | Project, plan, credits, limits, and whether you're using a test key. |
| `forke-mail init` | Set up the current folder: a test key in `.env`, `.env` in `.gitignore`, notes in `AGENTS.md`. |
| `forke-mail send` | Send an email (options below). |
| `forke-mail domains` | List sending domains and their status. |
| `forke-mail tools` | List every tool with its description. |
| `forke-mail call <tool>` | Run any tool with JSON (`'{"name":"x"}'`) or `key=value` arguments. |
| `forke-mail mcp` | Run as a local MCP server over stdio. |

## send

```bash
forke-mail send \
  --to ada@example.com \
  --from "Acme <hi@acme.com>" \
  --subject "Your receipt" \
  --html-file receipt.html
```

| Option | Meaning |
| --- | --- |
| `--to` | The recipient. |
| `--from` | `Name <address>` or just the address. |
| `--subject` | The subject. |
| `--text` | A plain-text body. |
| `--html` | An HTML body. |
| `--html-file` | Read the HTML body from a file. |
| `--template` | Send a saved template by name. |
| `--data key=value` | A template value. Repeat for more. |

```bash
forke-mail send --to ada@example.com --from "Acme <hi@acme.com>" --template welcome --data name=Ada
```

## Options for every command

| Option | Meaning |
| --- | --- |
| `--yes` | Answer confirmation prompts with yes. |
| `--json` | Print raw JSON output. |
| `--no-browser` | Print links instead of opening them. |
| `--url` | Use another Forke Mail server. |

## Environment

| Variable | Meaning |
| --- | --- |
| `FORKE_MAIL_API_KEY` | Use this key instead of the signed-in account. |
| `FORKE_MAIL_URL` | Use another server. |

## Confirmations

When a command needs confirmation, the CLI asks in the terminal and says when the action can't be undone:

```text
Send a real email to ada@example.com from hi@acme.com with subject "Your receipt"?
Go ahead? [y/N]
```
