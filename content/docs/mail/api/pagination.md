---
title: Pagination
description: List endpoints return results newest first. Use limit and offset to page through them.
---

List endpoints take two query parameters:

| Parameter | Default | Range |
| --- | --- | --- |
| `limit` | 50 | 1–200 |
| `offset` | 0 | 0 and up |

```bash
curl "https://mail.forke.space/api/contacts?limit=100&offset=200" \
  -H "Authorization: Bearer $FORKE_MAIL_API_KEY"
```

Contacts, suppressions and deliveries also return a `total`, so you know how many pages there are:

```json
{ "contacts": [ … ], "total": 1284 }
```

## Fetching everything

```python
import os, requests

def all_contacts():
    offset, out = 0, []
    while True:
        res = requests.get(
            "https://mail.forke.space/api/contacts",
            params={"limit": 200, "offset": offset},
            headers={"Authorization": f"Bearer {os.environ['FORKE_MAIL_API_KEY']}"},
        )
        res.raise_for_status()
        page = res.json()
        out += page["contacts"]
        offset += 200
        if offset >= page["total"]:
            return out
```
