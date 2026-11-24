---
title: Analytics
description: Sent, delivered, opened, clicked, bounced, complained and unsubscribed, compared with the period before, for transactional email, broadcasts or both.
---

**Analytics** shows how your email is doing over the last 1, 7, 30 or 90 days, compared with the period before.

## The numbers

| Metric | What it counts |
| --- | --- |
| Sent | Emails handed to Amazon SES. |
| Delivered | Accepted by the recipient's server. |
| Opened | Counted opens (only for emails with open tracking). |
| Clicked | Counted clicks (only with click tracking). |
| Bounced | Permanent bounces. |
| Complained | Spam reports. |
| Unsubscribed | Unsubscribes from broadcasts. |

Each comes with its rate and the change from the previous period, plus a day-by-day chart and a split between transactional and broadcast.

## From the API

```bash
curl "https://mail.forke.space/api/analytics?days=7&stream=all" \
  -H "Authorization: Bearer $FORKE_MAIL_API_KEY"
```

`stream` is `all`, `transactional` or `broadcast`. See [Get analytics](/docs-demo/mail/api/insights/analytics) for the response.

## Reading it

- **Delivery rate under 98%?** Look at bounces in [Deliveries](/docs-demo/mail/deliveries) with the `problems` filter.
- **Complaints above 0.05%?** Check who you're emailing and how they signed up. See [Deliverability](/docs-demo/mail/deliverability).
- **Open rates** are estimates; compare them over time rather than against other companies.

> [!TIP]
> "Give me a short report on my email over the last 7 days" works well in any connected AI app.
