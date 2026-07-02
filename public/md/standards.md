# Standards shaping agentic IAM

- **OAuth 2.0 / 2.1** (established; track: both) — Delegated, scoped access via tokens — the backbone agents build on.
- **OpenID Connect** (established; track: enterprise) — Identity layer on OAuth — answers "who is the user?".
- **RFC 8693 — Token Exchange** (RFC (2020); track: both) — Swap a token for a narrower one — the basis for scoped sub-agent delegation.
- **RFC 8707 — Resource Indicators** (RFC (2020); track: enterprise) — Bind a token to a specific audience/resource, limiting where it can be replayed.
- **OAuth on-behalf-of user (AI agents)** (IETF draft · 2025; track: agentic) — Adds act / requested_actor / actor_token so a token carries the user → agent delegation chain.
- **MCP Authorization** (spec · 2025-11; track: agentic) — An OAuth 2.1 profile for the Model Context Protocol — how agent clients get scoped access to tools and servers.
- **SPIFFE / SPIRE** (CNCF; track: enterprise) — Verifiable, short-lived workload identity (SVIDs) without stored secrets.
- **NIST AI Agent Standards Initiative** (launched · Feb 2026; track: agentic) — Early US-government work toward governing autonomous-agent identity and action.

---
Source: https://iam.vjsonline.org/standards
