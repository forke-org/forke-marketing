---
title: Templates
description: Save an email once with variables, then send it by name from your code, workflows and broadcasts. Escaped values, raw HTML and built-in variables.
---

A template keeps the words and design of an email out of your code. Your app sends `template: "welcome"` with a little data; the template decides what it looks like. Change the email in the dashboard and every future send uses the new version.

## Create one

In the dashboard under **Templates**, or with the API:

```json
{
  "name": "welcome",
  "kind": "transactional",
  "subject": "Welcome to Acme, {{name}}",
  "html": "<h1>Hi {{name}}</h1><p>Thanks for joining Acme.</p><p><a href=\"{{{login_url}}}\">Open your dashboard</a></p>",
  "text": "Hi {{name}}, thanks for joining Acme. Open your dashboard: {{{login_url}}}"
}
```

Variables are found automatically from the placeholders: this template has `name` and `login_url`.

## Variables

| Syntax | What it inserts |
| --- | --- |
| `{{name}}` | The value, HTML-escaped. Safe for anything a user typed. |
| `{{{block}}}` | The value as raw HTML, not escaped. Only for HTML you built yourself. |
| `{{date}}` | Today's date, like `24 Nov 2026`, unless you pass your own `date`. |

> [!WARNING]
> Never put user input in a `{{{triple}}}` placeholder. Use `{{double}}` so it's escaped.

In broadcasts, these are filled for each contact automatically:

| Variable | Value |
| --- | --- |
| `{{first_name}}` | The contact's first name |
| `{{email}}` | The contact's address |
| `{{unsubscribe_url}}` | Their personal unsubscribe link |

## Send it

```json
{
  "to": "ada@example.com",
  "from_address": "hi@acme.com",
  "from_name": "Acme",
  "template": "welcome",
  "data": { "name": "Ada", "login_url": "https://acme.com/login" }
}
```

Use the template's name (`template`) or its ID (`template_id`). The template's subject is used.

## Transactional or marketing

| Kind | Who receives it |
| --- | --- |
| `transactional` | Everyone you send it to. For receipts, codes and alerts. |
| `marketing` | Skips people who unsubscribed. Must keep the `{{unsubscribe_url}}` link. For broadcasts and promotional workflows. |

## Tips

- Keep templates simple: one column, web-safe fonts, images with `alt` text.
- Name them by what they're for, not when they were made: `password-reset`, not `email-v3`.
- Deleting a template breaks any code or workflow that still sends it. Check first.

> [!TIP]
> Ask an AI app to write one for you: "Create a welcome email template for my product with a friendly tone." See the [prompt library](/docs-demo/agents/prompts).

## Next steps

:::cards
- [Templates API](/docs-demo/mail/api/templates/create) — Create, update and delete. {icon=Braces}
- [Workflows](/docs-demo/mail/workflows) — Send templates on a schedule. {icon=GitMerge}
:::
