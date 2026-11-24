---
title: Contacts & import
description: The people you email. How contacts are created, what's stored on them, their statuses, and how to import a list safely.
---

A contact is one person in your project: an email address, a name, tags, custom data and a status.

## How contacts are created

You rarely create contacts by hand. They appear when:

- you **track an event** for someone ([Events](/docs-demo/mail/events)), the usual way for apps
- you **import a CSV**
- you add someone to an **audience** ([Add to an audience](/docs-demo/mail/api/broadcasts/add-to-audience))

## What's stored

| Field | Example |
| --- | --- |
| `email` | `ada@example.com` (unique per project) |
| `first_name`, `last_name` | `Ada`, `Lovelace` |
| `tags` | `customer`, `beta` |
| `data` | Custom fields such as `{"plan": "pro", "company": "Analytical Engines"}` (up to 100 keys) |
| `status` | See below |

## Statuses

| Status | Gets broadcasts | Gets transactional |
| --- | --- | --- |
| `active` | Yes | Yes |
| `unsubscribed` | No | Yes |
| `bounced` | No | No |
| `complained` | No | No |
| `invalid` | No | No |

## Importing a list

Upload a CSV under **Contacts → Import**, or `POST /api/contacts/import` with the file. It needs an `email` column; `first_name`, `last_name` and every other column are saved (other columns go into `data`).

```csv contacts.csv
email,first_name,last_name,plan
ada@example.com,Ada,Lovelace,pro
grace@example.com,Grace,Hopper,free
```

Forke Mail cleans the list as it imports:

| Left out | Why |
| --- | --- |
| Invalid addresses | They would bounce. |
| Duplicates | Each person once. |
| Typos like `gmial.com` | Always dropped. |
| Role addresses (`info@`, `sales@`) and disposable domains | Left out unless you choose **keep risky**. They complain and bounce more. |
| Suppressed addresses | Never re-added or reactivated. |

You get counts back: `added`, `updated`, `skipped`, `invalid` and `risky_skipped`. Check a file first, without importing, with `POST /api/contacts/import/check`. Files can be up to 5 MB (split bigger lists).

> [!IMPORTANT]
> Only import people who agreed to hear from you. A bought or scraped list will bounce and get spam complaints, and Forke Mail pauses sending to protect your reputation.

## Tags

Tags group contacts: `customer`, `beta`, `newsletter`. Add them on import, with events, or with [Tag contacts](/docs-demo/mail/api/contacts/tag). Segments and broadcasts can target them.

## Next steps

:::cards
- [Events](/docs-demo/mail/events) — Keep contacts up to date from your app. {icon=Activity}
- [Segments](/docs-demo/mail/segments) — Audiences from rules. {icon=Filter}
:::
