/**
 * @fileoverview Forke Platform
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

import { snippet, type LangId, type Request } from './snippets'

/**
 * "Send with <language>" guides. Plain languages reuse the API snippet generator; frameworks (Next.js,
 * Laravel, Rails, Express, Django) get code written the way that framework does things.
 */

export type LanguageGuide = { id: string; name: string; icon: string; fence: string; kind: 'language' | 'framework'; setup?: string; file?: string; send: string; template: string; note?: string }

const send: Request = {
  method: 'POST',
  path: '/api/transactional',
  idempotencyKey: 'welcome/user_123',
  body: { to: 'ada@example.com', from_name: 'Acme', from_address: 'hi@acme.com', subject: 'Welcome to Acme', html: '<p>Hi Ada, thanks for signing up!</p>', text: 'Hi Ada, thanks for signing up!' },
}
const tpl: Request = { method: 'POST', path: '/api/transactional', idempotencyKey: 'welcome/user_123', body: { to: 'ada@example.com', from_name: 'Acme', from_address: 'hi@acme.com', template: 'welcome', data: { name: 'Ada' } } }

const plain = (id: LangId) => ({ send: snippet(id, send), template: snippet(id, tpl) })

export const LANGUAGE_GUIDES: LanguageGuide[] = [
  { id: 'nodejs', name: 'Node.js', icon: 'node', fence: 'ts', kind: 'language', setup: 'Node.js 18 or newer has `fetch` built in, so there is nothing to install.', file: 'send.mjs', ...plain('node') },
  {
    id: 'nextjs',
    name: 'Next.js',
    icon: 'nextjs',
    fence: 'tsx',
    kind: 'framework',
    setup: 'Send from the server only: a Route Handler, a Server Action or an API route. Never import your key into a client component.',
    file: 'app/api/welcome/route.ts',
    send: `import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email, name, userId } = await request.json()

  const res = await fetch('https://mail.forke.space/api/transactional', {
    method: 'POST',
    headers: {
      Authorization: \`Bearer \${process.env.FORKE_MAIL_API_KEY}\`,
      'Content-Type': 'application/json',
      'Idempotency-Key': \`welcome/\${userId}\`,
    },
    body: JSON.stringify({
      to: email,
      from_name: 'Acme',
      from_address: 'hi@acme.com',
      subject: 'Welcome to Acme',
      html: \`<p>Hi \${name}, thanks for signing up!</p>\`,
      text: \`Hi \${name}, thanks for signing up!\`,
    }),
  })

  const data = await res.json()
  if (!res.ok) return NextResponse.json({ error: data.error }, { status: 502 })
  return NextResponse.json({ id: data.id })
}`,
    template: `'use server'

// app/actions/send-welcome.ts: call it from a form or another server action.
export async function sendWelcome(user: { id: string; email: string; name: string }) {
  const res = await fetch('https://mail.forke.space/api/transactional', {
    method: 'POST',
    headers: {
      Authorization: \`Bearer \${process.env.FORKE_MAIL_API_KEY}\`,
      'Content-Type': 'application/json',
      'Idempotency-Key': \`welcome/\${user.id}\`,
    },
    body: JSON.stringify({
      to: user.email,
      from_name: 'Acme',
      from_address: 'hi@acme.com',
      template: 'welcome',
      data: { name: user.name },
    }),
  })
  if (!res.ok) throw new Error(\`Forke Mail: \${(await res.json()).error}\`)
}`,
  },
  {
    id: 'express',
    name: 'Express',
    icon: 'node',
    fence: 'ts',
    kind: 'framework',
    setup: 'Express runs on Node.js 18+, which has `fetch` built in.',
    file: 'server.ts',
    send: `import express from 'express'

const app = express()
app.use(express.json())

app.post('/signup', async (req, res) => {
  const { email, name, id } = req.body
  // …create the user…

  const mail = await fetch('https://mail.forke.space/api/transactional', {
    method: 'POST',
    headers: {
      Authorization: \`Bearer \${process.env.FORKE_MAIL_API_KEY}\`,
      'Content-Type': 'application/json',
      'Idempotency-Key': \`welcome/\${id}\`,
    },
    body: JSON.stringify({
      to: email,
      from_name: 'Acme',
      from_address: 'hi@acme.com',
      subject: 'Welcome to Acme',
      html: \`<p>Hi \${name}, thanks for signing up!</p>\`,
    }),
  })
  if (!mail.ok) console.error('welcome email failed', await mail.json())

  res.status(201).json({ ok: true })
})

app.listen(3000)`,
    template: snippet('node', tpl),
  },
  { id: 'python', name: 'Python', icon: 'python', fence: 'python', kind: 'language', setup: 'Install `requests`, the most used HTTP library for Python.\n\n```bash\npip install requests\n```', file: 'send.py', ...plain('python') },
  {
    id: 'django',
    name: 'Django',
    icon: 'python',
    fence: 'python',
    kind: 'framework',
    setup: 'Put the key in your settings from the environment, and send from a view, a signal or a task queue job.\n\n```bash\npip install requests\n```',
    file: 'accounts/emails.py',
    send: `import os
import requests

FORKE_MAIL_URL = "https://mail.forke.space/api/transactional"


def send_welcome(user):
    res = requests.post(
        FORKE_MAIL_URL,
        headers={
            "Authorization": f"Bearer {os.environ['FORKE_MAIL_API_KEY']}",
            "Idempotency-Key": f"welcome/{user.pk}",
        },
        json={
            "to": user.email,
            "from_name": "Acme",
            "from_address": "hi@acme.com",
            "subject": "Welcome to Acme",
            "html": f"<p>Hi {user.first_name}, thanks for signing up!</p>",
        },
        timeout=10,
    )
    res.raise_for_status()
    return res.json()["id"]`,
    template: `# accounts/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
import os, requests


@receiver(post_save, sender=User)
def welcome_new_user(sender, instance, created, **kwargs):
    if not created:
        return
    requests.post(
        "https://mail.forke.space/api/transactional",
        headers={
            "Authorization": f"Bearer {os.environ['FORKE_MAIL_API_KEY']}",
            "Idempotency-Key": f"welcome/{instance.pk}",
        },
        json={
            "to": instance.email,
            "from_name": "Acme",
            "from_address": "hi@acme.com",
            "template": "welcome",
            "data": {"name": instance.first_name},
        },
        timeout=10,
    ).raise_for_status()`,
  },
  { id: 'php', name: 'PHP', icon: 'php', fence: 'php', kind: 'language', setup: 'This uses PHP\'s built-in cURL extension, so there is nothing to install.', file: 'send.php', ...plain('php') },
  {
    id: 'laravel',
    name: 'Laravel',
    icon: 'php',
    fence: 'php',
    kind: 'framework',
    setup: 'Laravel\'s `Http` client is all you need. Add the key to `.env` and read it through `config/services.php`.\n\n```php config/services.php\n\'forke_mail\' => [\n    \'key\' => env(\'FORKE_MAIL_API_KEY\'),\n],\n```',
    file: 'app/Services/ForkeMail.php',
    send: `<?php

namespace App\\Services;

use Illuminate\\Support\\Facades\\Http;

class ForkeMail
{
    public static function send(array $email, ?string $idempotencyKey = null): array
    {
        return Http::withToken(config('services.forke_mail.key'))
            ->withHeaders(array_filter(['Idempotency-Key' => $idempotencyKey]))
            ->post('https://mail.forke.space/api/transactional', $email)
            ->throw()
            ->json();
    }
}

// Anywhere in your app:
ForkeMail::send([
    'to' => $user->email,
    'from_name' => 'Acme',
    'from_address' => 'hi@acme.com',
    'subject' => 'Welcome to Acme',
    'html' => "<p>Hi {$user->name}, thanks for signing up!</p>",
], "welcome/{$user->id}");`,
    template: `ForkeMail::send([
    'to' => $user->email,
    'from_name' => 'Acme',
    'from_address' => 'hi@acme.com',
    'template' => 'welcome',
    'data' => ['name' => $user->name],
], "welcome/{$user->id}");`,
  },
  { id: 'ruby', name: 'Ruby', icon: 'ruby', fence: 'ruby', kind: 'language', setup: 'This uses Ruby\'s standard library (`net/http` and `json`), so there is nothing to install.', file: 'send.rb', ...plain('ruby') },
  {
    id: 'rails',
    name: 'Rails',
    icon: 'ruby',
    fence: 'ruby',
    kind: 'framework',
    setup: 'Wrap the call in a small client and send from a background job, so a slow network never slows down a request.',
    file: 'app/jobs/welcome_email_job.rb',
    send: `require "net/http"

class WelcomeEmailJob < ApplicationJob
  queue_as :default
  retry_on Net::OpenTimeout, wait: :polynomially_longer

  def perform(user)
    uri = URI("https://mail.forke.space/api/transactional")
    req = Net::HTTP::Post.new(uri)
    req["Authorization"] = "Bearer #{ENV.fetch("FORKE_MAIL_API_KEY")}"
    req["Content-Type"] = "application/json"
    req["Idempotency-Key"] = "welcome/#{user.id}"
    req.body = {
      to: user.email,
      from_name: "Acme",
      from_address: "hi@acme.com",
      subject: "Welcome to Acme",
      html: "<p>Hi #{user.name}, thanks for signing up!</p>",
    }.to_json

    res = Net::HTTP.start(uri.host, uri.port, use_ssl: true) { |http| http.request(req) }
    raise "Forke Mail: #{res.body}" unless res.is_a?(Net::HTTPSuccess)
  end
end

# after the user is created:
WelcomeEmailJob.perform_later(user)`,
    template: `req.body = {
  to: user.email,
  from_name: "Acme",
  from_address: "hi@acme.com",
  template: "welcome",
  data: { name: user.name },
}.to_json`,
  },
  { id: 'go', name: 'Go', icon: 'go', fence: 'go', kind: 'language', setup: 'This uses Go\'s standard library (`net/http`), so there is nothing to install.', file: 'main.go', ...plain('go') },
  { id: 'rust', name: 'Rust', icon: 'rust', fence: 'rust', kind: 'language', setup: 'Add `reqwest`, `tokio` and `serde_json`.\n\n```bash\ncargo add reqwest --features json\ncargo add tokio --features full\ncargo add serde_json\n```', file: 'src/main.rs', ...plain('rust') },
  { id: 'java', name: 'Java', icon: 'java', fence: 'java', kind: 'language', setup: 'Java 15 or newer: `java.net.http.HttpClient` and text blocks are built in.', file: 'Main.java', ...plain('java') },
  { id: 'dotnet', name: '.NET', icon: 'dotnet', fence: 'csharp', kind: 'language', setup: '.NET 7 or newer (C# 11 raw string literals). `HttpClient` is built in.', file: 'Program.cs', ...plain('dotnet'), note: 'In an ASP.NET app, register a typed client with `builder.Services.AddHttpClient<ForkeMail>()` instead of creating `HttpClient` yourself.' },
  { id: 'curl', name: 'cURL', icon: 'terminal', fence: 'bash', kind: 'language', setup: 'Good for trying things out, shell scripts and cron jobs.', file: 'send.sh', ...plain('curl') },
]

export function languageGuideMarkdown(g: LanguageGuide): string {
  return `---
title: Send emails with ${g.name}
description: Send your first email from ${g.name} with Forke Mail in a few minutes, then use templates, handle errors and retry safely.
---

This guide sends a real email from ${g.name}: first with inline HTML, then with a saved template. Every example uses Forke Mail's HTTP API directly, so there's no SDK to install or keep up to date.

> [!NOTE]
> You need a Forke Mail account and an API key. A **test key** (\`fm_test_…\`) works for this whole guide: emails are checked and stored but never delivered, and any from address works. Switch to a **live key** and a [verified domain](/docs-demo/mail/domains) when you're ready to send for real.

:::steps

### Store your API key

Create a key under **API keys** in the [dashboard](https://mail.forke.space/keys/), or run \`forke-mail init\` in your project. Put it in an environment variable, never in your code.

\`\`\`bash .env
FORKE_MAIL_API_KEY=fm_test_...
\`\`\`

### Set up ${g.name}

${g.setup ?? 'Nothing to install.'}

### Send an email

\`\`\`${g.fence} ${g.file ?? ''}
${g.send}
\`\`\`

A successful call answers \`202 Accepted\` with the email and \`"status": "queued"\`. It's sent within a second or two. With a test key the status is \`test\` and nothing is delivered.

### Send a template instead

Saved [templates](/docs-demo/mail/templates) keep the wording out of your code. Send one by name with the values it needs:

\`\`\`${g.fence}
${g.template}
\`\`\`

:::

${g.note ? `> [!TIP]\n> ${g.note}\n\n` : ''}## Handle errors

Errors come back as JSON with a status code, like \`{"error": "from_domain_not_verified"}\`. The ones to handle in your code:

| Status | Error | What to do |
| --- | --- | --- |
| \`401\` | \`unauthorized\` | The key is missing, mistyped or revoked. |
| \`402\` | \`trial_quota_exceeded\` | Out of credits. Add credits in the dashboard. |
| \`409\` | \`idempotency_key_reused\` | The same key was used with a different body. Use a new key per email. |
| \`422\` | \`from_domain_not_verified\` | Send from an address on a [verified domain](/docs-demo/mail/domains). |
| \`422\` | \`recipient_suppressed\` | This address bounced or complained before. Don't retry. |
| \`429\` | \`rate_limited\`, \`daily_limit_reached\` | Wait and retry later. |

Every code is listed in [Errors](/docs-demo/mail/api/errors).

## Retry safely

Networks fail. Send an \`Idempotency-Key\` header (the examples use \`welcome/<user id>\`) and you can retry the same request as often as you like: Forke Mail sends the email once and returns the same answer for 24 hours. More in [Retries & idempotency](/docs-demo/mail/idempotency).

## Next steps

:::cards
- [Verify your domain](/docs-demo/mail/domains) — Send from your own domain with SPF, DKIM and DMARC. {icon=Globe}
- [Templates](/docs-demo/mail/templates) — Variables, raw HTML blocks and the unsubscribe link. {icon=LayoutTemplate}
- [Webhooks](/docs-demo/mail/webhooks) — Hear about deliveries, bounces and opens. {icon=Webhook}
- [API reference](/docs-demo/mail/api/emails/send) — Every field of the send endpoint. {icon=Braces}
:::
`
}
