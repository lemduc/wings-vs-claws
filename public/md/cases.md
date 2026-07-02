# Case files — agent & NHI incidents

## The Salesloft–Drift OAuth-token breach (2025, real incident)

- What happened: Attackers obtained OAuth tokens from a widely-integrated third-party app and used them to pull data from hundreds of downstream environments — the biggest SaaS breach of the year, with ~10× the blast radius of prior incidents.
- Identity angle: A single non-human identity (an OAuth app token) carrying broad, long-lived, standing scope across many tenants.
- What stops it: Short-lived, narrowly-scoped tokens; NHI inventory + monitoring; least privilege per integration; fast token revocation. Any one would have shrunk the blast radius.
- Maps to: SecretRef / token hygiene (Era 5 — NHIs)

## The agent nobody could stop (2026, representative pattern)

- What happened: An agent with standing broad credentials begins taking unintended actions. Teams discover they cannot enforce a purpose limit or terminate it cleanly — 63% of orgs report they cannot enforce purpose limits, and 60% cannot kill a misbehaving agent.
- Identity angle: An over-trusted agent identity with no runtime authorization and no kill switch.
- What stops it: Just-in-time / runtime authorization, purpose limitation, human-in-the-loop approval for dangerous actions, and an enforced kill switch.
- Maps to: Dangerous-command approval (Era 6 — Agents)

## Shadow agents in production (2026, representative pattern)

- What happened: Business units deploy agents outside security’s visibility. Mean monitoring coverage sits near 52%, so roughly half of production agents run unsecured — unregistered identities, untracked credentials, unmonitored access.
- Identity angle: Uninventoried agent identities operating with credentials no one owns.
- What stops it: Agent discovery and inventory; treat every agent as a first-class identity (only ~22% do); centralized issuance instead of ad-hoc service accounts.
- Maps to: Allowlist / gateway authority (Era 6 — Agents)

## Prompt-injection → data exfiltration (2026, representative pattern)

- What happened: An agent reads an attacker-poisoned document (a project file, an email) containing hidden instructions, then uses its tools and network access to exfiltrate secrets — turning the agent into a confused deputy.
- Identity angle: A legitimately-authenticated agent tricked into abusing its own authorized access.
- What stops it: Context-file scanning, egress off by default, secret stripping from the subprocess, and credential redaction — exactly the layers in the defense-in-depth model.
- Maps to: Context scanning + egress control (Era 6 — Agents)

---
Source: https://iam.vjsonline.org/cases
