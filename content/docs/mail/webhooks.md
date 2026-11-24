---
title: Webhooks
description: Get a signed HTTPS request when an email is delivered, bounces, is opened, or when a contact or your project changes. Every event, the payload, retries and signature checks in five languages.
---

A webhook is a URL on your server that Forke Mail calls when something happens. Use them to mark an email as delivered in your app, stop emailing an address that bounced, or alert your team when sending is paused.

::demo{name="lifecycle"}

:::steps

### Create an endpoint

Under **Webhooks** in the dashboard, or with [`POST /api/webhooks`](/docs-demo/mail/api/webhooks/create): give a public `https` URL and the events you want. The answer includes the **signing secret**, shown only once. Store it as `FORKE_MAIL_WEBHOOK_SECRET`.

### Verify every request

Check the signature before trusting a request (below).

### Answer quickly with 2xx

Return any `2xx` within 10 seconds. Do slow work after answering, in a queue.

:::

## Events

| Event | When |
| --- | --- |
| `email.queued` | An email was accepted. |
| `email.sent` | It was handed to Amazon SES. |
| `email.delivered` | The recipient's mail server accepted it. |
| `email.delayed` | Delivery is delayed; SES keeps trying. |
| `email.bounced` | A permanent bounce. The address is now suppressed. |
| `email.soft_bounced` | A temporary bounce, such as a full mailbox. |
| `email.complained` | The recipient marked it as spam. The address is now suppressed. |
| `email.unsubscribed` | The recipient unsubscribed. |
| `email.failed` | It couldn't be sent. |
| `email.rejected` | SES refused to send it. |
| `email.opened` | The first counted open (needs [tracking](/docs-demo/mail/tracking)). |
| `email.clicked` | A counted click. The link is on the email's timeline. |
| `contact.updated` | A contact's status or topic choices changed. |
| `contact.deleted` | A contact was deleted. |
| `workspace.reputation_warning` | Bounce or complaint rates are getting high. |
| `workspace.sending_paused` | Sending was paused to protect your reputation. |

## The request

```http
POST /webhooks/forke-mail HTTP/1.1
Content-Type: application/json
Webhook-Id: 771204
Webhook-Timestamp: 1764063670
Webhook-Signature: v1=4f9c2b…
Webhook-Key-Version: 1

{
  "id": "771204",
  "version": "1",
  "type": "email.delivered",
  "created_at": "2026-11-24T09:41:10Z",
  "data": {
    "message_id": "5f1c2e7a-8d43-4b1e-9c55-2a7f0e9b6d13",
    "message_type": "transactional"
  }
}
```

| `data` field | Meaning |
| --- | --- |
| `message_type` | `transactional`, `broadcast` or `workspace`. |
| `message_id` | For transactional email: the `id` you got when you sent it. |
| `email_id`, `recipient_id` | For broadcasts: the broadcast and the recipient. |
| `contact_id`, `email`, `status` | For `contact.*` events. |

Use the event's `id` to ignore duplicates: the same event can arrive more than once.

## Verifying signatures

`Webhook-Signature` is `v1=` followed by the hex HMAC-SHA256 of `<Webhook-Id>.<Webhook-Timestamp>.<raw body>`, keyed with your secret. Reject requests older than 5 minutes, and compare in constant time. Always use the **raw** body, before any JSON parsing.

```ts Node.js
import { createHmac, timingSafeEqual } from 'node:crypto'

export function verify(raw: string, headers: Headers, secret = process.env.FORKE_MAIL_WEBHOOK_SECRET!) {
  const id = headers.get('webhook-id') ?? ''
  const ts = headers.get('webhook-timestamp') ?? ''
  const sig = headers.get('webhook-signature') ?? ''
  if (Math.abs(Date.now() / 1000 - Number(ts)) > 300) return false
  const expected = 'v1=' + createHmac('sha256', secret).update(`${id}.${ts}.${raw}`).digest('hex')
  return sig.length === expected.length && timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
}

// Next.js route handler
export async function POST(req: Request) {
  const raw = await req.text()
  if (!verify(raw, req.headers)) return new Response('bad signature', { status: 401 })
  const event = JSON.parse(raw)
  // …handle event.type…
  return new Response('ok')
}
```

```python Python
import hashlib, hmac, os, time

def verify(raw: bytes, headers) -> bool:
    secret = os.environ["FORKE_MAIL_WEBHOOK_SECRET"].encode()
    msg_id = headers.get("Webhook-Id", "")
    ts = headers.get("Webhook-Timestamp", "0")
    sig = headers.get("Webhook-Signature", "")
    if abs(time.time() - int(ts)) > 300:
        return False
    expected = "v1=" + hmac.new(secret, f"{msg_id}.{ts}.".encode() + raw, hashlib.sha256).hexdigest()
    return hmac.compare_digest(sig, expected)

# Flask: verify(request.get_data(), request.headers)
# Django: verify(request.body, request.headers)
```

```go Go
func verify(raw []byte, h http.Header, secret string) bool {
	ts, err := strconv.ParseInt(h.Get("Webhook-Timestamp"), 10, 64)
	if err != nil || math.Abs(float64(time.Now().Unix()-ts)) > 300 {
		return false
	}
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write([]byte(h.Get("Webhook-Id") + "." + h.Get("Webhook-Timestamp") + "."))
	mac.Write(raw)
	expected := "v1=" + hex.EncodeToString(mac.Sum(nil))
	return hmac.Equal([]byte(h.Get("Webhook-Signature")), []byte(expected))
}
```

```php PHP
function verify(string $raw, array $headers, string $secret): bool {
    $id = $headers['Webhook-Id'] ?? '';
    $ts = $headers['Webhook-Timestamp'] ?? '0';
    $sig = $headers['Webhook-Signature'] ?? '';
    if (abs(time() - (int) $ts) > 300) return false;
    $expected = 'v1=' . hash_hmac('sha256', "{$id}.{$ts}.{$raw}", $secret);
    return hash_equals($expected, $sig);
}

// verify(file_get_contents('php://input'), getallheaders(), getenv('FORKE_MAIL_WEBHOOK_SECRET'));
```

```ruby Ruby
require "openssl"

def verify(raw, headers, secret = ENV.fetch("FORKE_MAIL_WEBHOOK_SECRET"))
  ts = headers["Webhook-Timestamp"].to_i
  return false if (Time.now.to_i - ts).abs > 300
  expected = "v1=" + OpenSSL::HMAC.hexdigest("SHA256", secret, "#{headers["Webhook-Id"]}.#{ts}.#{raw}")
  Rack::Utils.secure_compare(expected, headers["Webhook-Signature"].to_s)
end

# Rails: verify(request.raw_post, request.headers)
```

## Retries

If your endpoint doesn't answer `2xx` within 10 seconds, the delivery is retried with growing waits, up to 8 attempts over 24 hours. See every attempt and the status code your server returned under **Webhooks**, or with [List deliveries](/docs-demo/mail/api/webhooks/deliveries). History is kept for 7 days.

## Rotating the secret

[Rotate the secret](/docs-demo/mail/api/webhooks/rotate) if it may have leaked. Requests carry `Webhook-Key-Version`, so during the switch you can accept the version you expect and reject older ones.

## Next steps

:::cards
- [Webhooks API](/docs-demo/mail/api/webhooks/create) — Create, update and rotate. {icon=Braces}
- [Reputation & alerts](/docs-demo/mail/reputation) — The workspace events in detail. {icon=Gauge}
:::
