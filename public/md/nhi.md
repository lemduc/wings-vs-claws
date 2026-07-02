# Non-human identities (NHIs)

> Most identities are not people — they are service accounts, API keys, workloads, and now agents. They outnumber humans 100:1+ and are a top breach vector.

## What counts as an NHI

Service accounts, API keys, OAuth apps, certificates, workloads, bots — and AI agents. Anything that authenticates and acts without a human at the keyboard.

## Why they’re risky

NHIs are routinely over-permissioned (~97%), live on long-lived secrets that rarely rotate, are often unowned and unmonitored, and they spawn more NHIs. Research puts the NHI-to-human ratio around 144:1 (2025), up 44% year over year.

## A real failure

The 2025 Salesloft–Drift breach started with stolen OAuth tokens from one integration and reached hundreds of downstream environments — a single NHI with too much standing access.

## How it changes for AI agents

Agents are a new, especially dangerous NHI class: unlike a static service account, they reason, act unpredictably, and spawn sub-identities. Yet only ~22% of teams treat agents as first-class, identity-bearing entities.

## Quick check

1. Which is a non-human identity?
   - Answer: A service account — Service accounts, keys, workloads, agents = NHIs.
2. Roughly what share of NHIs are over-permissioned?
   - Answer: About 97% — Research found ~97% have excessive privileges.
3. The biggest everyday NHI risk is…
   - Answer: Long-lived, sprawling secrets — Long-lived, unrotated, over-scoped secrets dominate NHI risk.

---
Source: https://iam.vjsonline.org/learn/nhi · Part of Wings vs Claws — Learn IAM — from directories to agents. An interactive, source-grounded guide to identity & access management for the AI-agent era.
