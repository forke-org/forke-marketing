---
title: Quickstart
description: Send your first email in about five minutes. Get a test key, send from any language, then verify your domain and go live.
---

By the end of this page you will:

1. **Send a test email** from your code with a test key, no domain needed
2. **Look it up** and see its status
3. **Verify your domain** and send a real email

Prefer to let an AI app do it? Connect it and paste one prompt: see [Agents quickstart](/docs-demo/agents/quickstart).

## Get a test key

Sign in at [mail.forke.space](https://mail.forke.space), open **API keys**, create a key and choose **Test**. Or let the CLI do it in your project folder:

```bash Terminal
brew install forke-org/tap/forke-mail   # or: curl -fsSL https://mail.forke.space/install.sh | sh
forke-mail login
forke-mail init
```

`forke-mail init` creates a test key, saves it to `.env` as `FORKE_MAIL_API_KEY`, adds `.env` to `.gitignore` and writes notes into `AGENTS.md` so your coding agent knows how to send email in this project.

::demo{name="cli"}

> [!NOTE]
> Test keys check everything exactly like live keys, but emails are stored with status `test` and never delivered. Any from address works, so you can build before your domain is verified.

## 1. Send an email

```bash cURL
curl -X POST "https://mail.forke.space/api/transactional" \
  -H "Authorization: Bearer $FORKE_MAIL_API_KEY" \
  -H "Idempotency-Key: hello/1" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "you@example.com",
    "from_name": "Acme",
    "from_address": "hi@acme.com",
    "subject": "Hello from Forke Mail",
    "html": "<p>It works!</p>",
    "text": "It works!"
  }'
```

```ts Node.js
const res = await fetch('https://mail.forke.space/api/transactional', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.FORKE_MAIL_API_KEY}`,
    'Content-Type': 'application/json',
    'Idempotency-Key': 'hello/1',
  },
  body: JSON.stringify({
    to: 'you@example.com',
    from_name: 'Acme',
    from_address: 'hi@acme.com',
    subject: 'Hello from Forke Mail',
    html: '<p>It works!</p>',
    text: 'It works!',
  }),
})
console.log(res.status, await res.json())
```

```python Python
import os
import requests

res = requests.post(
    "https://mail.forke.space/api/transactional",
    headers={
        "Authorization": f"Bearer {os.environ['FORKE_MAIL_API_KEY']}",
        "Idempotency-Key": "hello/1",
    },
    json={
        "to": "you@example.com",
        "from_name": "Acme",
        "from_address": "hi@acme.com",
        "subject": "Hello from Forke Mail",
        "html": "<p>It works!</p>",
        "text": "It works!",
    },
)
print(res.status_code, res.json())
```

```bash CLI
forke-mail send --to you@example.com --from "Acme <hi@acme.com>" --subject "Hello from Forke Mail" --text "It works!"
```

You get `202 Accepted` and the email back, with an `id`:

```json
{
  "id": "5f1c2e7a-8d43-4b1e-9c55-2a7f0e9b6d13",
  "to": "you@example.com",
  "subject": "Hello from Forke Mail",
  "status": "test",
  "created_at": "2026-11-24T09:41:07Z"
}
```

Other languages: [Go](/docs-demo/mail/send-with-go), [PHP](/docs-demo/mail/send-with-php), [Ruby](/docs-demo/mail/send-with-ruby), [Rust](/docs-demo/mail/send-with-rust), [Java](/docs-demo/mail/send-with-java), [.NET](/docs-demo/mail/send-with-dotnet) and [more](/docs-demo/mail/languages).

## 2. Look it up

Use the `id` to see where the email is. In the dashboard it's under **Deliveries**.

```bash
curl "https://mail.forke.space/api/transactional/5f1c2e7a-8d43-4b1e-9c55-2a7f0e9b6d13" \
  -H "Authorization: Bearer $FORKE_MAIL_API_KEY"
```

A live email goes `queued` → `sent` in about a second, then gets `delivered_at`, and `opened_at` and `clicked_at` if you turned on [tracking](/docs-demo/mail/tracking). A test email stays `test`.

## 3. Go live

:::steps

### Verify your domain

Open **Domains**, add `acme.com` and copy the five DNS records into your DNS provider. Forke Mail checks them on its own and marks the domain **verified**, usually within minutes. See [Add & verify a domain](/docs-demo/mail/domains).

::demo{name="domain"}

### Create a live key

Create a key and choose **Live**. Put it in your production environment as `FORKE_MAIL_API_KEY`. Nothing else in your code changes.

### Send for real

The same request now delivers the email. Add a [webhook](/docs-demo/mail/webhooks) to hear about bounces and complaints.

:::

## Next steps

:::cards
- [Transactional email](/docs-demo/mail/sending) — Every option, from reply-to to tags. {icon=Send}
- [Templates](/docs-demo/mail/templates) — Keep email content out of your code. {icon=LayoutTemplate}
- [Webhooks](/docs-demo/mail/webhooks) — Delivery, bounce and open events in real time. {icon=Webhook}
- [Retries & idempotency](/docs-demo/mail/idempotency) — Never send the same email twice. {icon=RefreshCw}
:::
