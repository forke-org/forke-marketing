---
title: Troubleshooting
description: Fixes for the errors and surprises people hit most often, from unverified domains to emails landing in spam.
---

:::details from_domain_not_verified
The from address isn't on a verified domain in this project. Check **Domains**: is the domain there, and is it verified? Run **Check DNS** to see which record is missing. With a test key any from address works, so this only happens with live keys.
:::

:::details recipient_suppressed
This address hard-bounced, marked you as spam, or was suppressed by hand before. Look it up under **Suppressions**. Don't remove it unless you know the address works now.
:::

:::details 401 unauthorized
The key is missing, mistyped or revoked. Check the header is exactly `Authorization: Bearer fm_…` with no quotes or spaces, and that the environment variable is set where the code runs.
:::

:::details 403 insufficient_scope
The key has sending access and the endpoint needs full access (domains, webhooks, suppressions, segments, broadcasts, workflows). Create a full-access key for that job.
:::

:::details 402 trial_quota_exceeded
The project is out of credits. Add credits under **Settings**. Test keys keep working.
:::

:::details 409 idempotency_key_reused
You sent the same `Idempotency-Key` with a different body. Each different email needs its own key. See [Retries & idempotency](/docs-demo/mail/idempotency).
:::

:::details 409 workspace_sending_paused
Sending was paused because bounce or complaint rates got too high. See [Reputation & alerts](/docs-demo/mail/reputation).
:::

:::details 429 rate_limited or daily_limit_reached
Too many requests per second (wait the `Retry-After` seconds), or the daily limit was reached (it resets the next day). See [Rate limits](/docs-demo/mail/api/rate-limits).
:::

:::details The API answered 202 but the email never arrived
Find it in [Deliveries](/docs-demo/mail/deliveries). `test` means a test key was used. `bounced` means the address doesn't work. `delivered` means it reached their server: check spam and promotions, and read [Deliverability](/docs-demo/mail/deliverability).
:::

:::details The domain won't verify
Most often: Cloudflare is proxying the DKIM records (set them to **DNS only**), the name got the domain added twice, or there are two SPF records. See [Add & verify a domain](/docs-demo/mail/domains#if-it-doesnt-verify).
:::

:::details Emails land in spam
Make sure all five DNS records pass, send both HTML and text, use a real reply-to, and only email people who asked. See [Deliverability](/docs-demo/mail/deliverability).
:::

:::details My AI app keeps asking for confirmation
The arguments changed between the request and your "yes" (a different recipient or subject), so a new confirmation is needed. Confirm the final version. See [Safety & confirmations](/docs-demo/agents/safety).
:::

Still stuck? Email [support@forke.space](mailto:support@forke.space) with the email's ID and the error, and check [status.forke.space](https://status.forke.space).
