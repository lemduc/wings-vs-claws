# MFA & step-up authentication

> Multi-factor auth requires more than one proof of identity. Step-up adds a fresh check right before a risky action.

## The three factors

Something you know (password), something you have (a device or passkey), something you are (biometric). MFA combines at least two, so a stolen password alone isn’t enough.

## Phishing resistance

Passkeys / FIDO2 bind the credential to the real site, defeating phishing that one-time codes (OTPs) still fall for. Not all factors are equal.

## Step-up

Re-verify just before a sensitive action — a transfer, a deletion — rather than trusting the original login forever. Risk-based, in the moment.

## How it changes for AI agents

An agent can’t tap a phone or scan a face. Machine identity leans on cryptographic factors — keys, mTLS, attestation — and "step-up" becomes a human-in-the-loop approval before the agent does something dangerous.

## Quick check

1. MFA requires…
   - Answer: At least two different factors — Combine ≥2 distinct factor types.
2. Which is most phishing-resistant?
   - Answer: Passkey / FIDO2 — Passkeys bind to the real site.
3. For agents, "step-up" usually becomes…
   - Answer: A human-in-the-loop approval — A fresh human approval before a dangerous action.

---
Source: https://iam.vjsonline.org/learn/mfa · Part of Wings vs Claws — Learn IAM — from directories to agents. An interactive, source-grounded guide to identity & access management for the AI-agent era.
