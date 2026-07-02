# Authentication vs Authorization

> Authentication proves who you are. Authorization decides what you may do. Agents add a third question: who are you acting for?

## Two different questions

Authentication (authN) verifies an identity — a password, API key, certificate, or token. Authorization (authZ) is a separate decision made afterward: is this verified identity allowed to do this specific thing? You authenticate once, then authorize every action.

## Where each shows up

AuthN: login, mTLS, an OIDC token, a pairing code. AuthZ: roles, ACLs, OAuth scopes, a policy engine. Confusing the two is a classic source of bugs — a valid token (authN passed) does not mean the action is permitted (authZ).

## How it changes for AI agents

An agent authenticates as a non-human identity, but it usually acts on behalf of a human. So authorization must weigh both the agent and the delegating user — the "on-behalf-of" problem.

## Quick check

1. A system checks your password. Which step is this?
   - Answer: Authentication — Verifying an identity = authentication.
2. "This token may read but not write." Which step is this?
   - Answer: Authorization — Deciding what an identity may do = authorization.
3. For an AI agent, authorization should consider…
   - Answer: Both the agent and the user it acts for — Agents act on-behalf-of a user; both identities matter.

---
Source: https://iam.vjsonline.org/learn/authn-vs-authz · Part of Wings vs Claws — Learn IAM — from directories to agents. An interactive, source-grounded guide to identity & access management for the AI-agent era.
