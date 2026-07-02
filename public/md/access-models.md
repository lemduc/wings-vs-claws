# Access models: ACL, RBAC, ABAC

> Three ways to express "who can do what" — lists, roles, and policies — trading simplicity for flexibility.

## ACL — lists

An access control list attaches permissions directly to a resource: principal X may read, Y may write. Simple and old, but it explodes as identities and resources grow.

## RBAC — roles

Role-based access control bundles permissions into roles ("auditor", "operator") and assigns roles to identities. It scales with org structure but suffers "role explosion" when every exception needs a new role.

## ABAC / PBAC — policies

Attribute/policy-based access evaluates rules at runtime using attributes (department, resource tag, time, risk). Most flexible, but needs a policy engine and good data.

## How it changes for AI agents

Agents are dynamic and non-deterministic, so standing roles strain. Agentic IAM leans toward attribute/policy decisions made just-in-time — authorize the action now, not a role forever.

## Quick check

1. Which model bundles permissions into named job functions?
   - Answer: RBAC — RBAC = role-based.
2. Which is most suited to runtime, context-aware decisions?
   - Answer: ABAC / PBAC — Attribute/policy-based access decides at runtime from context.
3. "Role explosion" is a downside of…
   - Answer: RBAC — RBAC can sprawl into too many narrow roles.

---
Source: https://iam.vjsonline.org/learn/access-models · Part of Wings vs Claws — Learn IAM — from directories to agents. An interactive, source-grounded guide to identity & access management for the AI-agent era.
