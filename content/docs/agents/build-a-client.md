---
title: Build your own MCP client
description: The discovery documents, dynamic client registration, OAuth with PKCE and the MCP transport, for anyone building an AI app or agent that connects to Forke Mail.
---

Forke Mail follows the MCP authorization spec, so standard MCP clients connect with no special code. This page is for people building their own.

## Discovery

An unauthenticated request to `/mcp` answers `401` with a `WWW-Authenticate` header pointing at the protected-resource metadata:

```http
WWW-Authenticate: Bearer resource_metadata="https://mail.forke.space/.well-known/oauth-protected-resource"
```

| Document | Address |
| --- | --- |
| Protected resource metadata | `GET /.well-known/oauth-protected-resource` |
| Authorization server metadata | `GET /.well-known/oauth-authorization-server` |
| MCP server card | `GET /.well-known/mcp.json` |

## Register

`POST /oauth/register` with dynamic client registration (public clients, no secret). Redirect URIs can be:

- `https://…`
- `http://127.0.0.1` or `http://localhost`, on any port
- an app scheme such as `cursor://…`

## Authorize

Send the person to `GET /oauth/authorize` with PKCE (`code_challenge_method=S256`). They sign in, pick a project and press **Allow**; you get a code on your redirect URI.

## Tokens

| Step | Endpoint |
| --- | --- |
| Exchange the code | `POST /oauth/token` with `grant_type=authorization_code` and the `code_verifier` |
| Refresh | `POST /oauth/token` with `grant_type=refresh_token` |
| Revoke | `POST /oauth/revoke` |

Access tokens (`fm_oauth_…`) last an hour. Refresh tokens (`fm_refresh_…`) rotate on every use and keep working for 60 days of use. OAuth tokens are only accepted at `/mcp`.

## The MCP endpoint

`POST https://mail.forke.space/mcp` speaks JSON-RPC over Streamable HTTP and answers with JSON (no server-sent events). Supported protocol versions: `2025-06-18`, `2025-03-26` and `2024-11-05`. It offers tools, a `forke-mail://guide` resource and prompts.

```bash
curl -X POST https://mail.forke.space/mcp \
  -H "Authorization: Bearer $FORKE_MAIL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_account","arguments":{}}}'
```

## Handling confirmations

When a tool answers `CONFIRMATION NEEDED`, show the summary to the person, and only after an explicit yes call the same tool with the same arguments plus `confirm_token`. Never confirm on their behalf. See [Safety & confirmations](/docs-demo/agents/safety).

## Registry

Forke Mail is listed in the official MCP Registry as `space.forke/mail`.
