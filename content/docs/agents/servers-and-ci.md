---
title: Servers, CI & frameworks
description: Use Forke Mail's MCP server or CLI without a browser, by sending an API key, for agent frameworks, servers and CI.
---

OAuth needs a person at a browser. For servers, CI jobs and agent frameworks, skip it and send an API key as a bearer token instead.

## MCP with a key

```json
{
  "mcpServers": {
    "forke-mail": {
      "url": "https://mail.forke.space/mcp",
      "headers": { "Authorization": "Bearer fm_test_..." }
    }
  }
}
```

Use a **test key** while you develop: sends are stored, never delivered, and don't ask for confirmation.

## The CLI with a key

```bash
export FORKE_MAIL_API_KEY=fm_test_...
forke-mail whoami
forke-mail send --to ci@acme.com --from "CI <ci@acme.com>" --subject "Build passed" --text "All green."
```

## Confirmations without a person

With a live key, risky tools still answer `CONFIRMATION NEEDED`. In an unattended job, decide in code: the CLI accepts `--yes` to answer yes, and a framework can show the summary to a human reviewer before calling again with the `confirm_token`.

> [!WARNING]
> Only use `--yes` (or auto-confirm in a framework) for actions you'd approve every time, such as a CI notification. Never for broadcasts or deletes.

## Agent frameworks

Any MCP client library works: point it at `https://mail.forke.space/mcp` with the `Authorization` header. Or skip MCP and call the [HTTP API](/docs-demo/mail/api) directly from your tools.

```python Python
from mcp import ClientSession
from mcp.client.streamable_http import streamablehttp_client
import os

async def main():
    headers = {"Authorization": f"Bearer {os.environ['FORKE_MAIL_API_KEY']}"}
    async with streamablehttp_client("https://mail.forke.space/mcp", headers=headers) as (read, write, _):
        async with ClientSession(read, write) as session:
            await session.initialize()
            tools = await session.list_tools()
            result = await session.call_tool("get_account", {})
            print(result.content[0].text)
```
