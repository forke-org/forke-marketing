---
title: Connecting GitHub & permissions
description: Why Forke needs GitHub access, what permissions are requested, and how PRs are mapped.
read: 3
---

Forke uses GitHub to create your working branches and to map your pull requests to the tasks you claimed.

## Why Forke needs access

- To create an isolated Forke branch for each claimed task
- To detect your pull request and link it to the task
- To merge the PR after the owner approves

## Connect your account

1. Sign in at [forke.space](https://www.forke.space/signin).
2. Choose **Connect GitHub** and approve the permission request.
3. Confirm your GitHub username on your profile.

## How PRs are mapped

Each claim is tied to one Forke branch. A PR opened from that branch is linked to the task and sent to the [review pipeline](#review-pipeline).

## Revoking access

You can revoke Forke's access from your GitHub settings at any time. You will not be able to claim new tasks until you reconnect.

> **Note** Developers never push to a founder's main branch. See [Forke branch workflow](#branch-workflow).
