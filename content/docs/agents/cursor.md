---
title: Cursor, VS Code & others
description: Add Forke Mail to Cursor, VS Code, Windsurf, Antigravity and any app that reads an MCP settings file.
---

Most apps read a JSON file of MCP servers. Add Forke Mail to it:

```json
{
  "mcpServers": {
    "forke-mail": { "url": "https://mail.forke.space/mcp" }
  }
}
```

The app opens your browser to sign in the first time it connects.

## Where the file is

| App | File |
| --- | --- |
| Cursor | `~/.cursor/mcp.json`, or `.cursor/mcp.json` in your project |
| VS Code | `.vscode/mcp.json` in your project (VS Code uses `"servers"` instead of `"mcpServers"`, with `"type": "http"`) |
| Windsurf | `~/.codeium/windsurf/mcp_config.json` (use `"serverUrl"` instead of `"url"`) |
| Antigravity and others | The app's MCP settings; look for "Add server" or "Edit config" |

```json .vscode/mcp.json
{
  "servers": {
    "forke-mail": { "type": "http", "url": "https://mail.forke.space/mcp" }
  }
}
```

## Apps that only run local servers

Install the CLI and sign in once, then run it as a local (stdio) server:

```bash
curl -fsSL https://mail.forke.space/install.sh | sh
forke-mail login
```

```json
{
  "mcpServers": {
    "forke-mail": { "command": "forke-mail", "args": ["mcp"] }
  }
}
```

## Next steps

:::cards
- [Prompt library](/docs-demo/agents/prompts) — What to ask. {icon=Wand}
- [Servers, CI & frameworks](/docs-demo/agents/servers-and-ci) — No browser? Use a key. {icon=Server}
:::
