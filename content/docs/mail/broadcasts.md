---
title: Broadcasts
description: Send a newsletter or announcement to a segment, tag or topic. Draft it, check it, then launch it when you're ready.
---

A broadcast is one email sent to many people: a newsletter, a launch announcement, a policy update. It's always created as a **draft** and only goes out when you launch it.

:::steps

### Write it

Use a `marketing` [template](/docs-demo/mail/templates) or inline HTML. It must contain the `{{unsubscribe_url}}` link (or Forke Mail adds a footer). `{{first_name}}` and `{{email}}` are filled in for each person.

### Choose who gets it

Pick a [segment](/docs-demo/mail/segments), a tag, or everyone, and optionally a [topic](/docs-demo/mail/topics) so people who opted out of it are skipped. Unsubscribed, bounced and complained contacts are always left out.

### Create the draft

In the dashboard under **Broadcasts**, or with the API:

```bash
curl -X POST "https://mail.forke.space/api/forke-mail/broadcasts" \
  -H "Authorization: Bearer $FORKE_MAIL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "November update",
    "from": "Acme <news@acme.com>",
    "subject": "What we shipped in November",
    "template": "monthly-update",
    "data": { "month": "November" },
    "segment": "Active customers",
    "topic": "product-updates"
  }'
```

### Check it

In the dashboard, preview the email, send yourself a test and look at the spam score. Broadcasts are scored for spam before they can launch.

### Launch

Press **Send** or call [Send a broadcast](/docs-demo/mail/api/broadcasts/send). This can't be undone: emails start going out straight away.

:::

> [!IMPORTANT]
> AI apps always ask you in the chat before launching a broadcast, and say it can't be undone. Test keys can't launch broadcasts at all.

## How sending is paced

- **Transactional email always goes first**, so a big broadcast never delays a sign-in code.
- **New projects warm up**: for the first 14 days there's a daily broadcast cap that grows from 200 to 5,000. A larger broadcast continues the next day. See [Credits, limits & warm-up](/docs-demo/mail/limits-and-credits).
- If bounce or complaint rates spike, sending pauses. See [Reputation & alerts](/docs-demo/mail/reputation).

You can pause and resume a broadcast that's sending from the dashboard.

## After it's sent

The broadcast's report shows sent, delivered, opened, clicked, bounced, complained and unsubscribed, and each recipient's status. Webhooks fire for every recipient.

## Next steps

:::cards
- [Segments](/docs-demo/mail/segments) — Build the audience. {icon=Filter}
- [Analytics](/docs-demo/mail/analytics) — Compare broadcasts over time. {icon=ChartColumn}
:::
