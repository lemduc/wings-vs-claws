# Workload identity & SPIFFE

> Workloads — services, containers, agents — need verifiable identity without baked-in secrets. SPIFFE gives them one.

## The hardcoded-secret problem

Stuffing an API key into a service is fragile: it leaks, never rotates, and is shared. Workloads need an identity they can prove cryptographically, not a stored password.

## SPIFFE / SPIRE

SPIFFE issues short-lived, verifiable IDs (SVIDs) to workloads based on what they are — attested by the platform — instead of a secret they hold. SPIRE is the runtime that hands them out.

## Why it matters

It’s Zero Trust for machines: identity the platform attests to, rotated automatically, with no long-lived shared secret to steal.

## How it changes for AI agents

An agent is a workload too. Giving agents attested, short-lived identities instead of long-lived API keys is one of the cleanest answers to the agent-credential problem — where SPIFFE-style workload identity meets the agent world.

## In practice

```
# the workload asks the local SPIFFE Workload API for its SVID
$ grpcurl -unix /run/spire/agent.sock \
    SpiffeWorkloadAPI/FetchX509SVID

→ spiffe_id: spiffe://example.org/ns/prod/sa/mailer
   x509_svid: <short-lived cert, auto-rotated>   # identity, not a stored key
```

## Quick check

1. Workload identity aims to replace…
   - Answer: Hardcoded, long-lived secrets — Provable identity instead of stored secrets.
2. A SPIFFE SVID is…
   - Answer: A short-lived, verifiable workload ID — Short-lived and cryptographically verifiable.
3. Workload identity is essentially…
   - Answer: Zero Trust for machines — Attested, rotating identity — Zero Trust applied to workloads.

---
Source: https://iam.vjsonline.org/learn/workload-identity · Part of Wings vs Claws — Learn IAM — from directories to agents. An interactive, source-grounded guide to identity & access management for the AI-agent era.
