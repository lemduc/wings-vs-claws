# Case files — agent & NHI incidents

## The forged token, and the log you had to pay for (2023, real incident)

- What happened: From 15 May 2023, the actor tracked as Storm-0558 forged authentication tokens using a 2016 Microsoft consumer (MSA) signing key that had leaked into a corporate crash dump. A separate validation flaw let that consumer key be accepted for enterprise accounts, so a key that should only ever have signed for consumer mailboxes could mint tokens for government tenants. Around 25 organizations were affected; roughly 60,000 emails were downloaded from the State Department alone, over at least six weeks. The State Department found it on 15 June 2023 with a custom rule over the MailItemsAccessed mailbox-auditing log — a log it had only because it held a licence tier including Purview Audit (Premium). The Cyber Safety Review Board called the intrusion preventable and the vendor’s security culture inadequate; the vendor still does not know how the key was stolen. In February 2024 it made the expanded logs available at every tier and raised default retention from 90 to 180 days.
- Identity angle: A signing key is the root of an identity system’s trust. One leaked key plus a validation gap meant tokens for any user could be minted at will — and nothing downstream could tell a forged-but-validly-signed token from a real one, because the signature was genuine.
- What stops it: On prevention: strict issuer and audience validation, so a consumer key is refused for an enterprise tenant no matter how good the signature, plus key isolation and rotation that assumes a key will eventually leak. On detection: the mailbox-access log — the only reason anyone noticed. That control was a paid add-on, which is the uncomfortable part.
- Maps to: Audit & redaction / token validation (Era 4 — cloud & federation)

## The Salesloft–Drift OAuth-token breach (2025, real incident)

- What happened: Attackers obtained OAuth tokens from a widely-integrated third-party app and used them to pull data from hundreds of downstream environments — the biggest SaaS breach of the year, with ~10× the blast radius of prior incidents.
- Identity angle: A single non-human identity (an OAuth app token) carrying broad, long-lived, standing scope across many tenants.
- What stops it: Short-lived, narrowly-scoped tokens; NHI inventory + monitoring; least privilege per integration; fast token revocation. Any one would have shrunk the blast radius.
- Maps to: SecretRef / token hygiene (Era 5 — NHIs)

## The infostealer that swept up an agent’s soul (2026, real incident)

- What happened: A commodity Vidar infostealer variant (infection dated Feb 13, 2026) harvested an OpenClaw user’s openclaw.json gateway tokens, device.json key pairs, and memory files (soul.md, AGENTS.md, MEMORY.md) — the first documented case of an infostealer stealing an AI agent’s credentials and memory. It wasn’t even targeting OpenClaw: a generic keyword sweep for tokens and keys caught a readable state directory that happened to contain the agent’s entire remembered life. Hudson Rock called the haul enough for "a full compromise of the victim’s digital identity."
- Identity angle: An agent’s plaintext state directory acting as a standing credential-and-memory store, readable by any process running as the user.
- What stops it: Credentials out of world-readable plaintext (OpenClaw has since moved to a per-agent SQLite store + opt-in SecretRef); a dedicated OS user with a 700 state dir; and treating agent memory as sensitive data, not just config.
- Maps to: SecretRef / state-dir hardening (Era 6 — Agents)

## The #1 skill was exfiltrating data (2026, real incident)

- What happened: Cisco’s AI security researchers tested ClawHub’s top-ranked skill (Jan 28, 2026) and found it silently exfiltrating data via curl and performing direct prompt injection — "without user awareness." Snyk’s ToxicSkills study then showed why: publishing to the marketplace required a SKILL.md file and a week-old GitHub account. No code signing, no security review, no sandbox by default.
- Identity angle: Third-party skill code executing with the agent’s full permissions — an unvetted supply chain feeding directly into a privileged principal.
- What stops it: Install policies with pinned versions and lockfile pinning; actually reading a skill’s code (not just its SKILL.md) before install; opt-in guard scans; treating skills as the operator’s review surface, not the marketplace’s.
- Maps to: Skill supply chain / install policy (Era 6 — Agents)

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
