---
title: Topics & unsubscribes
description: Let people opt out of one kind of email instead of everything. How unsubscribe links, the preferences page and topics work.
---

## Unsubscribe links

Every broadcast carries a personal unsubscribe link, in the footer and in the `List-Unsubscribe` headers that Gmail, Yahoo and Apple Mail turn into a one-click **Unsubscribe** button.

Put `{{unsubscribe_url}}` anywhere in a marketing template to place the link yourself. If you don't, Forke Mail adds a footer.

When someone unsubscribes:

- their status becomes `unsubscribed` and they stop getting broadcasts and marketing workflows
- they still get **transactional** email (receipts, password resets)
- an `email.unsubscribed` webhook is sent

## Topics

Topics let people choose what they hear about, so someone tired of your newsletter can still get product updates.

:::steps

### Create topics

Under **Topics** in the dashboard, or with [`PUT /api/topics/{key}`](/docs-demo/mail/api/insights/put-topic):

```json
{ "label": "Product updates" }
```

with the key `product-updates` in the address.

### Send a broadcast on a topic

Add `"topic": "product-updates"` when you [create the broadcast](/docs-demo/mail/api/broadcasts/create). People who opted out of that topic are skipped.

### People manage their choices

The unsubscribe link opens a preferences page where each person can turn single topics off, or unsubscribe from everything.

:::

## Next steps

:::cards
- [Suppressions](/docs-demo/mail/suppressions) — Addresses that never get email. {icon=Ban}
- [Broadcasts](/docs-demo/mail/broadcasts) — Sending to a topic. {icon=Megaphone}
:::
