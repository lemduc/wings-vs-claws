# Delegation & on-behalf-of for agents

> Agents act for you and hand work to sub-agents. The hard part: carry authority down the chain without over-granting — and keep it auditable.

## On-behalf-of

An agent rarely acts as itself; it acts for a user. Authorization has to capture both the user’s consent and the agent’s identity. The IETF "OAuth on-behalf-of user for AI agents" draft adds an act claim, a requested_actor consent parameter, and an actor_token to do exactly this.

## Multi-hop delegation

When an orchestrator hands a task to a sub-agent, each hop should narrow scope (RFC 8693 token exchange) rather than pass the full token. Otherwise authority — and accountability — leak downstream.

## Keeping the chain traceable

If nobody records which agent authorized which sub-agent with what scope, the accountability chain fractures. The delegation chain in the token is what lets you answer "who told this sub-agent it could do that?"

## How it changes for AI agents

This is the agentic frontier. Hermes scopes sub-agents via cross-session isolation; OpenClaw uses explicit delegation plus visibility: self / tree / agent / all. Both are early answers to a problem standards are still racing to solve.

## In practice

```
// decoded access-token claims (RFC 8693 / on-behalf-of)
{
  "sub":   "user:duc",                // the human it acts for
  "act": {                            // the actor — the agent
    "sub": "agent:orchestrator",
    "act": { "sub": "agent:drafting-subagent" }  // nested = multi-hop
  },
  "scope": "mail:send",               // narrowed to just what's needed
  "aud":   "https://mail.example"
}
```

## Quick check

1. An agent acting "on-behalf-of" a user means authorization must capture…
   - Answer: The user’s consent and the agent’s identity — Both the delegating user and the agent matter.
2. When an orchestrator delegates to a sub-agent, scope should…
   - Answer: Get narrower — Each hop should narrow authority (RFC 8693).
3. What breaks if delegation is not recorded?
   - Answer: The accountability chain — Untracked delegation fractures accountability.

---
Source: https://iam.vjsonline.org/learn/agent-delegation · Part of Wings vs Claws — Learn IAM — from directories to agents. An interactive, source-grounded guide to identity & access management for the AI-agent era.
