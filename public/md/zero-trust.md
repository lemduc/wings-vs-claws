# Zero Trust & least privilege

> Never trust, always verify. Drop the network perimeter; make every request prove identity and context, and grant the least privilege that works.

## The shift

Old model: inside the network = trusted. Zero Trust removes implicit trust — location proves nothing. Google’s BeyondCorp proved it in practice; NIST SP 800-207 (2020) codified it.

## Three principles

Verify explicitly (every request, with context), enforce least privilege (smallest access that works), and assume breach (limit blast radius, segment, log).

## Identity becomes the perimeter

Workloads and agents have no "inside" to be in. Identity — not the network — becomes the control plane (SPIFFE/SPIRE gave workloads verifiable identity).

## How it changes for AI agents

An autonomous agent is the purest Zero Trust subject: no fixed location, always running, and compromisable. Treating the sandbox/container as the boundary and checking every action — as Hermes does — is Zero Trust applied to an agent.

## Quick check

1. The Zero Trust motto is…
   - Answer: Never trust, always verify — No implicit trust — verify every request.
2. Which NIST publication codified Zero Trust?
   - Answer: SP 800-207 — SP 800-207 (2020) is the Zero Trust Architecture standard.
3. In Zero Trust, the new perimeter is…
   - Answer: Identity — Identity becomes the control plane.

---
Source: https://iam.vjsonline.org/learn/zero-trust · Part of Wings vs Claws — Learn IAM — from directories to agents. An interactive, source-grounded guide to identity & access management for the AI-agent era.
