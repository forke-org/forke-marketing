---
title: Install & sign in
description: Install the forke-mail CLI on macOS, Linux or Windows, sign in through your browser, and set up a project folder.
---

`forke-mail` is one small binary. It sends email, runs any Forke Mail tool from your terminal, sets up projects for your coding agent, and works as a local MCP server.

::demo{name="cli"}

## Install

```bash macOS & Linux
curl -fsSL https://mail.forke.space/install.sh | sh
```

```bash Debian & Ubuntu
# download the .deb for your CPU from the latest release, then:
sudo apt install ./forke-mail_*_linux_amd64.deb
```

```bash Windows
# download forke-mail_<version>_windows_amd64.zip from the latest release,
# unzip it and put forke-mail.exe somewhere on your PATH
```

The install script finds the latest release for your system, checks its SHA-256 checksum and installs it. Every release, with `.deb`, `.rpm` and `.apk` packages, checksums and build attestations, is on [GitHub](https://github.com/forke-org/forke-mail/releases/latest).

## Sign in

```bash
forke-mail login
```

Your browser opens Forke Mail: sign in, pick a project and press **Allow**. Credentials are stored in your user config folder, readable only by you. On a machine without a browser, add `--no-browser` and open the printed link anywhere.

Or skip signing in and use a key:

```bash
export FORKE_MAIL_API_KEY=fm_test_...
```

## Set up a project

In your project folder:

```bash
forke-mail init
```

This:

- creates a **test key** and saves it to `.env` as `FORKE_MAIL_API_KEY`
- adds `.env` to `.gitignore`
- writes Forke Mail notes into `AGENTS.md`, so your coding agent knows how this project sends email

## Check it works

```bash
forke-mail whoami
forke-mail send --to you@example.com --from "Acme <hi@acme.com>" --subject "Hello" --text "It works"
```

## Next steps

:::cards
- [Commands](/docs-demo/agents/cli-commands) — Every command and option. {icon=Terminal}
- [Cursor, VS Code & others](/docs-demo/agents/cursor) — Use the CLI as a local MCP server. {icon=MousePointer2}
:::
