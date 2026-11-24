---
title: Connecting GitHub
description: Why Forke needs GitHub, the exact permissions involved, and how the mirror keeps founders' repositories safe.
---

Forke is built on Git. Connecting GitHub sets your starting level, and every task flows through branches and pull requests.

## For developers

You connect your GitHub account once, with OAuth. Forke uses it to:

- **Set your starting level** (1 to 3) from a one-time look at your public activity.
- **Know who you are on GitHub**, so your branches, commits and pull requests in the mirror are yours, and merged work credits you.

Forke doesn't need access to your own repositories, private or public.

## For founders

Founders install **Forke's GitHub App** on the specific repositories they post tasks for. A GitHub App is scoped to the repositories you choose, unlike a personal token. It asks for the least it needs:

| Permission | Why |
| --- | --- |
| Contents (read and write) | Mirror the repository and open the final pull request. |
| Pull requests | Open the clean pull request when you approve. |
| Checks | Report the automated review results. |
| Metadata | Read basic repository information. |

You can remove the app from GitHub at any time.

## The mirror

Developers never push to a founder's repository. Instead of one fork per developer, Forke keeps a single mirror and gives each task its own branches:

```text
founder/repo
   └─ Forke mirror
        └─ task/1042-signup-validation         the task branch
             └─ dev-ada/task-1042               the developer's branch
                  └─ pull request → task branch → review → approval
                                                         └─ clean squash-merge into founder/repo
```

## Built-in safeguards

- **Secret scanning** blocks commits that add `.env` files or hard-coded tokens.
- **File-scope checks** reject any pull request that changes files outside the task's scope.
- **Only Forke merges.** No developer can merge their own work, ever.
- **Task branches are temporary.** They're deleted within 24 hours of the task finishing; the record stays on the developer's profile.

## Next steps

:::cards
- [Working in your branch](/docs-demo/forke/branches) — The day-to-day Git workflow. {icon=GitBranch}
- [Submitting a pull request](/docs-demo/forke/submitting) — What to include and what happens next. {icon=GitPullRequest}
:::
