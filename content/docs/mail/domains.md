---
title: Add & verify a domain
description: Prove you own the domain you send from with five DNS records (DKIM, SPF and DMARC), so your email is trusted and lands in the inbox.
---

Before Forke Mail delivers email from `hi@acme.com`, it needs proof that you control `acme.com`. You give that proof with DNS records, and they also tell inbox providers your email is genuine.

::demo{name="domain"}

:::steps

### Add the domain

In the dashboard, open **Domains** and add your domain. Or with the API:

```bash
curl -X POST "https://mail.forke.space/api/domains" \
  -H "Authorization: Bearer $FORKE_MAIL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "acme.com"}'
```

You can add the bare domain (`acme.com`) or a subdomain used only for email (`mail.acme.com`). A subdomain keeps marketing email's reputation apart from your main domain.

### Add the five records at your DNS provider

| Type | Name | Value | What it does |
| --- | --- | --- | --- |
| `CNAME` | `<token1>._domainkey` | `<token1>.dkim.amazonses.com` | DKIM: signs every email so it can't be forged |
| `CNAME` | `<token2>._domainkey` | `<token2>.dkim.amazonses.com` | DKIM, second key |
| `CNAME` | `<token3>._domainkey` | `<token3>.dkim.amazonses.com` | DKIM, third key |
| `TXT` | `@` (the domain itself) | `v=spf1 include:amazonses.com ~all` | SPF: says Amazon SES may send for you |
| `TXT` | `_dmarc` | `v=DMARC1; p=none;` | DMARC: tells inboxes what to do with failures |

Copy the exact values from your dashboard: the DKIM tokens are unique to your domain. Step-by-step instructions for Cloudflare, GoDaddy, Namecheap and others are in [DNS provider guides](/docs-demo/mail/dns-providers).

> [!WARNING]
> **Already have an SPF record?** A domain can only have one. Don't add a second: add `include:amazonses.com` to the one you have, for example `v=spf1 include:_spf.google.com include:amazonses.com ~all`.

### Wait for verification

Forke Mail checks pending domains every minute and marks them **verified** as soon as the records are found. Most providers take a few minutes; some take up to an hour. Press **Check now** (or `POST /api/domains/{id}/verify`) to check straight away.

### Send from any address on it

Once verified, every address on the domain works: `hi@acme.com`, `receipts@acme.com`, `noreply@acme.com`.

:::

## If it doesn't verify

Use **Check DNS** in the dashboard, or [`GET /api/domains/{id}/dns`](/docs-demo/mail/api/domains/dns). It looks each record up live and tells you exactly which one is missing and what it found instead.

| What you see | Usual cause |
| --- | --- |
| DKIM record missing | The provider added your domain to the name, making `token._domainkey.acme.com.acme.com`. Enter only `token._domainkey`. |
| Value looks right but isn't found | Cloudflare is proxying the record. Set it to **DNS only** (grey cloud). |
| SPF missing | There are two SPF records. Merge them into one. |
| Nothing found after an hour | The records went to a different DNS provider than the one your domain uses. Check the domain's nameservers. |

## The rules

- A domain can belong to only one Forke Mail project.
- Deleting a domain stops sending from it straight away, and adding it again means new DKIM records.

## Next steps

:::cards
- [DNS provider guides](/docs-demo/mail/dns-providers) — Click-by-click for each provider. {icon=Server}
- [Deliverability](/docs-demo/mail/deliverability) — Land in the inbox, not spam. {icon=Inbox}
:::
