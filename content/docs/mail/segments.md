---
title: Segments
description: Audiences built from rules on contact fields, tags, engagement, events and custom data. They stay up to date on their own.
---

A segment is a saved set of rules, such as "customers who opened something in the last 30 days". Forke Mail keeps its members up to date as contacts change, and refreshes it before every broadcast.

## An example

```json
{
  "name": "Active customers",
  "match": "all",
  "rules": [
    { "field": "tag", "op": "has", "value": "customer" },
    { "field": "last_engaged_at", "op": "within_days", "days": 30 }
  ]
}
```

`match: "all"` means every rule must be true; `"any"` means at least one.

## Fields and operators

| Field | Operators | Example |
| --- | --- | --- |
| `email`, `first_name`, `last_name` | `equals`, `not_equals`, `contains`, `not_contains`, `is_set`, `is_not_set` | `{"field": "email", "op": "contains", "value": "@acme.com"}` |
| `status` | `equals`, `not_equals` | `{"field": "status", "op": "equals", "value": "active"}` |
| `tag` | `has`, `not_has` | `{"field": "tag", "op": "has", "value": "beta"}` |
| `created_at`, `last_engaged_at` | `within_days`, `older_than_days`, `before`, `after`, `is_set`, `is_not_set` | `{"field": "created_at", "op": "within_days", "days": 7}` |
| `event` | `performed`, `not_performed` (optionally with `days`) | `{"field": "event", "op": "performed", "value": "order.paid", "days": 30}` |
| `data.<field>` | `equals`, `not_equals`, `contains`, `not_contains`, `is_set`, `is_not_set`, `greater_than`, `less_than` | `{"field": "data.plan", "op": "equals", "value": "pro"}` |

## Mixing "all" and "any"

Use one level of groups:

```json
{
  "match": "all",
  "rules": [
    { "field": "status", "op": "equals", "value": "active" },
    {
      "field": "group",
      "op": "any",
      "rules": [
        { "field": "data.plan", "op": "equals", "value": "pro" },
        { "field": "tag", "op": "has", "value": "beta" }
      ]
    }
  ]
}
```

This is "active contacts who are on Pro **or** in the beta".

## Check the size first

[Preview a segment](/docs-demo/mail/api/segments/preview) returns how many contacts match and a sample, without saving anything. The dashboard shows the count live as you edit rules.

## Ideas

| Segment | Rules |
| --- | --- |
| New this week | `created_at` within 7 days |
| Never purchased | `event` not performed `order.paid` |
| Going quiet | `last_engaged_at` older than 90 days |
| Team plans | `data.plan` equals `team` |

## Next steps

:::cards
- [Broadcasts](/docs-demo/mail/broadcasts) — Send to a segment. {icon=Megaphone}
- [Segments API](/docs-demo/mail/api/segments/create) — Create and update in code. {icon=Braces}
:::
