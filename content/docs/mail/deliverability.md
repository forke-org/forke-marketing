---
title: Deliverability
description: What gets email into the inbox instead of spam, what Forke Mail already does for you, and what's up to you.
---

Inbox providers decide where an email lands from three things: **who sent it** (is the domain authenticated and trusted?), **who it's going to** (do these people want it?) and **what's in it**.

## What Forke Mail does for you

- **DKIM signs every email**, so it can't be forged, once your [domain is verified](/docs-demo/mail/domains).
- **Suppresses bad addresses.** Addresses that hard-bounce or mark you as spam are never emailed again. Hard bounces are blocked across every project on Forke Mail.
- **One-click unsubscribe** headers on every broadcast, which Gmail and Yahoo require for bulk senders.
- **Checks imports**: obvious typos (`gmial.com`), disposable domains and role addresses (`info@`) are left out by default.
- **Scores broadcasts for spam** before they launch.
- **Warms up new projects** with a daily broadcast cap that grows over 14 days.
- **Watches your rates** and pauses sending before a problem damages your reputation. See [Reputation & alerts](/docs-demo/mail/reputation).

## What's up to you

### Authenticate fully

Add all five records, including DMARC. Start with `p=none`, and once everything is passing, move to `p=quarantine`.

### Send only to people who asked

Never buy or scrape lists. Use double opt-in for newsletters if you can. People who didn't ask become complaints, and complaints hurt more than anything else.

### Keep transactional and marketing apart

Send receipts and codes as transactional email, and newsletters as broadcasts. Use a subdomain such as `news.acme.com` for marketing if you send a lot.

### Write like a person

- Send both HTML and plain text.
- Use a real reply-to address someone reads.
- Keep images light and avoid link shorteners.
- Make the subject say what's inside.

### Keep lists clean

Remove people who haven't opened anything in months. A segment on `last_engaged_at` makes this easy: see [Segments](/docs-demo/mail/segments).

## Targets to aim for

| Rate | Healthy | Forke Mail warns | Forke Mail pauses |
| --- | --- | --- | --- |
| Bounce rate | Under 1% | 2% | 5% |
| Complaint rate | Under 0.01% | 0.05% | 0.1% |

Rates are over the last 30 days. See [Reputation & alerts](/docs-demo/mail/reputation).
