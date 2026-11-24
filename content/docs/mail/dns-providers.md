---
title: DNS provider guides
description: Where to add Forke Mail's DNS records in Cloudflare, GoDaddy, Namecheap, Route 53, Vercel, Google Cloud DNS and others, and the gotchas for each.
---

Every provider asks for the same three things for each record: **type**, **name** (sometimes called host) and **value** (sometimes called target, content or points to). Copy them from **Domains** in the dashboard.

> [!TIP]
> Most providers add your domain to the name on their own. Enter `abc123._domainkey`, not `abc123._domainkey.acme.com`, unless the provider's form shows the full domain must be typed.

:::details Cloudflare
1. Open your domain, then **DNS → Records → Add record**.
2. Add each `CNAME` with the name and target from the dashboard.
3. **Turn the proxy off**: click the orange cloud so it turns grey (**DNS only**). Proxied DKIM records never verify.
4. Add the two `TXT` records. For SPF use `@` as the name.
:::

:::details GoDaddy
1. Open **My Products → DNS** for your domain.
2. **Add new record**, choose `CNAME`, put the part before your domain in **Name**, and the value in **Value**.
3. For SPF, edit the existing `TXT` record on `@` if there is one, and add `include:amazonses.com` before `~all`.
:::

:::details Namecheap
1. Open **Domain List → Manage → Advanced DNS**.
2. **Add new record**. For `CNAME`, the **Host** is the part before your domain (`abc123._domainkey`).
3. For SPF, use host `@` and type `TXT Record`.
:::

:::details Amazon Route 53
1. Open **Hosted zones**, pick your domain, then **Create record**.
2. Record name is the part before your domain. Choose `CNAME` and paste the value.
3. For `TXT` values, Route 53 needs the value in double quotes: `"v=spf1 include:amazonses.com ~all"`.
:::

:::details Vercel
1. Open your team's **Domains**, pick the domain, then **DNS Records**.
2. Add each record with the name and value from the dashboard. Vercel adds your domain to the name.
:::

:::details Google Cloud DNS
1. Open **Cloud DNS**, pick the zone, then **Add standard**.
2. DNS names here are full names ending in a dot: `abc123._domainkey.acme.com.`.
3. Wrap `TXT` values in double quotes.
:::

:::details Any other provider
Add the five records with the type, name and value shown in the dashboard. If you're unsure whether to type the full name, look at an existing record such as `www`: if it's shown as `www`, enter only the part before your domain.
:::

## Check your work

Run **Check DNS** in the dashboard. It looks up each record live and shows what it found, so you can see a typo straight away.

```bash
dig +short CNAME abc123._domainkey.acme.com
dig +short TXT acme.com
dig +short TXT _dmarc.acme.com
```
