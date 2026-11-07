---
title: The 4-layer review pipeline
description: Static analysis, AI test generation, security scanning, and owner verdict card generation.
read: 5
---

No code reaches an owner, and no money moves, until your submission clears the pipeline.

## See it run

{{pipeline}}

## Layer 1: Static analysis

Build, lint and scope checks run first. Broken code never reaches a human.

## Layer 2: AI test generation

An AI reviewer reads the diff against the task spec and generates tests to check the behaviour.

## Layer 3: Security scanning

The submission is scanned for security issues before the owner sees it.

## Layer 4: Verdict card

Forke turns the results into a plain-English [verdict card](#verdict-card) for the task owner, with a risk score from 0 to 100.

> **Important** Fail a layer and the submission does not reach the owner. Pass all four and the owner can approve, after which merge and payout are automatic.

## Related

- [Writing clear acceptance criteria](#acceptance-criteria)
