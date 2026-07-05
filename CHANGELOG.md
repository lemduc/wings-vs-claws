# Changelog

All notable changes to Wings vs Claws. The site is an interactive, source-grounded
guide to IAM for the AI-agent era.

## v0.4 — July 2026

### Fact-check refresh
Every agent claim re-verified against live primary docs (July 2026).

- **OpenClaw corrections**: credential store is the per-agent SQLite database
  (`openclaw-agent.sqlite`; the `~/.openclaw/credentials/` JSON path is legacy,
  migrated by `openclaw doctor --fix`) — with the honest caveat that plaintext
  still works and agent-readable files stay exposed. License shown as MIT.
  SecretRef marked static-credentials-only (OAuth profiles can't use it).
- **Hermes additions**: Daytona joins the backend list; approval prompts fail
  closed (deny) after 60s; dashboard/remote auth documented (Nous Portal OAuth,
  self-hosted OIDC, basic auth — fails closed on non-loopback bind; `--insecure`
  is a deprecated no-op since the June 2026 hardening).
- **Symmetry fix**: both isolation cells now state sandboxing is opt-in —
  Hermes defaults to an unisolated `local` backend (containers run as root
  unless `docker_run_as_host_user`), OpenClaw ships `sandbox.mode: "off"`.
- **Two new real-incident case files**: the Vidar infostealer sweep of an
  OpenClaw state directory (Hudson Rock, Feb 2026 — first documented infostealer
  harvest of an AI agent's credentials and memory) and ClawHub's top-ranked
  skill caught exfiltrating data (Cisco, Jan 2026; Snyk's ToxicSkills on the
  no-vetting marketplace).

## v0.3 — June 2026

### Phase 3 — Polish & reach
- Route-level code-splitting (each page is its own lazy-loaded chunk).
- Accessibility: skip-to-content link, visible `:focus-visible` rings, `main`
  landmark, global `prefers-reduced-motion` handling.
- Freshness: "last updated" footer + this changelog.
- Open Graph / Twitter image for shared links.

### Phase 2 — Interactive labs
- Delegation-chain visualizer (`/delegation`): scoped on-behalf-of delegation.
- OAuth Authorization Code flow walkthrough (`/oauth-flow`).

### Phase 1 — Stickier learning
- Inline glossary auto-linking with hover definitions in lessons.
- Three new foundation lessons: Federation & SSO, MFA & step-up, Workload identity.
- Standards radar (`/standards`): the protocols shaping agentic IAM.

### Phase 0 — Foundations & findability
- Per-page SEO/meta, auto-generated sitemap, robots.txt.
- Dependency security fixes (15 alerts → 2 dev-only).

## v0.2 — earlier

- Reorganized into an IAM learning hub: Start-here paths, Foundations lessons,
  reusable quiz engine + progress tracking, case files.
- The journey page (IAM eras as a git-log) + Rosetta Stone mapping.
- Defense-in-Depth mini-game, config-posture playground, ⌘K command palette,
  light/dark theme, multi-page navigation.

## v0.1 — initial

- Interactive Hermes Agent vs OpenClaw IAM comparison: access-trace simulator,
  diff + control matrix, enforcement-topology diagrams.
